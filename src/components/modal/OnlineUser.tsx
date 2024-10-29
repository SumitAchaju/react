import { useEffect, useRef, useState } from "react";
import { onlineUserType } from "../../types/fetchTypes";
import Button from "../Button";
import { SearchIcon } from "../Icons";
import ProfilePic from "../ProfilePic";
import MyModal from "./MyModal";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  users: onlineUserType[];
};

export default function OnlineUser({ users }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement | null>(null);

  const [filterUser, setFilterUser] = useState<onlineUserType[]>(users);
  const searchFilter = () =>
    users.filter((user) =>
      (
        user.user.first_name.toLowerCase() +
        " " +
        user.user.last_name.toLowerCase()
      ).includes((searchRef.current?.value ?? "").toLowerCase())
    );

  const handleSearchChange = useDebouncedCallback(() => {
    setFilterUser(searchFilter());
  }, 1000);

  useEffect(() => {
    setFilterUser(searchFilter());
  }, [users]);

  return (
    <MyModal
      trigger={<p className="text-blue-color">See all</p>}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modal={
        <div className="py-[50px] flex flex-col gap-[20px] h-full">
          <div className="px-[50px]">
            <h2 className="text-primary-text text-[20px] font-medium">
              Online Friends
            </h2>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center gap-5 px-[50px]"
          >
            <input
              type="text"
              placeholder="Search Online Friends..."
              className="rounded-[10px] block py-[15px] ps-[55px] border border-secondary-text pe-5 w-full text-primary-text placeholder:text-primary-text bg-transparent"
              ref={searchRef}
              onChange={handleSearchChange}
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-[75px]">
              <SearchIcon />
            </div>
            <button
              type="button"
              className="bg-red-color rounded-full p-4 block"
              onClick={() => setFilterUser(searchFilter())}
            >
              <SearchIcon color="white" />
            </button>
          </form>
          <div className="flex flex-col overflow-y-auto my-scroll grow gap-[20px] px-[50px] w-full">
            {filterUser.map((user: onlineUserType) => (
              <div
                key={user.user.id}
                className="flex justify-between items-center w-full"
              >
                <div className="flex gap-5 justify-between items-center">
                  <ProfilePic size={50} image={user.user.profile} />
                  <div>
                    <p className="text-primary-text font-medium">
                      {user.user.first_name} {user.user.last_name}
                    </p>
                    <span className="block text-secondary-text text-[14px]">
                      {user.user.address}
                    </span>
                  </div>
                </div>
                <Link to={`/main/${user.room.id}`}>
                  <Button
                    onClick={() => setIsOpen(false)}
                    varient="secondary"
                    text="Message"
                  />
                </Link>
              </div>
            ))}
            {filterUser.length === 0 && (
              <div className="flex justify-center items-center w-full">
                <p className="text-secondary-text font-medium text-[20px] mt-10">
                  No User Found
                </p>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
