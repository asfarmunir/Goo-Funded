import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALL_STEP_CHALLENGES } from "./constants";

interface Bet {
  id: number;
  team: string;
  odds: number;
  pick: number;
  toWin: number;
  home_team: string;
  away_team: string;
  oddsFormat: "decimal" | "american";
  gameDate: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDaysDifference = ({ date1, date2 }:{ date1: Date; date2: Date }) => {
  const betDate = new Date(date1);
  const diffTime = date2.getTime() - betDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return Math.abs(diffDays).toPrecision(2);
};

export function dateToFullCronString(date: Date) {
  const minutes = date.getUTCMinutes(); // Get minutes in UTC
  const hours = date.getUTCHours(); // Get hours in UTC
  const dayOfMonth = date.getUTCDate(); // Get day of the month
  const month = date.getUTCMonth() + 1; // Get month (0-11, so +1)
  const dayOfWeek = "*"; // Can specify a day or use '*' for any

  // If you need a specific year, you'll handle that logic separately
  return `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
}

export const americanToDecimalOdds = (odds: number) => {
  return odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;
};
export const calculateToWin = (bet: Bet, newPick: number) => {
  let decimalOdds = bet.odds;
  if (bet.oddsFormat === "american") {
    decimalOdds = americanToDecimalOdds(bet.odds);
  }
  return newPick * (decimalOdds - 1);
};

export function getOriginalAccountValue(account: any) {
  return parseInt(account.accountSize.replace("K", "000"));
}

export function getPercentageTimePassed(
  startDate: Date | string,
  endDate: Date | string
): number {
  // Convert the input to Date objects if necessary
  const start: Date = new Date(startDate);
  const end: Date = new Date(endDate);
  const now: Date = new Date();

  // If current time is before the start, return 0 (0% time passed)
  if (now < start) {
    return 0;
  }

  // If current time is after the end, return 100 (100% time passed)
  if (now > end) {
    return 100;
  }

  // Calculate the total duration and time passed (in milliseconds)
  const totalDuration: number = end.getTime() - start.getTime();
  const timePassed: number = now.getTime() - start.getTime();

  // Calculate the percentage of time passed
  const percentagePassed: number = (timePassed / totalDuration) * 100;

  return percentagePassed;
}

export const areStepObjectivesComplete = (account: any) => {
  const accountValue = getOriginalAccountValue(account);

  // Check if the account has made the minimum number of picks
  if (account.picks < ALL_STEP_CHALLENGES.minPicks) {
    return false;
  }

  // Check max daily loss
  if (account.dailyLoss >= accountValue * ALL_STEP_CHALLENGES.maxDailyLoss) {
    return false;
  }

  // Check total loss
  const totalLoss = account.totalLoss;
  if (totalLoss >= accountValue * ALL_STEP_CHALLENGES.maxLoss) {
    return false;
  }

  // Check profit target
  const profit = account.balance - accountValue;
  if (profit <= accountValue * ALL_STEP_CHALLENGES.profitTarget) {
    return false;
  }

  // Min bet period
  if (account.minBetPeriodCompleted === false) {
    return false;
  }

  // Max bet period automatically handled by the CRON job

  return true;
};

export const checkObjectivesAndUpgrade = async (prisma: any, account: any) => {
  const objectivesComplete = areStepObjectivesComplete(account);

  // If objectives are complete, update account status
  if (objectivesComplete) {
    const oldPhase = account.phase;
    const type: "TWO_STEP" | "THREE_STEP" = account.accountType;

    let newPhase = oldPhase + 1;
    let goFunded = false;

    if (type === "TWO_STEP") {
      if (newPhase === 3) {
        goFunded = true;
      }
    } else if (type === "THREE_STEP") {
      if (newPhase === 4) {
        goFunded = true;
      }
    }

    try {
      if (!goFunded) {
        // reset cron job for 30 days.
        const response = await fetch(
          `${process.env.BG_SERVICES_URL}/edit-cron-job`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobName: `${account.id}_MAX_BET_PERIOD`,
              newTime: dateToFullCronString(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              ),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        // new cron job for 7 days.
        const response2 = await fetch(`${account.id}_MIN_BET_PERIOD`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobName: `${account.id}_MIN_BET_PERIOD`,
            newTime: dateToFullCronString(
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ),
          }),
        });

        if (!response2.ok) {
          throw new Error(await response2.text());
        }
      } else {
        // delete 30 days cron job
        const response = await fetch(
          `${process.env.BG_SERVICES_URL}/delete-cron-job`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobName: `${account.id}_MAX_BET_PERIOD`,
            }),
          }
        );
        if(!response.ok) {
          throw new Error(await response.text());
        }

        // add 7 days cron job for inactivity
        const response2 = await fetch(
          `${process.env.BG_SERVICES_URL}/add-cron-job`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jobName: `${account.id}_INACTIVITY`,
              time: dateToFullCronString(
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              ),
              account: account.id,
              type: "inactivity"
            }),
          }
        );
        if(!response2.ok) {
          throw new Error(await response2.text());
        }
      }

      const updatedAccount = await prisma.account.update({
        where: {
          id: account.id,
        },
        data: {
          phase: newPhase,
          status: goFunded ? "FUNDED" : "CHALLENGE",
          balance: getOriginalAccountValue(account),
          picks: 0,
          dailyLoss: 0,
          // 7 days from now
          minBetPeriod: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          minBetCompleted: false,
          // 30 days from now
          maxBetPeriod: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          totalFundedAmount: goFunded ? getOriginalAccountValue(account) : 0,
          totalLoss: 0,
          fundedPayoutTimer: goFunded ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
        },
      });

      return updatedAccount;
    } catch (e) {
      throw new Error(`Error updating account: ${e}`);
    }
  } else {
    return null;
  }
};
