import Button from "../Button";
import ProfilePic from "../ProfilePic";
import MyModal from "./MyModal";
import { NotificationIcon, TickIcon, TrashIcon } from "../Icons";
import { useEffect, useMemo, useState } from "react";
import useNotificationQuery, {
  useNotificationMutation,
} from "../../queryHooks/useNotificationQuery";
import { formatedDate } from "../../utils/processDate";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Spinner from "../Spinner";
import { useInView } from "react-intersection-observer";
import { AxiosError } from "../../hooks/useAxios";
import notify, { notifyPromise } from "../toast/MsgToast";
import { notificationType } from "../../types/fetchTypes";
import { KEY as NotificationKEY } from "../../queryHooks/useNotificationQuery";

type Props = {};

const acceptMutationKey = "Accept Mutation notification";

export default function Notification({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const notificationQuery = useNotificationQuery();

  console.log(notificationQuery.data);

  const { inView, ref } = useInView();

  const unReadMsg = useMemo(() => {
    return notificationQuery.data?.pages
      .flat()
      .filter((notification) => !notification.is_read).length;
  }, [notificationQuery.data]);

  const {
    notificationStatusChange,
    notificationMarkAllRead,
    notificationDeleteAll,
    notificationDelete,
  } = useNotificationMutation();

  const api = useAxios();
  const queryClient = useQueryClient();

  const handleAccept = useMutation({
    mutationKey: [acceptMutationKey],
    mutationFn: async ({ id }: { id: number; notiId: number }) => {
      const res = await api.get(`/account/add/${id}`);
      return res.data;
    },
    onSuccess: async (_, varibles) => {
      notificationStatusChange.mutate({
        id: varibles.notiId,
        data: { is_read: true },
      });
      await queryClient.cancelQueries({ queryKey: [NotificationKEY] });
      queryClient.setQueryData(
        [NotificationKEY],
        (old: InfiniteData<notificationType[], number>) => ({
          pages: old?.pages.map((page) =>
            page.map((notification) => ({
              ...notification,
              extra_data: {
                ...notification.extra_data,
                is_active: false,
                is_accepted: true,
              },
            }))
          ),
          pageParams: old?.pageParams,
        })
      );
    },
    onError: (error: AxiosError) => {
      console.log(error.response?.data.detail);
    },
  });

  useEffect(() => {
    if (inView && notificationQuery.hasNextPage) {
      notificationQuery.fetchNextPage();
    }
  }, [inView]);

  return (
    <MyModal
      trigger={
        <>
          <NotificationIcon />
          {(unReadMsg ?? 0) > 0 && (
            <div className="absolute -top-2 -right-1 bg-red-color rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
              {(unReadMsg ?? 0) > 9 ? "9+" : unReadMsg}
            </div>
          )}
        </>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modal={
        <div className="py-[50px] flex flex-col gap-[40px] h-full">
          <div className="flex items-center justify-between px-[50px]">
            <h2 className="text-primary-text text-[28px] font-medium">
              Notification
            </h2>

            <div className="flex items-center gap-5">
              <Button
                varient="primary"
                text="Mark all as read"
                onClick={
                  (notificationQuery.data?.pages[0].length ?? 0) > 0 &&
                  (unReadMsg ?? 0) > 0
                    ? () =>
                        notifyPromise({
                          promise: notificationMarkAllRead.mutateAsync(),
                          msg: "All marked as read",
                          loading: "Marking all as read",
                        })
                    : () => notify("info", "All Notification are already read")
                }
              />
              <Button
                varient="primary"
                text="Delete All"
                onClick={
                  (notificationQuery.data?.pages[0].length ?? 0) > 0
                    ? () =>
                        notifyPromise({
                          promise: notificationDeleteAll.mutateAsync(),
                          msg: "Sucessfully deleted",
                          loading: "Deleting...",
                        })
                    : () => notify("info", "No notifications to delete")
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 overflow-y-auto my-scroll grow px-[50px] mt-1">
            {notificationQuery.isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Spinner />
              </div>
            ) : notificationQuery.isError ? (
              <p className="text-red-color text-center">
                Error: {notificationQuery.error.message}
              </p>
            ) : notificationQuery.data?.pages.flat().length === 0 ? (
              <p className="text-center text-xl  font-medium text-secondary-text">
                No notifications found
              </p>
            ) : null}
            {notificationQuery.data?.pages.flat().map((notification, index) => (
              <NotificationItem
                {...notification}
                onClick={() => {
                  notifyPromise({
                    promise: handleAccept.mutateAsync({
                      id: notification?.sender_id || 0,
                      notiId: notification.id,
                    }),
                    msg: "Request accepted",
                    loading: "Accepting request",
                  });
                }}
                key={notification.id}
                inViewRef={
                  index === notificationQuery.data?.pages.flat().length - 1
                    ? ref
                    : undefined
                }
                isMutating={handleAccept.isPending}
                notificationStatusChange={notificationStatusChange}
                notificationDelete={notificationDelete}
              />
            ))}
            {/* This is the loading spinner */}
            {notificationQuery.isFetchingNextPage ? (
              <div className="flex justify-center py-5">
                <Spinner />
              </div>
            ) : null}
          </div>
        </div>
      }
    />
  );
}

type NotificationItemProps = notificationType & {
  onClick: () => void;
  inViewRef: ((node?: Element | null) => void) | undefined;
  isMutating: boolean;
  notificationStatusChange: ReturnType<
    typeof useNotificationMutation
  >["notificationStatusChange"];
  notificationDelete: ReturnType<
    typeof useNotificationMutation
  >["notificationDelete"];
};

function NotificationItem({
  onClick,
  inViewRef,
  isMutating,
  notificationStatusChange,
  notificationDelete,
  ...props
}: NotificationItemProps) {
  return (
    <div ref={inViewRef} className="flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <ProfilePic size={60} image={props.sender_user?.profile} />
        <div className="flex flex-col gap-1">
          <p className="text-primary-text font-medium">{props.message}</p>
          <div className="flex items-center gap-5">
            <span className="block text-secondary-text text-[14px]">
              {formatedDate(props.created_at)}
            </span>
            {props.is_read ? (
              <TickIcon color="var(--active_green_color)" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <Button
          varient="secondary"
          text={
            props.notification_type === "friend_request"
              ? props.extra_data.is_active
                ? "Accept"
                : props.extra_data.is_canceled
                ? "Canceled"
                : props.extra_data.is_rejected
                ? "Rejected"
                : "Accepted"
              : "Mark Read"
          }
          onClick={
            props.notification_type === "friend_request" &&
            !isMutating &&
            props.extra_data.is_active
              ? onClick
              : props.is_read
              ? () => notify("info", "Notification already read")
              : () =>
                  notifyPromise({
                    promise: notificationStatusChange.mutateAsync({
                      id: props.id,
                      data: { is_read: true },
                    }),
                    msg: "Notification marked as read",
                    loading: "Reading...",
                  })
          }
        />
        <Button
          varient="primary"
          Icon={TrashIcon}
          hover={false}
          className="!p-2"
          onClick={() =>
            notifyPromise({
              promise: notificationDelete.mutateAsync(props.id),
              msg: "Notification deleted",
              loading: "Deleting...",
            })
          }
        />
      </div>
    </div>
  );
}
