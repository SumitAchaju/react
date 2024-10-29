import { useContext, FormEvent, useEffect } from "react";
import AuthContext from "../context/Auth";
import { Link, useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { notifyPromise } from "../components/toast/MsgToast";

type Props = {};

export default function Login({}: Props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const api = useAxios();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };
    const login = async () => {
      const res = await api.post("/auth/token/", formData);
      if (res.status !== 200) {
        await Promise.reject(res);
        return;
      }
      localStorage.setItem("access", res.data.access_token);
      localStorage.setItem("refresh", res.data.refresh_token);
      context?.setLoginStatus(true);

      navigate("/");
    };
    await notifyPromise({
      promise: login(),
      msg: "Login Success",
      loading: "Logging in...",
    });
  }

  useEffect(() => {
    if (context?.loginStatus) {
      navigate("/");
    }
  }, [context?.loginStatus]);
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[400px] mt-28">
        <h1 className="text-primary-text text-center text-3xl font-semibold">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="my-5">
            <label
              className="block text-primary-text font-semibold mb-2 text-xl"
              htmlFor="username"
            >
              Username:{" "}
            </label>
            <input
              className="p-4 text-xl block text-primary-text w-full border-2 border-icon-color bg-main rounded-xl"
              type="text"
              name="username"
              id="username"
              required
            />
          </div>
          <div className="my-5">
            <label
              className="block font-semibold mb-2 text-primary-text text-xl"
              htmlFor="password"
            >
              Password:{" "}
            </label>
            <input
              className="p-4 text-xl block text-primary-text w-full border-2 border-icon-color bg-main rounded-xl"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          <div className="text-center">
            <button
              className="text-2xl text-white text-primary-text bg-green-500 py-3 px-7 rounded-xl"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-10">
          <p className="text-xl text-primary-text">
            Didn't have account yet?{" "}
            <Link className="text-blue-600 font-medium" to={"/signup"}>
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
