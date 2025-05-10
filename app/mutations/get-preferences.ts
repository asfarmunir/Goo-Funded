export const getPreferences = async () => {
  const response = await fetch("/api/preferences");
  if (!response.ok) {
    throw new Error("Failed to fetch preferences");
  }
  return response.json();
};