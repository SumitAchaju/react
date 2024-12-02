import { FormEvent } from "react";
import newWebsocketMsg from "../utils/websocketMsg";
import { userType } from "../types/fetchTypes";
import { excludeFriendsFromUser } from "../utils/extractData";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export default function sendMsg(
  e: FormEvent<HTMLFormElement>,
  sendJsonMessage: SendJsonMessage,
  roomId: string | undefined,
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
  sendJsonMessage(
    newWebsocketMsg({
      room_id: roomId,
      message_text: msgValue,
      sender_user: excludeFriendsFromUser(senderUser),
    })
  );
  msg.value = "";
  msg.focus();
}
