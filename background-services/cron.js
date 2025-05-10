const cron = require("node-cron");
const { PrismaClient } = require("../node_modules/@prisma/client");
const {
  ALL_STEP_CHALLENGES,
  calculateTotalLoss,
  getTailoredObjectives,
  calculateTotalProfit,
  sendAppNotification,
} = require("./utils");
const prisma = new PrismaClient();

const scheduleOldCronJobs = async () => {
  try {
    const breachedAccounts = await prisma.account.findMany({
      where: {
        status: "BREACHED",
      },
      select: { id: true }, // Only select the IDs, no need to fetch full objects
    });

    const breachedAccountIds = new Set(
      breachedAccounts.map((account) => account.id)
    ); // Store breached account IDs in a Set
    const cronJobs = await prisma.cronJobs.findMany({
      where: {
        jobStatus: "PENDING",
      },
    });
    for (const job of cronJobs) {
      // Skip the job if it belongs to a breached account
      if (breachedAccountIds.has(job.accountId)) {
        continue;
      }
      addCronJob(job.jobName, job.jobDate, job.type, job.accountId, true);
    }
  } catch (error) {
    throw new Error(error);
  }
};

// Initialize CRON jobs
const init = () => {
  // Schedule the CRON job to run at 6 AM UTC every day
  cron.schedule(
    "0 6 * * *",
    async () => {
      try {
        console.log("Resetting dailyLoss at 6AM UTC");
        await prisma.account.updateMany({
          data: { dailyLoss: 0 },
        });
        console.log("dailyLoss reset successful");
      } catch (error) {
        console.error("Error resetting dailyLoss:", error);
      }
    },
    {
      timezone: "UTC",
    }
  );

  // Schedule the CRON job to run every second
  cron.schedule('0 * * * *', async () => {
    const accounts = await prisma.account.findMany();
  
    accounts.forEach(async (account) => {
      await prisma.balanceHistory.create({
        data: {
          accountId: account.id,
          balance: account.balance,
          date: new Date()
        }
      });
    });
  
    console.log('Daily balance snapshots saved.');
  }, {
    timezone: 'UTC'
  });
};

// cron job fn for marking objective as fulfilled, WILL RUN ONCE 7 DAYS AFTER ACCOUNT CREATION
const markMinObjectiveAsFulfilled = async (accountId) => {
  try {
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        minBetPeriod: new Date(0), // random in the past
        minBetPeriodCompleted: true,
      },
    });
    await sendAppNotification(updatedAccount.userId, "UPDATE", "Your minimum bet period is completed successfully!")
  } catch (error) {
    throw new Error(error);
  }
};

// cron job fn for marking objective as failed, WILL RUN ONCE 30 DAYS AFTER ACCOUNT CREATION
const checkAllObjectives = async (accountId) => {
  try {
    // find the account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

     // check if the account is funded
    if (account.accountType !== "FUNDED") {
      return;
    }
    // check if phase > 1
    if (account.phase > 1) {
      return;
    }

    // get tailored objectives
    const tailoredObjectives = getTailoredObjectives(account);

    // set the flag
    let flag = false;

    // OBJECTIVE: MIN PICKS
    if (account.picks < ALL_STEP_CHALLENGES.minPicks) {
      flag = true;
    }

    // OBJECTIVE: MAX LOSS
    const totalLoss = account.totalLoss;
    if (totalLoss > tailoredObjectives.maxLoss) {
      flag = true;
    }

    // OBJECTIVE: MAX DAILY LOSS
    // if (account.dailyLoss > tailoredObjectives.maxDailyLoss) {
    //   flag = true;
    // }

    // OBJECTIVE: PROFIT TARGET
    const totalProfit = calculateTotalProfit(account);
    if (totalProfit < tailoredObjectives.profitTarget) {
      flag = true;
    }

    // if any of the objectives are not met, mark change account status to breached
    if (flag) {
      await prisma.account.update({
        where: { id: accountId },
        data: {
          status: "BREACHED",
        },
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

// cron job fn for marking account as breached, WILL RUN ONCE 7 DAYS AFTER LAST PICK
const markAccountAsInactive = async (accountId) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    // check if the account is funded
    if (account.accountType !== "FUNDED") {
      return;
    }

    await prisma.account.update({
      where: { id: accountId },
      data: {
        status: "BREACHED",
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

// Store the cron jobs
const cronJobs = {};

// Function to add a new cron job
const addCronJob = async (
  jobName,
  time,
  type,
  accountId,
  alreadyExists = false
) => {
  if (cronJobs[jobName]) {
    throw new Error("Job name already exists");
  }

  if (!alreadyExists) {
    try {
      await prisma.cronJobs.create({
        data: {
          jobName,
          jobDate: time,
          jobStatus: "PENDING",
          type,
          accountId: accountId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  const job = cron.schedule(
    time,
    async () => {
      console.log(`Executing job: ${jobName} at ${new Date()}`);
      try {
        if (type === "objectiveMin") {
          await markMinObjectiveAsFulfilled(accountId);
        } else if (type === "objectiveMax") {
          await checkAllObjectives(accountId);
        } else if (type === "inactivity") {
          await markAccountAsInactive(accountId);
        }

        const cronJob = await prisma.cronJobs.findFirst({
          where: { jobName },
        });

        if (!cronJob) {
          throw new Error("Job not found");
        }

        await prisma.cronJobs.update({
          where: { id: cronJob.id },
          data: {
            jobStatus: "COMPLETED",
          },
        });

        console.log(`Job ${jobName} executed successfully`);
      } catch (error) {
        console.error(`Error executing job ${jobName}:`, error);
      }
    },
    {
      timezone: "UTC",
    }
  );

  cronJobs[jobName] = job; // Store the job
};

// Function to edit an existing cron job
const editCronJob = async (jobName, newTime) => {
  const job = cronJobs[jobName];
  if (!job) {
    throw new Error("Job not found");
  }

  job.stop(); // Stop the existing job
  job.destroy(); // Destroy the job instance

  // Schedule the new job
  const newJob = cron.schedule(newTime, job.getTask().callback, {
    timezone: "UTC",
  });

  // edit in database
  await prisma.cronJobs.update({
    where: { jobName },
    data: {
      jobDate: newTime,
    },
  });

  cronJobs[jobName] = newJob; // Update the stored job
};

// Function to delete a cron job
const deleteCronJob = async (jobName) => {
  const job = cronJobs[jobName];
  if (job) {
    job.stop(); // Stop the job
    job.destroy(); // Destroy the job instance
    delete cronJobs[jobName]; // Remove from the stored jobs
    // delete from db
    await prisma.cronJobs.delete({
      where: { jobName },
    });
  } else {
    throw new Error("Job not found");
  }
};

module.exports = {
  init,
  addCronJob,
  editCronJob,
  deleteCronJob,
  scheduleOldCronJobs,
};
