import { Navigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Spinner from "../components/Spinner";
import { useContext, useState } from "react";
import AuthContext from "../context/Auth";
import { useQuery } from "@tanstack/react-query";

type Props = {};

export default function RedirectRoute({}: Props) {
  const context = useContext(AuthContext);

  if (!context?.loginStatus) {
    return <Navigate to="/login" />;
  }

  const [roomId, setRoomId] = useState<string | null>(
    localStorage.getItem("roomId")
  );
  const api = useAxios();

  const initialRoomIdQuery = useQuery({
    queryKey: ["initialRoom"],
    queryFn: () =>
      api.get("/message/initialRoom").then((res) => {
        setRoomId(res.data.id);
        localStorage.setItem("roomId", res.data.id);
        return res.data.id;
      }),
    enabled: !roomId,
  });

  if (!roomId && initialRoomIdQuery.isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Navigate to={`/main/${roomId}`} />;
}
