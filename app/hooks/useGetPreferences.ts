import { useMutation } from "@tanstack/react-query";
import { getPreferences } from "../mutations/get-preferences";

export const useGetPreferences = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: getPreferences,
    onSuccess,
    onError,
  });
};
