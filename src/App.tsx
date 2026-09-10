import { useCallback, useEffect, useRef, useState } from "react";
import HomeScreen from "#imports/index";
import WearPackOverlay, { type OverlayType } from "./WearPackOverlay";
import ChatView from "./ChatView";

function formatHour(h: number): string {
  const period = h < 12 ? "am" : "pm";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

// All 8 three-hour slots across 24 hours: 12am, 3am, 6am, …, 9pm
const ALL_SLOTS = [0, 3, 6, 9, 12, 15, 18, 21].map(formatHour);

function useTimestamps() {
  useEffect(() => {
    const container = document.querySelector('[data-name="Time Stamps"]');
    if (!container) return;

    // Replace static <p> tags with dynamic ones using createElement (avoids innerHTML source-mapping issues)
    while (container.firstChild) container.removeChild(container.firstChild);
    ALL_SLOTS.forEach((label) => {
      const p = document.createElement("p");
      p.className = "relative shrink-0 w-full";
      p.textContent = label;
      container.appendChild(p);
    });

    // Scroll the panel so the current 3-hour block is near the top
    const currentSlot = Math.floor(new Date().getHours() / 3);
    const scrollTarget = currentSlot * 217; // ~24px text + 193px gap per slot
    const panel = document.querySelector('[data-name="Time and conditions"]');
    if (panel) panel.scrollTop = Math.max(0, scrollTarget - 53);
  }, []);
}

function useDOMInteractions(
  overlayRef: React.RefObject<(v: OverlayType) => void>,
  openChatRef: React.RefObject<(msg: string) => void>,
) {
  useEffect(() => {
    // Icon cards → wear / pack overlay
    const cells = document.querySelectorAll('[data-name="Frame Background Cell"]');
    const wearCell = cells[0] as HTMLElement | undefined;
    const packCell = cells[1] as HTMLElement | undefined;
    const openWear = () => overlayRef.current?.("wear");
    const openPack = () => overlayRef.current?.("pack");
    wearCell?.addEventListener("click", openWear);
    packCell?.addEventListener("click", openPack);
    if (wearCell) wearCell.style.cursor = "pointer";
    if (packCell) packCell.style.cursor = "pointer";

    // Prompt cards + chat box → chat view
    const promptContainer = document.querySelector('[data-name="Suggestion Prompt"]');
    const chatBox = document.querySelector('[data-name="Chat Box"]');
    const cardHandlers: Array<[Element, EventListener]> = [];
    if (promptContainer) {
      Array.from(promptContainer.children).forEach((card) => {
        const text = card.textContent?.trim() ?? "";
        const handler: EventListener = () => openChatRef.current?.(text);
        card.addEventListener("click", handler);
        cardHandlers.push([card, handler]);
      });
    }
    const chatBoxHandler: EventListener = () => openChatRef.current?.("");
    chatBox?.addEventListener("click", chatBoxHandler);

    return () => {
      wearCell?.removeEventListener("click", openWear);
      packCell?.removeEventListener("click", openPack);
      cardHandlers.forEach(([el, fn]) => el.removeEventListener("click", fn));
      chatBox?.removeEventListener("click", chatBoxHandler);
    };
  }, []); // refs are stable — safe to omit
}

function WeatherApp() {
  const [overlay, setOverlay] = useState<OverlayType>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatSeed, setChatSeed] = useState<string | null>(null);

  useTimestamps();

  const setOverlayRef = useRef(setOverlay);
  setOverlayRef.current = setOverlay;

  const openChat = useCallback((msg: string) => {
    setChatSeed(msg || null);
    setChatOpen(true);
  }, []);
  const openChatRef = useRef(openChat);
  openChatRef.current = openChat;

  useDOMInteractions(setOverlayRef, openChatRef);

  return (
    <>
      <div className="size-full overflow-x-auto">
        <div className="weather-app-root h-full min-w-max">
          <HomeScreen />
        </div>
      </div>
      <WearPackOverlay
        open={overlay}
        onClose={() => setOverlay(null)}
        onSwitch={setOverlay}
      />
      <ChatView
        open={chatOpen}
        initialMessage={chatSeed}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}

export default WeatherApp;
