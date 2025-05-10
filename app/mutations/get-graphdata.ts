export const getGraphData = async (accountId: string) => {
  const response = await fetch(`/api/account/${accountId}/graph-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.text();
    throw new Error(error);
  }
};
