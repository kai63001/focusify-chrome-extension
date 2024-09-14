// Widgets
import Pomodoro from "./Pomodoro";
import Todo from "./Todo";
import { House, Settings, Timer, Folder } from "lucide-react";

// Store
import useWidgetControllerStore from "../../store/widgetControllerStore";
import { FileCheck } from "lucide-react";

const Controller = () => {
  const { addWidget, removeWidget, isWidgetOpen, bringToFront } =
    useWidgetControllerStore();
  const state = useWidgetControllerStore();

  const toggleWidget = (widgetName) => {
    const isOpen = isWidgetOpen(widgetName)(state);
    if (isOpen) {
      removeWidget(widgetName);
    } else {
      addWidget(widgetName);
      bringToFront(widgetName);
    }
  };

  const listMiddleMenu = [
    {
      name: "Folder",
      icon: <Folder size={24} />,
    },
    {
      name: "Pomodoro",
      icon: <Timer size={24} />,
    },
    {
      name: "Todo",
      icon: <FileCheck size={24} />,
    },
  ];

  return (
    <>
      <div className="absolute bottom-4 left-0 z-50 w-full flex justify-center items-center px-4">
        <div className="p-3 bg-[#221B15]/70 backdrop-blur-lg rounded-lg w-full flex justify-between items-center">
          {/* start with time format with AM AND PM */}
          <div className="text-white text-md font-bold">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          {/* main center is a controller compoenent */}
          <div className="flex justify-center items-center space-x-5">
            <button className="text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10">
              <House size={24} />
            </button>
            <div className="mx-10 h-6 w-px bg-white/30"></div>
            <div className="flex justify-center items-center space-x-1">
            {listMiddleMenu.map((item, index) => (
              <button
                key={index}
                className="text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10"
              >
                {item.icon}
              </button>
            ))}
            </div>
          </div>
          {/* end with user settings */}
          <div className="text-white text-md font-bold">
            <button onClick={() => toggleWidget("Settings")}>
              <Settings size={24} />
            </button>
          </div>
        </div>
      </div>
      {isWidgetOpen("Pomodoro")(state) && <Pomodoro />}
      {isWidgetOpen("Todo")(state) && <Todo />}
    </>
  );
};

export default Controller;
