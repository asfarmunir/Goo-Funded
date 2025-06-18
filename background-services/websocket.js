const WebSocket = require("ws");
const { PrismaClient } = require("../node_modules/@prisma/client");
const {
  getOriginalBalance,
  sendBreachedEmail,
  getTailoredObjectives,
  areObjectivesComplete,
  sendPhaseUpdateEmail,
  sendFundedAccountEmail,
  sendAppNotification,
  sendPickResultEmail,
  MAX_PROFIT_THRESHOLD,
  MAX_BET_WIN_THRESHOLD,
} = require("./utils");
const { default: axios } = require("axios");

const prisma = new PrismaClient();

// Store connected clients by their userId
const connectedClients = {};

// Function to broadcast data to all connected WebSocket clients
function broadcast(data, wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Function to send a notification to a specific client by userId
function sendNotification(userId, message) {
  const client = connectedClients[userId];

  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ message }));
  } else {
    console.log(`Client with userId: ${userId} is not connected.`);
  }
}

function getNewUserLevel(picksWon) {
  if (picksWon < 10) {
    return "Beginner";
  } else if (picksWon < 25) {
    return "Superviser";
  } else if (picksWon < 50) {
    return "Coach";
  } else if (picksWon < 100) {
    return "TopTier";
  } else if (picksWon < 200) {
    return "RegionalPlayer";
  } else {
    return "RegionalPlayer";
  }
}

async function handleWin(bet, account) {
  const accountSize = getOriginalBalance(account);
  const maxMonthlyProfit = accountSize * MAX_PROFIT_THRESHOLD;
  const maxBetWin = maxMonthlyProfit * MAX_BET_WIN_THRESHOLD;
  const discardBet = bet.winnings > maxBetWin;
  const updatedAccount = await prisma.account.update({
    where: { id: bet.accountId },
    data: {
      balance: { increment: bet.pick + bet.winnings },
      totalFundedAmount: {
        increment:
          account.status === "FUNDED" && !discardBet ? bet.winnings : 0,
      },
    },
  });
  const updatedUser = await prisma.user.update({
    where: {
      id: bet.userId,
    },
    data: {
      picksWon: {
        increment: 1,
      },
    },
  });
  const updateLevelUser = await prisma.user.update({
    where: {
      id: bet.userId,
    },
    data: {
      profileLevel: {
        set: getNewUserLevel(updatedUser.picksWon),
      },
    },
  });
  await sendAppNotification(
    bet.userId,
    "ALERT",
    `Congratulations! You won $${Number(bet.winnings.toFixed(2))} Pick.`
  );
  await sendPickResultEmail(bet.accountId, "WIN");

  if (account.status === "CHALLENGE") {
    const objectivesComplete = areObjectivesComplete(updatedAccount);
    if (objectivesComplete) {
      let goFunded = false;
      let newPhase = updatedAccount.phaseNumber + 1;

      if (account.accountType === "TWO_STEP" && newPhase === 3) {
        goFunded = true;
      } else if (account.accountType === "THREE_STEP" && newPhase === 4) {
        goFunded = true;
      }

      if (goFunded) {
        await prisma.account.update({
          where: {
            id: bet.accountId,
          },
          data: {
            status: "FUNDED",
            phaseNumber: newPhase,
            balance: getOriginalBalance(account),
            dailyLoss: 0,
            totalLoss: 0,
            totalFundedPayout: 0,
            totalFundedAmount: getOriginalBalance(account),
            picks: 0,
            fundedPayoutTimer: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          },
        });
        await sendFundedAccountEmail(account.id);
        await sendAppNotification(
          bet.userId,
          "UPDATE",
          "Congratulations! Your account has been funded."
        );
      } else {
        await prisma.account.update({
          where: {
            id: bet.accountId,
          },
          data: {
            phase: newPhase,
            balance: getOriginalBalance(account),
            dailyLoss: 0,
            totalLoss: 0,
            totalFundedPayout: 0,
            totalFundedAmount: getOriginalBalance(account),
            picks: 0,
          },
        });
        await sendPhaseUpdateEmail(account.id, newPhase);
        await sendAppNotification(
          bet.userId,
          "UPDATE",
          `Your account is upgraded to phase ${newPhase}`
        );
      }
    }
  }
}

async function handleLoss(bet, account) {
  await prisma.account.update({
    where: {
      id: bet.accountId,
    },
    data: {
      totalLoss: { increment: bet.pick },
      dailyLoss: { increment: bet.pick },
       // yha pr issue hain
      totalFundedAmount: {
        decrement: account.status === "FUNDED" ? bet.pick : 0,
      },
    },
  });
  await sendPickResultEmail(bet.accountId, "LOSS");
  if (account.dailyLoss + bet.pick >= getOriginalBalance(account) * 0.15) {
    await prisma.account.update({
      where: {
        id: bet.accountId,
      },
      data: {
        status: "BREACHED",
      },
    });

    await sendBreachedEmail("BREACHED", account.id);
    await sendAppNotification(
      bet.userId,
      "ALERT",
      "Your account has been breached."
    );
  }
  if (account.totalLoss + bet.pick >= getOriginalBalance(account) * 0.2) {
    await prisma.account.update({
      where: {
        id: bet.accountId,
      },
      data: {
        status: "BREACHED",
      },
    });

    await sendBreachedEmail("BREACHED", account.id);
    await sendAppNotification(
      bet.userId,
      "ALERT",
      "Your account has been breached."
    );
  }
}

// Function to evaluate game outcome for all markets
function evaluateGameOutcome(game) {
  if (!game.completed || !game.scores || game.scores.length !== 2) {
    return null;
  }

  const homeTeam = game.scores.find((score) => score.name === game.home_team);
  const awayTeam = game.scores.find((score) => score.name === game.away_team);

  if (!homeTeam || !awayTeam) {
    return null;
  }

  const homeScore = Number(homeTeam.score);
  const awayScore = Number(awayTeam.score);

  // Determine winner for Moneyline (h2h)
  const winner = homeScore > awayScore ? homeTeam.name : awayScore > homeScore ? awayTeam.name : null;

  // Check if game is a draw
  const isDraw = homeScore === awayScore;

  // Check if both teams scored
  const bothTeamsScored = homeScore > 0 && awayScore > 0;

  // Calculate total points for Totals
  const totalPoints = homeScore + awayScore;

  // Calculate point differential for Spreads (home score - away score)
  const pointDifferential = homeScore - awayScore;

  return {
    eventId: game.id,
    winner,
    isDraw,
    bothTeamsScored,
    totalPoints,
    pointDifferential,
    homeTeam: homeTeam.name,
    awayTeam: awayTeam.name,
    homeTeamScore: homeScore,
    awayTeamScore: awayScore,
  };
}

// Function to fetch match results from the third-party API
async function fetchMatchResults(bets) {
  // Find unique sport keys from all bets
  const sportKeys = bets.reduce((acc, bet) => {
    bet.sportKey.forEach((key) => {
      if (!acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);

  // Find unique eventIds from all bets
  const eventIds = bets.reduce((acc, bet) => {
    bet.eventId.forEach((id) => {
      if (!acc.includes(id)) {
        acc.push(id);
      }
    });
    return acc;
  }, []);

  // Hash Map for sport keys and event ids { sportKey: [eventIds] }
  const sportEventMap = bets.reduce((acc, bet) => {
    bet.sportKey.forEach((key, index) => {
      if (!acc[key]) {
        acc[key] = [];
      }
      if (!acc[key].includes(bet.eventId[index])) {
        acc[key].push(bet.eventId[index]);
      }
    });
    return acc;
  }, {});

  // Fetch match results from the third-party API
  const results = await Promise.all(
    sportKeys.map(async (sportKey) => {
      const eventIdsForSport = sportEventMap[sportKey];
      try {
        const apiKey = process.env.NEXT_PUBLIC_PICKS_API_KEY;
        const apiUrl = `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${apiKey}&daysFrom=3&eventIds=${eventIdsForSport.join(",")}`;
        const sportResults = await axios.get(apiUrl);
        console.log("🚀 ~ sportKeys.map ~ apiUrl:", apiUrl)
        console.log("🚀 ~ sportKeys.map ~ sportResults:", sportResults.data);
        return sportResults.data;
      } catch (error) {
        console.error(`Error fetching results for sport ${sportKey}:`, error);
        return [];
      }
    })
  );

  const completedResults = results
    .flat()
    .filter((game) => game.completed);

  if (!completedResults.length) {
    return [];
  }

  console.log("🚀 ~ fetchMatchResults ~ completedResults:", completedResults);
  const outcomes = completedResults
    .map((game) => evaluateGameOutcome(game))
    .filter((outcome) => outcome !== null);

  console.log("🚀 ~ fetchMatchResults ~ outcomes:", outcomes);
  return outcomes;
}

// Function to check for match updates and send to clients
async function checkForUpdates(wss) {
  console.log("Checking for updates...");
  try {
    // 1. Fetch all active bets
    const bets = await prisma.bets.findMany({
      where: {
        betStatus: "OPENED",
      },
    });
    console.log("🚀 ~ checkForUpdates ~ bets:", bets)

    // 2. Fetch the match results from the third-party API
    const outcomes = await fetchMatchResults(bets);
    console.log("🚀 ~ checkForUpdates ~ outcomes:", outcomes);

    if (!outcomes.length) {
      console.log("No completed games found.");
      return;
    }

    for (const bet of bets) {
      const legResults = []; // ["WIN", "LOSE", "PUSH", "SKIP"]

      for (let i = 0; i < bet.eventId.length; i++) {
        const eventId = bet.eventId[i];
        const team = bet.team[i];
        const market = bet.betDetails[i].market;
        const point = bet.betDetails[i].point;
        const description = bet.betDetails[i].description;
        const outcome = outcomes.find((o) => o.eventId === eventId);

        if (!outcome) {
          legResults.push("SKIP");
          continue;
        }

        if (market === "h2h") {
          // Moneyline: Win if selected team is the winner
          if (team === outcome.winner) {
            legResults.push("WIN");
          } else {
            legResults.push("LOSE");
          }
        } else if (market === "spreads") {
          // Spreads: Win if selected team covers the spread
          const selectedTeamIsHome = team === outcome.homeTeam;
          const spread = point || 0;
          const adjustedDifferential = selectedTeamIsHome
            ? outcome.pointDifferential + spread
            : -outcome.pointDifferential + spread;

          if (adjustedDifferential > 0) {
            legResults.push("WIN");
          } else if (adjustedDifferential === 0) {
            legResults.push("PUSH");
          } else {
            legResults.push("LOSE");
          }
        } else if (market === "totals") {
          // Totals: Win if total points are over/under the point
          const totalPoint = point || 0;
          if (outcome.totalPoints > totalPoint) {
            legResults.push(team === "Over" ? "WIN" : "LOSE");
          } else if (outcome.totalPoints < totalPoint) {
            legResults.push(team === "Under" ? "WIN" : "LOSE");
          } else {
            legResults.push("PUSH");
          }
        } else if (market === "btts") {
          // Both Teams to Score: Win if both teams scored (Yes) or neither/both didn't (No)
          if (team === "Yes" && outcome.bothTeamsScored) {
            legResults.push("WIN");
          } else if (team === "No" && !outcome.bothTeamsScored) {
            legResults.push("WIN");
          } else {
            legResults.push("LOSE");
          }
        } else if (market === "draw_no_bet") {
          // Draw No Bet: Win if selected team wins, push if draw
          if (outcome.isDraw) {
            legResults.push("PUSH");
          } else if (team === outcome.winner) {
            legResults.push("WIN");
          } else {
            legResults.push("LOSE");
          }
        } else if (market === "h2h_3_way") {
          // 3-Way Moneyline: Win if selected outcome (home/away/draw) matches
          if (outcome.isDraw && team === "Draw") {
            legResults.push("WIN");
          } else if (team === outcome.winner) {
            legResults.push("WIN");
          } else {
            legResults.push("LOSE");
          }
        } else if (market === "team_totals" || market === "alternate_team_totals") {
          // Team Totals/Alternate Team Totals: Win if selected team's score is over/under the point
          const selectedTeam = description || team; // Use description for alternate_team_totals
          const teamScore =
            selectedTeam === outcome.homeTeam
              ? outcome.homeTeamScore
              : outcome.awayTeamScore;
          const totalPoint = point || 0;

          if (teamScore > totalPoint) {
            legResults.push(team === "Over" ? "WIN" : "LOSE");
          } else if (teamScore < totalPoint) {
            legResults.push(team === "Under" ? "WIN" : "LOSE");
          } else {
            legResults.push("PUSH");
          }
        } else {
          legResults.push("SKIP");
          console.warn(`Unknown market type: ${market}`);
        }
      }

      if (legResults.includes("SKIP")) {
        continue; // Wait for all games to complete
      }

      let betResult;
      if (legResults.every((result) => result === "PUSH")) {
        betResult = "LOSE"; // All legs pushed, treat as loss, pehly idhr PUSH tha
      } else if (legResults.includes("LOSE")) {
        betResult = "LOSE";
      } else if (legResults.some((result) => result === "PUSH")) {
        // Recalculate winnings for remaining winning legs
        const winningLegs = legResults
          .map((result, index) => (result === "WIN" ? index : null))
          .filter((index) => index !== null);
        if (winningLegs.length === 0) {
          betResult = "LOSE"; // All legs lost, treat as loss
        } else {
          betResult = "WIN";
          // Adjust winnings (simplified: assume odds provided are correct)
        }
      } else {
        betResult = "WIN";
      }

      const account = await prisma.account.findUnique({
        where: { id: bet.accountId },
      });

      // Update the bet in the database
      await prisma.bets.update({
        where: { id: bet.id },
        data: { betResult, betStatus: "CLOSED" },
      });

      if (betResult === "WIN") {
        await handleWin(bet, account);
      } else if (betResult === "LOSE") {
        await handleLoss(bet, account);
      } 
      // else if (betResult === "PUSH") {
      //   // Refund the pick amount
      //   await prisma.account.update({
      //     where: { id: bet.accountId },
      //     data: {
      //       balance: { increment: bet.pick },
      //     },
      //   });
      //   await sendPickResultEmail(bet.accountId, "PUSH");
      //   await sendAppNotification(
      //     bet.userId,
      //     "ALERT",
      //     `Your bet has been pushed. $${bet.pick.toFixed(2)} refunded.`
      //   );
      // }
    }

    broadcast({ message: "Match results updated" }, wss);

  } catch (error) {
    console.error("An unexpected error occurred in checkForUpdates:", error);
  }
}

// Initialize WebSocket server
const init = (server) => {
  const wss = new WebSocket.Server({ port: 8443 });

  wss.on("connection", (ws, req) => {
    // Parse userId from query params
    const userId = req.url.split("?userId=")[1];
    console.log(userId);

    // Store the connected client
    connectedClients[userId] = ws;
    console.log(`Client connected: userId=${userId}`);

    // When a message is received from the client
    ws.on("message", (message) => {
      console.log("Received message:", message);
      ws.send("Server received your message");
    });

    // When the connection is closed
    ws.on("close", () => {
      console.log(`Client disconnected: userId=${userId}`);
      delete connectedClients[userId]; // Remove the client from the map
    });
  });

  console.log("WebSocket server initialized");

  return wss;
};

module.exports = { init, sendNotification, checkForUpdates };