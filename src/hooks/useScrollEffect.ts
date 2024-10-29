import React, { useEffect, useRef } from "react";
import { useMsgQueryType } from "../queryHooks/useMsgQuery";

export default function useScrollEffect(
  chatMessages: useMsgQueryType,
  msgDivRef: React.MutableRefObject<HTMLDivElement | null>
) {
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    if (chatMessages.isFetchingNextPage) {
      prevScrollHeight.current = msgDivRef.current?.scrollHeight || 0;
      return;
    }
    if (msgDivRef.current !== null) {
      msgDivRef.current.scrollTo(
        0,
        msgDivRef.current.scrollHeight - prevScrollHeight.current
      );
    }
    prevScrollHeight.current = 0;
  }, [chatMessages.data, chatMessages.isFetchingNextPage]);
}
