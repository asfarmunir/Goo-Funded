export const getAccountStats = async ({ accountId }:{ accountId: string }) => {
    const response = await fetch(`/api/account/${accountId}/stats`);
    if (!response.ok) {
        throw new Error("Failed to fetch account stats");
    }
    return response.json();
}