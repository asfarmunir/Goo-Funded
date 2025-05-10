const BASE_URL = process.env.NODE_ENV === "production" ? "https://app.vantagepicks.com" : "http://localhost:3000";

const ALL_STEP_CHALLENGES = {
  minPicks: 25,
  minPickAmount: 0.025, // 2.5%
  maxPickAmount: 0.1, // 10%
  maxLoss: 0.2, // 20%
  maxDailyLoss: 0.15, // 15%
  profitTarget: 0.3, // 30%
  minBetPeriod: 7, // 7 days
  maxBetPeriod: 30, // 30 days
};

function getTailoredObjectives(account) {
  const tailoredObjectives = {
    minPicks: 25,
    maxLoss: getOriginalBalance(account) * ALL_STEP_CHALLENGES.maxLoss,
    maxDailyLoss:
      getOriginalBalance(account) * ALL_STEP_CHALLENGES.maxDailyLoss,
    profitTarget:
      getOriginalBalance(account) * ALL_STEP_CHALLENGES.profitTarget,
  };
  return tailoredObjectives;
}

function getOriginalBalance(account) {
  const original_balance = parseInt(account.accountSize.replace("K", "000"));
  return original_balance;
}

function calculateTotalLoss(account) {
  const account_size = getOriginalBalance(account);
  const total_loss = account_size - account.balance;
  if (total_loss < 0) {
    return 0;
  }
  return total_loss;
}

function calculateTotalProfit(account) {
  const account_size = getOriginalBalance(account);
  const total_profit = account.balance - account_size;
  if (total_profit < 0) {
    return 0;
  }
  return total_profit;
}

const areObjectivesComplete = (account) => {
  const objectives = getTailoredObjectives(account)
  let objectivesComplete = true;
  if(!account.minBetPeriodCompleted) {
    objectivesComplete = false;
  }
  if(account.totalLoss > objectives.maxLoss) {
    objectivesComplete = false;
  }
  if(account.dailyLoss > objectives.maxDailyLoss) {
    objectivesComplete = false;
  }
  if(calculateTotalProfit(account) < objectives.profitTarget) {
    objectivesComplete = false;
  }
  if(account.picks < objectives.minPicks) {
    objectivesComplete = false;
  }
  return objectivesComplete;
}

async function sendBreachedEmail(status, accountId) {
  const emailResponse = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: accountId,
      status: "BREACHED",
    }),
  })
  if (!emailResponse.ok) {
    throw new Error(`Email request failed with status ${emailResponse.status}`);
  }
}

async function sendPhaseUpdateEmail(accountId, newPhase) {
  const emailResponse = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: accountId,
      status: "PHASE",
      phaseNumber: newPhase,
    }),
  })
  if (!emailResponse.ok) {
    throw new Error(`Email request failed with status ${emailResponse.status}`);
  }
}


async function sendPickResultEmail(accountId, result) {
  const emailResponse = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: accountId,
      status: result === "WIN" ? "BET_WIN" : "BET_LOSS" ,
    }),
  })
  if (!emailResponse.ok) {
    throw new Error(`Email request failed with status ${emailResponse.status}`);
  }
}

async function sendFundedAccountEmail(accountId) {
  const emailResponse = await fetch(`${BASE_URL}/api/send-status-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: accountId,
      status: "FUNDED",
    }),
  })
  if (!emailResponse.ok) {
    throw new Error(`Email request failed with status ${emailResponse.status}`);
  }
}

async function sendAppNotification(userId, type, message) {
  const emailResponse = await fetch(`${BASE_URL}/api/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      type,
      message,
    }),
  })

  if (!emailResponse.ok) {
    throw new Error(`Email request failed with status ${emailResponse.status}`);
  }
}

const MAX_BET_WIN_THRESHOLD = 0.25;
const MAX_PROFIT_THRESHOLD = 0.25;

module.exports = {
  ALL_STEP_CHALLENGES,
  MAX_BET_WIN_THRESHOLD,
  MAX_PROFIT_THRESHOLD,
  getTailoredObjectives,
  getOriginalBalance,
  calculateTotalLoss,
  calculateTotalProfit,
  areObjectivesComplete,
  sendBreachedEmail,
  sendPhaseUpdateEmail,
  sendFundedAccountEmail,
  sendAppNotification,
  sendPickResultEmail
};