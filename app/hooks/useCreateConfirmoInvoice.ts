import { useMutation } from "@tanstack/react-query";
import { createConfirmoInvoice } from "../mutations/create-confirmo-invoice";


export const useCreateConfirmoInvoice = ({
    onSuccess,
    onError,
}: {
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
}) => {

    return useMutation({
        mutationFn: createConfirmoInvoice,
        onSuccess,
        onError,
    })

}