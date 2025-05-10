import { useQuery } from "@tanstack/react-query";
import { getAccountInvoices } from "../mutations/get-account-invoices";

export const useGetAccountInvoices = () => {
  return useQuery({
    queryKey: ["accountInvoices"], // Unique key for caching
    queryFn: getAccountInvoices,
  });
};
