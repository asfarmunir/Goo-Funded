import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../mutations/get-notifcations";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};
