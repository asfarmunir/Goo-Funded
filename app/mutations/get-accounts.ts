export const getAccounts = async () => {
  const response = await fetch("/api/accounts");
  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return response.json();
};
