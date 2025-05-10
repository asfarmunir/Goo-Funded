import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../mutations/get-accounts";

export const useGetAccounts = () => {
  return useQuery({
    queryKey: ["get-accounts"],
    queryFn: getAccounts,
  });
};
