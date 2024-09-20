import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { chatHistoryType, messageType } from "../types/fetchTypes";

const KEY = ["chatHistory"];

export default function useChatHistoryQuery() {
  const api = useAxios();
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const fetch = await api.get("/message/history");
      return fetch.data;
    },
  });

  return { data, isSuccess, isLoading, isError, error };
}

export function useChatHistoryQueryMutation() {
  const queryClient = useQueryClient();

  const updateHistoryData = (msg: messageType) => {
    queryClient.setQueryData(KEY, (prev: chatHistoryType[]) => {
      let historyList = structuredClone(prev);

      historyList.forEach((history, index) => {
        if (history.room.id == msg.room_id) {
          history.message = msg;

          if (msg.status !== "seen") {
            history.quantity += 1;
          }
          const data = historyList.splice(index, 1)[0];
          historyList.unshift(data);

          return;
        }
      });

      return historyList;
    });
  };

  const updateHistoryDataStatus = (msg: messageType[]) => {
    queryClient.setQueryData(KEY, (prev: chatHistoryType[]) => {
      let historyList = structuredClone(prev);
      let update = false;

      historyList.forEach((history) => {
        if (history.message == null) return;
        msg.forEach((m) => {
          if (m.id == history.message.id) {
            history.message = m;
            if (m.status == "seen") {
              history.quantity = 0;
            }
            update = true;
          }
        });
      });
      if (update) {
        return historyList;
      }
      return prev;
    });
  };

  return { updateHistoryData, updateHistoryDataStatus };
}
