interface GetGamesParams {
  sportKey: string;
  oddsFormat: "decimal" | "american";
}

export const getGames = async ({
  sportKey = "americanfootball_nfl",
  oddsFormat = "american",
}: GetGamesParams) => {
  const response = await fetch(
    `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${process.env.NEXT_PUBLIC_PICKS_API_KEY}&regions=us&oddsFormat=${oddsFormat}&dateFormat=iso`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return response.json();
};
