import { useState, useCallback } from "react";
import { ChevronLeft, Edit, Trash, Plus, GripVertical } from "lucide-react";
import useQuickLinkStore from "../../../store/useQuickLinkStore";

const QuickLinkSetting = ({ onBack }) => {
  const { listSite, setListSite } = useQuickLinkStore();
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newLink, setNewLink] = useState({ name: "", link: "" });
  const [draggedLink, setDraggedLink] = useState(null);
  const [openSectionNewLink, setOpenSectionNewLink] = useState(false);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewLink(listSite[index]);
    setOpenSectionNewLink(true);
  };

  const handleDelete = (index) => {
    const updatedList = listSite.filter((_, i) => i !== index);
    setListSite(updatedList);
  };

  const handleSave = () => {
    if (editingIndex === -1) {
      setListSite([...listSite, newLink]);
    } else {
      const updatedList = listSite.map((item, index) =>
        index === editingIndex ? newLink : item
      );
      setListSite(updatedList);
    }
    setEditingIndex(-1);
    setNewLink({ name: "", link: "" });
    setOpenSectionNewLink(false);
  };

  const onDragStart = useCallback((e, link) => {
    setDraggedLink(link);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", link.name);
  }, []);

  const onDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      const draggedOverLink = listSite[index];
      if (draggedLink.name === draggedOverLink.name) return;

      const newListSite = listSite.filter(
        (link) => link.name !== draggedLink.name
      );
      newListSite.splice(index, 0, draggedLink);
      setListSite(newListSite);
    },
    [draggedLink, listSite, setListSite]
  );

  const onDragEnd = useCallback(() => {
    setDraggedLink(null);
  }, []);

  return (
    <div className="animate-slide-left">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <ChevronLeft
            size={20}
            className="cursor-pointer mr-2"
            onClick={onBack}
          />
          <span className="text-sm text-white font-semibold">
            Quick Link Settings
          </span>
        </div>
        <button
          onClick={() => setOpenSectionNewLink(!openSectionNewLink)}
          className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="px-4 py-2">
        {listSite.length === 0 ? (
          <div className="text-white text-center">No links found</div>
        ) : (
          listSite.map((site, index) => (
            <div
              key={site.name}
              draggable
              onDragStart={(e) => onDragStart(e, site)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              className={`flex items-center mb-2 transition-all duration-300 ease-in-out bg-gray-700 p-2 rounded cursor-move ${
                draggedLink && draggedLink.name === site.name
                  ? "opacity-50"
                  : ""
              }`}
            >
              <GripVertical size={16} className="mr-2 text-white" />
              <img
                src={`https://www.google.com/s2/favicons?domain=${site.link}&sz=64`}
                alt={site.name}
                className="w-6 h-6 mr-2"
              />
              <span className="flex-grow text-white">{site.name}</span>
              <Edit
                size={16}
                className="cursor-pointer mr-2 text-white"
                onClick={() => handleEdit(index)}
              />
              <Trash
                size={16}
                className="cursor-pointer text-white"
                onClick={() => handleDelete(index)}
              />
            </div>
          ))
        )}
      </div>

      {openSectionNewLink && (
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold mb-2 text-white">
            {editingIndex === -1 ? "Add New Link" : "Edit Link"}
          </h3>
          <input
            type="text"
            placeholder="Name"
            value={newLink.name}
            onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            className="w-full mb-2 p-1 bg-gray-700 text-white rounded"
          />
          <input
            type="text"
            placeholder="URL"
            value={newLink.link}
            onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
            className="w-full mb-2 p-1 bg-gray-700 text-white rounded"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
          >
            <Plus size={16} className="mr-2" />
            {editingIndex === -1 ? "Add" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickLinkSetting;
