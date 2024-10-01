import { create } from "zustand";

interface TranscriptionState {
  transcript: string | null;
  setTranscript: (transcript: string) => void;
}

export const useTranscriptionStore = create<TranscriptionState>((set) => ({
  transcript: null,
  setTranscript: (transcript) => set({ transcript }),
}));
