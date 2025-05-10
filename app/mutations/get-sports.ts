export const getSports = async () => {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${process.env.NEXT_PUBLIC_PICKS_API_KEY}`);
    if (!response.ok) {
        throw new Error("Failed to fetch sports");  
    }
    return response.json();
}