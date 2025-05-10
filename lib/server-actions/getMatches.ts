'use server'

export const getMatches = async(
    sportId: number,
    tournamentId: number,
    matchStatus: number
) => {
    try {
        // Get the current time and date in Unix timestamp format
        const currentUnixTime = Math.floor(new Date().getTime() / 1000);

        const res = await fetch(`https://stm-snapshot.lsports.eu/PreMatch/GetEvents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json-patch+json',
            },
            body: JSON.stringify({
                "packageId": 2443,
                "userName": "sandro@proppicks.com",
                "password": "Ud354687!",
                "sports": [sportId],
                "leagues": [tournamentId],
                "FromDate": currentUnixTime, // Passing the Unix timestamp here
            })
        });

        const data = await res.json();
        return JSON.parse(JSON.stringify({ data, status: 200 }));
    } catch (error) {
        console.log("🚀 ~ getGames ~ error", error);
        return JSON.parse(JSON.stringify({ error, status: 500 }));
    }
}
