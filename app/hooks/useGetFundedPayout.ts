import { useQuery } from "@tanstack/react-query"
import { getFundedPayout } from "../mutations/get-funded-payout"

export const useGetFundedPayout = (accountId: string) => {
    return useQuery({
        queryKey: ["funded-payout"],
        queryFn: () => getFundedPayout(accountId),
    })
}