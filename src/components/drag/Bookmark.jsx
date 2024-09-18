import { useState, useEffect, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import {
  X,
  Folder,
  ChevronLeft,
  Edit,
  Trash,
  Menu,
  FolderPlus,
  Link,
} from "lucide-react";
import ModalAddFolder from "./bookmark/ModalAddFolder";
import ModalAddLink from "./bookmark/ModalAddLink";
import ModalDelete from "./bookmark/ModalDelete";
import "react-resizable/css/styles.css";

const Bookmark = () => {
  const {
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    addWidget,
    updateWidgetPosition,
    updateWidgetSize,
  } = useWidgetControllerStore();
  const zIndex = getWidgetZIndex("Bookmark")(
    useWidgetControllerStore.getState()
  );
  const [position, setPosition] = useRandomPosition("Bookmark");
  const [currentPath, setCurrentPath] = useState([]);
  const [rootFolder, setRootFolder] = useState({ children: [] });
  const [currentFolder, setCurrentFolder] = useState({ children: [] });
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [modalAddFolder, setModalAddFolder] = useState(false);
  const [modalAddLink, setModalAddLink] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const editInputRef = useRef(null);
  const bookmarkRef = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const bookmarkWidget = savedState.find(widget => widget.name === "Bookmark");
    const savedSize = bookmarkWidget?.size || { width: 600, height: 400 };
    setSize(savedSize);
    addWidget("Bookmark", position, savedSize);
  }, [addWidget, position]);

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

  const updateNestedBookmarksRename = (folder, path, updater) => {
    if (path.length === 0) {
      return updater(folder);
    }

    const [currentIndex, ...restPath] = path;
    const updatedChildren = [...folder.children];
    updatedChildren[currentIndex] = updateNestedBookmarksRename(
      folder.children[currentIndex],
      restPath,
      updater
    );

    return { ...folder, children: updatedChildren };
  };

  const addFolder = (folderName) => {
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

  const addLink = (linkName, linkUrl) => {
    if (linkName && linkUrl) {
      const newLink = {
        type: "link",
        name: linkName,
        url: linkUrl,
        favicon: `https://www.google.com/s2/favicons?domain=${linkUrl}&sz=64`,
      };
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

  const addFaviconToLinks = (bookmarkData) => {
    if (bookmarkData.type === 'link') {
      return {
        ...bookmarkData,
        favicon: `https://www.google.com/s2/favicons?domain=${bookmarkData.url}&sz=64`
      };
    } else if (bookmarkData.type === 'folder' && bookmarkData.children) {
      return {
        ...bookmarkData,
        children: bookmarkData.children.map(addFaviconToLinks)
      };
    }
    return bookmarkData;
  };

  const importBookmarks = () => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["importedBookmarks"], (result) => {
      if (result.importedBookmarks) {
        const data = addFaviconToLinks(result.importedBookmarks[0]);
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

  const confirmDelete = () => {
    if (!deleteItem) return;

    const updatedRoot = updateNestedBookmarksRename(
      rootFolder,
      currentPath,
      (folder) => {
        const updatedChildren = folder.children.filter(
          (item) => item !== deleteItem
        );
        return { ...folder, children: updatedChildren };
      }
    );

    setRootFolder(updatedRoot);
    setCurrentFolder(
      currentPath.length === 0
        ? updatedRoot
        : updatedRoot.children[currentPath[currentPath.length - 1]]
    );
    saveBookmarks(updatedRoot);
    setDeleteItem(null);
    setModalDelete(false);
  };

  const handleRename = (e, item, index) => {
    if (e.key === "Enter" || e.type === "blur") {
      const newName = e.target.value.trim();
      if (newName && newName !== item.name) {
        const updatedRoot = updateNestedBookmarksRename(
          rootFolder,
          currentPath,
          (folder) => {
            const updatedChildren = [...folder.children];
            updatedChildren[index] = { ...item, name: newName };
            return { ...folder, children: updatedChildren };
          }
        );

        setRootFolder(updatedRoot);
        setCurrentFolder(
          currentPath.length === 0
            ? updatedRoot
            : updatedRoot.children[currentPath[currentPath.length - 1]]
        );
        saveBookmarks(updatedRoot);
      }
      setEditingItem(null);
    }
  };

  return (
    <>
      <Draggable
        bounds="parent"
        handle="#dragHandle"
        position={position}
        onStop={(e, data) => {
          setPosition({ x: data.x, y: data.y });
          updateWidgetPosition("Bookmark", { x: data.x, y: data.y });
        }}
      >
        <ResizableBox
          width={size.width}
          height={size.height}
          minConstraints={[400, 300]}
          maxConstraints={[800, 600]}
          className="absolute"
          onResizeStop={(e, data) => {
            const newSize = { width: data.size.width, height: data.size.height };
            setSize(newSize);
            updateWidgetSize("Bookmark", newSize);
          }}
          handle={<div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />}
        >
          <div
            ref={bookmarkRef}
            className="absolute bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
            style={{ zIndex: 40 + zIndex, width: "100%", height: "100%" }}
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
                    className="px-4 py-2 rounded mt-4 border hover:bg-white hover:text-black duration-300"
                  >
                    Import Bookmarks
                  </button>

                  <button
                    onClick={() => {
                      setIsFirstTime(false);
                      localStorage.setItem("bookmarkFirstTime", "false");
                    }}
                    className="ml-3 px-4 py-2 rounded mt-4 "
                  >
                    No, thanks
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between p-2 -mt-4 rounded-lg">
                    <div className="flex items-center">
                      <button
                        onClick={goBack}
                        disabled={currentPath.length === 0}
                        className={`text-white ${
                          currentPath.length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <span className="text-white text-md ml-3">
                        {currentFolder.name}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className=" text-white px-3 py-1 rounded text-smtransition-colors duration-200 flex items-center"
                      >
                        <Menu size={24} className="" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#222222] rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              setModalAddFolder(true);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#4A403A] transition-colors duration-200"
                          >
                            <FolderPlus size={16} className="mr-2" />
                            Add Folder
                          </button>
                          <button
                            onClick={() => {
                              setModalAddLink(true);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#4A403A] transition-colors duration-200"
                          >
                            <Link size={16} className="mr-2" />
                            Add Link
                          </button>
                        </div>
                      )}
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
                          <img src={item.favicon} alt="" className="w-6 h-6 mr-2" />
                        )}
                        {editingItem === item ? (
                          <input
                            ref={editInputRef}
                            defaultValue={item.name}
                            onKeyDown={(e) => handleRename(e, item, index)}
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
                  onClick={() => {
                    setModalDelete(true);
                    setDeleteItem(contextMenu.item);
                    setContextMenu(null);
                  }}
                >
                  <Trash size={16} className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </ResizableBox>
      </Draggable>
      {modalAddFolder && (
        <ModalAddFolder
          isOpen={modalAddFolder}
          onClose={() => setModalAddFolder(false)}
          onAddFolder={addFolder}
        />
      )}
      {modalAddLink && (
        <ModalAddLink
          isOpen={modalAddLink}
          onClose={() => setModalAddLink(false)}
          onAddLink={addLink}
        />
      )}
      {modalDelete && (
        <ModalDelete
          isOpen={modalDelete}
          onClose={() => setModalDelete(false)}
          onDelete={confirmDelete}
        />
      )}
    </>
  );
};

export default Bookmark;
