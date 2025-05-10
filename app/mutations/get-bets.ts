export const getBets = async (accountNumber?: string) => {

  const fetchUrl = accountNumber ? `/api/bets/${accountNumber}` : "/api/bets";
  const response = await fetch(fetchUrl);

  if (!response.ok) {
    const responseJson = await response.json();
    throw new Error( responseJson.error || "Failed to fetch bets");
  }

  return response.json();
};