import { getMarkets } from "@/lib/server-actions/getMarketsforMatch";
import { getMatcheById } from "@/lib/server-actions/getMatchById";
import { getMatches } from "@/lib/server-actions/getMatches";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sportsId, leagueId, matchId } = await req.json();

    if (!matchId) {
      return NextResponse.json(
        { error: "Invalid or missing information" },
        { status: 400 }
      );
    }

    const response = await getMarkets(sportsId, leagueId, matchId);
    console.log("🚀 ~ POST ~ MARKETS:", response);
    if (response.status !== 200) {
      console.error("Failed to fetch match:", response.error || response);
      return NextResponse.json(
        { error: "Failed to fetch match" },
        { status: 500 }
      );
    }

    const markets = response.data.Body;
    return NextResponse.json({ markets: markets }, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
