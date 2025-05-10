type Bet = {
  eventId: string[];
  sportKey: string[];
  sport: string[];
  event: string[]; // Home vs away teams
  league: string[];
  team: string[];
  odds: number;
  pick: number;
  winnings: number;
  oddsFormat: string; // Assuming OddsFormat is an enum, you may need to adjust this
  gameDate: Date[];
};

interface CreateBet {
    bet: Bet,
    accountNumber: string
}

export const createBet = async (data: CreateBet) => {
  const response = await fetch("/api/bet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error || "Failed to create bet");
  }

  return response.json(); // Return the new bet data
};
