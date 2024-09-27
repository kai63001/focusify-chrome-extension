import { useEffect, useRef } from "react";
import useMusicStore from "../../store/useMusicStore";

const MusicController = () => {
  const {
    music,
    playlist,
    setMusic,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
  } = useMusicStore();
  const playerRef = useRef(null);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "315",
        width: "560",
        videoId: music?.id,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (playlist[currentTrackIndex]) {
      setMusic(playlist[currentTrackIndex]);
    }
  }, [currentTrackIndex, playlist, setMusic]);

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    const domCurrentTrackIndex = ~~document.getElementById(
      "current-track-index"
    ).innerText;
    const domPlaylistLength =
      ~~document.getElementById("playlist-length").innerText;
    console.log("onPlayerStateChange", domPlaylistLength);
    if (event.data == window.YT.PlayerState.ENDED) {
      console.log("ended", domCurrentTrackIndex, domPlaylistLength);
      if (domCurrentTrackIndex < domPlaylistLength - 1) {
        setCurrentTrackIndex(domCurrentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(music?.id);
    }
  }, [music]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  return (
    <div className="hidden">
      <div id="youtube-player"></div>
      <div id="current-track-index">{currentTrackIndex}</div>
      <div id="playlist-length">{playlist.length}</div>
    </div>
  );
};

export default MusicController;
