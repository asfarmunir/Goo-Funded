
export const createNowpaymentsInvoice = async (data: any) => {
    const response = await fetch("/api/invoice/nowpayment", {
        method: "POST",
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error("Failed to create invoice");
    }
    return response.json();
}