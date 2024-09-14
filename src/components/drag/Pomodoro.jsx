import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import { useEffect, useState } from "react";

const Pomodoro = () => {
  const { bringToFront, getWidgetZIndex } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Pomodoro")(useWidgetControllerStore.getState());
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomPosition = () => {
      const maxWidth = window.innerWidth - 300; // Assuming widget width is 300px
      const maxHeight = window.innerHeight - 200; // Assuming widget height is 200px
      return {
        x: Math.random() * maxWidth,
        y: Math.random() * maxHeight,
      };
    };
    setPosition(randomPosition());
  }, []);

  return (
    <Draggable bounds="parent" handle="#dragHandle" position={position} onStop={(e, data) => setPosition({ x: data.x, y: data.y })}>
      <div
        className="absolute bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
        style={{ zIndex: 40 + zIndex, width: '300px' }}
        onClick={() => bringToFront("Pomodoro")}
      >
        <div id="dragHandle" className="text-white px-4 py-2 flex justify-between items-center cursor-move">
          <span>Pomodoro Timer</span>
        </div>
        <div className="p-4">
          <p>Pomodoro timer content goes here</p>
        </div>
      </div>
    </Draggable>
  );
};

export default Pomodoro;
