import { useChatHistoryQueryMutation } from "../queryHooks/useChatHistoryQuery";
import { useMsgQueryMutation } from "../queryHooks/useMsgQuery";
import { messageType, websocketResponseType } from "../types/fetchTypes";

export default function useOnMessageRoom() {
  const { updateHistoryData, updateHistoryDataStatus } =
    useChatHistoryQueryMutation();
  const { updateMsg, updateMsgStatus } = useMsgQueryMutation();

  const onMessage = (msg: websocketResponseType) => {
    console.log(msg);

    switch (msg.event_type) {
      case "new_message":
        const msgData = msg.data[0] as messageType;
        updateHistoryData(msgData);
        updateMsg(msgData);
        break;
      case "change_message_status":
        const msgDataList = msg.data as messageType[];
        updateHistoryDataStatus(msgDataList);
        updateMsgStatus(msgDataList);
        break;
    }
  };

  return { onMessage };
}
