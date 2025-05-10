import { useMutation } from "@tanstack/react-query"
import { sendCeriticicate } from "../mutations/send-certificate"

export const useSendCertificate = ({
    onSuccess,
    onError,
}: {
    onSuccess: () => void
    onError: (error: Error) => void
}) => {
    return useMutation({
        mutationFn: sendCeriticicate,
        onSuccess,
        onError,
    })
}