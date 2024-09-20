import { msgStatusType } from "../types/fetchTypes";
import { processMsgType } from "./processMsg";

export default function getMsgStatus(
  chatMessages: processMsgType[] | undefined,
  status: msgStatusType
) {
  let unSeenMsg: processMsgType["message"] = [];
  let senderIdList: Set<number> = new Set();
  chatMessages?.forEach((chatMsg) => {
    chatMsg.message.forEach((msg) => {
      if (msg.status !== status) {
        unSeenMsg.push(msg);
        senderIdList.add(chatMsg.sender_id);
      }
    });
  });
  return { unSeenMsg, senderIdList };
}
