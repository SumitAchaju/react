import { processMsgType } from "./processMsg";

export type newWebsocketMsgType = {
  room_id: string | undefined;
  sender_id: number | undefined;
  message_text: string;
};

export default function newWebsocketMsg({
  room_id,
  sender_id,
  message_text,
}: newWebsocketMsgType) {
  return {
    type: "new_msg",
    room_id: room_id,
    status: "sent",
    sender_id: sender_id,
    message_text: message_text,
    messages: null,
  };
}

export type statusChangeWebsocketMsgType = {
  room_id: string | undefined;
  sender_id: number | undefined;
  messages: processMsgType["message"];
  status: "sent" | "delivered" | "seen";
};

export function statusChangeWebsocketMsg({
  room_id,
  sender_id,
  messages,
  status,
}: statusChangeWebsocketMsgType) {
  return {
    type: "change_msg_status",
    room_id: room_id,
    status: status,
    sender_id: sender_id,
    message_text: null,
    messages: messages,
  };
}
