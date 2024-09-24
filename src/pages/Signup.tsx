import { FormEvent, useContext, useEffect } from "react";
import AuthContext from "../context/Auth";
import { useNavigate, Link } from "react-router-dom";
import { extractDataForm } from "../utils/extractData";
import { userType } from "../types/fetchTypes";
import useAxios from "../hooks/useAxios";
import { notifyPromise } from "../components/toast/MsgToast";

type Props = {};

export default function Signup({}: Props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const api = useAxios();

  function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let data: userType = extractDataForm(e);
    const register = async () => {
      const res = await api.post("/account/createuser/", data);
      if (res.status !== 201) {
        Promise.reject(res);
        return;
      }
      localStorage.setItem("access", res.data.access_token);
      localStorage.setItem("refresh", res.data.refresh_token);
      context?.setLoginStatus(true);
      navigate("/");
    };
    notifyPromise({
      promise: register(),
      msg: "Signup Success",
      loading: "Signing up...",
    });
  }
  useEffect(() => {
    if (context?.loginStatus) {
      navigate("/");
    }
  }, [context?.loginStatus]);
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[800px] mt-10">
        <h1 className="text-center text-3xl font-semibold mb-5">Signup</h1>
        <form onSubmit={handleSignUp}>
          <div className="flex gap-10 justify-between">
            <div className="grow">
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="fname"
                >
                  First Name:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="text"
                  name="first_name"
                  id="fname"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="lname"
                >
                  Last Name:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="text"
                  name="last_name"
                  id="lname"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="email"
                >
                  Email:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="email"
                  name="email"
                  id="email"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="address"
                >
                  Address:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="text"
                  name="address"
                  id="address"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="pcode"
                >
                  Country Code:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="number"
                  name="contact_number_country_code"
                  id="pcode"
                  required
                />
              </div>
            </div>
            <div className="grow">
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="pnumber"
                >
                  Contact Number:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="number"
                  name="contact_number"
                  id="pnumber"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="username"
                >
                  Username:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="text"
                  name="username"
                  id="username"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="password"
                >
                  Password:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="password"
                  name="password"
                  id="password"
                  required
                />
              </div>
              <div className="my-5">
                <label
                  className="block font-semibold mb-2 text-xl"
                  htmlFor="superpass"
                >
                  Super Password:
                </label>
                <input
                  className="p-4 text-xl block w-full border-2 border-black rounded-xl"
                  type="password"
                  name="superuser_pass"
                  id="superpass"
                />
              </div>
              <div className="text-center mt-14">
                <button
                  className="text-2xl text-white bg-green-500 py-3 px-7 rounded-xl"
                  type="submit"
                >
                  Signup
                </button>
              </div>
              <div className="text-center mt-10">
                <p className="text-xl">
                  Already have account yet?{" "}
                  <Link className="text-blue-600 font-medium" to={"/login"}>
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
