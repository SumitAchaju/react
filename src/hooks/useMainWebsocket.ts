import { useEffect, useMemo, useState } from "react";
import { useMutateChatHistoryQuery } from "../queryHooks/useChatHistoryQuery";

export default function useMainWebsocket() {
  const socket = useMemo(() => new WebSocket("ws://localhost/ws/"), []);
  const [isConnected, setIsConnected] = useState(false);

  const { updateHistoryData } = useMutateChatHistoryQuery();

  useEffect(() => {
    socket.onmessage = (event: MessageEvent<any>) => {
      const msg = JSON.parse(JSON.parse(event.data));
      if (msg.msg_type == "new_msg") {
        updateHistoryData(msg.msg[0]);
      }
    };
    socket.onopen = () => {
      const token = localStorage.getItem("access");
      socket.send(token ? token : "invalid");
      setIsConnected(true);
    };
    return () => {
      socket.close();
      setIsConnected(false);
    };
  }, []);

  return { socket, isConnected, setIsConnected };
}
