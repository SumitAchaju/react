import useAxios from "../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { userType } from "../types/fetchTypes";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/Auth";

type Props = {};

export default function Home({}: Props) {
  const api = useAxios();
  const context = useContext(AuthContext);
  const { data, isFetched } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const fetch = await api.get("/users/");
      return fetch.data;
    },
  });

  return (
    <div>
      <div className="py-8 text-center text-xl font-medium bg-lime-700 text-white">
        <h1>Chat</h1>
      </div>
      <div className="w-[80%] mx-auto my-10">
        {isFetched
          ? data?.map((item: userType) => (
              <div key={item.id} className="flex gap-5 my-5">
                <h2 className="font-medium text-3xl">
                  {item.first_name} {item.last_name}
                </h2>
                <Link
                  className="rounded-full py-4 px-5 text-white bg-green-800"
                  to={`/main/${item.id}`}
                >
                  Chat
                </Link>
              </div>
            ))
          : "loading"}
      </div>
      <div className="w-[80%] mx-auto my-10">
        <button
          type="submit"
          className="py-4 px-5 rounded-full bg-red-600 text-white"
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            context?.setLoginStatus(false);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
