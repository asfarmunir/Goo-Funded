export const signAgreement = async (data: any) => {
  const response = await fetch("/api/agreements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        field: data.field,
        value: data.value
    }),
  });

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to sign agreement");
  }

  return await response.json();
};
