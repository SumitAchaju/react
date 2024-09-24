import { FormEvent } from "react";
import newWebsocketMsg from "../utils/websocketMsg";
import { userType } from "../types/fetchTypes";

export default function sendMsg(
  e: FormEvent<HTMLFormElement>,
  roomSocket: WebSocket,
  roomId: string | undefined,
  senderId: number | undefined,
  senderUser: userType | undefined
) {
  e.preventDefault();
  const msg = e.currentTarget.messageBox;
  const msgValue = msg.value.trim();
  if (msgValue.length === 0) {
    msg.value = "";
    msg.focus();
    return;
  }
  roomSocket.send(
    JSON.stringify(
      newWebsocketMsg({
        room_id: roomId,
        sender_id: senderId,
        message_text: msgValue,
        sender_user: senderUser,
      })
    )
  );
  msg.value = "";
  msg.focus();
}
