export const upgradeAccount = async () => {
    const response = await fetch("/api/objectives");
    if(!response.ok) {
        throw new Error("Failed to upgrade account");
    }
    return response.json();
}