import {InfiniteData, useInfiniteQuery, useMutation, useQueryClient,} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import {userType} from "../types/fetchTypes";

const KEY = "notification";
const LIMIT = 10;

export default function useNotificationQuery() {
  const api = useAxios();
  return useInfiniteQuery({
    queryKey: [KEY],
    queryFn: async ({pageParam}): Promise<notificationType[]> => {
      const res = await api.get(
          `notification?limit=${LIMIT}&offset=${pageParam}`
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
  data: { read?: boolean; is_active?: boolean };
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
                    read:
                      data.read !== undefined ? data.read : notification.read,
                    is_active:
                      data.is_active !== undefined
                        ? data.is_active
                        : notification.is_active,
                  }
                : notification
            )
          ),
          pageParams: old?.pageParams,
        })
      );
      return { previousValue, id, data };
    },
  });

  const notificationMarkAllRead = useMutation({
    mutationKey: [KEY, "markAllRead"],

    mutationFn: async () => {
      const res = await api.patch(`/notification/markallread`);
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [KEY] });
      queryClient.setQueryData(
        [KEY],
        (old: InfiniteData<notificationType[], number>) => ({
          pages: old?.pages.map((page) =>
            page.map((notification) => ({ ...notification, read: true }))
          ),
          pageParams: old?.pageParams,
        })
      );
    },
  });
  const notificationDelete = useMutation({
    mutationKey: [KEY, "delete"],

    mutationFn: async (id: number) => {
      const res = await api.delete(`/notification/${id}`);
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
          pageParams: old?.pageParams,
        })
      );
    },
  });

  const notificationDeleteAll = useMutation({
    mutationKey: [KEY, "deleteAll"],

    mutationFn: async () => {
      const res = await api.delete(`/notification/deleteall`);
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
          pageParams: old.pageParams.map((param, i, arr) =>
            i === arr.length - 1 ? param + 1 : param
          ),
        };
      }
    );
  };

  return {
    notificationStatusChange,
    notificationDelete,
    notificationDeleteAll,
    notificationMarkAllRead,
    notificationUpdate,
  };
}

export type notificationType = {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
  title: string;
  type: string;
  user: userType;
  is_active: boolean;
  request_id?: number;
  is_canceled?: boolean;
};
