interface GetEventOddsParams {
  sportKey: string;
  eventId: string;
  oddsFormat: "decimal" | "american";
}

export const getEventOdds = async ({
  sportKey,
  eventId,
  oddsFormat = "american",
}: GetEventOddsParams) => {
  const markets = [
    "h2h",
    "spreads",
    "totals",
    "btts",
    "draw_no_bet",
    "h2h_3_way",
    "team_totals",
    "alternate_team_totals",
  ].join(",");

  const fetchUrl = new URL(
    `https://api.the-odds-api.com/v4/sports/${sportKey}/events/${eventId}/odds`
  );
  fetchUrl.searchParams.append("apiKey", process.env.NEXT_PUBLIC_PICKS_API_KEY!);
  fetchUrl.searchParams.append("regions", "us,uk,eu,au");
  fetchUrl.searchParams.append("markets", markets);
  fetchUrl.searchParams.append("dateFormat", "iso");
  fetchUrl.searchParams.append("oddsFormat", oddsFormat);

  const response = await fetch(fetchUrl.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch odds for event ${eventId}`);
  }

  return response.json();
};