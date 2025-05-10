import { useMutation } from "@tanstack/react-query";
import { getKYC } from "../mutations/get-kyc";

export const useGetKyc = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: getKYC,
    onSuccess,
    onError,
  });
};
