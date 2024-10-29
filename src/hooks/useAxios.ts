import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../context/Auth";

const BaseUrl = "http://localhost";

export default function useAxios() {
  const context = useContext(AuthContext);
  const instance = axios.create({
    baseURL: BaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (localStorage.getItem("access")) {
    instance.interceptors.request.use(async (config) => {
      let token = localStorage.getItem("access");

      if (checkTokenExpire(token)) {
        const newToken = await getRefreshToken(localStorage.getItem("refresh"));
        if (newToken.status !== 200) {
          context?.setLoginStatus(false);
          return config;
        }
        localStorage.setItem("access", newToken.data.access_token);
        localStorage.setItem("refresh", newToken.data.refresh_token);
        token = newToken.data.access_token;
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  return instance;
}

function checkTokenExpire(token: string | null) {
  if (token === null) return false;
  const decodedToken = jwtDecode(token);
  const currentDate = new Date();
  return decodedToken.exp !== undefined ? decodedToken.exp * 1000 < currentDate.getTime(): false;
}

async function getRefreshToken(refreshToken: string | null) {
  return await axios.post(BaseUrl + "/auth/token/refresh/", {
    token: refreshToken,
  });
}

export interface AxiosError<T = any, D = any> extends Error {
  config: AxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosResponse<T, D>;
  isAxiosError: boolean;
  toJSON: () => object;
}
