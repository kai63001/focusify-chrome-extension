import Draggable from "react-draggable";

const Pomodoro = () => {
  return (
    <Draggable bounds="parent">
      <div className="absolute top-20 left-20 z-40 bg-white rounded-lg shadow-lg overflow-hidden cursor-move">
        <div className="bg-red-500 text-white px-4 py-2 flex justify-between items-center">
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
