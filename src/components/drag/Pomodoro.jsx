import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { Play, Pause, RefreshCcw, X } from "lucide-react";


const Pomodoro = () => {
  const { bringToFront, getWidgetZIndex, removeWidget } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Pomodoro")(
    useWidgetControllerStore.getState()
  );
  const [position, setPosition] = useRandomPosition();

  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoroTime");
    if (savedTime) setTime(parseInt(savedTime));

    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem("pomodoroTime", newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
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
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        className="absolute bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
        style={{ zIndex: 40 + zIndex, width: "300px" }}
        onClick={() => bringToFront("Pomodoro")}
      >
        <div
          id="dragHandle"
          className="text-white px-4 py-2 flex justify-between items-ceter cursor-move"
        >
          <span>Pomodoro Timer</span>
          <X size={16} className="cursor-pointer" onClick={()=>{
            removeWidget("Pomodoro")
          }} />
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
    </Draggable>
  );
};

export default Pomodoro;
