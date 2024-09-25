import { useContext } from "react";
import AuthContext from "../../../context/Auth";
import useAxios from "../../../hooks/useAxios";
import Button from "../../Button";
import { notifyPromise } from "../../toast/MsgToast";

type Props = {};

export default function Help({}: Props) {
  const context = useContext(AuthContext);
  const api = useAxios();
  const handleDeleteAccount = () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    const promise = async () => {
      const res = await api.delete("/account/delete");
      if (res.status !== 202) {
        Promise.reject(res);
        return;
      }
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
      localStorage.removeItem("roomId");
      context?.setLoginStatus(false);
    };
    notifyPromise({
      promise: promise(),
      msg: "Account Deleted",
      loading: "Deleting Account...",
    });
  };
  return (
    <div className="flex flex-col px-5 justify-between h-full items-end w-full">
      <div className="flex flex-col gap-5">
        <h2 className="text-primary-text text-[25px] tracking-[0.64px] font-medium">
          Terms & Conditions
        </h2>
        <p className="text-icon-color text-[18px]">
          By using this website you have given access to share your profile
          information to all of the user of this web platfrom
        </p>
        <p className="text-icon-color text-[18px]">
          if you need any help you can contact to sumitaachaju@gmail.com with
          detail about problems
        </p>
      </div>
      <div>
        <Button
          onClick={handleDeleteAccount}
          text="Delete Account"
          varient="secondary"
        />
      </div>
    </div>
  );
}
