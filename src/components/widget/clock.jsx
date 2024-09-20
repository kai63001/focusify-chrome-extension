import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col text-center">
      <h1 className="text-white text-[120px] font-bold mt-[5%]">{time}</h1>
      {/* quote simple small text */}
      <div>
        <p className="text-white text-sm -mt-7 font-bold">
          {`“The only way to do great work is to love what you do.”`}
        </p>
      </div>
    </div>
  );
};

export default Clock;
