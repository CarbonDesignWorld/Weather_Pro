import React, { useState, useEffect, useCallback } from "react";
import HomeScreen from "#imports/index";
import WearPackOverlay, { type OverlayType } from "./WearPackOverlay";
import ChatView from "./ChatView";
import { DayBrief, LocationInfo } from "./lib/types";
import { resolveUserLocation, fetchDayBrief, saveLocation } from "./lib/weather";
import { requestCopyGeneration, sendChatMessage } from "./lib/apiClient";
import { WeatherContext, WeatherContextValue, ChatMessageItem } from "./context/WeatherContext";

export default function WeatherApp() {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [brief, setBrief] = useState<DayBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

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

  const handleSendChatMessage = useCallback(async (text: string, customHistory?: ChatMessageItem[]) => {
    if (!text.trim() || !brief) return;
    const userMsg: ChatMessageItem = { id: Date.now(), role: "user", text: text.trim() };
    const currentList = customHistory !== undefined ? customHistory : messages;
    const updated = [...currentList, userMsg];
    setMessages(updated);
    setChatLoading(true);
    setChatError(null);

    const apiMessages = updated.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const res = await sendChatMessage(apiMessages, brief);
      if (res.message) {
        const agentMsg: ChatMessageItem = {
          id: Date.now() + 1,
          role: "assistant",
          text: res.message,
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else if (res.error) {
        setChatError(res.error);
      }
    } catch (err: any) {
      setChatError(err?.message || "Failed to reach agent");
    } finally {
      setChatLoading(false);
    }
  }, [brief, messages]);

  const openChatWithPrompt = useCallback((promptText: string) => {
    setChatSeed(promptText || null);
    setChatOpen(true);
    if (promptText && promptText.trim()) {
      handleSendChatMessage(promptText.trim(), []);
    }
  }, [handleSendChatMessage]);

  const handleCloseChat = useCallback(() => {
    setChatOpen(false);
    setChatSeed(null);
  }, []);

  // Close chat on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && chatOpen) {
        handleCloseChat();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen, handleCloseChat]);

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
    chatOpen,
    chatSeed,
    closeChat: handleCloseChat,
    messages,
    chatLoading,
    chatError,
    sendChatMessage: handleSendChatMessage,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      <div className="size-full overflow-x-hidden overflow-y-auto">
        <div className="weather-app-root min-h-full w-full min-w-0">
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
        onClose={handleCloseChat}
      />
    </WeatherContext.Provider>
  );
}
