import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/Auth";

type Props = {};

export default function ProtectedRoute({}: Props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!context?.loginStatus) {
      navigate("/login");
    }
  }, [context?.loginStatus]);
  return <>{context?.loginStatus ? <Outlet /> : null}</>;
}
