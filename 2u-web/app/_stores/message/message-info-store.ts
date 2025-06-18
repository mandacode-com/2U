import { create } from "zustand";

type State = {
  from: string;
  to: string;
  hint: string;
};

type Action = {
  updateFrom: (from: string) => void;
  updateTo: (to: string) => void;
  updateHint: (hint: string) => void;
};

export const useMessageInfoStore = create<State & Action>((set) => ({
  from: "",
  to: "",
  hint: "",

  updateFrom: (from) => set({ from }),
  updateTo: (to) => set({ to }),
  updateHint: (hint) => set({ hint }),
}));
