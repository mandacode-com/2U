import { create } from "zustand";

type State = {
  error: string | null;
};

type Action = {
  setError: (error: string | null) => void;
};

export const useErrorStore = create<State & Action>((set) => ({
  error: null,
  setError: (error) => set({ error }),
}));
