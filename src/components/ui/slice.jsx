import { useState, useRef, useEffect } from "react";

const Slice = ({ value, onChange, min = 0, max = 100, lock = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    if (lock) return;
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const updateSliderPosition = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, rect.width);
      const newValue = Math.round((x / rect.width) * (max - min) + min);
      onChange(newValue);
    }
  };

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(value, max));
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateSliderPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div
      className={`relative w-full flex items-center rounded-full ${
        lock ? "bg-[#47403b] cursor-not-allowed" : "bg-[#5B514A]"
      }`}
    >
      <div
        ref={sliderRef}
        className={`w-full h-6 bg-[#5B514A] rounded-full overflow-hidden
        ${lock ? "cursor-not-allowed" : "cursor-pointer"} `}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`h-full  rounded-l-full w-full rounded-r-2xl bg-[#F3A951]`}
          style={{ width: `${clamp(percentage + 6, 0, 99)}%` }}
        ></div>
      </div>
      <div
        className={`absolute w-6 h-6 ${
          percentage == 0 ? "bg-[#47403b]" : "bg-[#d68f38]"
        } rounded-full shadow-md transform cursor-pointer `}
        style={{ left: `calc(${clamp(percentage + 3, 0, 95)}% - 8px)` }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Slice;
