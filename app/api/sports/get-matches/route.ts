import { getMatches } from "@/lib/server-actions/getMatches";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {sportsId,tournamentId,matchStatus}  = await req.json();

    if (!sportsId) {
      return NextResponse.json({ error: "Invalid or missing information" }, { status: 400 });
    }

    const response = await  getMatches(sportsId,tournamentId,matchStatus);

    if (response.status !== 200) {
      console.error("Failed to fetch matches:", response.error || response);
      return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
    }

    const matchesList = response.data?.Body;
    // if (!matchesList || matchesList.length === 0) {
    //   return NextResponse.json({ error: "No matches found" }, { status: 404 });
    // }

    return NextResponse.json({ matches: matchesList }, { status: 200 });

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}
