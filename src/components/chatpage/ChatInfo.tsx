import { ArrowIcon, BlockIocn, CrossIcon, HelpIcon, MuteIcon } from "../Icons";
import Profile from "../modal/Profile";
import ProfilePic from "../ProfilePic";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { userType } from "../../types/fetchTypes";

type Props = {};

export default function ChatInfo({}: Props) {
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();
  const roomFriend = queryClient.getQueryData<userType>([
    "roomFriends",
    roomId,
  ]);
  return (
    <div className="flex flex-col h-full gap-[40px] bg-third">
      <div className="flex px-[40px] min-h-[92px] bg-second items-center justify-between">
        <div className="flex gap-5 items-center">
          <div>
            <HelpIcon />
          </div>
          <h2 className="text-primary-text tracking-[0.6px] text-[22px] font-medium text-nowrap">
            Chat Info
          </h2>
        </div>
        <div>
          <CrossIcon color="var(--red_color)" />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <ProfilePic image={roomFriend?.profile} size={80} circle={false} />
        <p className="text-primary-text text-[22px] tracking-wide">
          {roomFriend?.first_name} {roomFriend?.last_name}
        </p>
      </div>
      <div className="flex gap-[40px] items-center justify-center">
        <Profile />
        <div className="text-center">
          <div className="rounded-[50%] bg-main me-auto flex items-center justify-center mb-2 w-[50px] h-[50px]">
            <MuteIcon />
          </div>
          <span className="text-primary-text">Mute</span>
        </div>
        <div className="text-center">
          <div className="rounded-[50%] bg-main me-auto flex items-center justify-center mb-2 w-[50px] h-[50px]">
            <BlockIocn />
          </div>
          <span className="text-primary-text">Block</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between py-[15px] px-[30px] border-b-2 border-main border-t-2">
          <p className="text-primary-text text-[18px]">Customize Chats</p>
          <ArrowIcon />
        </div>
        <div className="flex items-center justify-between py-[15px] px-[30px] border-b-2 border-main border-t-2">
          <p className="text-primary-text text-[18px]">Privacy & Support</p>
          <ArrowIcon />
        </div>
        <div className="flex items-center justify-between py-[15px] px-[30px] border-b-2 border-main border-t-2">
          <p className="text-primary-text text-[18px]">Files and Media</p>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
}
