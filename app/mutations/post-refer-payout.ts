import { ReferPayoutRequests } from "@prisma/client";

export const postReferPayout = async (data: any) => {
  const response = await fetch("/api/refer-payout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(JSON.parse(error).error || "Failed to post refer payout");
  }
  return response.json();
};
