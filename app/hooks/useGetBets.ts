import { useQuery } from "@tanstack/react-query"
import { getBets } from "../mutations/get-bets"

export const useGetBets = (accountNumber?:string) => {
    const conditionalQueryFn = () => accountNumber ? getBets(accountNumber) : getBets()
    return useQuery({
        queryKey: ["userBets"],
        queryFn: conditionalQueryFn
    })
}