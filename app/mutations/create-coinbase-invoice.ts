
export const createCoinbaseInvoice = async (data: any) => {
    const response = await fetch("/api/invoice/create", {
        method: "POST",
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error("Failed to create invoice");
    }
    return response.json();
}