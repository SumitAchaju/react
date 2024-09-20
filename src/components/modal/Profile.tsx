import { useState } from "react";
import { UserIcon } from "../Icons";
import ProfilePic from "../ProfilePic";
import MyModal from "./MyModal";

type Props = {};

export default function Profile({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MyModal
      trigger={
        <div className="text-center">
          <div className="rounded-[50%] bg-main me-auto flex items-center justify-center mb-2 w-[50px] h-[50px]">
            <UserIcon />
          </div>
          <span className="text-primary-text">Profile</span>
        </div>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modal={
        <div className="p-[50px] flex flex-col gap-[20px] h-full">
          <div className="text-center">
            <h2 className="text-primary-text text-[20px] font-medium">
              Profile
            </h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <ProfilePic image="/src/assets/png/profile.png" size={150} />
            <p className="text-primary-text text-[35px] font-medium">
              Sumit Achaju
            </p>
          </div>
        </div>
      }
    />
  );
}
