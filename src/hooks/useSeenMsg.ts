import { msgStatusType } from "../types/fetchTypes";
import { processMsgType } from "../utils/processMsg";

export default function getMsgStatus(
  chatMessages: processMsgType[] | undefined,
  status: msgStatusType
) {
  let unSeenMsg: processMsgType["message"] = [];
  chatMessages?.map((chatMsg) => {
    chatMsg.message.forEach((msg) => {
      if (msg.status !== status) {
        unSeenMsg.push(msg);
      }
    });
  });
  return unSeenMsg;
}
