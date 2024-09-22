import { lazy, Suspense } from "react";

// Dragable Widgets
const Pomodoro = lazy(() => import("./Pomodoro"));
const Todo = lazy(() => import("./Todo"));
const Bookmark = lazy(() => import("./Bookmark"));
const Note = lazy(() => import("./Note"));
const PriceTable = lazy(() => import("../modal/PricingTable"));
const Soundscape = lazy(() => import("./Soundscape"));
// Un-Dragable Widgets
const Clock = lazy(() => import("../widget/clock"));
const Settings = lazy(() => import("../widget/settings"));
const User = lazy(() => import("../widget/user"));
const QuickLink = lazy(() => import("../widget/quickLink"));

// Icons
import { House, Timer, Folder, FileText, FileCheck, AudioLines } from "lucide-react";

// Store
import useWidgetControllerStore from "../../store/widgetControllerStore";

// Hooks
import { useEffect } from "react";
import BackgroundSetting from "./BackgroundSetting";

const Controller = () => {
  const {
    addWidget,
    removeAllWidgets,
    removeWidget,
    isWidgetOpen,
    bringToFront,
    initializeFromLocalStorage,
  } = useWidgetControllerStore();
  const state = useWidgetControllerStore();

  useEffect(() => {
    initializeFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      name: "Bookmark",
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
    {
      name: "Note",
      icon: <FileText size={24} />,
    },
    {
      name: "Soundscape",
      icon: <AudioLines size={24} />,
    },
  ];

  return (
    <div className="h-full w-full select-none overflow-hidden">
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
            <button
              onClick={() => {
                removeAllWidgets();
              }}
              className="text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10"
            >
              <House size={24} />
            </button>
            <div className="mx-10 h-6 w-px bg-white/30"></div>
            <div className="flex justify-center items-center space-x-1">
              {listMiddleMenu.map((item, index) => (
                <button
                  key={index}
                  className={`text-white text-md font-bold px-2 py-1 rounded-md hover:bg-white/10 ${
                    isWidgetOpen(item.name)(state) ? "bg-white/10" : ""
                  }`}
                  onClick={() => toggleWidget(item.name)}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>
          {/* end with user settings */}
          <div className="flex items-center space-x-1">
            <User />
            <Settings />
          </div>
        </div>
      </div>
      {/* Wrap dynamic components with Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        {isWidgetOpen("Pomodoro")(state) && <Pomodoro />}
        {isWidgetOpen("Todo")(state) && <Todo />}
        {isWidgetOpen("Bookmark")(state) && <Bookmark />}
        {isWidgetOpen("Note")(state) && <Note />}
        {isWidgetOpen("Background")(state) && (
          <BackgroundSetting
            onClose={() => {
              toggleWidget("Background");
            }}
          />
        )}
        {isWidgetOpen("Soundscape")(state) && <Soundscape />}
        {isWidgetOpen("PricingTable")(state) && (
          <PriceTable
            onClose={() => {
              toggleWidget("PricingTable");
            }}
          />
        )}
        {isWidgetOpen("Clock")(state) && <Clock />}
        {isWidgetOpen("QuickLink")(state) && <QuickLink />}
      </Suspense>
    </div>
  );
};

export default Controller;
