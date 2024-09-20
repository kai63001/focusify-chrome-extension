import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import useBackgroundStore from "../../store/useBackgroundStore";
import { storage, auth } from "../../libs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const BackgroundSetting = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("original");
  const originalBackgrounds = [
    {
      url: "https://images4.alphacoders.com/134/1349198.png",
      name: "",
      author: "robokoboto",
    },
    {
      url: "https://images8.alphacoders.com/134/1349195.png",
      name: "",
      author: "robokoboto",
    },
    {
      url: "https://images.alphacoders.com/135/1350899.png",
      name: "",
      author: "robokoboto",
    },
    {
      url: "https://images7.alphacoders.com/135/1354305.jpeg",
      name: "",
      author: "patrika",
    },
    {
      url: "https://images4.alphacoders.com/135/1354757.png",
      name: "",
      author: "patrika",
    },
    {
      url: "https://images.alphacoders.com/133/1335808.png",
      name: "",
      author: "patrika",
    },
    {
      url: "https://images6.alphacoders.com/131/1316888.jpeg",
      name: "",
      author: "Tadokiari",
    },
  ];
  const [uploadedImage, setUploadedImage] = useState(null);
  const { setBackground, background } = useBackgroundStore();

  useEffect(() => {
    if (auth.currentUser) {
      // Fetch user's custom background if exists
      const userBackgroundRef = ref(
        storage,
        `backgrounds/${auth.currentUser.uid}`
      );
      getDownloadURL(userBackgroundRef)
        .then((url) => setUploadedImage(url))
        .catch(() => setUploadedImage(null));
    }
  }, []);

  const handleBackgroundSelect = (url) => {
    setBackground(url);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && auth.currentUser) {
      const userBackgroundRef = ref(
        storage,
        `backgrounds/${auth.currentUser.uid}`
      );
      await uploadBytes(userBackgroundRef, file);
      const downloadURL = await getDownloadURL(userBackgroundRef);
      setUploadedImage(downloadURL);
      setBackground(downloadURL);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg w-[80%] max-w-2xl overflow-hidden">
        <div className="bg-[#2e2e2e]/60 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-xl font-bold">Background Settings</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex mb-4 space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "original"
                  ? "bg-[#ed974d] text-white"
                  : "bg-[#2e2e2e]/60 text-white"
              }`}
              onClick={() => setActiveTab("original")}
            >
              Original
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "custom"
                  ? "bg-[#ed974d] text-white"
                  : "bg-[#2e2e2e]/60 text-white"
              }`}
              onClick={() => setActiveTab("custom")}
            >
              Custom
            </button>
          </div>
          {activeTab === "original" ? (
            <div className="grid grid-cols-3 gap-4">
              {originalBackgrounds.map((item, index) => (
                <img
                  key={index}
                  src={item.url}
                  alt={`Background ${index + 1}`}
                  className={`w-full h-32 object-cover cursor-pointer rounded ${
                    background === item.url ? "border-2 border-[#ed974d]" : ""
                  }`}
                  onClick={() => handleBackgroundSelect(item.url)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {uploadedImage && (
                <img
                  onClick={() => handleBackgroundSelect(uploadedImage)}
                  src={uploadedImage}
                  alt="Custom background"
                  className={`w-full h-64 object-cover mb-4 rounded cursor-pointer ${
                    background === uploadedImage
                      ? "border-2 border-[#ed974d]"
                      : ""
                  }`}
                />
              )}
              <label className="cursor-pointer bg-[#ed974d] hover:bg-[#ed974d]/80 text-white px-4 py-2 rounded flex items-center transition duration-300">
                <Upload className="mr-2" size={20} />
                Upload Custom Background
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSetting;
