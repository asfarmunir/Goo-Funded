// import { getAccount }

import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../mutations/get-account";

export const useGetAccount = (accountId: string) => {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(accountId),
  });
};
