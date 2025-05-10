import { getLeagues } from "@/lib/server-actions/getLeaguesForSport";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sportsId  = await req.json();

    if (!sportsId) {
      return NextResponse.json({ error: "Invalid or missing sportsId" }, { status: 400 });
    }

    const response = await getLeagues(sportsId);

    if (response.status !== 200) {
      console.error("Failed to fetch leagues:", response.error || response);
      return NextResponse.json({ error: "Failed to fetch leagues" }, { status: 500 });
    }

    const leaguesList = response.data?.Body?.Leagues;
    if (!leaguesList || leaguesList.length === 0) {
      return NextResponse.json({ error: "No leagues found" }, { status: 404 });
    }
       const limitedLeagues = leaguesList.slice(0, 50);

    return NextResponse.json({ leagues: limitedLeagues }, { status: 200 });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Failed to fetch leagues" }, { status: 500 });
  }
}
