import React, { useState, useEffect, useRef } from "react";
import { useWeather } from "./context/WeatherContext";

export function ChatCard({ className }: { className?: string }) {
  const ctx = useWeather();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = ctx?.messages || [];
  const loading = ctx?.chatLoading || false;
  const errorMsg = ctx?.chatError || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleSend(text: string) {
    if (!text.trim() || loading || !ctx) return;
    setInput("");
    ctx.sendChatMessage(text.trim());
  }

  return (
    <div
      className={`flex-1 flex flex-col size-full min-h-0 rounded-[28px] lg:rounded-[42px] overflow-hidden bg-[#f0ece4] ${className || ""}`}
    >
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-[16px] lg:px-[32px] pt-[20px] lg:pt-[32px] pb-[16px] flex flex-col gap-[14px] lg:gap-[16px] min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-12 text-[#6b655b] text-[15px]" style={{ fontFamily: "Inter, sans-serif" }}>
            Ask anything about today&apos;s weather, what to wear, or item substitutions.
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div
                className="bg-[#faf8f4] text-[#2e2a26] rounded-[22px] px-[18px] lg:px-[24px] py-[12px] lg:py-[15px] max-w-[85%] lg:max-w-[60%] text-[15px] leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start">
              <div
                className="bg-white text-[#2e2a26] rounded-[22px] px-[18px] lg:px-[24px] py-[12px] lg:py-[15px] max-w-[85%] lg:max-w-[60%] text-[15px] leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {msg.text}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">
            <div
              className="bg-white rounded-[22px] px-[20px] py-[14px] text-[#6b655b] text-[14px] italic"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Thinking...
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="text-center py-2 text-red-600 text-[14px]">
            {errorMsg}.{" "}
            <button
              onClick={() => {
                const lastUser = [...messages].reverse().find((m) => m.role === "user");
                if (lastUser) ctx?.sendChatMessage(lastUser.text);
              }}
              className="underline cursor-pointer bg-transparent border-none text-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-[14px] lg:px-[24px] pb-[14px] lg:pb-[24px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="rounded-[22px] flex items-center px-[18px] lg:px-[24px] py-[14px] lg:py-[18px] gap-[12px] bg-[#faf8f4]"
        >
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about today.."
            maxLength={500}
            className="flex-1 bg-transparent border-none outline-none text-[#2e2a26] text-[16px] placeholder-[#6b655b]"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`shrink-0 rounded-[14px] px-[16px] py-[8px] text-[14px] font-medium border-none transition-colors duration-150 ${
              input.trim() && !loading
                ? "bg-[#4a69a9] hover:bg-[#3a5384] active:bg-[#2a3d61] text-white cursor-pointer shadow-[0px_2px_8px_rgba(28,42,68,0.25)]"
                : "bg-[#d5cfc4] text-[#6b655b] cursor-not-allowed opacity-60"
            }`}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChatView({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[#faf8f4]"
      style={{
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 300ms ease",
      }}
    >
      {/* Mobile Header with Close button */}
      <div className="flex justify-between items-center px-4 h-[60px] border-b border-[#e4dfd6] shrink-0 bg-[#faf8f4]">
        <span className="font-['Source_Serif_Pro:Semi_Bold','Source_Serif_4',serif] font-semibold text-[20px] text-[#2e2a26]">
          Today Assistant
        </span>
        <button
          onClick={onClose}
          className="cursor-pointer bg-transparent border-none text-[#6b655b] underline text-[16px] transition-colors duration-150 hover:text-[#2e2a26]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          Close
        </button>
      </div>

      {/* Mobile Chat Card */}
      <div className="flex-1 flex flex-col p-3 min-h-0">
        <ChatCard />
      </div>
    </div>
  );
}
