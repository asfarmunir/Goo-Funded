import { getMatcheById } from "@/lib/server-actions/getMatchById";
import { getMatches } from "@/lib/server-actions/getMatches";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {sportsId,leagueId,matchId}  = await req.json();
    console.log("🚀 ~ POST ~ leagueId:", leagueId)
    console.log("🚀 ~ POST ~ matchId:", matchId)
    console.log("🚀 ~ POST ~ sportsId:", sportsId)

    if (!matchId) {
      return NextResponse.json({ error: "Invalid or missing information" }, { status: 400 });
    }

    const response = await  getMatcheById(sportsId,leagueId,matchId);
    console.log("🚀 ~ POST ~ response:", response)
    if (response.status !== 200) {
      console.error("Failed to fetch match:", response.error || response);
      return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
    }

    const matchDetails = response.data.Body;
    return NextResponse.json({ match: matchDetails }, { status: 200 });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}
