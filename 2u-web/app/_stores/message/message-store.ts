import { create } from "zustand";
import { Content } from "@tiptap/react";

type State = {
  id?: string;
  content?: Content;
  from?: string | null;
  to?: string | null;
  hint?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Action = {
  updateId: (id: string) => void;
  updateContent: (content: Content | null) => void;
  updateFrom: (from: string) => void;
  updateTo: (to: string) => void;
  updateHint: (hint: string) => void;
  updateCreatedAt: (createdAt: string) => void;
  updateUpdatedAt: (updatedAt: string) => void;
  updateMessage: (data: {
    id: string;
    content: Content;
    from?: string | null;
    to?: string | null;
    hint?: string | null;
    createdAt: string;
    updatedAt: string;
  }) => void;
  reset: () => void;
};

export const useMessageStore = create<State & Action>((set) => ({
  id: undefined,
  content: undefined,
  from: null,
  to: null,
  hint: null,
  createdAt: undefined,
  updatedAt: undefined,

  updateId: (id) => set({ id }),
  updateContent: (content) => set({ content }),
  updateFrom: (from) => set({ from }),
  updateTo: (to) => set({ to }),
  updateHint: (hint) => set({ hint }),
  updateCreatedAt: (createdAt) => set({ createdAt }),
  updateUpdatedAt: (updatedAt) => set({ updatedAt }),
  updateMessage: (data) =>
    set({
      id: data.id,
      content: data.content,
      from: data.from ?? null,
      to: data.to ?? null,
      hint: data.hint ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }),
  reset: () =>
    set({
      id: undefined,
      content: undefined,
      from: null,
      to: null,
      hint: null,
      createdAt: undefined,
      updatedAt: undefined,
    }),
}));
