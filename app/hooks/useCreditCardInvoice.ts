import { useMutation } from "@tanstack/react-query";
import { createCreditCardInvoice } from "../mutations/create-credit-card-invoice";

export const useCreditCardInvoice = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: createCreditCardInvoice,
    onSuccess,
    onError,
  });
};