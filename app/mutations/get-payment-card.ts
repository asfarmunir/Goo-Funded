export const getPaymentCard = async () => {
  const response = await fetch("/api/card");
  if (!response.ok) {
    throw new Error("Failed to fetch payment card");
  }
  return response.json();
};