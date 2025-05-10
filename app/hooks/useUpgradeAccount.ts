import { useQuery } from "@tanstack/react-query"
import { upgradeAccount } from "../mutations/upgrade-account"

export const useUpgradeAccount = () => {
    return useQuery({
        queryKey: ['upgradeAccount'],
        queryFn: upgradeAccount,
    })
}