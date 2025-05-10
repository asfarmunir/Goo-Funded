'use server'

export const getGames = async() => {
    try {
    //   const res = await fetch(`https://api.aiodds.com/v1/sport/list?user=${process.env.SPORTS_API_USER}&secret=${process.env.SPORTS_API_SECRET}`);

      const newGames = await fetch('https://stm-api.lsports.eu/Sports/Get',
      {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          "packageId": process.env.SPORTS_API_PACKAGEID,
          "userName": process.env.SPORTS_API_USERNAME,
          "password": process.env.SPORTS_API_PASSWORD,
          })
      })

      const data = await newGames.json();
      return JSON.parse(JSON.stringify({ data, status:200}))
    } catch (error) {
        console.log("🚀 ~ getGames ~ error", error)        
        return JSON.parse(JSON.stringify({ error, status:500}))
    }

}