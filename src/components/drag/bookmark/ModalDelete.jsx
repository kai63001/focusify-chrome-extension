const ModalDelete = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <div className="fixed inset-0 " onClick={onClose}></div>
      <div className="bg-[#221B15]/70 backdrop-blur-lg rounded-lg p-6 shadow-xl z-10 w-[400px]">
        <h2 className="text-xl font-bold mb-4 text-white">Delete</h2>
        <p className="text-white">Are you sure you want to delete this item?</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 mr-2 text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="px-4 py-2 text-white bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
