import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { Play, Pause, RefreshCcw, X, Settings } from "lucide-react";
import "react-resizable/css/styles.css";

const Pomodoro = () => {
  const {
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    addWidget,
    updateWidgetPosition,
    updateWidgetSize,
  } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Pomodoro")(
    useWidgetControllerStore.getState()
  );
  const [position, setPosition] = useRandomPosition("Pomodoro");

  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const workerRef = useRef(null);
  const [size, setSize] = useState({ width: 300, height: 200 });

  const [sessionType, setSessionType] = useState("work");
  const [sessionCount, setSessionCount] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25 * 60,
    shortBreakTime: 5 * 60,
    longBreakTime: 15 * 60,
    longBreakInterval: 4,
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const pomodoroWidget = savedState.find(
      (widget) => widget.name === "Pomodoro"
    );
    if (!pomodoroWidget) return;
    console.log(pomodoroWidget);
    const savedSize = pomodoroWidget?.size || { width: 300, height: 200 };
    setSize(savedSize);
    addWidget("Pomodoro", position, savedSize);

    const savedSettings = JSON.parse(localStorage.getItem("pomodoroSettings"));
    if (savedSettings) setSettings(savedSettings);

    const savedSessionType = localStorage.getItem("pomodoroSessionType");
    if (savedSessionType) setSessionType(savedSessionType);

    const savedSessionCount = localStorage.getItem("pomodoroSessionCount");
    if (savedSessionCount) setSessionCount(parseInt(savedSessionCount));

    const savedTime = localStorage.getItem("pomodoroTime");
    if (savedTime) setTime(parseInt(savedTime));

    workerRef.current = new Worker(
      new URL("../../libs/timerWorker.js", import.meta.url)
    );

    workerRef.current.onmessage = (e) => {
      setTime(e.data.time);
      localStorage.setItem("pomodoroTime", e.data.time.toString());
    };

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [addWidget, position]);

  useEffect(() => {
    if (isActive && time > 0) {
      workerRef.current.postMessage({ action: "start", time });
    } else {
      workerRef.current.postMessage({ action: "stop" });
      if (time === 0) {
        handleSessionEnd();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, time]);

  const handleSessionEnd = () => {
    setIsActive(false);
    if (sessionType === "work") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      localStorage.setItem("pomodoroSessionCount", newSessionCount.toString());

      if (newSessionCount % settings.longBreakInterval === 0) {
        setSessionType("longBreak");
        setTime(settings.longBreakTime);
      } else {
        setSessionType("shortBreak");
        setTime(settings.shortBreakTime);
      }
    } else {
      setSessionType("work");
      setTime(settings.workTime);
    }
    localStorage.setItem("pomodoroSessionType", sessionType);
    localStorage.setItem("pomodoroTime", time.toString());
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setTime(settings.workTime);
    setIsActive(false);
    setSessionType("work");
    setSessionCount(0);
    localStorage.setItem("pomodoroTime", settings.workTime.toString());
    localStorage.setItem("pomodoroSessionType", "work");
    localStorage.setItem("pomodoroSessionCount", "0");
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
    if (sessionType === "work") setTime(newSettings.workTime);
    else if (sessionType === "shortBreak") setTime(newSettings.shortBreakTime);
    else setTime(newSettings.longBreakTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateWidgetPosition("Pomodoro", { x: data.x, y: data.y });
      }}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        style={{ zIndex: 40 + zIndex }}
        minConstraints={[200, 150]}
        maxConstraints={[400, 300]}
        className="fixed"
        onResizeStop={(e, data) => {
          const newSize = { width: data.size.width, height: data.size.height };
          setSize(newSize);
          updateWidgetSize("Pomodoro", newSize);
        }}
        handle={
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.5 16v-1.5H16V16h-4.5zM8 16v-1.5h1.5V16H8zm-3.5 0v-1.5H6V16H4.5zM16 12.5h-1.5V16H16v-3.5zM16 9h-1.5v1.5H16V9zM16 5.5h-1.5V7H16V5.5z" />
            </svg>
          </div>
        }
      >
        <div
          className="absolute w-full h-full bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
          onClick={() => bringToFront("Pomodoro")}
        >
          <div
            id="dragHandle"
            className="text-white px-4 py-2 flex justify-between items-center cursor-move"
          >
            <span>Pomodoro Timer ({sessionType})</span>
            <div className="flex items-center space-x-2">
              <Settings
                size={16}
                className="cursor-pointer"
                onClick={() => setShowSettings(!showSettings)}
              />
              <X
                size={16}
                className="cursor-pointer"
                onClick={() => removeWidget("Pomodoro")}
              />
            </div>
          </div>
          {showSettings ? (
            <div className="p-4 text-white">
              <h3 className="font-bold mb-2">Settings</h3>
              <div className="space-y-2">
                <div>
                  <label>Work Time (minutes): </label>
                  <input
                    type="number"
                    value={settings.workTime / 60}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        workTime: e.target.value * 60,
                      })
                    }
                    className="w-16 text-black px-1"
                  />
                </div>
                <div>
                  <label>Short Break (minutes): </label>
                  <input
                    type="number"
                    value={settings.shortBreakTime / 60}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        shortBreakTime: e.target.value * 60,
                      })
                    }
                    className="w-16 text-black px-1"
                  />
                </div>
                <div>
                  <label>Long Break (minutes): </label>
                  <input
                    type="number"
                    value={settings.longBreakTime / 60}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        longBreakTime: e.target.value * 60,
                      })
                    }
                    className="w-16 text-black px-1"
                  />
                </div>
                <div>
                  <label>Long Break Interval: </label>
                  <input
                    type="number"
                    value={settings.longBreakInterval}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        longBreakInterval: parseInt(e.target.value),
                      })
                    }
                    className="w-16 text-black px-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {formatTime(time)}
              </div>
              <div className="space-x-2">
                <button
                  onClick={toggleTimer}
                  className="border-[#ed974d] border duration-300 hover:bg-[#ed974d]/20 text-white font-bold py-2 px-7 rounded"
                >
                  {isActive ? (
                    <Pause size={24} className="text-[#ed974d]" />
                  ) : (
                    <Play size={24} className="text-[#ed974d]" />
                  )}
                </button>
                {!isActive && (
                  <button
                    onClick={resetTimer}
                    className="duration-300 text-white font-bold py-2 px-4 rounded"
                  >
                    <RefreshCcw size={24} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default Pomodoro;
