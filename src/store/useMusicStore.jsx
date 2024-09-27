import { create } from "zustand";

const useMusicStore = create((set) => ({
  music: null,
  setMusic: (music) => set({ music }),
  playlist: [],
  setPlaylist: (playlist) => set({ playlist }),
  currentTrackIndex: 0,
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrackIndex: (index) => {
    set({ currentTrackIndex: index });
    set({ isPlaying: true });
  },
  volume: 50,
  setVolume: (volume) => set({ volume }),
}));

export default useMusicStore;
