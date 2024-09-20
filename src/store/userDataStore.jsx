import { create } from "zustand";

const useUserDataStore = create((set) => ({
  userName: localStorage.getItem("userName") || "",
  premium: false,
  setUserName: (name) => set({ userName: name }),
  setPremium: (isPremium) => set({ premium: isPremium }),
}));

export default useUserDataStore;