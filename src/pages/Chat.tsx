import { FormEvent, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/Auth";
import { useQueries } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { userType, messageType } from "../types/fetchTypes";

type Props = {};

export default function Chat({}: Props) {
  const { id } = useParams();
  const [prevId, setPrevId] = useState<string | undefined>(id);
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const socket = useMemo(() => new WebSocket("ws://localhost/ws/"), []);

  const api = useAxios();

  const [usersQuery, msgUserQuery] = useQueries({
    queries: [
      {
        queryKey: ["users"],
        queryFn: async () => {
          const fetch = await api.get("/users/");
          return fetch.data;
        },
      },
      {
        queryKey: ["msgUser"],
        queryFn: async (): Promise<userType> => {
          const fetch = await api.get(`/getuser/?user_id=${id}`);
          return fetch.data;
        },
      },
    ],
  });

  function sendMsg(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const msg = e.currentTarget.message;
    if (msg.value === "") return;
    socket.send(
      JSON.stringify({
        sender_id: context?.user?.id,
        reciever_id: Number(id),
        message_text: msg.value,
      })
    );
    msg.value = "";
    msg.focus();
  }

  const [msg, setMsg] = useState<messageType[]>([]);

  useEffect(() => {
    if (prevId !== id && id) {
      msgUserQuery.refetch();
      setPrevId(id);
    }
    if (context?.user?.id === Number(id)) {
      socket.close();
      navigate("/");
    }
  }, [id]);
  useEffect(() => {
    if (context?.user?.id === Number(id)) return socket.close();
    socket.onmessage = (event: MessageEvent<any>) => {
      const msg = JSON.parse(JSON.parse(event.data));
      setMsg((prev) => [...prev, msg]);
    };
    socket.onopen = () => {
      const token = localStorage.getItem("access");
      socket.send(token ? token : "invalid");
    };
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <h1 className="text-center text-2xl text-white py-5 bg-sky-700 font-bold">
        Chat
      </h1>

      <div className="flex h-[calc(100vh-72px)] text-white">
        <div className="w-1/5 h-full bg-gray-700 py-10">
          <h2 className="text-2xl px-5 mb-5 font-bold">Friends:</h2>
          {usersQuery.isFetched
            ? usersQuery.data?.map((user: userType) =>
                user.id === context?.user?.id ? (
                  ""
                ) : (
                  <div
                    key={user.id}
                    className="py-5 text-xl hover:bg-gray-600 px-5 duration-300 cursor-pointer"
                    onClick={() => {
                      if (user.id === Number(id)) return;
                      navigate(`/chat/${user.id}`);
                    }}
                  >
                    <p className="capitalize">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                )
              )
            : ""}
        </div>
        <div className="w-3/5 h-full bg-gray-600">
          <div className="w-full h-full relative">
            <h2 className="text-2xl capitalize mb-10 p-5 bg-gray-700">
              {msgUserQuery.data?.first_name} {msgUserQuery.data?.last_name}
            </h2>
            <div className="p-5 h-[calc(100%-72px-2.5rem)] scroll-smooth">
              <div className="overflow-y-auto h-full mb-10">
                {msg.map((m: messageType, index) => (
                  <div
                    className={
                      "py-5 px-10 rounded-full max-w-[48%] w-fit my-2 " +
                      `${
                        m.sender_id === context?.user?.id
                          ? "bg-sky-700 ms-auto"
                          : "bg-gray-700 me-auto"
                      }`
                    }
                    key={index}
                  >
                    <p className="break-words">{m.message_text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 w-full p-5">
              <form onSubmit={sendMsg} className="relative mb-4">
                <input
                  type="text"
                  autoFocus
                  className="rounded-lg bg-gray-700 text-xl py-5 px-4 block w-full "
                  name="message"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="bg-sky-800 py-4 px-6 rounded-full top-1/2 absolute -translate-y-1/2 right-1"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="w-1/5 h-full bg-gray-700"></div>
      </div>

      {/* <div className="container">
        <div className="my-5 mx-10">
          <form onSubmit={sendMsg}>
            <label htmlFor="message">Message</label>
            <textarea
              className="block p-5 my-3"
              name="message"
              id="message"
              cols={100}
              rows={10}
            ></textarea>
            <button type="submit" className="bg-sky-600 py-4 px-8 rounded-xl">
              Send
            </button>
          </form>
        </div>
        <div className="my-5 mx-10">
          {msg?.map((data, index) => (
            <div
              key={data.message + index}
              className={`msg rounded-full w-1/3 py-3 px-10 my-5 ${
                data.sender_id === context?.user?.id
                  ? "bg-black me-auto"
                  : "bg-blue-500 ms-auto"
              }`}
            >
              <p key={index} className="text-white">
                {data.message}
              </p>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}
