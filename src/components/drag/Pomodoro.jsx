import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { Play, Pause, RefreshCcw, X } from "lucide-react";
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
  const zIndex = getWidgetZIndex("Pomodoro")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition("Pomodoro");

  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const workerRef = useRef(null);
  const [size, setSize] = useState({ width: 300, height: 200 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const pomodoroWidget = savedState.find(widget => widget.name === "Pomodoro");
    const savedSize = pomodoroWidget?.size || { width: 300, height: 200 };
    setSize(savedSize);
    addWidget("Pomodoro", position, savedSize);
  }, [addWidget, position]);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (isActive && time > 0) {
      workerRef.current.postMessage({ action: "start", time });
    } else {
      workerRef.current.postMessage({ action: "stop" });
      if (time === 0) {
        setIsActive(false);
      }
    }
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setTime(25 * 60);
    setIsActive(false);
    localStorage.setItem("pomodoroTime", (25 * 60).toString());
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
        className="absolute"
        onResizeStop={(e, data) => {
          const newSize = { width: data.size.width, height: data.size.height };
          setSize(newSize);
          updateWidgetSize("Pomodoro", newSize);
        }}
        handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />}
      >
        <div
          className="absolute w-full h-full bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
          onClick={() => bringToFront("Pomodoro")}
        >
          <div
            id="dragHandle"
            className="text-white px-4 py-2 flex justify-between items-ceter cursor-move"
          >
            <span>Pomodoro Timer</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => {
                removeWidget("Pomodoro");
              }}
            />
          </div>
          <div className="p-4 text-center">
            <div className="text-4xl font-bold text-white mb-4">
              {formatTime(time)}
            </div>
            <div className="space-x-2">
              <button
                onClick={toggleTimer}
                className="border-[#ed974d]   border duration-300 hover:bg-[#ed974d]/20 text-white font-bold py-2 px-7 rounded"
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
                  className="duration-300  text-white font-bold py-2 px-4 rounded"
                >
                  <RefreshCcw size={24} className="text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default Pomodoro;
