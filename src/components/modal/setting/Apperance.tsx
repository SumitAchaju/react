import { useState } from "react";
import Switch from "../../Switch";
import useThemeDetector from "../../../hooks/themeDetector";

type Props = {};

type theme = "system" | "dark" | "light";

export default function Apperance({}: Props) {
  const [activeState, setActiveState] = useState<theme>("system");
  const isDarkSystemTheme = useThemeDetector();

  function activateSystemTheme(theme: "system") {
    setActiveState(theme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(isDarkSystemTheme ? "dark" : "light");
  }

  function activateTheme(theme: theme) {
    setActiveState(theme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
  }
  return (
    <div className="flex flex-col gap-5 px-5">
      <div>
        <h2 className="text-primary-text text-[25px] pe-5 tracking-[0.64px] font-medium mb-5">
          Theme
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-icon-color text-[18px]">Use System Theme</p>
            <Switch
              state={activeState == "system" && true}
              disable={activeState == "system" && true}
              onClick={() => activateSystemTheme("system")}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-icon-color text-[18px]">Dark Mode</p>
            <Switch
              state={activeState == "dark" && true}
              disable={activeState == "dark" && true}
              onClick={() => activateTheme("dark")}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-icon-color text-[18px]">Light Mode</p>
            <Switch
              state={activeState == "light" && true}
              disable={activeState == "light" && true}
              onClick={() => activateTheme("light")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
