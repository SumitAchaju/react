import { useContext } from "react";
import notify, { notifyMsg } from "../components/toast/MsgToast";
import AuthContext from "../context/Auth";
import { useChatHistoryQueryMutation } from "../queryHooks/useChatHistoryQuery";
import { useMsgQueryMutation } from "../queryHooks/useMsgQuery";
import { useNotificationMutation } from "../queryHooks/useNotificationQuery";
import {
  websocketMsgType,
  websocketNotificationType,
} from "../types/fetchTypes";
import { statusChangeWebsocketMsg } from "../utils/websocketMsg";
import { excludeFriendsFromUser } from "../utils/extractData";

export default function useOnMessage(type: "main" | "room") {
  const { updateHistoryData, updateHistoryDataStatus } =
    useChatHistoryQueryMutation();
  const { updateMsg, updateMsgStatus } = useMsgQueryMutation();
  const { notificationUpdate } = useNotificationMutation();
  const context = useContext(AuthContext);

  const onMessage = (msg: websocketMsgType, socket: WebSocket) => {
    console.log(msg);
    if (msg.msg_type === "new_msg") {
      const msgData = msg.msg[0];
      updateHistoryData(msgData);
      updateMsg(msgData);

      if (context?.user?.id !== msg.sender_user?.id) {
        notifyMsg(msgData.message_text, msg.sender_user);
      }

      if (type === "main") {
        socket.send(
          JSON.stringify({
            ...statusChangeWebsocketMsg({
              room_id: msgData.room_id,
              sender_id: msgData.sender_id,
              messages: [msgData],
              status: "delivered",
              sender_user: excludeFriendsFromUser(context?.user),
            }),
            reciever_id: msgData.sender_id,
          })
        );
      }
    } else if (msg.msg_type === "change_msg_status") {
      updateHistoryDataStatus(msg.msg);
      updateMsgStatus(msg.msg);
    }
  };

  const onNotification = (notification: websocketNotificationType) => {
    notificationUpdate(notification.msg);
    notify(
      "info",
      `${notification.sender_user?.first_name} ${notification.sender_user?.last_name} has send you a friend request`
    );
  };
  return { onMessage, onNotification };
}
