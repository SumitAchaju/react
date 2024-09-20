import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";

const KEY = ["onlineUsers"];

export default function useOnlineUserQuery() {
  const api = useAxios();
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const fetch = await api.get("/message/onlineuser");
      return fetch.data;
    },
  });

  return { data, isSuccess, isLoading, isError, error };
}
