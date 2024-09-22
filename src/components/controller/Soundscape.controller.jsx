import { useEffect, useRef, useState } from "react";
import useSoundScapeStore from "../../store/useSoundScapeStore";

const SoundscapeController = () => {
  const [soundListFound, setSoundListFound] = useState([]);
  const { sounds } = useSoundScapeStore();
  const audioRefs = useRef({});

  useEffect(() => {
    // Initialize audio elements for each sound
    sounds.forEach((sound) => {
      if (!audioRefs.current[sound.name] && !soundListFound.includes(sound.name)) {
        setSoundListFound((prev) => [...prev, sound.name]);
        const audio = new Audio(`/sounds/${sound.name}.mp3`);
        audio.loop = true;
        audioRefs.current[sound.name] = audio;
      }
    });

  }, [soundListFound, sounds]);

  useEffect(() => {
    sounds.forEach((sound) => {
      const audio = audioRefs.current[sound.name];
      if (audio) {
        if (sound.volume > 0) {
          audio.volume = sound.volume / 100;
          if (audio.paused) {
            audio
              .play()
              .catch((error) => console.error("Error playing audio:", error));
          }
        } else {
          audio.pause();
        }
      }
    });
  }, [sounds]);

  return null; // This component doesn't render anything visible
};

export default SoundscapeController;
