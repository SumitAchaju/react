import { processInnerMsgType, processMsgType } from "../utils/processMsg";
import { TickIcon } from "./Icons";
import ProfilePic from "./ProfilePic";

type Props = {
  inViewRef?: (node?: Element | null) => void;
  img: string | undefined;
  type: "sent" | "recieved";
  msg: processMsgType["message"];
  lastMsg: {
    lastSeen: processInnerMsgType | undefined;
    lastDelivered: processInnerMsgType | undefined;
    lastSent: processInnerMsgType | undefined;
  };
};

export default function Message({ inViewRef, img, type, msg, lastMsg }: Props) {
  const msgColor =
    type == "sent" ? "bg-blue-color text-white" : "bg-msg text-primary-text";
  const msgStyle = extractStyle(
    msg.map((m) => m.message_text),
    type
  );
  return (
    <div
      className={
        `${type == "sent" ? "flex-row-reverse" : ""}` +
        " flex gap-[5px] items-end"
      }
    >
      <div className="shrink-0">
        <ProfilePic image={img} size={40} active={false} circle={false} />
      </div>
      <div className="flex flex-col gap-1 max-w-[70%]">
        {msg.map((m, i: number) => (
          <div
            ref={inViewRef}
            key={i}
            className={`${
              type == "sent" ? "flex-row-reverse" : ""
            } flex gap-[5px] items-end`}
          >
            <p
              key={m.created_at}
              className={`${msgColor} ${msgStyle[i]}  break-all break-words whitespace-normal py-4 px-6 w-fit text-[17px] font-normal`}
            >
              {m.message_text}
            </p>

            <div
              className={`shrink-0 ${
                lastMsg.lastSeen?.id === m.id ||
                lastMsg.lastDelivered?.id === m.id ||
                lastMsg.lastSent?.id === m.id
                  ? ""
                  : "invisible"
              }`}
            >
              <TickIcon color={msgStatusColor(m.status)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function msgStatusColor(status: string) {
  let color: string;
  switch (status) {
    case "sent":
      color = "yellow";
      break;
    case "delivered":
      color = "var(--blue_color)";
      break;
    case "seen":
      color = "var(--active_green_color)";
      break;

    default:
      color = "yellow";
      break;
  }
  return color;
}

function extractStyle(
  msg: Array<string>,
  type: "sent" | "recieved"
): Array<string> {
  let style: Array<string> = [];
  if (msg.length == 1) {
    style.push("rounded-[30px]");
    return style;
  }

  if (type == "sent") {
    msg.forEach((_, i: number) => {
      if (i == 0) {
        style.push("rounded-[30px] rounded-br-[15px]");
      } else if (i == msg.length - 1) {
        style.push("rounded-[30px] rounded-tr-[15px]");
      } else {
        style.push("rounded-[30px] rounded-tr-[15px] rounded-br-[15px]");
      }
    });
  } else {
    msg.forEach((_, i: number) => {
      if (i == 0) {
        style.push("rounded-[30px] rounded-bl-[15px]");
      } else if (i == msg.length - 1) {
        style.push("rounded-[30px] rounded-tl-[15px]");
      } else {
        style.push("rounded-[30px] rounded-tl-[15px] rounded-bl-[15px]");
      }
    });
  }

  return style;
}
