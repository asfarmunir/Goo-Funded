import { useMutation } from "@tanstack/react-query";
import { createCoinbaseInvoice } from "../mutations/create-coinbase-invoice";


// export const useCreateCoinbaseInvoice = ({
//     onSuccess,
//     onError,
// }: {
//     onSuccess: (data: any) => void;
//     onError: (error: Error) => void;
// }) => {

//     return useMutation({
//         mutationFn: createCoinbaseInvoice,
//         onSuccess,
//         onError,
//     })

// }

export const useCreateCoinbaseInvoice = () => {
  return useMutation({
    mutationFn: createCoinbaseInvoice,
  });
};