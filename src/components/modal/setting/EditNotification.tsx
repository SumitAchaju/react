import { useState } from "react";
import Switch from "../../Switch";
import ProfilePic from "../../ProfilePic";

type Props = {};

export default function EditNotification({}: Props) {
  const [notificationState] = useState(false);
  return (
    <div className="flex flex-col gap-5 h-full ps-5 w-full">
      <h2 className="text-primary-text text-[25px] pe-5 tracking-[0.64px] font-medium">
        Notification
      </h2>
      <div className="flex justify-between items-center pe-5">
        <p className="text-secondary-text text-[18px]">Mute all Notification</p>
        <Switch state={notificationState} />
      </div>
      <div className="grow flex flex-col gap-5 overflow-y-hidden">
        <p className="text-primary-text font-medium text-[20px] pe-5">
          Mute Friends
        </p>
        <div className="flex flex-col gap-5 grow overflow-y-auto my-scroll pe-5">
          {[1, 2, 3].map(() => (
            <MuteFriend />
          ))}
        </div>
      </div>
    </div>
  );
}

function MuteFriend() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <ProfilePic
          image="/src/assets/profile/default_profile.jpg"
          circle={false}
          active={false}
          size={40}
        />
        <p className="text-primary-text text-[18px]">Sumit Achaju</p>
      </div>
      <Switch state={true} />
    </div>
  );
}
