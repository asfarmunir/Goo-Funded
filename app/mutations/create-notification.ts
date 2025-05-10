export const createNotification = async (data: any, p0: string, id: any) => {
    const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if(!response.ok) {
        console.log(await response.text());
        throw new Error("Failed to create notification");
    }

    return await response.json();
}