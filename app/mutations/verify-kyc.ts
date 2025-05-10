export const verifyKYC = async () => {
  const response = await fetch("/api/auth/verify-kyc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to verify KYC");
  }
  return response.json();
};
