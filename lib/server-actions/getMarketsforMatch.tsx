"use server";

export const getMarkets = async (
  sportsId: number,
  leagueId: number,
  matchId: number
) => {
  try {
    const res = await fetch(
      `https://stm-snapshot.lsports.eu/PreMatch/GetFixtureMarkets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({
          packageId: 2443,
          userName: "sandro@proppicks.com",
          password: "Ud354687!",
          sports: [sportsId],
          leagues: [leagueId],
          fixtures: [matchId],
          Markets: [1, 5, 17, 169, 84, 85, 41, 42, 7, 168, 211, 409],
        }),
      }
    );
    const data = await res.json();
    return JSON.parse(JSON.stringify({ data, status: 200 }));
  } catch (error) {
    console.log("🚀 ~ get match ~ error", error);
    return JSON.parse(JSON.stringify({ error, status: 500 }));
  }
};
