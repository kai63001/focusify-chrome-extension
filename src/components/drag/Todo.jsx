import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";

const Todo = () => {
  const { bringToFront, getWidgetZIndex } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Todo")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition();

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
        onClick={() => bringToFront("Todo")}
      >
        <div
          id="dragHandle"
          className="text-white px-4 py-2 flex justify-between items-center cursor-move"
        >
          <span>Todo</span>
        </div>
        <div className="p-4">
          <p>Todo content goes here</p>
        </div>
      </div>
    </Draggable>
  );
};

export default Todo;
