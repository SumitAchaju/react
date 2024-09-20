import { ReactNode, createContext, useState } from "react";
import useAxios from "../hooks/useAxios";
import { userType } from "../types/fetchTypes";
import { useQuery } from "@tanstack/react-query";

type Props = {
  children: ReactNode;
};

type contextType = {
  loginStatus: boolean;
  setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
  user: userType;
};

const AuthContext = createContext<contextType | null>(null);
export default AuthContext;

export function AuthProvider({ children }: Props) {
  const api = useAxios();
  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem("access") ? true : false
  );

  const { data, isFetched } = useQuery({
    queryKey: ["getUser"],
    queryFn: () => api.get("/getuser/").then((res) => res.data),
    enabled: loginStatus,
    retry: 2,
  });

  const context: contextType = {
    loginStatus,
    setLoginStatus,
    user: data,
  };
  return (
    <AuthContext.Provider value={context}>
      {isFetched || !loginStatus ? children : null}
    </AuthContext.Provider>
  );
}
