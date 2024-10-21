import { FormEvent, useRef, useState } from "react";
import Button from "../../Button";
import { EditIcon } from "../../Icons";
import Input from "../../Input";
import ProfilePic from "../../ProfilePic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userType } from "../../../types/fetchTypes";
import useAxios from "../../../hooks/useAxios";
import notify, { notifyPromise } from "../../toast/MsgToast";

type Props = {};

export default function EditProfile({}: Props) {
  const queryClient = useQueryClient();
  const [profilePic, setProfilePic] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFilePick = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfilePic(reader.result as string);
      };
    }
  };
  const api = useAxios();
  const profilePicUpdate = useMutation({
    mutationKey: ["updateProfilePic"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("uploaded_file", file as Blob);
      const res = await api.post("/account/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });

  const profileDataMutation = useMutation({
    mutationKey: ["updateProfileData"],
    mutationFn: async (form: FormData) => {
      const res = await api.patch("/account/updateuser", form);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] });
    },
  });
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];
    if (!file && !checkFormDataChange(userData, formData)) {
      notify("dumb", "No data changed");
      return;
    }
    const promise = async (form: FormData) => {
      if (file) {
        await profilePicUpdate.mutateAsync(file);
      }
      if (checkFormDataChange(userData, form)) {
        await profileDataMutation.mutateAsync(form);
      }
    };
    notifyPromise({
      promise: promise(formData),
      msg: "Profile Updated",
      loading: "Saving...",
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    formRef.current?.reset();
  };

  const userData = queryClient.getQueryData<userType>(["getUser"]);

  return (
    <div className="flex flex-col px-5 w-full">
      <div className="flex justify-between items-start">
        <h2 className="text-primary-text text-[25px] tracking-[0.64px] font-medium">
          Edit Profile
        </h2>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFilePick}
          />
          <button onClick={() => fileInputRef.current?.click()}>
            <ProfilePic
              image={profilePic !== "" ? profilePic : userData?.profile}
              size={80}
              circle={false}
              active={false}
            />
          </button>
          <div className="absolute bottom-0 right-0 rounded-full bg-red-color p-1">
            <EditIcon color="white" size={14} />
          </div>
        </div>
      </div>
      <div className="w-full grow h-full">
        <form
          className="flex flex-col w-full h-full gap-2"
          onSubmit={handleFormSubmit}
          ref={formRef}
        >
          <div className="flex gap-5 w-full">
            <Input
              name="first_name"
              labelname="First Name"
              defaultValue={userData?.first_name}
              required
            />
            <Input
              name="last_name"
              labelname="Last Name"
              defaultValue={userData?.last_name}
              required
            />
          </div>
          <Input
            name="email"
            labelname="Email"
            type="email"
            defaultValue={userData?.email}
            required
          />
          <Input
            name="address"
            labelname="Address"
            defaultValue={userData?.address}
            required
          />
          <Input
            name="contact_number"
            disabled
            labelname="Contact Number"
            defaultValue={`+${userData?.contact_number_country_code} ${userData?.contact_number}`}
            required
          />
          <div className="flex gap-5 justify-end mt-5">
            <Button
              type="submit"
              className="text-[15px]"
              text="Save"
              varient="primary"
            />
            <Button
              type="button"
              onClick={handleCancel}
              text="Cancel"
              varient="secondary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

const checkFormDataChange = (
  userData: userType | undefined,
  formData: FormData
) => {
  let changed = false;
  if (userData === undefined) return changed;
  for (let [key, value] of formData.entries()) {
    if (key === "contact_number") {
      break;
    }
    if (key === "email" && String(value).toLocaleLowerCase() === userData.email)
      continue;
    if (userData[key as keyof userType] !== value) {
      changed = true;
      break;
    }
  }
  return changed;
};
