import { useContext, useEffect, useRef, useState } from "react";
import {
  PhoneIcon,
  ScrollBottomIcon,
  SearchIcon,
  ThreeDotIcon,
} from "../Icons";
import Message from "../Message";
import MessageBox from "../MessageBox";
import ProfilePic from "../ProfilePic";
import AuthContext from "../../context/Auth";
import { useParams } from "react-router-dom";
import { processMsgType } from "../../utils/processMsg";
import { checkTimeDiff, formatedDate } from "../../utils/processDate";
import useRoomFriendQuery from "../../queryHooks/useRoomFriendQuery";
import useMsgQuery from "../../queryHooks/useMsgQuery";
import Spinner from "../Spinner";
import useShowMsgStatus from "../../hooks/useShowMsgStatus";
import { useInView } from "react-intersection-observer";
import useMsgSeenEffect from "../../hooks/useMsgSeenEffect";
import useScrollEffect from "../../hooks/useScrollEffect";
import sendMsg from "../../form/msgSend";
import { useUpdateEffect } from "../../hooks/useUpdateEffect";
import useRoomQuery from "../../queryHooks/useRoomQuery";
import ChatInfo from "./ChatInfo";
import useBottomScroll from "../../hooks/useBottomScroll";
import useNewWebsocket from "../../hooks/useNewWebsocket";
import useOnMessageRoom from "../../hooks/useOnMessageRoom";

type Props = {};

export default function MainChatBox({}: Props) {
  const context = useContext(AuthContext);
  const { roomId } = useParams();
  const msgDivRef = useRef<HTMLDivElement | null>(null);

  const [isChatInfoOpen, setIsChatInfoOpen] = useState(true);

  const { ref, inView } = useInView();

  const friendUsers = useRoomFriendQuery(roomId);
  const chatMessages = useMsgQuery(roomId);
  const roomQuery = useRoomQuery(roomId);

  const { lastStatusMsg } = useShowMsgStatus(chatMessages.orderedChatMessages);

  const handleRoomMessage = useOnMessageRoom();
  const { sendJsonMessage, isConnected, readyState } = useNewWebsocket({
    url: `/${roomId}`,
    onMessage: handleRoomMessage.onMessage,
  });

  useMsgSeenEffect(
    chatMessages.data,
    isConnected,
    sendJsonMessage,
    readyState,
    roomId
  );

  useScrollEffect(chatMessages, msgDivRef);

  useUpdateEffect(() => {
    if (inView && chatMessages.hasNextPage) {
      chatMessages.fetchNextPage().then((res) => console.log(res));
    }
  }, [inView]);

  let prevDate: string;

  useEffect(() => {
    if (roomId) {
      if (roomQuery.data && !roomQuery.isFetching)
        localStorage.setItem("roomId", roomId);
    }
  }, [roomId, roomQuery.isFetching]);

  const { isShowBottom, handleScroll } = useBottomScroll();

  return (
    <div className="bg-main grow h-full flex ">
      <div className="w-[62%] grow flex flex-col h-full">
        <div className="flex px-[40px] min-h-[92px] bg-second items-center justify-between">
          {friendUsers.error?.response?.data.detail === "friend not found" ? (
            <div className="flex gap-[20px] items-center">
              <ProfilePic circle={true} />
              <p className="text-primary-text font-medium text-[25px] tracking-[0.6px]">
                Account Deleted
              </p>
            </div>
          ) : friendUsers.isError ? (
            <p className="text-primary-text font-medium text-[25px] tracking-[0.6px]">
              Something went wrong
            </p>
          ) : friendUsers.isLoading ? (
            <div className="flex items-center">
              <Spinner />
            </div>
          ) : (
            <div className="flex gap-[20px] items-center">
              <ProfilePic image={friendUsers.data?.profile} circle={true} />
              <p className="text-primary-text font-medium text-[25px] tracking-[0.6px]">
                {friendUsers.data?.first_name} {friendUsers.data?.last_name}
              </p>
            </div>
          )}
          <div className="flex items-center gap-[30px]">
            <div>
              <SearchIcon />
            </div>
            <div>
              <PhoneIcon />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setIsChatInfoOpen((prev) => !prev)}
            >
              <ThreeDotIcon />
            </div>
          </div>
        </div>
        <div
          className="grow basis-0 overflow-y-auto my-scroll flex flex-col gap-[40px] px-[40px] py-5 relative"
          ref={msgDivRef}
          onScroll={handleScroll}
        >
          {chatMessages.isError ? (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-primary-text font-medium text-xl">
                Error Loading Messages
              </p>
            </div>
          ) : chatMessages.isLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              {chatMessages.isFetchingNextPage && (
                <div className="flex  items-center justify-center">
                  <Spinner />
                </div>
              )}
              {chatMessages.orderedChatMessages?.map(
                (m: processMsgType, index: number) => {
                  if (index == 0) {
                    prevDate = m.message[0].created_at;
                  }
                  const isOneHour = checkTimeDiff(
                    m.message[0].created_at,
                    prevDate,
                    3600
                  );
                  if (!isOneHour) {
                    prevDate = m.message[0].created_at;
                  }

                  return (
                    <div key={m.message[0].created_at}>
                      {index == 0 || !isOneHour ? (
                        <div className="text-center text-secondary-text text-[12px]">
                          <p>{formatedDate(m.message[0].created_at)}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <Message
                        inViewRef={index === 0 ? ref : undefined}
                        img={
                          m.sender_id == context?.user?.id
                            ? context?.user.profile
                            : friendUsers.data?.profile
                        }
                        type={
                          m.sender_id == context?.user?.id ? "sent" : "recieved"
                        }
                        msg={m.message}
                        lastMsg={lastStatusMsg}
                      />
                    </div>
                  );
                }
              )}
            </>
          )}
          {!roomQuery.data?.is_active && !roomQuery.isFetching && (
            <p className="text-secondary-text text-center">
              You cannot message this person
            </p>
          )}

          <div
            onClick={() =>
              msgDivRef.current?.scrollTo(0, msgDivRef.current.scrollHeight)
            }
            className={`fixed w-fit rounded-full bg-second shadow-xl cursor-pointer bottom-32 z-50 left-1/2 -translate-x-1/2 ${
              isShowBottom ? "flex items-center justify-center" : "hidden"
            }`}
          >
            <ScrollBottomIcon size={25} />
          </div>
        </div>
        <div className="mx-10">
          <MessageBox
            isActive={roomQuery.data?.is_active}
            handleMsgSend={(e) =>
              sendMsg(e, sendJsonMessage, roomId, context?.user)
            }
          />
        </div>
      </div>

      {isChatInfoOpen && (
        <div className="w-[33%] flex flex-col h-full">
          <ChatInfo
            friendUsers={friendUsers}
            setIsChatInfoOpen={setIsChatInfoOpen}
          />
        </div>
      )}
    </div>
  );
}
