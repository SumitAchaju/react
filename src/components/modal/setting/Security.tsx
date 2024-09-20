import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../Button";
import Input from "../../Input";
import Switch from "../../Switch";
import useAxios from "../../../hooks/useAxios";
import notify, { notifyPromise } from "../../toast/MsgToast";

type Props = {};

export default function Security({}: Props) {
  const queryClient = useQueryClient();
  const api = useAxios();
  const updateUsernameMutation = useMutation({
    mutationKey: ["updateUsername"],
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await api.put("/account/updateusername", data);
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });
  const updatePasswordMutation = useMutation({
    mutationKey: ["updatePassword"],
    mutationFn: async (data: { old: string; new: string }) => {
      const res = await api.put("/account/updatepassword", data);
      return res.data;
    },
  });
  const handleUsernameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };
    notifyPromise({
      promise: updateUsernameMutation.mutateAsync(data),
      msg: "Username Updated",
      loading: "Updating Username...",
    });
  };
  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      old: e.currentTarget.oldpassword.value,
      new: e.currentTarget.newpassword.value,
    };
    if (data.new !== e.currentTarget.confirmpassword.value) {
      notify("dumb", "Password does not match");
      return;
    }
    notifyPromise({
      promise: updatePasswordMutation.mutateAsync(data),
      msg: "Password Updated",
      loading: "Updating Password...",
    });
  };
  return (
    <div className="flex flex-col px-5 gap-10 w-full">
      <div className="flex flex-col gap-3">
        <h2 className="text-primary-text text-[25px] tracking-[0.64px] font-medium">
          Encryption
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-icon-color text-[18px]">
            Use end to end encryption
          </p>
          <Switch state={false} />
        </div>
      </div>
      <form
        onSubmit={handleUsernameSubmit}
        className="flex flex-col gap-4 items-end"
      >
        <div className="flex gap-5">
          <Input name="username" labelname="New Username" required />
          <Input
            name="password"
            labelname="Authorize Password"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          text="Change"
          varient="primary"
          className="w-fit"
        />
      </form>
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <div className="flex gap-5">
          <Input
            name="oldpassword"
            labelname="Old Password"
            type="password"
            required
          />
          <Input
            name="newpassword"
            labelname="New Password"
            type="password"
            required
          />
        </div>
        <div className="flex gap-5 items-end">
          <Input
            name="confirmpassword"
            labelname="Confirm Password"
            type="password"
            required
          />
          <Button
            type="submit"
            text="Change"
            varient="primary"
            className="w-fit"
          />
        </div>
      </form>
    </div>
  );
}
