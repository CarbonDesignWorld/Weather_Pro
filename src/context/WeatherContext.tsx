import React, { createContext, useContext } from "react";
import { DayBrief, LocationInfo } from "../lib/types";

export interface WeatherContextValue {
  brief: DayBrief | null;
  loading: boolean;
  error: string | null;
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  openLocationModal: () => void;
  openChatWithPrompt: (prompt: string) => void;
  openOverlay: (type: "wear" | "pack") => void;
}

export const WeatherContext = createContext<WeatherContextValue | null>(null);

export function useWeather() {
  return useContext(WeatherContext);
}
