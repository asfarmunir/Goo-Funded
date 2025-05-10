import { connectToDatabase } from "@/helper/dbconnect";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { accountNumber: string } }) {

    const { accountNumber } = params;
    
    // connect to database
    await connectToDatabase();

    
    // get session
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "You must be logged in to view results" }, { status: 401 });
    }

    // get user details
    const user = session.user;
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find user using user.email
    const existingUser = await prisma.user.findFirst({
        where: {
            email: user.email,
        },
    });
    if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // find account Id from account number
    const account = await prisma.account.findFirst({
        where: {
            accountNumber,
        },
    });

    if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // get all bets
    const bets = await prisma.bets.findMany({
        where: {
            userId: existingUser.id,
            accountId: account.id,
        },
    });

    if (!bets) {
        return NextResponse.json({ error: "No bets found" }, { status: 404 });
    }
    
    // group bets by sportKey
    const groupedBets = bets.reduce((acc: any, bet: any) => {
        if (!acc[bet.sportKey]) {
            acc[bet.sportKey] = [];
        }
        acc[bet.sportKey].push(bet);
        return acc;
    }, {});

    // for group bets call the api to get the result
    const results = await Promise.all(
        Object.keys(groupedBets).map(async (sportKey) => {
            const response = await fetch(
                `https://api.the-odds-api.com/v4/sports/${sportKey}/scores/?apiKey=${process.env.NEXT_PUBLIC_PICKS_API_KEY}&daysFrom=3&eventIds=${groupedBets[sportKey].map((bet: any) => bet.eventId).join(",")}`
            );
            return response.json();
        })
    );

    // get all completed games where completed:true to a seperate array
    const completedGames: any[] = [];
    results.forEach((result: any) => {
        result.forEach((game: any) => {
            if (game.completed) {
                completedGames.push(game);
            }
        });
    });

    // updated the bets with the completed games
    bets.forEach(async (bet) => {
        const game = completedGames.find((game) => game.id === bet.eventId);
        if (game) {

            // see if team is home or away
            let isHomeTeam = false;
            if(bet.team === game.home_team) {
                isHomeTeam = true;
            } else if(bet.team === game.away_team) {
                isHomeTeam = false;
            }

            // check if chosen team won
            let betResult: "LOSE" | "WIN" | "DRAW" = "LOSE";
            if(isHomeTeam && Number(game.scores[0].score) > Number(game.scores[1].score)) {
                betResult = "WIN";
            } else if(!isHomeTeam && Number(game.scores[0].score) < Number(game.scores[1].score)) {
                betResult = "WIN";
            } else {
                betResult = "LOSE";
            }

            // mark bet as closed
            const betStatus = "CLOSED";

            // check if bet.betResult is null already in db or not
            if(bet.betResult !== betResult) {
                // update account balance
                if(betResult === "WIN") {
                    await prisma.account.update({
                        where: {
                            id: account.id,
                        },
                        data: {
                            balance: {
                                increment: bet.pick + bet.winnings,
                            },
                        },
                    });
                }
            }
            
            // update the bet in the database
            await prisma.bets.update({
                where: { id: bet.id },
                data: {
                    betResult,
                    betStatus,
                },
            });
        }
    });

    // return updated bets
    return NextResponse.json(bets);
}