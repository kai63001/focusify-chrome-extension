import { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { Plus, GripVertical, X, Trash } from "lucide-react";

const useTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = () => {
      const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      setTodos(savedTodos);
    };

    loadTodos();
    window.addEventListener("storage", loadTodos);

    return () => {
      window.removeEventListener("storage", loadTodos);
    };
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  return [todos, setTodos];
};

const Todo = () => {
  const {
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    addWidget,
    updateWidgetPosition,
  } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Todo")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition("Todo");
  const [todos, setTodos] = useTodos();
  const [draggedTodo, setDraggedTodo] = useState(null);

  useEffect(() => {
    addWidget("Todo", position);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTodo = useCallback(() => {
    const newTodoItem = { id: Date.now(), text: "", completed: false };
    setTodos((prevTodos) => [...prevTodos, newTodoItem]);
  }, [setTodos]);

  const toggleTodo = useCallback(
    (id) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const updateTodoText = useCallback(
    (id, newText) => {
      setTodos((prevTodos) => {
        if (newText.trim() === "") {
          return prevTodos.filter((todo) => todo.id !== id);
        }
        return prevTodos.map((todo) =>
          todo.id === id ? { ...todo, text: newText } : todo
        );
      });
    },
    [setTodos]
  );

  const checkTodoHasDone = () => {
    return todos.filter((todo) => todo.completed).length;
  };

  const onDragStart = (e, todo) => {
    setDraggedTodo(todo);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", todo.id);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverTodo = todos[index];
    if (draggedTodo.id === draggedOverTodo.id) return;

    const newTodos = todos.filter((todo) => todo.id !== draggedTodo.id);
    newTodos.splice(index, 0, draggedTodo);
    setTodos(newTodos);
  };

  const onDragEnd = () => {
    setDraggedTodo(null);
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateWidgetPosition("Todo", { x: data.x, y: data.y });
      }}
    >
      <div
        className="absolute bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden"
        style={{ zIndex: 40 + zIndex, width: "300px" }}
        onClick={() => bringToFront("Todo")}
      >
        <div
          id="dragHandle"
          className="text-white px-4 py-2 flex justify-between items-center cursor-move bg-[#2C2420]"
        >
          <span>
            Completed items: {todos.filter((todo) => todo.completed).length} /{" "}
            {todos.length}
          </span>
          <X
            size={16}
            className="cursor-pointer"
            onClick={() => {
              removeWidget("Todo");
            }}
          />
        </div>
        <div className="p-4">
          <ul className="space-y-2 mb-4 min-h-[50px]">
            {todos.map((todo, index) => (
              <li
                key={todo.id}
                draggable
                onDragStart={(e) => onDragStart(e, todo)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                className={`flex items-center space-x-2 bg-[#2C2420] p-2 rounded cursor-move ${
                  draggedTodo && draggedTodo.id === todo.id ? "opacity-50" : ""
                }`}
              >
                <GripVertical size={16} className="text-white" />
                <div className="inline-flex items-center">
                  <label className="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-[#ed974d] checked:border-[#ed974d]"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </label>
                </div>
                <input
                  type="text"
                  value={todo.text}
                  onChange={(e) => updateTodoText(todo.id, e.target.value)}
                  className={`flex-grow bg-transparent outline-none ${
                    todo.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                  placeholder="Enter task name"
                />
              </li>
            ))}
          </ul>
          <div></div>
          <div className="flex justify-center items-center space-x-2  duration-1000">
            <button
              onClick={addTodo}
              className="w-full duration-1000 hover:bg-[#ed974d]/20 bg-[#2C2420] text-white p-2 rounded flex items-center justify-center space-x-2"
            >
              <Plus size={20} />
              <span>Add new task</span>
            </button>
            {checkTodoHasDone() > 0 && (
              <button
                onClick={() => {
                  setTodos(todos.filter((todo) => !todo.completed));
                }}
                className="w-10  duration-1000 bg-[#2C2420] text-white p-2 rounded flex items-center justify-center space-x-2"
              >
                <Trash size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Todo;
