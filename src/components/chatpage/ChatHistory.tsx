import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import RecentChat from "../RecentChat";
import StackIcon, { MessageIcon, SearchIcon } from "../Icons";
import ProfilePic from "../ProfilePic";
import Notification from "../modal/Notification";
import AddFriend from "../modal/AddFriend";
import Setting from "../modal/Setting";
import OnlineUser from "../modal/OnlineUser";
import { chatHistoryType, onlineUserType } from "../../types/fetchTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import useOnlineUserQuery from "../../queryHooks/useOnlineUserQuery";
import useChatHistoryQuery from "../../queryHooks/useChatHistoryQuery";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/Auth";
import { useDebouncedCallback } from "use-debounce";

type Props = {};

export default function ChatHistory({}: Props) {
  const go = useNavigate();
  const { roomId } = useParams();
  const onlineUserQuery = useOnlineUserQuery();
  const historyQuery = useChatHistoryQuery();

  const context = useContext(AuthContext);

  const historySearchRef = useRef<HTMLInputElement | null>(null);
  const [historyUser, setHistoryUser] = useState<chatHistoryType[]>([]);

  const searchFilter = () =>
    historyQuery.data?.filter((chat: chatHistoryType) =>
      (
        chat.users[0]?.first_name?.toLowerCase() +
        " " +
        chat.users[0]?.last_name?.toLowerCase()
      ).includes((historySearchRef.current?.value ?? "").toLowerCase())
    );

  const handleChatSearch = useDebouncedCallback(() => {
    setHistoryUser(searchFilter());
  }, 1000);

  useEffect(() => {
    if (historyQuery.data) {
      setHistoryUser(searchFilter());
    }
  }, [historyQuery.data]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 items-center min-h-[92px] px-[10%]">
        <div>
          <StackIcon />
        </div>
        <h1 className="text-primary-text font-semibold text-[35px]">Hello</h1>
      </div>
      <div className="flex grow">
        <div className="h-full flex bg-third flex-col items-center justify-between px-3 py-5">
          <div className="flex flex-col gap-10 my-auto">
            <div>
              <MessageIcon />
            </div>
            <div className="relative">
              <Notification />
            </div>
            <div>
              <AddFriend />
            </div>
          </div>
          <div className="flex flex-col gap-5 items-center mt-auto">
            <div>
              <Setting />
            </div>
            <ProfilePic
              image={context?.user?.profile}
              size={30}
              circle={false}
              active={false}
            />
          </div>
        </div>
        <div className="grow bg-second flex flex-col gap-4 overflow-hidden pb-1">
          {onlineUserQuery.data?.length ? (
            <>
              <div className="flex justify-between items-center font-medium text-[18px] px-5">
                <p className="text-primary-text">Online</p>
                <OnlineUser users={onlineUserQuery.data} />
              </div>
              <div className="px-5">
                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  mousewheel={true}
                  direction="horizontal"
                  modules={[Mousewheel]}
                >
                  {onlineUserQuery.data.map((onlineUser: onlineUserType) => (
                    <SwiperSlide key={onlineUser?.user.id}>
                      <Link to={`/main/${onlineUser.room.id}`}>
                        <ProfilePic image={onlineUser?.user.profile} />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          ) : (
            ""
          )}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative mx-5 mt-1"
          >
            <input
              type="text"
              placeholder="Search Chats..."
              className="rounded-full block py-[10px] ps-12 outline-primary-text outline outline-1 pe-5 w-full text-primary-text placeholder:text-primary-text bg-transparent"
              onChange={handleChatSearch}
              ref={historySearchRef}
              onBlur={(e) => {
                e.currentTarget.value = "";
                setHistoryUser(searchFilter());
              }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-5">
              <SearchIcon />
            </div>
          </form>
          <p className="text-primary-text text-[18px] font-medium px-5">
            Messages
          </p>
          <div className="flex flex-col grow basis-0 overflow-y-auto my-scroll">
            {historyUser.map((chat: chatHistoryType) => (
              <div
                key={chat.room.id}
                className={
                  "px-5 hover:bg-third cursor-pointer duration-300 py-4 rounded " +
                  (roomId === chat.room.id ? "bg-third" : "")
                }
                onClick={() => go(`/main/${chat.room.id}`)}
              >
                <RecentChat
                  img={chat?.users[0]?.profile}
                  name={
                    chat?.users[0]?.first_name === undefined
                      ? "Account Deleted"
                      : chat?.users[0]?.first_name +
                        " " +
                        chat?.users[0]?.last_name
                  }
                  msgQuantity={chat.quantity}
                  message={chat.message}
                  active={true}
                />
              </div>
            ))}
            {historyUser.length === 0 && (
              <div className="text-secondary-text font-semibold text-center text-[18px] px-5">
                <p className="mt-10">No chat found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
