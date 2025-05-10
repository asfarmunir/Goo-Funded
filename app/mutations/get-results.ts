export const getResults = async (accountNumber: string) => {
  const response = await fetch(`/api/bet/results/${accountNumber}`);
  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error(responseJson.error || "Failed to fetch results");
  }
  return response.json();
};