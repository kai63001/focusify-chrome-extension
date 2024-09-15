import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { X, Folder, Globe, ChevronLeft } from "lucide-react";

const Bookmark = () => {
  const { bringToFront, getWidgetZIndex, removeWidget } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Bookmark")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition();
  const [currentPath, setCurrentPath] = useState([]);
  const [rootFolder, setRootFolder] = useState({ children: [] });
  const [currentFolder, setCurrentFolder] = useState({ children: [] });
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const firstTimeCheck = localStorage.getItem("bookmarkFirstTime");
    if (firstTimeCheck === null) {
      setIsFirstTime(true);
      localStorage.setItem("bookmarkFirstTime", "false");
    } else {
      setIsFirstTime(false);
    }
    
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setRootFolder({ children: savedBookmarks });
    setCurrentFolder({ children: savedBookmarks });
  }, []);

  const saveBookmarks = (rootFolder) => {
    localStorage.setItem("bookmarks", JSON.stringify(rootFolder.children));
  };

  const updateNestedBookmarks = (folder, path, newItem) => {
    if (path.length === 0) {
      return { ...folder, children: [...folder.children, newItem] };
    }

    const [currentIndex, ...restPath] = path;
    const updatedChildren = [...folder.children];
    updatedChildren[currentIndex] = updateNestedBookmarks(folder.children[currentIndex], restPath, newItem);

    return { ...folder, children: updatedChildren };
  };

  const addFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const newFolder = { type: "folder", name: folderName, children: [] };
      const updatedRoot = updateNestedBookmarks(rootFolder, currentPath, newFolder);
      setRootFolder(updatedRoot);
      setCurrentFolder(updateNestedBookmarks(currentFolder, [], newFolder));
      saveBookmarks(updatedRoot);
    }
  };

  const addLink = () => {
    const linkName = prompt("Enter link name:");
    const linkUrl = prompt("Enter link URL:");
    if (linkName && linkUrl) {
      const newLink = { type: "link", name: linkName, url: linkUrl };
      const updatedRoot = updateNestedBookmarks(rootFolder, currentPath, newLink);
      setRootFolder(updatedRoot);
      setCurrentFolder(updateNestedBookmarks(currentFolder, [], newLink));
      saveBookmarks(updatedRoot);
    }
  };

  const handleItemClick = (item, index) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, index]);
      setCurrentFolder(item);
    } else if (item.type === "link") {
      window.open(item.url, "_blank");
    }
  };

  const goBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      let newCurrentFolder = rootFolder;
      for (let i = 0; i < newPath.length; i++) {
        newCurrentFolder = newCurrentFolder.children[newPath[i]];
      }
      setCurrentFolder(newCurrentFolder);
    }
  };

  const importBookmarks = () => {
    // Implement bookmark import logic here
    alert("Bookmark import functionality to be implemented");
    setIsFirstTime(false);
    localStorage.setItem("bookmarkFirstTime", "false");
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        className="absolute bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden w-[600px] h-[400px] flex flex-col"
        style={{ zIndex: 40 + zIndex }}
        onClick={() => bringToFront("Bookmark")}
      >
        <div
          id="dragHandle"
          className="text-white px-4 py-2 flex justify-between items-center cursor-move"
        >
          <span>Bookmarks</span>
          <X
            size={16}
            className="cursor-pointer"
            onClick={() => removeWidget("Bookmark")}
          />
        </div>
        <div className="flex-grow overflow-auto p-4">
          {isFirstTime ? (
            <div className="text-white text-center">
              <p>Welcome to Bookmarks! Would you like to import your existing bookmarks?</p>
              <button onClick={importBookmarks} className="bg-blue-500 px-4 py-2 rounded mt-4">
                Import Bookmarks
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button onClick={goBack} disabled={currentPath.length === 0} className="text-white">
                  <ChevronLeft />
                </button>
                <div>
                  <button onClick={addFolder} className="bg-green-500 px-4 py-2 rounded mr-2">Add Folder</button>
                  <button onClick={addLink} className="bg-blue-500 px-4 py-2 rounded">Add Link</button>
                </div>
              </div>
              <ul className="space-y-2">
                {currentFolder.children.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center text-white cursor-pointer hover:bg-gray-700 p-2 rounded"
                    onClick={() => handleItemClick(item, index)}
                  >
                    {item.type === "folder" ? <Folder className="mr-2" /> : <Globe className="mr-2" />}
                    {item.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Bookmark;