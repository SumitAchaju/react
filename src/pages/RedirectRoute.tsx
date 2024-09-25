import { Navigate } from "react-router-dom";

type Props = {};

export default function RedirectRoute({}: Props) {
  const roomId = localStorage.getItem("roomId");

  return <Navigate to={`/main/${roomId}`} />;
}
