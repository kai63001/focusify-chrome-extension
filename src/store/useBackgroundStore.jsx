import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBackgroundStore = create(
    persist(
        (set) => ({
            background: 'https://images4.alphacoders.com/135/1354757.png',
            setBackground: (background) => set({ background }),
        }),
        {
            name: "background-storage",
        }
    )
);

export default useBackgroundStore;