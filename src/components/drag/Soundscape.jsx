import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { X, Lock } from "lucide-react";
import "react-resizable/css/styles.css";
import useSoundScapeStore from "../../store/useSoundScapeStore";
import Slice from "../ui/slice";
import useUserDataStore from "../../store/userDataStore";
const Soundscape = () => {
  const {
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    addWidget,
    updateWidgetPosition,
    updateWidgetSize,
  } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Soundscape")(
    useWidgetControllerStore.getState()
  );
  const [position, setPosition] = useRandomPosition("Soundscape");
  const { premium } = useUserDataStore();

  const { sounds, setSounds } = useSoundScapeStore();

  useEffect(() => {
    // Initialize sounds in the store if they're not already set
    if (sounds.length === 0) {
      setSounds([
        { name: "rain", volume: 0 },
        { name: "train", volume: 0, premium: true },
        { name: "wind", volume: 0, premium: true },
        { name: "fire", volume: 0, premium: true },
        { name: "forest", volume: 0, premium: true },
        { name: "ocean", volume: 0, premium: true },
      ]);
    }
  }, [sounds, setSounds]);

  const changeVolume = (soundName, newVolume) => {
    setSounds(
      sounds.map((sound) =>
        sound.name === soundName
          ? { ...sound, volume: parseInt(newVolume) }
          : sound
      )
    );
  };

  const [size, setSize] = useState({ width: 318, height: 318 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const soundscapeWidget = savedState.find(
      (widget) => widget.name === "Soundscape"
    );
    if (!soundscapeWidget) return;
    const savedSize = soundscapeWidget?.size || { width: 318, height: 318 };
    setSize(savedSize);
    addWidget("Soundscape", position, savedSize);
  }, [addWidget, position]);

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateWidgetPosition("Soundscape", { x: data.x, y: data.y });
      }}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        style={{ zIndex: 40 + zIndex }}
        minConstraints={[200, 200]}
        maxConstraints={[400, 600]}
        className="fixed"
        onResizeStop={(e, data) => {
          const newSize = { width: data.size.width, height: data.size.height };
          setSize(newSize);
          updateWidgetSize("Soundscape", newSize);
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
          onClick={() => bringToFront("Soundscape")}
        >
          <div
            id="dragHandle"
            className="text-white px-4 py-2 flex justify-between items-center cursor-move"
          >
            <span>Ambient sound</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => {
                removeWidget("Soundscape");
              }}
            />
          </div>
          <p className="text-sm text-yellow-400 px-4">
            Upgrade to Premium to use ambient sounds
          </p>
          <div className="p-4 flex flex-col space-y-4">
            {sounds.map((sound) => (
              <div key={sound.name} className="grid grid-cols-12">
                <span className="col-span-4 capitalize flex items-center space-x-2">
                  <span>{sound.name}</span>
                  {sound.premium && !premium && <Lock size={16} />}
                </span>
                <div className="col-span-8">
                  <Slice
                    value={sound.volume}
                    lock={sound.premium && !premium}
                    onChange={(value) => changeVolume(sound.name, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default Soundscape;
