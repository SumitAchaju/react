import { useContext, useMemo } from "react";
import { processMsgType } from "../utils/processMsg";
import AuthContext from "../context/Auth";

export default function useShowMsgStatus(
  msgData: processMsgType[] | undefined
) {
  const context = useContext(AuthContext);

  const lastStatusMsg = useMemo(() => {
    let copiedMsgData: processMsgType[] = [];

    for (const msg of structuredClone(msgData)?.reverse() ?? []) {
      if (
        msg.message[msg.message.length - 1].status === "seen" &&
        context?.user?.id === msg.sender_id
      ) {
        copiedMsgData.push(msg);

        break;
      }
      if (msg.sender_id === context?.user?.id) {
        copiedMsgData.push(msg);
      }
    }

    //reverse the array for latest msg
    copiedMsgData.forEach((msg) => msg.message.reverse());

    const lastSeen = copiedMsgData
      .find((msg) => msg.message.find((m) => m.status === "seen") !== undefined)
      ?.message.find((m) => m.status === "seen");

    const lastDelivered = copiedMsgData
      .find(
        (msg) => msg.message.find((m) => m.status === "delivered") !== undefined
      )
      ?.message.find((m) => m.status === "delivered");

    const lastSent = copiedMsgData
      .find((msg) => msg.message.find((m) => m.status === "sent") !== undefined)
      ?.message.find((m) => m.status === "sent");

    return { lastSeen, lastDelivered, lastSent };
  }, [msgData, context?.user?.id]);

  return { lastStatusMsg };
}
