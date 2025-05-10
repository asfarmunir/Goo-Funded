import { useMutation } from "@tanstack/react-query";
import { signAgreement } from "../mutations/sign-agreement";

export const useSignAgreement = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: signAgreement,
    onSuccess,
    onError,
  });
};
