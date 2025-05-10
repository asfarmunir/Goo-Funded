import { useMutation } from "@tanstack/react-query";
import { postReferPayout } from "../mutations/post-refer-payout";

export const usePostReferPayout = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: postReferPayout,
    onSuccess,
    onError,
  });
};
