import ChatHistory from "../components/chatpage/ChatHistory";
import MainChatBox from "../components/chatpage/MainChatBox";
import useNewWebsocket from "../hooks/useNewWebsocket";
import useOnMessageMain from "../hooks/useOnMessageMain";

type Props = {};

export default function MainChat({}: Props) {
  const { onMessage } = useOnMessageMain();
  useNewWebsocket({ url: "/", onMessage: onMessage });

  return (
    <div className="flex h-screen">
      <div className="w-[400px] shrink-0 bg-second h-full">
        <ChatHistory />
      </div>
      <MainChatBox />
    </div>
  );
}
