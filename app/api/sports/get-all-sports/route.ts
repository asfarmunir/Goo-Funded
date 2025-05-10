import { getGames } from "@/lib/server-actions/getGames";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await getGames();

        if (response.status !== 200) {
            return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 });
        }

        // Filter the sports to only include the desired ones
        const desiredSports = ["Football", "Basketball", "Ice Hockey", "Baseball"];
        const filteredSports = response.data.Body.Sports.filter((sport:any) => 
            desiredSports.includes(sport.Name)
        );

        return NextResponse.json({ sports: filteredSports }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 });
    }
}
// import { getGames } from "@/lib/server-actions/getGames";
// import { NextResponse } from "next/server";

// export async function GET() {

//     try {
        
//         const response = await getGames();

//         if(response.status !== 200) {
//             return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 });
//         }
//         console.log('hehehehehe',response.data.Body.Sports)
//         return NextResponse.json({ sports: response.data.Body.Sports }, { status: 200 });


//     } catch (error) {

//         return NextResponse.json({ error: "Failed to fetch sports" }, { status: 500 });
        
//     }

// }