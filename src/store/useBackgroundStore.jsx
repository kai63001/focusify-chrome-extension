import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBackgroundStore = create(
    persist(
        (set) => ({
            background: 'https://images7.alphacoders.com/137/1375523.png', // Default background
            setBackground: (background) => set({ background }),
        }),
        {
            name: "background-storage",
        }
    )
);

export default useBackgroundStore;