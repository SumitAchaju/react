import { useContext, useMemo } from "react";
import { messageType } from "../types/fetchTypes";
import { TickIcon } from "./Icons";
import ProfilePic from "./ProfilePic";
import AuthContext from "../context/Auth";
import { extracteDateToOneWord } from "../utils/processDate";
import { msgStatusColor } from "./Message";

type Props = {
  img: string;
  name: string;
  msgQuantity: number;
  active: boolean;
  message: messageType;
};

export default function RecentChat({
  img,
  name,
  msgQuantity,
  active,
  message,
}: Props) {
  const msgData = useMemo(() => initilizeMsg(message), [message]);
  const context = useContext(AuthContext);
  const myMsg = useMemo(
    () => msgData.sender_id === context?.user?.id,
    [msgData, context?.user?.id]
  );
  return (
    <div className="flex items-center gap-2">
      <ProfilePic image={img} active={active} size={50} circle={false} />
      <div className="flex grow justify-between items-center gap-2">
        <div>
          <p className="text-primary-text text-[17px] font-medium text-ellipsis max-w-[170px] whitespace-nowrap overflow-hidden">
            {name}
          </p>
          <p
            className={`${
              msgData.status === "seen" || msgData.sender_id === 0 || myMsg
                ? "text-secondary-text"
                : "text-primary-text"
            } font-normal text-[15px] text-ellipsis max-w-[170px] whitespace-nowrap overflow-hidden`}
          >
            {context?.user?.id === msgData.sender_id ? "You: " : ""}{" "}
            {msgData.message_text}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-secondary-text text-[12px] block mb-2">
            {msgData.created_at !== ""
              ? extracteDateToOneWord(msgData.created_at)
              : ""}
          </span>
          {myMsg ? (
            <span className="flex items-center justify-end">
              <TickIcon color={msgStatusColor(msgData.status)} />
            </span>
          ) : (
            <span
              className={
                "flex mx-auto items-center justify-center w-[13px] h-[13px] rounded-full text-white bg-blue-color text-[8px] " +
                (msgQuantity == 0 ? "opacity-0" : "")
              }
            >
              {msgQuantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function initilizeMsg(msg: messageType | null) {
  if (msg == null) {
    return {
      sender_id: 0,
      message_text: "Say Hi",
      created_at: "",
      room_id: "",
      message_type: "text",
      file_links: null,
      status: "sent",
      seen_by: [],
    };
  }
  return msg;
}
