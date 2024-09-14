import { useState } from "react";
import Draggable from "react-draggable";
import Pomodoro from "./Pomodoro";

const Controller = () => {
  const [showPomodoro, setShowPomodoro] = useState(false);

  return (
    <>
      <Draggable bounds="parent">
        <div className="absolute bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg overflow-hidden cursor-move">
          <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
            <span>Controller</span>
          </div>
          <div className="p-4">
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {showPomodoro ? "Close" : "Open"} Pomodoro
            </button>
          </div>
        </div>
      </Draggable>
      {showPomodoro && <Pomodoro />}
    </>
  );
};

export default Controller;
