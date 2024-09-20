import ChatHistory from "../components/chatpage/ChatHistory";
import ChatInfo from "../components/chatpage/ChatInfo";
import MainChatBox from "../components/chatpage/MainChatBox";
import useOnMessage from "../hooks/useOnMessage";
import useWebsocket from "../hooks/useWebsocket";

type Props = {};

export default function MainChat({}: Props) {
  const { onMessage, onNotification } = useOnMessage("main");
  useWebsocket("/", (msg, socket) => {
    if (msg.msg_type === "notification") {
      onNotification(msg);
    } else {
      onMessage(msg, socket);
    }
  });

  return (
    <div className="flex h-screen">
      <div className="w-[400px] bg-second h-full">
        <ChatHistory />
      </div>
      <div className="w-[45%] bg-main grow h-full ">
        <MainChatBox />
      </div>
      <div className="w-[25%] flex flex-col h-full">
        <ChatInfo />
      </div>
    </div>
  );
}
