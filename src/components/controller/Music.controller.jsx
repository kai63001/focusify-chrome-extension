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
  const iframeRef = useRef(null);

  useEffect(() => {
    if (playlist[currentTrackIndex]) {
      setMusic(playlist[currentTrackIndex]);
    }
  }, [currentTrackIndex, playlist, setMusic]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && music?.id) {
      iframe.src = `https://www.youtube.com/embed/${music.id}?enablejsapi=1&autoplay=1`;
    }
  }, [music]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      if (isPlaying) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":[${volume}]}`, '*');
    }
  }, [volume]);

  const handleMessage = (event) => {
    if (event.data && typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange' && data.info === 0) {
          // Video ended
          if (currentTrackIndex < playlist.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
          } else {
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, playlist.length, setCurrentTrackIndex, setIsPlaying]);

  return (
    <div className="hidden">
      <iframe
        ref={iframeRef}
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${music?.id}?enablejsapi=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video player"
      ></iframe>
      <div id="current-track-index">{currentTrackIndex}</div>
      <div id="playlist-length">{playlist.length}</div>
    </div>
  );
};

export default MusicController;
