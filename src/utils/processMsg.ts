import { messageType, msgStatusType, msgType } from "../types/fetchTypes";
import { checkTimeDiff } from "./processDate";

export type dateType = {
  year: number;
  month: string;
  day: number;
  hour: number;
  minute: number;
  second: number;
  hour12: string;
};

export type processInnerMsgType = {
  id: string;
  created_at: string;
  message_type: msgType;
  file_links: string[] | null;
  seen_by: number[];
  status: msgStatusType;
  message_text: string;
};

export type processMsgType = {
  sender_id: number;
  message: processInnerMsgType[];
  room_id: string;
};

export default function processMsg(msg: messageType[]) {
  let newMsg: processMsgType[] = [];
  msg.forEach((m, index) => {
    if (index == 0) {
      newMsg.push(addMsg(m));
      return;
    }
    let data = newMsg.pop();
    let latest_msg = data?.message.pop();
    if (data && latest_msg) {
      if (
        data.sender_id == m.sender_id &&
        checkTimeDiff(latest_msg.created_at, m.created_at, 60)
      ) {
        data.message.push(latest_msg);
        data.message.push(addInnerMsg(m));
        newMsg.push(data);
      } else {
        data.message.push(latest_msg);
        newMsg.push(data);
        newMsg.push(addMsg(m));
      }
    }
  });

  return newMsg;
}

export function addToProcessMsg(
  prevMsg: processMsgType[] | undefined,
  msg: messageType
) {
  if (prevMsg === undefined) return prevMsg;
  let newMsg = structuredClone(prevMsg);
  let data = newMsg.pop();
  let latest_msg = data?.message.pop();
  if (data && latest_msg) {
    if (
      data.sender_id == msg.sender_id &&
      checkTimeDiff(latest_msg.created_at, msg.created_at, 60)
    ) {
      data.message.push(latest_msg);
      data.message.push(addInnerMsg(msg));
      newMsg.push(data);
    } else {
      data.message.push(latest_msg);
      newMsg.push(data);
      newMsg.push(addMsg(msg));
    }
  }
  return newMsg;
}

function addMsg(msg: messageType) {
  return {
    sender_id: msg.sender_id,
    message: [addInnerMsg(msg)],
    room_id: msg.room_id,
  };
}

function addInnerMsg(msg: messageType) {
  return {
    id: msg.id,
    created_at: msg.created_at,
    message_type: msg.message_type,
    file_links: msg.file_links,
    status: msg.status,
    seen_by: msg.seen_by,
    message_text: msg.message_text,
  };
}
