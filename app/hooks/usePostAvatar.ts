import { useMutation } from "@tanstack/react-query"
import { postAvatar } from "../mutations/post-avatar"

export const usePostAvatar = ({
    onSuccess,
    onError,
}:{
    onSuccess: (data: any) => void,
    onError: (error: any) => void,
}) => {
    return useMutation({
        mutationFn: postAvatar,
        mutationKey: ['postAvatar'],
        onSuccess,
        onError,
    })
}