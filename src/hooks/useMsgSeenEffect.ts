import { InfiniteData } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { processMsgType } from "../utils/processMsg";
import { statusChangeWebsocketMsg } from "../utils/websocketMsg";
import AuthContext from "../context/Auth";
import getMsgStatus from "../utils/extractMsgStatus";

export default function useMsgSeenEffect(
  chatMessages: InfiniteData<processMsgType[], unknown> | undefined,
  isConnected: boolean,
  roomSocket: WebSocket,
  roomId: string | undefined
) {
  const context = useContext(AuthContext);
  useEffect(() => {
    if (chatMessages === undefined || !isConnected) return;

    const { unSeenMsg, senderIdList } = getMsgStatus(
      chatMessages?.pages.flat(),
      "seen"
    );
    if (senderIdList.size === 1 && senderIdList.has(context?.user?.id || 0))
      return;
    if (unSeenMsg.length === 0) return;
    if (roomSocket.readyState === roomSocket.CONNECTING) return;
    console.log("seen fire");
    roomSocket.send(
      JSON.stringify(
        statusChangeWebsocketMsg({
          room_id: roomId,
          sender_id: context?.user?.id,
          messages: unSeenMsg,
          status: "seen",
          sender_user: context?.user,
        })
      )
    );
  }, [chatMessages, isConnected]);
}
