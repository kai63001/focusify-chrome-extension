import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";

const Todo = () => {
  const { bringToFront, getWidgetZIndex } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Todo")(useWidgetControllerStore.getState());

  return (
    <Draggable bounds="parent" handle="#dragHandle">
      <div
        className="absolute top-20 left-20 bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
        style={{ zIndex: 40 + zIndex }}
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
