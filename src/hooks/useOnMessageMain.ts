import { useContext } from "react";
import notify, { notifyMsg } from "../components/toast/MsgToast";
import AuthContext from "../context/Auth";
import { useChatHistoryQueryMutation } from "../queryHooks/useChatHistoryQuery";
import { useMsgQueryMutation } from "../queryHooks/useMsgQuery";
import { useNotificationMutation } from "../queryHooks/useNotificationQuery";
import { websocketResponseType, messageType } from "../types/fetchTypes";
import { statusChangeWebsocketMsg } from "../utils/websocketMsg";
import { excludeFriendsFromUser } from "../utils/extractData";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { notificationType } from "../types/fetchTypes";
import { useQueryClient } from "@tanstack/react-query";
import { KEY as addFriendQueryKey } from "../queryHooks/useAddFriendQuery";

export default function useOnMessageMain() {
  const { updateHistoryData, updateHistoryDataStatus } =
    useChatHistoryQueryMutation();
  const { updateMsg, updateMsgStatus } = useMsgQueryMutation();
  const { notificationUpdate } = useNotificationMutation();
  const context = useContext(AuthContext);
  const queryClient = useQueryClient();

  const onMessage = (
    msg: websocketResponseType,
    sendJsonMessage: SendJsonMessage
  ) => {
    console.log(msg);
    switch (msg.event_type) {
      case "new_message":
        const newMsgData = msg.data[0] as messageType;
        updateHistoryData(newMsgData);
        updateMsg(newMsgData);

        if (context?.user?.id !== msg.sender_user?.id) {
          notifyMsg(newMsgData.message_text, msg.sender_user);
        }

        sendJsonMessage(
          statusChangeWebsocketMsg({
            room_id: newMsgData.room_id,
            messages: [newMsgData],
            status: "delivered",
            sender_user: excludeFriendsFromUser(context?.user),
          })
        );
        break;
      case "change_message_status":
        const changeMsgData = msg.data as messageType[];
        updateHistoryDataStatus(changeMsgData);
        updateMsgStatus(changeMsgData);
        break;
      case "notification":
        const notificationData = msg.data as notificationType[];
        notificationUpdate({
          ...notificationData[0],
          sender_user: msg.sender_user,
        });
        notify("info", notificationData[0].message);
        queryClient.invalidateQueries({
          queryKey: [addFriendQueryKey],
        });
    }
  };

  return { onMessage };
}
