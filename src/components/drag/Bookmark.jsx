import React, { useState, useEffect, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { X, Folder, Globe, ChevronLeft, Edit, Trash } from "lucide-react";

const Bookmark = () => {
  const { bringToFront, getWidgetZIndex, removeWidget } =
    useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Bookmark")(
    useWidgetControllerStore.getState()
  );
  const [position, setPosition] = useRandomPosition();
  const [currentPath, setCurrentPath] = useState([]);
  const [rootFolder, setRootFolder] = useState({ children: [] });
  const [currentFolder, setCurrentFolder] = useState({ children: [] });
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const editInputRef = useRef(null);
  const bookmarkRef = useRef(null);

  const sortItems = (items) => {
    return items.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a?.name?.localeCompare(b?.name);
    });
  };

  useEffect(() => {
    const checkFirstTimeAndImport = async () => {
      const firstTimeCheck = localStorage.getItem("bookmarkFirstTime");
      if (firstTimeCheck === null) {
        setIsFirstTime(true);
      } else {
        setIsFirstTime(false);
        // Load saved bookmarks as before
        const savedBookmarks = JSON.parse(
          localStorage.getItem("bookmarks") || "[]"
        );
        const sortedBookmarks = sortItems(savedBookmarks);
        setRootFolder({ children: sortedBookmarks });
        setCurrentFolder({ children: sortedBookmarks });
      }
    };

    checkFirstTimeAndImport();
  }, []);

  useEffect(() => {
    if (editingItem && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingItem]);

  const saveBookmarks = (rootFolder) => {
    localStorage.setItem(
      "bookmarks",
      JSON.stringify(sortItems(rootFolder.children))
    );
  };

  const updateNestedBookmarks = (folder, path, newItem) => {
    if (path.length === 0) {
      const updatedChildren = sortItems([...folder.children, newItem]);
      return { ...folder, children: updatedChildren };
    }

    const [currentIndex, ...restPath] = path;
    const updatedChildren = [...folder.children];
    updatedChildren[currentIndex] = updateNestedBookmarks(
      folder.children[currentIndex],
      restPath,
      newItem
    );

    return { ...folder, children: updatedChildren };
  };

  const addFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const newFolder = { type: "folder", name: folderName, children: [] };
      const updatedRoot = updateNestedBookmarks(
        rootFolder,
        currentPath,
        newFolder
      );
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
      const updatedRoot = updateNestedBookmarks(
        rootFolder,
        currentPath,
        newLink
      );
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
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["importedBookmarks"], (result) => {
      if (result.importedBookmarks) {
        const data = result.importedBookmarks[0];
        setRootFolder(data);
        setCurrentFolder(data);
        saveBookmarks(data);
        setIsFirstTime(false);
        localStorage.setItem("bookmarkFirstTime", "false");
      } else {
        alert("No bookmarks found to import.");
      }
    });
  };

  const handleContextMenu = useCallback((e, item, index) => {
    e.preventDefault();
    const rect = bookmarkRef.current.getBoundingClientRect();
    setContextMenu({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      item,
      index,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookmarkRef.current && !bookmarkRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeContextMenu]);

  const handleEdit = () => {
    setEditingItem(contextMenu.item);
    setContextMenu(null);
  };

  const handleDelete = () => {
    setDeleteConfirmation(contextMenu.item);
    setContextMenu(null);
  };

  const confirmDelete = () => {
    const updatedChildren = currentFolder.children.filter(
      (_, index) => index !== contextMenu.index
    );
    const updatedRoot = updateNestedBookmarks(
      rootFolder,
      currentPath.slice(0, -1),
      { ...currentFolder, children: updatedChildren }
    );
    setRootFolder(updatedRoot);
    setCurrentFolder({ ...currentFolder, children: updatedChildren });
    saveBookmarks(updatedRoot);
    setDeleteConfirmation(null);
  };

  const handleRename = (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      const newName = e.target.value.trim();
      if (newName) {
        const updatedItem = { ...editingItem, name: newName };
        const updatedChildren = currentFolder.children.map((item) =>
          item === editingItem ? updatedItem : item
        );
        const updatedRoot = updateNestedBookmarks(
          rootFolder,
          currentPath.slice(0, -1),
          { ...currentFolder, children: updatedChildren }
        );

        setRootFolder(updatedRoot);
        setCurrentFolder({ ...currentFolder, children: updatedChildren });
        saveBookmarks(updatedRoot);
      }
      setEditingItem(null);
    }
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={bookmarkRef}
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
              <p>
                Welcome to Bookmarks! Would you like to import your existing
                bookmarks?
              </p>
              <button
                onClick={importBookmarks}
                className="bg-blue-500 px-4 py-2 rounded mt-4"
              >
                Import Bookmarks
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button
                  onClick={goBack}
                  disabled={currentPath.length === 0}
                  className="text-white"
                >
                  <ChevronLeft />
                </button>
                <div>
                  <button
                    onClick={addFolder}
                    className="bg-green-500 px-4 py-2 rounded mr-2"
                  >
                    Add Folder
                  </button>
                  <button
                    onClick={addLink}
                    className="bg-blue-500 px-4 py-2 rounded"
                  >
                    Add Link
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {sortItems(currentFolder.children).map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center text-white cursor-pointer hover:bg-gray-700 p-2 rounded"
                    onClick={() => handleItemClick(item, index)}
                    onContextMenu={(e) => handleContextMenu(e, item, index)}
                  >
                    {item.type === "folder" ? (
                      <Folder className="mr-2" />
                    ) : (
                      <Globe className="mr-2" />
                    )}
                    {editingItem === item ? (
                      <input
                        ref={editInputRef}
                        defaultValue={item.name}
                        onKeyDown={handleRename}
                        onBlur={() => setEditingItem(null)}
                        className="bg-transparent border-b border-white outline-none"
                      />
                    ) : (
                      item.name
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {contextMenu && (
          <div
            className="absolute bg-white rounded shadow-md py-2 px-4"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="flex items-center text-gray-700 hover:bg-gray-100 px-2 py-1"
              onClick={handleEdit}
            >
              <Edit size={16} className="mr-2" /> Edit
            </button>
            <button
              className="flex items-center text-red-600 hover:bg-gray-100 px-2 py-1"
              onClick={handleDelete}
            >
              <Trash size={16} className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Bookmark;
