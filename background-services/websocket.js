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

const games = [
  {
    id: "572d984e132eddaac3da93e5db332e7e",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T03:10:38Z",
    completed: true,
    home_team: "Sacramento Kings",
    away_team: "Oklahoma City Thunder",
    scores: [
      {
        name: "Sacramento Kings",
        score: "113",
      },
      {
        name: "Oklahoma City Thunder",
        score: "103",
      },
    ],
    last_update: "2022-02-06T05:18:19Z",
  },
  {
    id: "e2296d6d1206f8d185466876e2b444ea",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T03:11:26Z",
    completed: true,
    home_team: "Portland Trail Blazers",
    away_team: "Milwaukee Bucks",
    scores: [
      {
        name: "Portland Trail Blazers",
        score: "108",
      },
      {
        name: "Milwaukee Bucks",
        score: "137",
      },
    ],
    last_update: "2022-02-06T05:21:01Z",
  },
  {
    id: "8d8affc2e29bcafd3cdec8b414256cda",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T20:41:04Z",
    completed: true,
    home_team: "Denver Nuggets",
    away_team: "Brooklyn Nets",
    scores: [
      {
        name: "Denver Nuggets",
        score: "124",
      },
      {
        name: "Brooklyn Nets",
        score: "104",
      },
    ],
    last_update: "2022-02-06T22:50:22Z",
  },
  {
    id: "aae8b3294ab2de36e63c614e44e94d80",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T20:41:47Z",
    completed: true,
    home_team: "Minnesota Timberwolves",
    away_team: "Detroit Pistons",
    scores: [
      {
        name: "Minnesota Timberwolves",
        score: "118",
      },
      {
        name: "Detroit Pistons",
        score: "105",
      },
    ],
    last_update: "2022-02-06T22:52:29Z",
  },
  {
    id: "07767ff2952c6b025aa5584626db2910",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T20:42:13Z",
    completed: true,
    home_team: "Chicago Bulls",
    away_team: "Philadelphia 76ers",
    scores: [
      {
        name: "Chicago Bulls",
        score: "108",
      },
      {
        name: "Philadelphia 76ers",
        score: "119",
      },
    ],
    last_update: "2022-02-06T22:58:23Z",
  },
  {
    id: "3f63cadf65ad249c5bc6b1aac8ba426d",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T23:10:53Z",
    completed: true,
    home_team: "Orlando Magic",
    away_team: "Boston Celtics",
    scores: [
      {
        name: "Orlando Magic",
        score: "83",
      },
      {
        name: "Boston Celtics",
        score: "116",
      },
    ],
    last_update: "2022-02-07T01:18:57Z",
  },
  {
    id: "4843de62e910869ee34065ffe4c20137",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T23:11:42Z",
    completed: true,
    home_team: "Dallas Mavericks",
    away_team: "Atlanta Hawks",
    scores: [
      {
        name: "Dallas Mavericks",
        score: "103",
      },
      {
        name: "Atlanta Hawks",
        score: "94",
      },
    ],
    last_update: "2022-02-07T01:26:29Z",
  },
  {
    id: "e0f6669de3ae5af63162c3d9459184bf",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-06T23:12:42Z",
    completed: true,
    home_team: "Cleveland Cavaliers",
    away_team: "Indiana Pacers",
    scores: [
      {
        name: "Cleveland Cavaliers",
        score: "98",
      },
      {
        name: "Indiana Pacers",
        score: "85",
      },
    ],
    last_update: "2022-02-07T01:36:15Z",
  },
  {
    id: "a306576b1789dd1c884cc1aa61fda4bf",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-07T00:11:03Z",
    completed: true,
    home_team: "Houston Rockets",
    away_team: "New Orleans Pelicans",
    scores: [
      {
        name: "Houston Rockets",
        score: "107",
      },
      {
        name: "New Orleans Pelicans",
        score: "120",
      },
    ],
    last_update: "2022-02-07T02:25:17Z",
  },
  {
    id: "4b25562aa9e87b57aa16f970abaec8cc",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-07T02:11:01Z",
    completed: false,
    home_team: "Los Angeles Clippers",
    away_team: "Milwaukee Bucks",
    scores: [
      {
        name: "Los Angeles Clippers",
        score: "40",
      },
      {
        name: "Milwaukee Bucks",
        score: "37",
      },
    ],
    last_update: "2022-02-07T02:47:23Z",
  },
  {
    id: "19434a586e3723c55cd3d028b90eb112",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-08T00:10:00Z",
    completed: false,
    home_team: "Charlotte Hornets",
    away_team: "Toronto Raptors",
    scores: null,
    last_update: null,
  },
  {
    id: "444e56cbf5a6d534741bb8d1298e2d50",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-08T01:10:00Z",
    completed: false,
    home_team: "Oklahoma City Thunder",
    away_team: "Golden State Warriors",
    scores: null,
    last_update: null,
  },
  {
    id: "16d461b95e9d643d7f2469f72c098a20",
    sport_key: "basketball_nba",
    sport_title: "NBA",
    commence_time: "2022-02-08T02:10:00Z",
    completed: false,
    home_team: "Utah Jazz",
    away_team: "New York Knicks",
    scores: null,
    last_update: null,
  },
];

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

// function getNewUserLevel(picksWon) {
//   if (picksWon < 10) {
//     return "NEWBIE";
//   } else if (picksWon < 50) {
//     return "BRONZE";
//   } else if (picksWon < 100) {
//     return "SILVER";
//   } else if (picksWon < 200) {
//     return "GOLD";
//   } else if (picksWon < 350) {
//     return "PLATINUM";
//   } else {
//     return "HERO";
//   }
// }
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
  console.log("🚀 ~ yaha hain" )
  await sendAppNotification(
    bet.userId,
    "ALERT",
    `Congratulations! You won $${
      Number(bet.winnings.toFixed(2))
    } Pick.`
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

// Function to get the winner of a game (old version)
function getWinner(game) {
  if (Number(game.scores[0].score) > Number(game.scores[1].score)) {
    return game.scores[0].name;
  } else {
    return game.scores[1].name;
  }
}
// Function to fetch match results from the third-party API (old version)
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
  console.log("🚀 ~ sportKeys ~ sportKeys:", sportKeys)

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
      acc[key].push(bet.eventId[index]);
    });
    return acc;
  }, {});
  console.log("🚀 ~ sportEventMap ~ sportEventMap:", sportEventMap)

  // Fetch match results from the third-party API
  const results = await Promise.all(
    sportKeys.map(async (sportKey) => {
      const eventIdsForSport = sportEventMap[sportKey];
      console.log("🚀 ~ sportKeys.map ~ eventIdsForSport:", eventIdsForSport)

      try {
        const apiKey = process.env.NEXT_PUBLIC_PICKS_API_KEY;
        const apiUrl = `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${apiKey}&daysFrom=3&eventIds=${eventIdsForSport.join(",")}`;

        console.log("🚀 ~ sportKeys.map ~ apiUrl:", apiUrl)
        const sportResults = await axios.get(apiUrl);
        console.log("🚀 ~ sportKeys.map ~ sportResults:", sportResults.data)
        return sportResults.data;
      } catch (error) {
        console.error(`Error fetching results for sport ${sportKey}:`, error);
        return [];
      }
    })
  );

  // const completedResults = results.filter((result) => result.length);
  const completedResults = results
  .flat() // Flatten the array of arrays into a single array
  .filter((game) => game.completed); // Filter only completed games
  if(!completedResults.length) {
    return [];
  }
  
  console.log("🚀 ~ fetchMatchResults ~ completedResults:", completedResults)
  const winners = [];
  completedResults.forEach((game) => {
    // const game = gameArray[0]; // Access the first element of the game array
    const winner = getWinner(game);
    winners.push({
      eventId: game.id,
      winner: winner,
    });
  });
  
  console.log("🚀 ~ fetchMatchResults ~ winners:", winners)
  return winners;
}

// Function to check for match updates and send to clients (old version)
async function checkForUpdates(wss) {
  console.log("Checking for updates...");
  try {
    // 1. Fetch all active bets
    const bets = await prisma.bets.findMany({
      where: {
        betStatus: "OPENED",
      },
    });

    // 2. Fetch the match results from the third-party API
    const winners = await fetchMatchResults(bets);
    console.log("🚀 ~ checkForUpdates ~ winners:", winners)

    const betIds = bets.map((bet) => bet.id);

    if(!winners.length) {
      return;
    }

    bets.forEach(async (bet) => {
      const eventResults = []; // [true, false, "SKIP"]
      bet.eventId.forEach((eventId, index) => {
        const winner = winners.find((game) => game.eventId === eventId);
        if (!winner) {
          eventResults.push("SKIP");
          return;
        }
        if (winner.winner === bet.team[index]) {
          eventResults.push(true);
        } else {
          eventResults.push(false);
        }
      });
      if(eventResults.includes("SKIP")) {
        return;
      }
      let allMatchesWon = false;
      if (
        eventResults.length === 0 ||
        eventResults.length !== bet.eventId.length ||
        eventResults.includes(false)
      ) {
        allMatchesWon = false;
      } else {
        allMatchesWon = true;
      }

      let betResult = allMatchesWon ? "WIN" : "LOSE";

      const account = await prisma.account.findUnique({
        where: { id: bet.accountId },
      });

      // Update the bet in the database
      await prisma.bets.update({
        where: { id: bet.id },
        data: { betResult, betStatus: "CLOSED" },
      });

      if (allMatchesWon) {
        await handleWin(bet, account);
      } else {
        await handleLoss(bet, account);
      }
    });

    broadcast({ message: "Match results updated" }, wss);

  } catch (error) {
    console.error("An unexpected error occurred in checkForUpdates:", error);
  }
}




async function checkBetResults(bet) {
    const LSportsConfig = {
        packageId: 2443,
        userName: "sandro@proppicks.com",
        password: "Ud354687!"
    };

    const fixtures = bet.eventId; // Array of fixture IDs from the bet schema

    try {
        // Step 1: Check if all matches are completed
        const fixtureStatusResponse = await axios.post(
            "https://stm-snapshot.lsports.eu/PreMatch/GetFixtures",
            {
                ...LSportsConfig,
                fixtures
            }
        );

        const fixturesData = fixtureStatusResponse.data.Body;

        // Ensure all matches are completed (status === 3)
        const allCompleted = fixturesData.every(fixture => fixture.Fixture.Status === 3);

        if (!allCompleted) {
            return { status: "Pending", message: "Not all matches are completed yet." };
        }

        // Step 2: Fetch markets for the completed matches
        const fixtureMarketsResponse = await axios.post(
            "https://stm-snapshot.lsports.eu/PreMatch/GetFixtureMarkets",
            {
                ...LSportsConfig,
                fixtures,
                Markets: [1, 5, 17, 169, 84, 85, 41, 42, 7, 168, 211, 409]
            }
        );

        const marketsData = fixtureMarketsResponse.data.Body;

        // Step 3: Validate each bet in the bet array
        const results = bet.bets.map(userBet => {
            const { fixtureId, marketName, betIdInMarket } = userBet;

            // Find the matching fixture
            const fixture = marketsData.find(f => f.FixtureId === parseInt(fixtureId));

            if (!fixture || !fixture.Markets) {
                return false; // If the fixture or markets are missing, consider it a loss
            }

            // Find the market with the specified name
            const market = fixture.Markets.find(m => m.Name === marketName);

            if (!market || !market.Bets) {
                return false; // If the market or bets are missing, consider it a loss
            }

            // Find the bet with the specified bet ID
            const userMarketBet = market.Bets.find(b => b.Id === parseInt(betIdInMarket));

            // If no matching bet or settlement is undefined, consider it a loss
            if (!userMarketBet || typeof userMarketBet.Settlement !== "number") {
                return false;
            }

            // Settlement 2 means win, all others are losses
            return userMarketBet.Settlement === 2;
        });

        // Step 4: Determine the overall result
        const isSuccess = results.every(result => result === true);

        return {
            status: isSuccess ? "Won" : "Lost",
            message: isSuccess ? "⚠️Congratulations, you won the bet!" : "⚠️Unfortunately, you lost the bet.",
            details: results
        };

    } catch (error) {
        console.error("⚠️Error while checking bet results:", error.message);
        return { status: "Error", message: "⚠️An error occurred while checking the bet results.", error };
    }
}

// Function to check for match updates and send to clients
async function checkForSettlements(wss) {
  console.log("Checking for updates...");
  try {
    // 1. Fetch all active bets
    const bets = await prisma.bets.findMany({
      where: {
        betStatus: "OPENED",
      },
    });

    // Iterate through each bet
    for (const bet of bets) {
      try {
        // Check the results of the bet using the provided function
        const result = await checkBetResults(bet);

        if (result.status === "Pending") {
          console.log(`Bet ID ${bet.id}: ${result.message}`);
          continue; // Skip updating this bet if matches are not yet completed
        }

        const allBetsWon = result.status === "Won";
        const betResult = allBetsWon ? "WIN" : "LOSE";

        // Fetch the account associated with the bet
        const account = await prisma.account.findUnique({
          where: { id: bet.accountId },
        });

        // Update the bet in the database
        await prisma.bets.update({
          where: { id: bet.id },
          data: { betResult, betStatus: "CLOSED" },
        });

        // Handle the result based on the bet outcome
        if (allBetsWon) {
          await handleWin(bet, account);
        } else {
          await handleLoss(bet, account);
        }

        console.log(`Bet ID ${bet.id} processed: ${result.message}`);
      } catch (betError) {
        console.error(`Error processing bet ID ${bet.id}:`, betError);
      }
    }

    // Broadcast update message to WebSocket clients
    broadcast({ message: "Match results updated" }, wss);

  } catch (error) {
    console.error("An unexpected error occurred in checkForSettlements:", error);
  }
}







// Initialize WebSocket server with noServer: true
const init = (server) => {
  const wss = new WebSocket.Server({ port: 8443 });

  wss.on("connection", (ws, req) => {
    // Parse userId from query params or a message
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
module.exports = { init, sendNotification, checkForUpdates,checkForSettlements };
