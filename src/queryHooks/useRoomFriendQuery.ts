import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { userType } from "../types/fetchTypes";

const KEY = "roomFriends";

export default function useRoomFriendQuery(roomId: string | undefined) {
  const api = useAxios();
  const { data, isLoading, isError, isSuccess, error } = useQuery<userType>({
    queryKey: [KEY, roomId],
    queryFn: async () => {
      const fetch = await api.get(`/message/friend/${roomId}`);
      return fetch.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000, // Cache unused data for 30 minutes
  });
  return { data, isLoading, isError, isSuccess, error };
}
