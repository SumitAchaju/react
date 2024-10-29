import { useEffect, useMemo, useState } from "react";
import {
  websocketMsgType,
  websocketNotificationType,
} from "../types/fetchTypes";

export default function useWebsocket(
  url: string,
  handleMsg: (
    msg: websocketMsgType | websocketNotificationType,
    selfSocket: WebSocket
  ) => void
) {
  const [isConnected, setIsConnected] = useState(false);

  const roomSocket = useMemo(
    () => new WebSocket(`ws://localhost/ws${url}`),
    [url]
  );

  useEffect(() => {
    roomSocket.onopen = () => {
      const token = localStorage.getItem("access");
      roomSocket.send(token ? token : "invalid");
      setIsConnected(true);
    };
    return () => {
      roomSocket.close();
      setIsConnected(false);
    };
  }, [url]);

  useEffect(() => {
    roomSocket.onmessage = (event: MessageEvent<any>) => {
      const msg = JSON.parse(event.data);
      handleMsg(msg, roomSocket);
    };
  }, [handleMsg, url]);

  return { isConnected, setIsConnected, roomSocket };
}
