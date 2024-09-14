import Draggable from "react-draggable";

// Widgets
import Pomodoro from "./Pomodoro";
import Todo from "./Todo";

// Store
import useWidgetControllerStore from "../../store/widgetControllerStore";

const Controller = () => {
  const { addWidget, removeWidget, isWidgetOpen, bringToFront } = useWidgetControllerStore();
  const state = useWidgetControllerStore();

  const toggleWidget = (widgetName) => {
    const isOpen = isWidgetOpen(widgetName)(state);
    if (isOpen) {
      removeWidget(widgetName);
    } else {
      addWidget(widgetName);
      bringToFront(widgetName);
    }
  };

  return (
    <>
      <Draggable bounds="parent">
        <div className="absolute bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg overflow-hidden cursor-move">
          <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
            <span>Controller</span>
          </div>
          <div className="p-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => toggleWidget("Pomodoro")}
            >
              {isWidgetOpen("Pomodoro")(state) ? "Close" : "Open"} Pomodoro
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => toggleWidget("Todo")}
            >
              {isWidgetOpen("Todo")(state) ? "Close" : "Open"} Todo
            </button>
          </div>
        </div>
      </Draggable>
      {isWidgetOpen("Pomodoro")(state) && <Pomodoro />}
      {isWidgetOpen("Todo")(state) && <Todo />}
    </>
  );
};

export default Controller;
