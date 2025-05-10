import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../mutations/create-account";

export const useCreateAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess,
    onError,
  });

  return {
    ...mutation,
  }
};
