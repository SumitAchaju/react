import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

const KEY = "room";

export default function useRoomQuery(roomId: string | undefined) {
  const api = useAxios();

  const query = useQuery({
    queryKey: [KEY, roomId],
    queryFn: async ({ queryKey }) => {
      const [_, roomId] = queryKey;
      const res = await api.get(`/message/room/${roomId}`);
      return res.data;
    },
  });

  return query;
}
