export const createCreditCardInvoice = async (data: any) => {
  const response = await fetch("/api/person-to-person", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Failed to create credit card invoice");
  }

  return response.json();
};