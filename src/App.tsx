import React, { useState, useEffect, useCallback } from "react";
import HomeScreen from "#imports/index";
import WearPackOverlay, { type OverlayType } from "./WearPackOverlay";
import ChatView from "./ChatView";
import { WeatherContext, WeatherContextValue } from "./context/WeatherContext";
import { DayBrief, LocationInfo } from "./lib/types";
import { resolveUserLocation, fetchDayBrief, saveLocation } from "./lib/weather";
import { requestCopyGeneration } from "./lib/apiClient";

export default function WeatherApp() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [brief, setBrief] = useState<DayBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | null>(null);

  // Initial location resolution
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const loc = await resolveUserLocation();
        if (active) setLocation(loc);
      } catch (err: any) {
        if (active) setError(err?.message || "Failed to resolve location");
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;
    let active = true;

    async function loadWeather() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDayBrief(location);
        if (!active) return;
        setBrief(data);
        setLoading(false);

        // Asynchronously request LLM copy generation (Step 5 in Build Spec)
        requestCopyGeneration(data)
          .then((copy) => {
            if (!active) return;
            setBrief((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                headline: (copy.headline && typeof copy.headline === "string" ? copy.headline.trim().replace(/[\r\n]+/g, " ").slice(0, 25) : prev.headline),
                nowDescription: copy.nowDescription || prev.nowDescription,
                wear: {
                  ...prev.wear,
                  description: copy.wearDescription || prev.wear.description,
                },
                pack: {
                  ...prev.pack,
                  description: copy.packDescription || prev.pack.description,
                },
                hourly: prev.hourly.map((h, i) =>
                  i === 0 && copy.nowDescription ? { ...h, description: copy.nowDescription } : h
                ),
                meta: {
                  ...prev.meta,
                  copySource: "llm",
                },
              };
            });
          })
          .catch((err) => {
            console.warn("Async LLM copy enrichment skipped:", err);
          });
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Failed to load weather");
          setLoading(false);
        }
      }
    }

    loadWeather();
    return () => {
      active = false;
    };
  }, [location]);

  const handleSelectLocation = useCallback((newLoc: LocationInfo) => {
    saveLocation(newLoc);
    setLocation(newLoc);
  }, []);

  const openChatWithPrompt = useCallback((promptText: string) => {
    setChatSeed(promptText || null);
    setChatOpen(true);
  }, []);

  const openOverlay = useCallback((type: "wear" | "pack") => {
    setOverlay(type);
  }, []);

  const contextValue: WeatherContextValue = {
    brief,
    loading,
    error,
    location: location || { city: "Locating...", region: "", lat: 0, lon: 0, timezone: "auto" },
    setLocation: handleSelectLocation,
    openLocationModal: () => {},
    openChatWithPrompt,
    openOverlay,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      <div className="size-full overflow-x-hidden">
        <div className="weather-app-root h-full w-full min-w-0">
          <HomeScreen />
        </div>
      </div>

      <WearPackOverlay
        open={overlay}
        brief={brief}
        onClose={() => setOverlay(null)}
        onSwitch={setOverlay}
      />

      <ChatView
        open={chatOpen}
        initialMessage={chatSeed}
        brief={brief}
        onClose={() => {
          setChatOpen(false);
          setChatSeed(null);
        }}
      />
    </WeatherContext.Provider>
  );
}
