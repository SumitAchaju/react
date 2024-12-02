import { useState } from "react";
import useWebSocket, { Options } from "react-use-websocket";
import { websocketResponseType } from "../types/fetchTypes";
import { useUpdateEffect } from "./useUpdateEffect";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

type Props = {
  url: string;
  onMessage: (
    msg: websocketResponseType,
    sendJsonMessage: SendJsonMessage
  ) => void;
  options?: Options;
};

const BaseWebsocketUrl = "ws://localhost/ws";

export default function useNewWebsocket({
  url,
  onMessage,
  options = {},
}: Props) {
  const [isConnected, setIsConnected] = useState(false);

  const socket = useWebSocket<websocketResponseType>(BaseWebsocketUrl + url, {
    onOpen: () => {
      const token = localStorage.getItem("access");
      socket.sendMessage(token ? token : "invalid");
      if (token) setIsConnected(true);
    },

    ...options,
  });

  useUpdateEffect(() => {
    if (socket.lastJsonMessage === null) return;
    onMessage(socket.lastJsonMessage, socket.sendJsonMessage);
  }, [socket.lastJsonMessage]);

  return { ...socket, isConnected };
}
