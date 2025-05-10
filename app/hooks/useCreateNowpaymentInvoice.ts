import { useMutation } from "@tanstack/react-query";
import { createNowpaymentsInvoice } from "../mutations/create-nowpayment-invoice";



export const useCreateNowpaymentInvoice = () => {
  return useMutation({
    mutationFn: createNowpaymentsInvoice,
  });
};