import { useState, useEffect } from "react";
import useClockStore from "../../store/useClockStore";
import Draggable from "react-draggable";

const Clock = () => {
  const [time, setTime] = useState("");
  const { mode, quote, position, setPosition, isDraggable } = useClockStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      
      if (mode === 'AM_PM') {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        setTime(`${hours}:${minutes} ${ampm}`);
      } else {
        hours = hours.toString().padStart(2, "0");
        setTime(`${hours}:${minutes}`);
      }
    };

    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [mode]);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const clockContent = (
    <div className="flex flex-col text-center">
      <h1 className="text-white text-[120px] font-bold whitespace-nowrap">{time}</h1>
      <div>
        <p className="text-white text-sm -mt-7 font-bold">{`"${quote}"`}</p>
      </div>
    </div>
  );

  return isDraggable ? (
    <Draggable
      position={position}
      onDrag={handleDrag}
      bounds="parent"
      className="fixed"
      handle=".drag-handle"
    >
      <div className="absolute cursor-move drag-handle  border-2 border-white">
        {clockContent}
      </div>
    </Draggable>
  ) : (
    <div style={{ position: 'absolute', left: position.x, top: position.y }}>
      {clockContent}
    </div>
  );
};

export default Clock;
