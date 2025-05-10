import { useQuery } from "@tanstack/react-query"
import { getLeaderboard } from "../mutations/get-leaderboard"

export const useGetLeaderboard = () => {
    return (
        useQuery({
            queryKey: ['leaderboard'],
            queryFn: getLeaderboard,
        })
    )
}