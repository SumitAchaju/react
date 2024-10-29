import { useContext, useState } from "react";
import Switch from "../../Switch";
import useThemeDetector from "../../../hooks/themeDetector";
import ThemeContext, {
  themeType,
  systemThemeType,
} from "../../../context/Theme";

type Props = {};

export default function Apperance({}: Props) {
  const [activeState, setActiveState] = useState<systemThemeType>(
    () => (localStorage.getItem("theme") as systemThemeType) || "system"
  );
  const themeContext = useContext(ThemeContext);
  const isDarkSystemTheme = useThemeDetector();

  function handleThemeChange(theme: systemThemeType) {
    const systemTheme = isDarkSystemTheme ? "dark" : "light";
    if (theme == "system") {
      activateTheme("system", systemTheme);
      return;
    }
    activateTheme(theme, theme);
  }

  const activateTheme = (theme: systemThemeType, mainTheme: themeType) => {
    setActiveState(theme);
    themeContext?.setTheme(mainTheme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(mainTheme);
    localStorage.setItem("theme", theme);
  };

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
              onClick={() => handleThemeChange("system")}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-icon-color text-[18px]">Dark Mode</p>
            <Switch
              state={activeState == "dark" && true}
              disable={activeState == "dark" && true}
              onClick={() => handleThemeChange("dark")}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-icon-color text-[18px]">Light Mode</p>
            <Switch
              state={activeState == "light" && true}
              disable={activeState == "light" && true}
              onClick={() => handleThemeChange("light")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
