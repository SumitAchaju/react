import { ArrowIcon, BlockIocn, CrossIcon, HelpIcon, MuteIcon } from "../Icons";
import Profile from "../modal/Profile";
import ProfilePic from "../ProfilePic";
import useRoomFriendQuery from "../../queryHooks/useRoomFriendQuery";
import useBlockUserMutation, {
  useUnBlockUserMutation,
} from "../../queryHooks/useBlockUserMutation";
import { notifyPromise } from "../toast/MsgToast";
import { useContext, useMemo } from "react";
import AuthContext from "../../context/Auth";

type Props = {
  friendUsers: ReturnType<typeof useRoomFriendQuery>;
  setIsChatInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChatInfo({ friendUsers, setIsChatInfoOpen }: Props) {
  const blockUserMutation = useBlockUserMutation();
  const unBlockUserMutation = useUnBlockUserMutation();
  const context = useContext(AuthContext);
  const isBlocked = useMemo(
    () =>
      context?.user?.blocked_user?.find(
        (user) => user.id === friendUsers.data?.id
      ) !== undefined,
    [friendUsers.data?.id, context?.user?.blocked_user]
  );
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
        <div
          onClick={() => setIsChatInfoOpen((prev) => !prev)}
          className="cursor-pointer"
        >
          <CrossIcon color="var(--red_color)" />
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <ProfilePic
          image={friendUsers.data?.profile}
          size={80}
          circle={false}
        />
        <p className="text-primary-text text-[22px] tracking-wide">
          {friendUsers?.data?.first_name === undefined
            ? "Account Deleted"
            : friendUsers?.data.first_name + " " + friendUsers?.data?.last_name}
        </p>
      </div>
      <div className="flex gap-[40px] items-center justify-center">
        <Profile userInfo={friendUsers.data} />
        <div className="text-center">
          <div className="rounded-[50%] bg-main me-auto flex items-center justify-center mb-2 w-[50px] h-[50px]">
            <MuteIcon />
          </div>
          <span className="text-primary-text">Mute</span>
        </div>
        <div className="text-center">
          <div
            className={
              "rounded-[50%] me-auto flex items-center justify-center mb-2 w-[50px] h-[50px] cursor-pointer " +
              (isBlocked ? "bg-red-color" : "bg-main")
            }
            onClick={() => {
              notifyPromise({
                promise: isBlocked
                  ? unBlockUserMutation.mutateAsync(friendUsers.data?.id ?? 0)
                  : blockUserMutation.mutateAsync(friendUsers.data?.id ?? 0),
                msg: isBlocked ? "User Unblocked" : "User Blocked",
                loading: isBlocked ? "Unblocking user" : "Blocking User",
              });
            }}
          >
            <BlockIocn color={isBlocked ? "white" : "var(--icon_color)"} />
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
