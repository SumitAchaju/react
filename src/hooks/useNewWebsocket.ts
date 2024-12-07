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
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxRetries = 3;

  const socket = useWebSocket<websocketResponseType>(BaseWebsocketUrl + url, {
    onOpen: () => {
      const token = localStorage.getItem("access");
      socket.sendMessage(token ? token : "invalid");
      if (token) setIsConnected(true);
    },
    retryOnError: true,
    shouldReconnect: (closeEvent) => {
      if (reconnectAttempts > maxRetries) {
        setReconnectAttempts(0);
        return false;
      }
      if (closeEvent.reason === "Invalid room id") return false;
      setReconnectAttempts((prev) => prev + 1);
      return true;
    },
    reconnectAttempts: 3,
    reconnectInterval: (attemptNumber) =>
      Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    onReconnectStop: () => {
      setIsConnected(false);
    },
    ...options,
  });

  useUpdateEffect(() => {
    if (socket.lastJsonMessage === null) return;
    onMessage(socket.lastJsonMessage, socket.sendJsonMessage);
  }, [socket.lastJsonMessage]);

  return { ...socket, isConnected };
}
