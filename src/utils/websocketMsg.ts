import { userType } from "../types/fetchTypes";
import { excludeFriendsFromUser } from "./extractData";
import { processMsgType } from "./processMsg";

export type newWebsocketMsgType = {
  room_id: string | undefined;
  message_text: string;
  sender_user: userType | undefined;
};

export default function newWebsocketMsg({
  room_id,
  message_text,
  sender_user,
}: newWebsocketMsgType) {
  return {
    event_type: "new_message",
    room_id: room_id,
    data: {
      message_text: message_text,
    },
    sender_user: sender_user,
  };
}

export type statusChangeWebsocketMsgType = {
  room_id: string | undefined;
  messages: processMsgType["message"];
  status: "sent" | "delivered" | "seen";
  sender_user: userType | undefined;
};

export function statusChangeWebsocketMsg({
  room_id,
  messages,
  status,
  sender_user,
}: statusChangeWebsocketMsgType) {
  return {
    event_type: "change_message_status",
    room_id: room_id,
    data: {
      message_id_list: messages.map((msg) => msg.id),
      status: status,
    },
    sender_user: excludeFriendsFromUser(sender_user),
  };
}
