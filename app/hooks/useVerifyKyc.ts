import { useMutation } from "@tanstack/react-query";
import { verifyKYC } from "../mutations/verify-kyc";

export const useVerifyKyc = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: verifyKYC,
    onSuccess,
    onError,
  });
};
