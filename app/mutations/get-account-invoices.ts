export const getAccountInvoices = async () => {
  const response = await fetch("/api/accounts/invoices");
  if (!response.ok) {
    throw new Error("Failed to fetch account invoices");
  }
  return response.json();
};
