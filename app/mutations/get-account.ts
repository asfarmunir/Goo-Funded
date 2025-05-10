export const getAccount = async (acountId: string) => {
    const res = await fetch(`/api/account/${acountId}`);
    if(res.ok) {
        return res.json();
    }
    throw new Error(res.statusText);
}