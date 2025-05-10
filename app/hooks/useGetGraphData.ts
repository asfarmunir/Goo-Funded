import { useQuery } from "@tanstack/react-query"
import { getGraphData } from "../mutations/get-graphdata"

export const useGetGraphData = (accountId: string) => {
    return useQuery({
        queryKey: ["graphData", accountId],
        queryFn: () => getGraphData(accountId),
    })
}