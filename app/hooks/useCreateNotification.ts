import { useMutation } from "@tanstack/react-query"
import { createNotification } from "../mutations/create-notification"

export const useCreateNotification = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
}) => {
    return useMutation({
        mutationFn: createNotification,
        onSuccess,
        onError,
    })
}