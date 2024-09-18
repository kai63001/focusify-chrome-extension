import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import Switch from "../ui/switch";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import ClockSetting from "./clock/ClockSetting";

const Settings = () => {
  const { addWidget, removeWidget, isWidgetOpen } = useWidgetControllerStore();
  const state = useWidgetControllerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showClockSettings, setShowClockSettings] = useState(false);

  const toggleClock = () => {
    const isOpen = isWidgetOpen("Clock")(state);
    if (isOpen) {
      removeWidget("Clock");
    } else {
      addWidget("Clock");
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
        <div className="absolute bottom-14 -mr-3 right-0 mt-2 w-48 bg-[#221B15]/70 backdrop-blur-lg rounded-md shadow-lg py-1 overflow-hidden">
          {showClockSettings ? (
            <ClockSetting onBack={() => setShowClockSettings(false)} />
          ) : (
            <ul className="animate-slide-right">
              <li
                onClick={toggleClock}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer flex justify-between items-center"
              >
                <span className="pointer-events-none">Clock</span>
                <Switch isOn={isWidgetOpen("Clock")(state)} />
              </li>
              <div className="h-px w-full bg-white/10"></div>
              <li
                onClick={() => setShowClockSettings(true)}
                className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
              >
                <span className="pointer-events-none">Clock Settings</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
