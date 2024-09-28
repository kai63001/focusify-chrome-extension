import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import useWidgetControllerStore from "../../store/widgetControllerStore";
import useRandomPosition from "../../hooks/useRandomPosition";
import { X, Plus, Trash, GripVertical } from "lucide-react";
import "react-resizable/css/styles.css";
import useMusicStore from "../../store/useMusicStore";
import useUserDataStore from "../../store/userDataStore";
import axios from "axios";

const Music = () => {
  const {
    addWidget,
    bringToFront,
    getWidgetZIndex,
    removeWidget,
    updateWidgetPosition,
    updateWidgetSize,
  } = useWidgetControllerStore();

  const zIndex = getWidgetZIndex("Music")(useWidgetControllerStore.getState());
  const [position, setPosition] = useRandomPosition("Music");

  const [activeTab, setActiveTab] = useState("myPlaylist");
  const [draggedTrack, setDraggedTrack] = useState(null);

  // useEffect(() => {
  //   const fetchSharedPlaylists = async () => {
  //     const snapshot = query(collection(db, "sharedPlaylists"));
  //     const docs = await getDocs(snapshot);
  //     const playlists = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     setSharedPlaylists(playlists);
  //   };
  //   fetchSharedPlaylists();
  // }, []);

  const { playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex } =
    useMusicStore();
  const { premium } = useUserDataStore();
  const [inputUrl, setInputUrl] = useState("");
  const [size, setSize] = useState({ width: 350, height: 450 });

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("widgetState") || "[]");
    const soundscapeWidget = savedState.find(
      (widget) => widget.name === "Music"
    );
    if (!soundscapeWidget) return;
    const savedSize = soundscapeWidget?.size || { width: 350, height: 450 };
    setSize(savedSize);
    addWidget("Music", position, savedSize);
  }, [addWidget, position]);

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    const videoId = extractYouTubeId(inputUrl);
    if (videoId) {
      if (!premium && playlist.length >= 1) {
        alert("Upgrade to Premium to add more than one song!");
        return;
      }
      const youtubeInfo = await getYoutubeInfo(inputUrl);
      console.log(youtubeInfo);
      const newTrack = {
        id: videoId,
        url: inputUrl,
        title: youtubeInfo.title,
        thumbnail: youtubeInfo.thumbnail_url,
        author_name: youtubeInfo.author_name,
        author_url: youtubeInfo.author_url,
      };
      setPlaylist([...playlist, newTrack]);
      setInputUrl("");
      if (playlist.length === 0) {
        setCurrentTrackIndex(0);
      }
    } else {
      alert("Invalid URL. Please enter a valid YouTube URL.");
    }
  };

  const getYoutubeInfo = async (url) => {
    const response = await axios.get(`https://noembed.com/embed?url=${url}`);
    return response.data;
  };

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // const handlePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };

  // const handleSkipForward = () => {
  //   if (currentTrackIndex < playlist.length - 1) {
  //     setCurrentTrackIndex(currentTrackIndex + 1);
  //   }
  // };

  // const handleSkipBack = () => {
  //   if (currentTrackIndex > 0) {
  //     setCurrentTrackIndex(currentTrackIndex - 1);
  //   }
  // };

  // const handleVolumeChange = (e) => {
  //   setVolume(parseInt(e.target.value));
  // };

  // const handleSharePlaylist = async () => {
  //   try {
  //     await addDoc(collection(db, "playlists"), {
  //       userId: useUserDataStore.getState().userId,
  //       tracks: playlist,
  //       shared: true,
  //     });
  //     alert("Playlist shared successfully!");
  //   } catch (error) {
  //     console.error("Error sharing playlist:", error);
  //     alert("Failed to share playlist. Please try again.");
  //   }
  // };

  // const handleSelectSharedPlaylist = (sharedPlaylist) => {
  //   setPlaylist(sharedPlaylist.tracks);
  //   setCurrentTrackIndex(0);
  // };

  const onDragStart = (e, track) => {
    setDraggedTrack(track);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", track.id);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverTrack = playlist[index];
    if (draggedTrack.id === draggedOverTrack.id) return;

    const newPlaylist = playlist.filter(
      (track) => track.id !== draggedTrack.id
    );
    newPlaylist.splice(index, 0, draggedTrack);
    setPlaylist(newPlaylist);
  };

  const onDragEnd = () => {
    setDraggedTrack(null);
  };

  return (
    <Draggable
      bounds="parent"
      handle="#dragHandle"
      position={position}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
        updateWidgetPosition("Music", { x: data.x, y: data.y });
      }}
    >
      <ResizableBox
        width={size.width}
        height={size.height}
        style={{ zIndex: 40 + zIndex }}
        minConstraints={[300, 400]}
        className="fixed"
        onResizeStop={(e, data) => {
          const newSize = { width: data.size.width, height: data.size.height };
          setSize(newSize);
          updateWidgetSize("Music", newSize);
        }}
        handle={
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.5 16v-1.5H16V16h-4.5zM8 16v-1.5h1.5V16H8zm-3.5 0v-1.5H6V16H4.5zM16 12.5h-1.5V16H16v-3.5zM16 9h-1.5v1.5H16V9zM16 5.5h-1.5V7H16V5.5z" />
            </svg>
          </div>
        }
      >
        <div
          className="absolute w-full h-full bg-[#221B15]/70 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden flex flex-col"
          onClick={() => bringToFront("Music")}
        >
          <div
            id="dragHandle"
            className="bg-[#2e2e2e]/60 text-white px-4 py-2 flex justify-between items-center cursor-move"
          >
            <span className="text-lg font-semibold">Music Player (BETA)</span>
            <X
              size={20}
              className="cursor-pointer hover:text-red-500 transition-colors"
              onClick={() => removeWidget("Music")}
            />
          </div>
          <div className="p-4 flex flex-col space-y-4 flex-grow">
            <div className="flex space-x-2">
              <button
                className={`flex-1 p-2 rounded ${
                  activeTab === "myPlaylist"
                    ? "bg-[#ed974d]"
                    : "bg-[#2e2e2e]/60"
                } text-white`}
                onClick={() => setActiveTab("myPlaylist")}
              >
                My Playlist
              </button>
              <button
                className={`flex-1 p-2 rounded ${
                  activeTab === "sharedPlaylists"
                    ? "bg-[#ed974d]"
                    : "bg-[#2e2e2e]/60"
                } text-white`}
                onClick={() => setActiveTab("sharedPlaylists")}
              >
                Shared Playlists
              </button>
            </div>
            {activeTab === "myPlaylist" && (
              <>
                <form onSubmit={handleUrlSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter YouTube URL"
                    className="flex-grow p-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ed974d]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded bg-[#ed974d] text-white hover:bg-[#ed974d]/80 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </form>
                {/* <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tracks"
                    className="flex-grow p-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#ed974d]"
                  />
                  <button
                    onClick={handleSharePlaylist}
                    className="p-2 rounded bg-[#ed974d] text-white hover:bg-[#ed974d]/80 transition-colors"
                  >
                    <Share2 size={20} />
                  </button>
                </div> */}
                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-[#ed974d] scrollbar-track-[#2e2e2e]/60">
                  {playlist.map((track, index) => (
                    <div
                      key={track.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, track)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className={`p-2 rounded ${
                        index === currentTrackIndex
                          ? "bg-[#ed974d]"
                          : "bg-white/10"
                      } text-white mb-2 cursor-move hover:bg-[#ed974d]/60 transition-colors flex items-center`}
                      onClick={() => setCurrentTrackIndex(index)}
                    >
                      <GripVertical size={16} className="mr-2 flex-shrink-0" />
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-10 h-10 rounded-md mr-2 flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {track.title}
                        </p>
                        <span className="text-xs text-gray-400 block truncate">
                          {track.author_name}
                        </span>
                      </div>
                      <Trash
                        size={16}
                        className="cursor-pointer hover:text-red-500 flex-shrink-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaylist(playlist.filter((_, i) => i !== index));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* <div className="flex justify-between items-center">
              <button
                onClick={handleSkipBack}
                disabled={currentTrackIndex === 0}
                className="text-white hover:text-[#ed974d] transition-colors"
              >
                <SkipBack
                  size={24}
                  className={currentTrackIndex === 0 ? "text-gray-500" : ""}
                />
              </button>
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-[#ed974d] transition-colors"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button
                onClick={handleSkipForward}
                disabled={currentTrackIndex === playlist.length - 1}
                className="text-white hover:text-[#ed974d] transition-colors"
              >
                <SkipForward
                  size={24}
                  className={
                    currentTrackIndex === playlist.length - 1
                      ? "text-gray-500"
                      : ""
                  }
                />
              </button>
            </div> */}
            {/* <div className="flex items-center space-x-2">
              <Volume2 size={20} className="text-white" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div> */}
            {!premium && (
              <p className="text-sm text-yellow-400">
                Upgrade to Premium for unlimited tracks and playlist sharing!
              </p>
            )}
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default Music;
