import { useQuery } from "@tanstack/react-query";
import { getSports } from "../mutations/get-sports";

export const useGetSports = () => {
  return useQuery({
    queryKey: ["sports"], // Unique key for caching
    queryFn: getSports, // Function that returns the data
  });
};
