import toast, { Toast } from "react-hot-toast";
import { AxiosError } from "../../hooks/useAxios";

type toastConfigType = Partial<
  Pick<
    Toast,
    | "id"
    | "icon"
    | "duration"
    | "ariaProps"
    | "className"
    | "style"
    | "position"
    | "iconTheme"
  >
>;

export const toastConfig: toastConfigType = {
  duration: 3000,
  position: "top-center",
  className: "text-primary-text bg-second font-medium",
};

const notify = (
  type: "error" | "success" | "loading" | "info" | "dumb",
  msg: string
) => {
  switch (type) {
    case "error":
      toast.error(msg, toastConfig);
      break;
    case "success":
      toast.success(msg, toastConfig);
      break;
    case "loading":
      toast.loading(msg, toastConfig);
      break;
    case "info":
      toast.success(msg, { ...toastConfig, icon: "🤔" });
      break;
    case "dumb":
      toast.success(msg, { ...toastConfig, icon: "🤦" });
  }
};

export default notify;

type notifyPromiseType = {
  msg: string;
  promise: Promise<any>;
  loading?: string;
  error?: string | ((e: AxiosError) => string);
  config?: toastConfigType;
};

export const notifyPromise = ({
  msg,
  promise,
  loading = "loading...",
  error,
  config,
}: notifyPromiseType) => {
  return toast.promise(
    promise,
    {
      loading: loading,
      success: msg,
      error: error
        ? error
        : (error: AxiosError) => {
            if (error.response?.status === 422) {
              return extract_422_error(error);
            }
            if (error.response?.data.detail) {
              return error.response.data.detail;
            }
            return error.message;
          },
    },
    { ...toastConfig, ...config }
  );
};

const extract_422_error = (error: AxiosError) => {
  const location = error.response?.data.detail[0].loc.pop();
  const msg = error.response?.data.detail[0].msg;
  return `${msg} at field "${location}"`;
};
