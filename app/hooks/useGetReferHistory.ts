import { useQuery } from "@tanstack/react-query"
import { getReferHistory } from "../mutations/get-refer-history"

export const useGetReferHistory = () => {
    return useQuery({
        queryKey: ["refer_history"],
        queryFn: getReferHistory,
    })
}