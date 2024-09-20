import { create } from "zustand";
import { persist } from "zustand/middleware";

const useQuickLinkStore = create(
  persist(
    (set) => ({
      listSite: [],
      setListSite: (listSite) => set({ listSite }),
    }),
    {
      name: "quick-link-storage",
    }
  )
);

export default useQuickLinkStore;
