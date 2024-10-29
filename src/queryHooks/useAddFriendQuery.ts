import {useInfiniteQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import {userType} from "../types/fetchTypes";

const KEY = "addFriend";
const LIMIT = 10;

export type searchFriendTypes = Omit<
  userType,
  "password" | "superuser_pass"
> & {
  friend_status: "none" | "friend" | "requested" | "blocked" | "requested_by";
};

export default function useAddFriendQuery(type: string, search: string) {
  const api = useAxios();

  return useInfiniteQuery({
    queryKey: [KEY, type, search],
    queryFn: async ({queryKey, pageParam}): Promise<searchFriendTypes[]> => {
      const [_, type, search] = queryKey;
      const fetch = await api.get(
          `/account/search?search_type=${type}&search=${search}&limit=${LIMIT}&offset=${pageParam}`
      );
      return fetch.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < 10) return undefined;
      return lastPageParam + LIMIT;
    },
    staleTime: 60 * 1000,
    retry: 0,
  });
}

export function useAddFriendMutation() {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [KEY, "mutation"],
    mutationFn: async ({id, type}: { id: number; type: string }) => {
      switch (type) {
        case "Unfriend":
          await api.get(`/account/unfriend/${id}`);
          break;
        case "Accept Request":
          await api.get(`/account/add/${id}`);
          break;
        case "Request":
          await api.get(`account/request/${id}`);
          break;
        case "Unblock":
          await api.get(`/account/unblock/${id}`);
          break;
        case "Cancel Request":
          await api.get(`/account/cancel/${id}`);
          break;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [KEY]});
      queryClient.invalidateQueries({queryKey: ["getUser"]});
    },
  });
}
