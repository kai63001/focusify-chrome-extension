import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ModalAddLink = ({ isOpen, onClose, onAddLink }) => {
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      toast.error("Invalid URL");
      console.error(e);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (linkName.trim() && isValidUrl(linkUrl)) {
      onAddLink(linkName, linkUrl);
      setLinkName("");
      setLinkUrl("");
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
        <h2 className="text-xl font-bold mb-4 text-white">Add New Link</h2>
        <form>
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            placeholder="Link name"
            className="w-full p-2 mb-4 bg-[#221B15]/70 text-white rounded"
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Link URL"
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
              onClick={handleSubmit}
            >
              Add Link
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ModalAddLink;
