import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { X, Plus, Trash } from "lucide-react";
import "react-resizable/css/styles.css";

const Note = () => {
  const {
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    addWidget,
    updateWidgetPosition,
    updateWidgetSize,
  } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Note")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition("Note");
  const [notes, setNotes] = useState([]);
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const textareaRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 500 });
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const noteWidget = savedState.find((widget) => widget.name === "Note");
    if (!noteWidget) return;
    const savedSize = noteWidget?.size || { width: 800, height: 500 };
    setSize(savedSize);
    addWidget("Note", position, savedSize);
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    if (savedNotes.length > 0) {
      setNotes(savedNotes);
    } 
  }, [addWidget, position])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeNoteIndex]);

  const addNewNote = () => {
    const newNotes = [{ title: "New Note", content: "" }, ...notes];
    setNotes(newNotes);
    setActiveNoteIndex(0);
  };

  const updateNoteContent = (content) => {
    const updatedNotes = [...notes];
    updatedNotes[activeNoteIndex].content = content;
    setNotes(updatedNotes);
  };

  const updateNoteTitle = (title) => {
    const updatedNotes = [...notes];
    updatedNotes[activeNoteIndex].title = title;
    setNotes(updatedNotes);
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setActiveNoteIndex(Math.min(activeNoteIndex, updatedNotes.length - 1));
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateWidgetPosition("Note", { x: data.x, y: data.y });
      }}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[200, 200]}
        style={{ zIndex: 40 + zIndex }}
        maxConstraints={[800, 800]}
        onResizeStop={(e, data) => {
          const newSize = { width: data.size.width, height: data.size.height };
          setSize(newSize);
          updateWidgetSize("Note", newSize);
        }}
        handle={
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
        }
      >
        <div
          className="absolute w-full h-full bg-[#221B15]/90 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
          onClick={() => bringToFront("Note")}
        >
          <div
            id="dragHandle"
            className="bg-[#3a3a3a]/70 backdrop-blur-lg text-[#e0e0e0] px-4 py-2 flex justify-between items-center cursor-move"
          >
            <span>Notes</span>
            <X
              size={16}
              className="cursor-pointer hover:text-white transition-colors duration-200"
              onClick={() => removeWidget("Note")}
            />
          </div>
          <div className="flex-grow flex">
            <div className="w-1/3 bg-[#333333]/70 backdrop-blur-lg flex flex-col h-full relative">
              <div className="absolute inset-0 overflow-y-auto pb-16">
                <div className="p-2">
                  {notes.map((note, index) => (
                    <div
                      key={index}
                      className={`p-2 mb-2 cursor-pointer rounded ${
                        index === activeNoteIndex ? "bg-[#4a4a4a]" : ""
                      } hover:bg-[#4a4a4a] transition-colors duration-200`}
                      onClick={() => setActiveNoteIndex(index)}
                    >
                      <div className="text-sm font-semibold truncate text-[#e0e0e0]">
                        {note.title}
                      </div>
                      <div className="text-xs text-[#b0b0b0] truncate">
                        {note.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#333333]">
                <button
                  onClick={addNewNote}
                  className="w-full p-2 bg-[#4a4a4a] text-[#e0e0e0] rounded flex items-center justify-center hover:bg-[#5a5a5a] transition-colors duration-200"
                >
                  <Plus size={16} className="mr-1" /> New Note
                </button>
              </div>
            </div>
            <div className="w-2/3 p-2 flex flex-col">
              <input
                type="text"
                disabled={notes.length === 0}
                value={notes[activeNoteIndex]?.title || ""}
                onChange={(e) => updateNoteTitle(e.target.value)}
                className="bg-transparent border-b border-[#4a4a4a] mb-2 p-1 outline-none text-[#e0e0e0] placeholder-[#b0b0b0] focus:border-[#6a6a6a] transition-colors duration-200"
                placeholder="Note Title"
              />
              <textarea
                ref={textareaRef}
                disabled={notes.length === 0}
                value={notes[activeNoteIndex]?.content || ""}
                onChange={(e) => updateNoteContent(e.target.value)}
                className="flex-grow bg-transparent outline-none resize-none text-[#e0e0e0] placeholder-[#b0b0b0]"
                placeholder="Start typing..."
              />
              <button
                onClick={() => deleteNote(activeNoteIndex)}
                className="self-end mt-2 p-1 text-[#ff6b6b] rounded flex items-center hover:bg-[#4a4a4a] transition-colors duration-200"
              >
                <Trash size={16} className="mr-1" /> Delete Note
              </button>
            </div>
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default Note;
