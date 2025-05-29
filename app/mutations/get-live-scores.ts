interface GetLiveScoresParams {
  sportKey: string;
}

export const getLiveScores = async ({ sportKey }: GetLiveScoresParams) => {
  const fetchUrl = new URL(
    `https://api.the-odds-api.com/v4/sports/${sportKey}/scores`
  );
  fetchUrl.searchParams.append("apiKey", process.env.NEXT_PUBLIC_PICKS_API_KEY!);
  fetchUrl.searchParams.append("daysFrom", "1");

  const response = await fetch(fetchUrl.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch live scores for ${sportKey}`);
  }

  const data = await response.json();

  // Filter for in-progress games
  return data.filter(
    (game: any) => !game.completed && game.scores && game.scores.length > 0
  );
};