import { create } from "zustand";

type State = {
  password: string;
};

type Action = {
  updatePassword: (password: State["password"]) => void;
};

export const useMessageAuthStore = create<State & Action>((set) => ({
  password: "",
  updatePassword: (password) => set({ password }),
}));
