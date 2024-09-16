import { useState } from "react";

const ModalAddFolder = ({ isOpen, onClose, onAddFolder }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onAddFolder(folderName);
      setFolderName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl z-10 w-[400px]">
        <h2 className="text-xl font-bold mb-4 text-white">Add New Folder</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full p-2 mb-4 bg-[#221B15]/70 text-white rounded"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-[#ed974d] border border-[#ed974d] duration-300 hover:bg-[#ed974d]/20 rounded-md"
            >
              Add Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddFolder;
