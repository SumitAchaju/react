import { useContext, useMemo, useState } from "react";
import {
  ApperanceIcon,
  ClipBordXIcon,
  EditIcon,
  IconProps,
  NotificationIcon,
  QuestionIcon,
  SecurityIcon,
  SettingIcon,
} from "../Icons";
import MyModal from "./MyModal";
import EditProfile from "./setting/EditProfile";
import EditNotification from "./setting/EditNotification";
import Apperance from "./setting/Apperance";
import Security from "./setting/Security";
import Help from "./setting/Help";
import AuthContext from "../../context/Auth";

type Props = {};

type activePageType =
  | "editProfile"
  | "notification"
  | "apperance"
  | "security"
  | "help";

export default function Setting({}: Props) {
  const [active, setActive] = useState<activePageType>("editProfile");
  const [isOpen, setIsOpen] = useState(false);
  const ActivePage = useMemo<React.ComponentType>(() => {
    let page = EditProfile;
    switch (active) {
      case "editProfile":
        page = EditProfile;
        break;
      case "notification":
        page = EditNotification;
        break;
      case "apperance":
        page = Apperance;
        break;
      case "security":
        page = Security;
        break;
      case "help":
        page = Help;
        break;
      default:
        page = EditProfile;
    }
    return page;
  }, [active]);

  const context = useContext(AuthContext);

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
    localStorage.removeItem("roomId");
    context?.setLoginStatus(false);
  };
  return (
    <MyModal
      trigger={<SettingIcon />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      modal={
        <div className="flex p-[30px] h-full">
          <div className="flex w-1/3 flex-col justify-between h-full">
            <div className="flex flex-col">
              <SettingIab
                name="Edit Profile"
                type="editProfile"
                active={active}
                Icon={EditIcon}
                setActive={setActive}
              />
              <SettingIab
                name="Notification"
                type="notification"
                active={active}
                Icon={NotificationIcon}
                setActive={setActive}
              />
              <SettingIab
                name="Apperance"
                type="apperance"
                active={active}
                Icon={ApperanceIcon}
                setActive={setActive}
              />
              <SettingIab
                name="Security"
                type="security"
                active={active}
                Icon={SecurityIcon}
                setActive={setActive}
              />
              <SettingIab
                name="Help"
                type="help"
                active={active}
                Icon={QuestionIcon}
                setActive={setActive}
              />
            </div>
            <button onClick={handleLogout}>
              <div className="flex gap-3 items-center p-[15px]">
                <div>
                  <ClipBordXIcon color="var(--red_color)" />
                </div>
                <p className="font-semibold text-[20px] text-red-color">
                  Logout
                </p>
              </div>
            </button>
          </div>
          <div className="w-2/3">
            <ActivePage />
          </div>
        </div>
      }
    />
  );
}

type tabProps = {
  name: string;
  Icon: React.ComponentType<IconProps>;
  active: activePageType;
  type: activePageType;
  setActive: React.Dispatch<React.SetStateAction<activePageType>>;
};
function SettingIab({ name, Icon, active, type, setActive }: tabProps) {
  return (
    <button onClick={() => setActive(type)}>
      <div className="flex gap-3 items-center p-[15px]">
        <div>
          <Icon
            color={active == type ? "var(--red_color)" : "var(--icon_color)"}
          />
        </div>
        <p
          className={
            (active == type ? "text-red-color " : "text-icon-color ") +
            "font-semibold text-[20px]"
          }
        >
          {name}
        </p>
      </div>
    </button>
  );
}
