export const getLeaderboard = async () => {
    const response = await fetch("/api/leaderboard");
    if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
    }
    return response.json();
}