export const getReferHistory = async () => {
  const response = await fetch("/api/refer-history");
  if (!response.ok) {
    throw new Error("Failed to fetch refer history");
  }
  return response.json();
};
