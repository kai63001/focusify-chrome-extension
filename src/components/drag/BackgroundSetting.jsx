import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import useBackgroundStore from "../../store/useBackgroundStore";
import { storage, auth } from "../../libs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useUserDataStore from "../../store/userDataStore";
import { app } from "../../libs/firebase";
import { collection, query, getDocs, getFirestore } from "firebase/firestore";

const BackgroundSetting = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("original");
  const { premium } = useUserDataStore();

  const db = getFirestore(app);
  // const originalBackgrounds = [
  //   {
  //     url: "https://images4.alphacoders.com/134/1349198.png",
  //     name: "",
  //     author: "robokoboto",
  //   },
  //   {
  //     url: "https://images8.alphacoders.com/134/1349195.png",
  //     name: "",
  //     author: "robokoboto",
  //   },
  //   {
  //     url: "https://images.alphacoders.com/135/1350899.png",
  //     name: "",
  //     author: "robokoboto",
  //   },
  //   {
  //     url: "https://images7.alphacoders.com/135/1354305.jpeg",
  //     name: "",
  //     author: "patrika",
  //   },
  //   {
  //     url: "https://images4.alphacoders.com/135/1354757.png",
  //     name: "",
  //     author: "patrika",
  //   },
  //   {
  //     url: "https://images.alphacoders.com/133/1335808.png",
  //     name: "",
  //     author: "patrika",
  //   },
  //   {
  //     url: "https://images6.alphacoders.com/131/1316888.jpeg",
  //     name: "",
  //     author: "Tadokiari",
  //   },
  // ];
  const [originalBackgrounds, setOriginalBackgrounds] = useState([]);
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

    const fetchOriginalBackgrounds = async () => {
      const snapshot = query(collection(db, "wallpapers"));
      const docs = await getDocs(snapshot);
      const backgrounds = docs.docs.map((doc) => doc.data());
      setOriginalBackgrounds(backgrounds);
    };

    fetchOriginalBackgrounds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
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
              } ${!premium ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => premium && setActiveTab("custom")}
              disabled={!premium}
            >
              Custom
            </button>
          </div>
          {!premium && (
            <p className="text-sm text-yellow-400 mb-4">
              Upgrade to Premium to use custom backgrounds
            </p>
          )}
          {activeTab === "original" ? (
            <>
            {originalBackgrounds.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {originalBackgrounds.map((item, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer"
                  onClick={() => handleBackgroundSelect(item.url)}
                >
                  <div className="absolute top-0 left-0 w-full h-full  flex items-end justify-end">
                    <p className="text-white text-xs">{item.author}</p>
                  </div>
                  <img
                    src={item.url}
                    alt={`Background ${index + 1}`}
                    className={`w-full h-32 object-cover cursor-pointer rounded ${
                      background === item.url ? "border-2 border-[#ed974d]" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
            ) : (
              <p className="text-white text-lg mb-4">
                Loading original backgrounds...
              </p>
            )}
            </>
            
          ) : premium ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-white text-lg mb-4">
                Upgrade to Premium to use custom backgrounds
              </p>
              <button className="bg-[#ed974d] hover:bg-[#ed974d]/80 text-white px-4 py-2 rounded transition duration-300">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSetting;
