interface GetGamesParams {
  sportKey: string;
  oddsFormat: "decimal" | "american";
}

export const getGames = async ({
  sportKey = "soccer_uefa_champs_league",
  oddsFormat = "american",
}: GetGamesParams) => {
  
  const fetchUrl = new URL(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${process.env.NEXT_PUBLIC_PICKS_API_KEY}&regions=us&oddsFormat=${oddsFormat}&dateFormat=iso`)
  fetchUrl.searchParams.append("markets", "h2h,spreads,totals")
  const response = await fetch(fetchUrl.toString())

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  return response.json();
};
