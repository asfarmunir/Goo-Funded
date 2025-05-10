import { useQuery } from "@tanstack/react-query";
import { getAccountStats } from "../mutations/get-account-stats";

export const useGetAccountStats = ({ accountId } : {accountId: string} ) => {
    return useQuery({
        queryKey: ["account-stats"],
        queryFn: () => getAccountStats({ accountId }),
    });
}