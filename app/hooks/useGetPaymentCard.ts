import { useQuery } from "@tanstack/react-query";
import { getPaymentCard } from "../mutations/get-payment-card";

export const useGetPaymentCard = () => {
  return useQuery({
    queryKey: ["paymentCard"], // Unique key for caching
    queryFn: getPaymentCard,
  });
};
