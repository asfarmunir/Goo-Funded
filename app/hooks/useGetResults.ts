import { useQuery } from "@tanstack/react-query";
import { getResults } from "../mutations/get-results";

export const useGetResults = (accountNumber: string) => {
  return useQuery({
    queryKey: ["results"],
    queryFn: () => getResults(accountNumber),
    refetchInterval: 10 * 60 * 1000, // refresh every 10 minutes
  });
};
