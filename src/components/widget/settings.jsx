import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import Switch from "../ui/switch";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import ClockSetting from "./clock/ClockSetting";
import QuickLinkSetting from "./quickLink/QuickLinkSetting";

const Settings = () => {
  const { addWidget, removeWidget, isWidgetOpen, setRememberWidgetPosition } =
    useWidgetControllerStore();
  const state = useWidgetControllerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);

  const toggleWidget = (widgetName) => {
    const isOpen = isWidgetOpen(widgetName)(state);
    if (isOpen) {
      removeWidget(widgetName);
    } else {
      addWidget(widgetName);
    }
  };

  return (
    <div className="relative select-none">
      <button
        className="text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <SettingsIcon size={24} />
      </button>
      {isOpen && (
        <div className="absolute bottom-14 -mr-3 right-0 mt-2 w-96 bg-[#221B15]/70 backdrop-blur-lg rounded-md shadow-lg py-1 overflow-hidden">
          {currentSetting === "clock" ? (
            <ClockSetting onBack={() => setCurrentSetting(null)} />
          ) : currentSetting === "quickLink" ? (
            <QuickLinkSetting onBack={() => setCurrentSetting(null)} />
          ) : (
            <ul>
              <li
                onClick={() => toggleWidget("Clock")}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex justify-between items-center"
              >
                <span className="pointer-events-none">Clock</span>
                <Switch isOn={isWidgetOpen("Clock")(state)} />
              </li>
              <li
                onClick={() => toggleWidget("QuickLink")}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex justify-between items-center"
              >
                <span className="pointer-events-none">Quick Link</span>
                <Switch isOn={isWidgetOpen("QuickLink")(state)} />
              </li>
              <li
                onClick={() => setRememberWidgetPosition(!state.rememberWidgetPosition)}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex justify-between items-center"
              >
                <span className="pointer-events-none">
                  Remember Positions
                </span>
                <Switch isOn={state.rememberWidgetPosition} />
              </li>
              <div className="h-px w-full bg-white/10"></div>
              <li
                onClick={() => setCurrentSetting("clock")}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <span className="pointer-events-none">Clock Settings</span>
              </li>
              <li
                onClick={() => setCurrentSetting("quickLink")}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <span className="pointer-events-none">Quick Link Settings</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
