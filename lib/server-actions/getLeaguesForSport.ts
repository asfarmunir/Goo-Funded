'use server'

export const getLeagues = async(sportsId:number) => {
    try {
       const res = await fetch(`https://stm-api.lsports.eu/Leagues/Get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify({
          "packageId": process.env.SPORTS_API_PACKAGEID,
          "userName": process.env.SPORTS_API_USERNAME,
          "password": process.env.SPORTS_API_PASSWORD,
        "sportIds": [sportsId], 
      })
    });
       const data = await res.json();
      return JSON.parse(JSON.stringify({ data, status:200}))
    } catch (error) {
        console.log("🚀 ~ getGames ~ error", error)     
        return JSON.parse(JSON.stringify({ error, status:500})) 
    }

}