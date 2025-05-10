export const getKYC = async () => {
  const response = await fetch("/api/auth/verify-kyc");
  if (!response.ok) {
    throw new Error("Failed to verify KYC");
  }
  return response.json();
};