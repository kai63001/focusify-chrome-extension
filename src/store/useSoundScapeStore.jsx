import { create } from "zustand";

const useSoundScapeStore = create((set) => ({
    sounds: [],
    setSounds: (sounds) => set({ sounds }),
}));

export default useSoundScapeStore;