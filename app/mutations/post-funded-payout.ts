interface FundedPayout {
    currency: "USDT_ERC20" | "ETH_ERC20";
    networkAddress: string;
    accountId: string;
}

export const postFundedPayout = async (data: FundedPayout) => {
    const response = await fetch("/api/funded-payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(JSON.parse(error).error || "Failed to post funded payout request.");
      }
      return response.json();
}