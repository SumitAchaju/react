import { useContext } from "react";
import AuthContext from "../context/Auth";
import { Navigate } from "react-router-dom";

type Props = {};

export default function RedirectRoute({}: Props) {
  const context = useContext(AuthContext);
  const roomId = localStorage.getItem("roomId");
  if (!roomId) {
    context?.setLoginStatus(false);
  }
  return <Navigate to={`/main/${roomId}`} />;
}
