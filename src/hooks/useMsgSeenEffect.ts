import { InfiniteData } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { processMsgType } from "../utils/processMsg";
import { statusChangeWebsocketMsg } from "../utils/websocketMsg";
import AuthContext from "../context/Auth";
import getMsgStatus from "../utils/extractMsgStatus";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { ReadyState } from "react-use-websocket";

export default function useMsgSeenEffect(
  chatMessages: InfiniteData<processMsgType[], unknown> | undefined,
  isConnected: boolean,
  sendJsonMessage: SendJsonMessage,
  socketState: ReadyState,
  roomId: string | undefined
) {
  const context = useContext(AuthContext);
  useEffect(() => {
    if (context?.user?.id === undefined) return;
    if (chatMessages === undefined || !isConnected) return;

    const { unSeenMsg, senderIdList } = getMsgStatus(
      chatMessages?.pages.flat(),
      "seen"
    );
    if (senderIdList.size === 1 && senderIdList.has(context?.user?.id)) return;
    if (unSeenMsg.length === 0) return;
    if (socketState === ReadyState.CONNECTING) return;
    console.log("seen fire");
    sendJsonMessage(
      statusChangeWebsocketMsg({
        room_id: roomId,
        messages: unSeenMsg,
        status: "seen",
        sender_user: context?.user,
      })
    );
  }, [chatMessages, isConnected]);
}
