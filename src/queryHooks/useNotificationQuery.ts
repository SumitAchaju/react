import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { notificationType } from "../types/fetchTypes";

export const KEY = "notification";
const LIMIT = 10;

export default function useNotificationQuery() {
  const api = useAxios();
  return useInfiniteQuery({
    queryKey: [KEY],
    queryFn: async ({ pageParam }): Promise<notificationType[]> => {
      const res = await api.get(
        `notification/?limit=${LIMIT}&offset=${pageParam}`
      );
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length < LIMIT) return undefined;
      return lastPageParam + LIMIT;
    },
  });
}

type notificationMutationType = {
  id: number;
  data: { is_read?: boolean };
};

export function useNotificationMutation() {
  const queryClient = useQueryClient();
  const api = useAxios();

  const notificationStatusChange = useMutation({
    mutationKey: [KEY, "mutation"],

    mutationFn: async ({ id, data }: notificationMutationType) => {
      const res = await api.patch(`/notification/${id}`, data);
      return res.data;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [KEY] });
      const previousValue = queryClient.getQueryData([KEY]);
      queryClient.setQueryData(
        [KEY],
        (old: InfiniteData<notificationType[], unknown>) => ({
          pages: old?.pages.map((page) =>
            page.map((notification) =>
              notification.id === id
                ? {
                    ...notification,
                    is_read:
                      data.is_read !== undefined
                        ? data.is_read
                        : notification.is_read,
                  }
                : notification
            )
          ),
          pageParams: old?.pageParams,
        })
      );
      return { previousValue, id, data };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });

  const notificationMarkAllRead = useMutation({
    mutationKey: [KEY, "markAllRead"],

    mutationFn: async () => {
      const res = await api.patch("/notification/mark/read/all");
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [KEY] });
      queryClient.setQueryData(
        [KEY],
        (old: InfiniteData<notificationType[], number>) => ({
          pages: old?.pages.map((page) =>
            page.map((notification) => ({ ...notification, is_read: true }))
          ),
          pageParams: old?.pageParams,
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });
  const notificationDelete = useMutation({
    mutationKey: [KEY, "delete"],

    mutationFn: async (id: number) => {
      const res = await api.delete(`/notification/delete/${id}`);
      return res.data;
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [KEY] });
      queryClient.setQueryData(
        [KEY],
        (old: InfiniteData<notificationType[], number>) => ({
          pages: old?.pages.map((page) =>
            page.filter((notification) => notification.id !== id)
          ),
          pageParams: old.pageParams,
        })
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });

  const notificationDeleteAll = useMutation({
    mutationKey: [KEY, "deleteAll"],

    mutationFn: async () => {
      const res = await api.delete("/notification/all/delete");
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [KEY] });
    },
  });

  const notificationUpdate = (notification: notificationType) => {
    queryClient.setQueryData(
      [KEY],
      (old: InfiniteData<notificationType[], number>) => {
        const newData = old.pages.shift();
        newData?.unshift(notification);
        return {
          pages: [newData, ...old.pages],
          pageParams: old.pageParams,
        };
      }
    );

    queryClient.invalidateQueries({ queryKey: [KEY] });
  };

  return {
    notificationStatusChange,
    notificationDelete,
    notificationDeleteAll,
    notificationMarkAllRead,
    notificationUpdate,
  };
}
