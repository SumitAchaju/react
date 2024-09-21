import { useState } from "react";
import { UserIcon } from "../Icons";
import ProfilePic from "../ProfilePic";
import MyModal from "./MyModal";
import { userType } from "../../types/fetchTypes";

type Props = {
  userInfo: userType | undefined;
};

export default function Profile({ userInfo }: Props) {
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
        <div className="p-[50px] flex flex-col w-full gap-[20px] h-full">
          <div className="flex">
            <div className="flex flex-col gap-5 text-primary-text items-center w-full font-medium text-xl">
              <h2 className="text-3xl">Profile</h2>
              <ProfilePic
                className="mb-5"
                image={userInfo?.profile}
                size={120}
                circle={false}
              />
              <p>
                Name: {userInfo?.first_name} {userInfo?.last_name}
              </p>
              <p>Email: {userInfo?.email}</p>
              <p>Address: {userInfo?.address}</p>
              <p>
                Phone Number: +{userInfo?.contact_number_country_code}{" "}
                {userInfo?.contact_number}
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
}
