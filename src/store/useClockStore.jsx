import { create } from "zustand";
import { persist } from "zustand/middleware";

const useClockStore = create(
  persist(
    (set) => ({
      mode: "DIGITAL",
      setMode: (mode) => set({ mode }),
      quote: "The only way to do great work is to love what you do.",
      setQuote: (quote) => set({ quote }),
      position: {
        x: window.innerWidth / 2 - 160,
        y: 150,
      },
      setPosition: (position) => set({ position }),
      isDraggable: false,
      setIsDraggable: (isDraggable) => set({ isDraggable }),
    }),
    {
      name: "clock-storage",
    }
  )
);

export default useClockStore;
