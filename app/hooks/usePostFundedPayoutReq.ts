import { useMutation } from "@tanstack/react-query";
import { postFundedPayout } from "../mutations/post-funded-payout";

export const usePostFundedPayoutReq = ({
    onSuccess,
    onError,
}: {
    onSuccess: () => void;
    onError: (error: any) => void;
}) => {
    return useMutation({
        mutationFn: postFundedPayout,
        onSuccess,
        onError,
    })
}