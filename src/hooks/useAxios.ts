import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import AuthContext from "../context/Auth";

const BaseUrl = "http://localhost";

let isTokenRefreshing = false;
let newTokenPromise: Promise<AxiosResponse<any, any>> | null = null;

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

      if (checkTokenExpire(token) && !isTokenRefreshing) {
        isTokenRefreshing = true;
        newTokenPromise = getRefreshToken()
          .then((newToken) => {
            localStorage.setItem("access", newToken.data.access_token);
            localStorage.setItem("refresh", newToken.data.refresh_token);
            isTokenRefreshing = false;
            newTokenPromise = null;
            return newToken;
          })
          .catch((error) => {
            context?.setLoginStatus(false);
            isTokenRefreshing = false;
            newTokenPromise = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("roomId");
            return error;
          });
      }

      // If token is refreshing, wait for the new token
      if (isTokenRefreshing && newTokenPromise !== null) {
        try {
          const newToken = await newTokenPromise;
          token = newToken.data.access_token;
        } catch (error) {
          const controller = new AbortController();
          config.signal = controller.signal;
          controller.abort();
        }
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
  return decodedToken.exp !== undefined
    ? decodedToken.exp * 1000 < currentDate.getTime()
    : false;
}

async function getRefreshToken() {
  const refreshToken = localStorage.getItem("refresh");
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
