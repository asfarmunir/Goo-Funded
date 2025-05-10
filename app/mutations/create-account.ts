export const createAccount = async (data: any) => {
  const response = await fetch("/api/accounts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create account");
  }

  return response.json(); // Return the new account data
};
