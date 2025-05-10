import { useQuery } from "@tanstack/react-query";
import { getUser } from "../mutations/get-user";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"], // Unique key for caching
    queryFn: getUser,
  });
};
