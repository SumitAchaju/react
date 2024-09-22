import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

export default function useBlockUserMutation() {
  const api = useAxios();
  const queryClient = useQueryClient();
  const blockUser = useMutation({
    mutationKey: ["blockUser"],
    mutationFn: async (userId: number) => {
      const res = await api.get(`/account/block/${userId}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  return blockUser;
}

export function useUnBlockUserMutation() {
  const api = useAxios();
  const queryClient = useQueryClient();
  const unBlockUser = useMutation({
    mutationKey: ["unBlockUser"],
    mutationFn: async (userId: number) => {
      const res = await api.get(`/account/unblock/${userId}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  return unBlockUser;
}
