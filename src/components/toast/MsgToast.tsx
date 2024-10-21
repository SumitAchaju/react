import toast, { Toast } from "react-hot-toast";
import { AxiosError } from "../../hooks/useAxios";
import { userType } from "../../types/fetchTypes";

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

export const notifyMsg = (msg: string, senderUser: userType | undefined) => {
  toast.custom(
    () => (
      <div
        className={`max-w-[350px] w-full bg-main rounded-lg pointer-events-auto flex drop-shadow-xl`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={senderUser?.profile}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-[18px] font-medium text-primary-text">
                {senderUser?.first_name} {senderUser?.last_name}
              </p>
              <p className="mt-1 text-[18px] text-primary-text overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px]">
                {msg}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      position: "bottom-right",
    }
  );
};
