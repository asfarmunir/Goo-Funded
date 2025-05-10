export const getFundedPayout = async (accountId: string) => {
    const response = await fetch(`/api/funded-payout/${accountId}/history`);
    if (!response.ok) {
        const error = await response.text();
        throw new Error(JSON.parse(error).error || "Failed to get funded payout history");
    }
    return response.json();
}