import Button from "../Button";
import ProfilePic from "../ProfilePic";
import MyModal from "./MyModal";
import { NotificationIcon, TickIcon } from "../Icons";
import { useEffect, useMemo, useState } from "react";
import useNotificationQuery, {
  notificationType,
  useNotificationMutation,
} from "../../queryHooks/useNotificationQuery";
import { formatedDate } from "../../utils/processDate";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Spinner from "../Spinner";
import { useInView } from "react-intersection-observer";
import { AxiosError } from "../../hooks/useAxios";
import notify, { notifyPromise } from "../toast/MsgToast";

type Props = {};

export default function Notification({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const notificationQuery = useNotificationQuery();

  const { inView, ref } = useInView();

  const unReadMsg = useMemo(() => {
    return notificationQuery.data?.pages
      .flat()
      .filter((notification) => !notification.read).length;
  }, [notificationQuery.data]);

  const {
    notificationStatusChange,
    notificationMarkAllRead,
    notificationDeleteAll,
  } = useNotificationMutation();

  const api = useAxios();

  const handleAccept = useMutation({
    mutationKey: ["Accept Mutation notification"],
    mutationFn: async ({ id }: { id: number; notiId: number }) => {
      const res = await api.get(`/account/add/${id}`);
      return res.data;
    },
    onSuccess: (_, varibles) => {
      notificationStatusChange.mutate({
        id: varibles.notiId,
        data: { is_active: false, read: true },
      });
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
                      id: notification?.user.id || 0,
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
};

function NotificationItem({
  onClick,
  inViewRef,
  isMutating,
  ...props
}: NotificationItemProps) {
  return (
    <div ref={inViewRef} className="flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <ProfilePic size={60} image={props.user.profile} />
        <div className="flex flex-col gap-1">
          <p className="text-primary-text font-medium">{props.message}</p>
          <div className="flex items-center gap-5">
            <span className="block text-secondary-text text-[14px]">
              {formatedDate(props.created_at)}
            </span>
            {props.read ? <TickIcon color="var(--active_green_color)" /> : null}
          </div>
        </div>
      </div>
      <Button
        varient="secondary"
        text={
          props.is_canceled
            ? "Canceled"
            : props.is_active
            ? "Accept"
            : "Accepted"
        }
        onClick={
          props.is_canceled
            ? () => notify("error", "Request is canceled")
            : props.is_active && !isMutating
            ? onClick
            : () => {}
        }
      />
    </div>
  );
}
