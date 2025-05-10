import { useMutation } from "@tanstack/react-query"
import { markNotification } from "../mutations/mark-notification"

export const useMarkNotification = ({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: any) => void
    onError?: (error: any) => void
}) => {
    return useMutation({
        mutationFn: markNotification,
        onSuccess,
        onError,
    })
}