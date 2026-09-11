import React, { createContext, useContext } from "react";
import { DayBrief, LocationInfo } from "../lib/types";

export interface ChatMessageItem {
  id: string | number;
  role: "user" | "assistant";
  text: string;
}

export interface WeatherContextValue {
  brief: DayBrief | null;
  loading: boolean;
  error: string | null;
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  openLocationModal: () => void;
  openChatWithPrompt: (prompt: string) => void;
  openOverlay: (type: "wear" | "pack") => void;
  chatOpen: boolean;
  chatSeed: string | null;
  closeChat: () => void;
  messages: ChatMessageItem[];
  chatLoading: boolean;
  chatError: string | null;
  sendChatMessage: (text: string) => Promise<void>;
}

export const WeatherContext = createContext<WeatherContextValue | null>(null);

export function useWeather() {
  return useContext(WeatherContext);
}
