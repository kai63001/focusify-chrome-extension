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
    const [size, setSize] = useState({ width: 300, height: 400 });

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
        const noteWidget = savedState.find(widget => widget.name === "Note");
        const savedSize = noteWidget?.size || { width: 300, height: 400 };
        setSize(savedSize);
        addWidget("Note", position, savedSize);
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
        setNotes(savedNotes.length > 0 ? savedNotes : [{ title: "New Note", content: "" }]);
    }, [addWidget, position]);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [activeNoteIndex]);

    const addNewNote = () => {
        setNotes([...notes, { title: "New Note", content: "" }]);
        setActiveNoteIndex(notes.length);
    };

    const updateNoteContent = (content) => {
        const updatedNotes = [...notes];
        updatedNotes[activeNoteIndex].content = content;
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
                maxConstraints={[800, 800]}
                className="absolute"
                onResizeStop={(e, data) => {
                    const newSize = { width: data.size.width, height: data.size.height };
                    setSize(newSize);
                    updateWidgetSize("Note", newSize);
                }}
                handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />}
            >
                <div
                    className="absolute bg-[#ED974D]/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
                    style={{ zIndex: 40 + zIndex, width: "100%", height: "100%" }}
                    onClick={() => bringToFront("Note")}
                >
                    <div
                        id="dragHandle"
                        className="bg-[#ED974D] text-white px-4 py-2 flex justify-between items-center cursor-move"
                    >
                        <span>Notes</span>
                        <X
                            size={16}
                            className="cursor-pointer hover:text-gray-200"
                            onClick={() => removeWidget("Note")}
                        />
                    </div>
                    <div className="flex-grow flex">
                        <div className="w-1/3 bg-[#ED974D]/20 p-2 overflow-y-auto">
                            {notes.map((note, index) => (
                                <div
                                    key={index}
                                    className={`p-2 mb-2 cursor-pointer rounded ${
                                        index === activeNoteIndex ? "bg-[#ED974D]/30" : ""
                                    }`}
                                    onClick={() => setActiveNoteIndex(index)}
                                >
                                    <div className="text-sm font-semibold truncate text-[#ED974D]">{note.title}</div>
                                    <div className="text-xs text-[#ED974D]/80 truncate">{note.content}</div>
                                </div>
                            ))}
                            <button
                                onClick={addNewNote}
                                className="w-full mt-2 p-2 bg-[#ED974D] text-white rounded flex items-center justify-center hover:bg-[#E68A3E] transition duration-300"
                            >
                                <Plus size={16} className="mr-1" /> New Note
                            </button>
                        </div>
                        <div className="w-2/3 p-2 flex flex-col">
                            <input
                                type="text"
                                value={notes[activeNoteIndex]?.title || ""}
                                onChange={(e) => {
                                    const updatedNotes = [...notes];
                                    updatedNotes[activeNoteIndex].title = e.target.value;
                                    setNotes(updatedNotes);
                                }}
                                className="bg-transparent border-b border-[#ED974D]/50 mb-2 p-1 outline-none text-[#ED974D] placeholder-[#ED974D]/50"
                                placeholder="Note Title"
                            />
                            <textarea
                                ref={textareaRef}
                                value={notes[activeNoteIndex]?.content || ""}
                                onChange={(e) => updateNoteContent(e.target.value)}
                                className="flex-grow bg-transparent outline-none resize-none text-[#ED974D]/80 placeholder-[#ED974D]/50"
                                placeholder="Start typing..."
                            />
                            <button
                                onClick={() => deleteNote(activeNoteIndex)}
                                className="self-end mt-2 p-1 text-red-500 rounded flex items-center hover:bg-red-500/10 transition duration-300"
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