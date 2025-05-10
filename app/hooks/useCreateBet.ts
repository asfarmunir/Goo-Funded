import { useMutation } from "@tanstack/react-query";
import { createBet } from "../mutations/create-bet";

export const useCreateBet = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  const mutation = useMutation({
    mutationFn: createBet,
    onSuccess,
    onError,
  });
  return { ...mutation };
};
