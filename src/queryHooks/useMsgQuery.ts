import {
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { useMemo } from "react";
import processMsg, {
  addToProcessMsg,
  processMsgType,
} from "../utils/processMsg";
import { messageType } from "../types/fetchTypes";

export type useMsgQueryType = InfiniteQueryObserverResult<
  InfiniteData<processMsgType[], unknown>
> & {
  orderedChatMessages: processMsgType[] | undefined;
};

const KEY = "messages";
const LIMIT = 20;

export default function useMsgQuery(roomId: string | undefined) {
  const api = useAxios();

  const msgQuery = useInfiniteQuery({
    queryKey: [KEY, roomId],
    queryFn: async ({ pageParam }): Promise<processMsgType[]> => {
      const fetch = await api.get(
        `/message/msg/${roomId}?limit=${LIMIT}&offset=${pageParam}`
      );
      if (fetch.status !== 200) {
        return fetch.data;
      }
      return processMsg(fetch.data);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.reduce((prev, msg) => prev + msg.message.length, 0) < 10)
        return undefined;
      return lastPageParam + LIMIT;
    },
    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000, // Cache unused data for 30 minutes
  });
  const orderedChatMessages = useMemo(
    () => structuredClone(msgQuery.data?.pages)?.reverse().flat(),
    [msgQuery.data]
  );

  return {
    ...msgQuery,
    orderedChatMessages,
  };
}

export function useMsgQueryMutation() {
  const queryClient = useQueryClient();

  const updateMsg = (msg: messageType) => {
    if (queryClient.getQueryData([KEY, msg.room_id]) === undefined) return;
    queryClient.setQueryData(
      [KEY, msg.room_id],
      (prev: InfiniteData<processMsgType[], unknown>) => ({
        pages: [addToProcessMsg(prev.pages.shift(), msg), ...prev.pages],
        pageParams: prev.pageParams.map((param, i, arr) =>
          i === arr.length - 1 ? Number(param) + 1 : param
        ),
      })
    );
  };

  const updateMsgStatus = (msg: messageType[]) => {
    if (queryClient.getQueryData([KEY, msg[0].room_id]) === undefined) return;
    queryClient.setQueryData(
      [KEY, msg[0].room_id],
      (prev: InfiniteData<processMsgType[], unknown>) => {
        let newMsg = structuredClone(prev);
        newMsg.pages.flat().forEach((msgBlock) => {
          msgBlock.message.forEach((m) => {
            msg.forEach((recievedmsg) => {
              if (m.id == recievedmsg.id) {
                m.status = recievedmsg.status;
              }
            });
          });
        });
        return newMsg;
      }
    );
  };

  return { updateMsg, updateMsgStatus };
}
