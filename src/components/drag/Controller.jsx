import { lazy, Suspense } from "react";

// Dragable Widgets
const Pomodoro = lazy(() => import("./Pomodoro"));
const Todo = lazy(() => import("./Todo"));
const Bookmark = lazy(() => import("./Bookmark"));
const Note = lazy(() => import("./Note"));
const PriceTable = lazy(() => import("../modal/PricingTable"));
const Soundscape = lazy(() => import("./soundscape"));
// Un-Dragable Widgets
const Clock = lazy(() => import("../widget/clock"));
const Settings = lazy(() => import("../widget/settings"));
const User = lazy(() => import("../widget/user"));
const QuickLink = lazy(() => import("../widget/quickLink"));
const Music = lazy(() => import("./Music"));
const MusicPlayerController = lazy(() =>
  import("../controller/MusicPlayer.controller")
);
// Controller
const SoundscapeController = lazy(() =>
  import("../controller/Soundscape.controller")
);
const MusicController = lazy(() => import("../controller/Music.controller"));

// Icons
import {
  House,
  Timer,
  Folder,
  FileText,
  FileCheck,
  AudioLines,
  Music as MusicIcon,
} from "lucide-react";

// Store
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useSoundScapeStore from "../../store/useSoundScapeStore";
import useMusicStore from "../../store/useMusicStore";
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
  const stateSoundScape = useSoundScapeStore();
  const { isPlaying, currentTrackIndex, playlist } = useMusicStore();

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
      name: "Music",
      icon: <MusicIcon size={24} />,
    },
    {
      name: "Soundscape",
      icon: <AudioLines size={24} />,
    },
  ];

  const soundPlaying = stateSoundScape.sounds.find((sound) => sound.volume > 0);

  return (
    <div className="h-full w-full select-none overflow-hidden">
      <div className="absolute bottom-4 left-0 z-50 w-full flex justify-center items-center px-4">
        <div className="p-3 bg-[#221B15]/70 backdrop-blur-lg rounded-lg w-full flex justify-between items-center">
          {/* Left section */}
          <div className="flex-1 flex items-center space-x-2 min-w-0">
            <div className="text-white text-md font-bold whitespace-nowrap">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            {soundPlaying && (
              <>
                <span className="whitespace-nowrap">·</span>
                <div className="text-white text-md font-bold whitespace-nowrap">
                  Ambient sound
                </div>
              </>
            )}
            {isPlaying && (
              <>
                <span className="whitespace-nowrap">·</span>
                <p className="text-white text-md font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                  {playlist.length > currentTrackIndex
                    ? playlist[currentTrackIndex].title
                    : "No track playing"}
                </p>
              </>
            )}
          </div>
          
          {/* Center section */}
          <div className="flex-1 flex justify-center items-center space-x-5">
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
            <div className="mx-10 h-6 w-px bg-white/30"></div>
            <MusicPlayerController />
          </div>
          
          {/* Right section */}
          <div className="flex-1 flex items-center justify-end space-x-1">
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
        {isWidgetOpen("Music")(state) && <Music />}
      </Suspense>
      <SoundscapeController />
      <MusicController />
    </div>
  );
};

export default Controller;
