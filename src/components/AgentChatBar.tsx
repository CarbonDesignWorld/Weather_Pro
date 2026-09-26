import React, { useState, useEffect, useRef } from "react";
import { useWeather } from "../context/WeatherContext";

export default function AgentChatBar() {
  const ctx = useWeather();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isExpanded = Boolean(ctx?.chatOpen);
  const messages = ctx?.messages || [];
  const loading = ctx?.chatLoading || false;
  const errorMsg = ctx?.chatError || null;

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isExpanded]);

  const handleChipClick = (prompt: string) => {
    ctx?.openChatWithPrompt(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    if (!isExpanded) {
      ctx?.openChatWithPrompt(text);
    } else {
      ctx?.sendChatMessage(text);
    }
  };

  // ================= EXPANDED STATE (Figma: Property 1=Expanded Chat Window) =================
  if (isExpanded) {
    return (
      <div
        data-name="Chat Window views"
        className="bg-white rounded-[22px] p-2 flex flex-col justify-between shadow-xs flex-1 min-h-0 overflow-hidden"
      >
        {/* Scrollable Conversation History (Chat Cells) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2 flex flex-col gap-3 no-scrollbar">
          {messages.length === 0 ? (
            <div className="flex-1" />
          ) : (
            messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div
                    className="bg-[#FAF8F4] text-[#2E2A26] rounded-[18px] px-3.5 py-2.5 max-w-[85%] border border-[#E4DFD6] text-[14px] leading-relaxed shadow-2xs"
                    style={{ fontFamily: '"Fira Sans", sans-serif' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-start">
                  <div
                    className="bg-[#FAF8F4] text-[#2E2A26] rounded-[18px] px-3.5 py-2.5 max-w-[85%] border border-[#E4DFD6] text-[14px] leading-relaxed shadow-2xs"
                    style={{ fontFamily: '"Fira Sans", sans-serif' }}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            )
          )}

          {loading && (
            <div className="flex justify-start">
              <div
                className="bg-[#FAF8F4] text-[#6B655B] rounded-[18px] px-3.5 py-2.5 text-[14px] italic border border-[#E4DFD6]"
                style={{ fontFamily: '"Fira Sans", sans-serif' }}
              >
                Thinking...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-center py-1 text-red-600 text-[13px]">
              {errorMsg}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pinned Bottom Chat Box Container */}
        <form onSubmit={handleSubmit} className="w-full shrink-0">
          <div
            data-name="Chat Box"
            className="bg-[#FAF8F4] rounded-[22px] p-4 flex flex-col justify-between gap-3 min-h-[86px] border border-[#E4DFD6] shadow-full-card"
            style={{
              backgroundColor: "#FAF8F4",
              borderColor: "#E4DFD6",
              boxShadow: "0px -2px 4px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <input
              type="text"
              value={input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you planning for?"
              className="font-b1 text-[#2E2A26] placeholder-[#2E2A26] outline-none w-full bg-transparent"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#4A69A9] text-white font-btn py-1.5 px-4 rounded-[8px] hover:bg-[#3A5384] transition shadow-xs cursor-pointer flex-shrink-0 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ================= MINIMIZED / DEFAULT STATE (Figma: Property 1=Minimized Chat Window) =================
  return (
    <div
      data-name="Chat Window views"
      className="bg-white rounded-[22px] p-2 flex flex-col gap-2 shadow-xs transition-all duration-300"
    >
      {/* Quick Action Chips (Prompt Suggestions) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => handleChipClick("Dress for the night")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Dress for the night
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("Dress for an event")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Dress for an event
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("Pack for vacation")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Pack for vacation
        </button>
      </div>

      {/* Chat Box Container */}
      <form onSubmit={handleSubmit} className="w-full">
        <div
          data-name="Chat Box"
          onClick={() => ctx?.openChat()}
          className="bg-[#FAF8F4] rounded-[22px] p-4 flex flex-col justify-between gap-3 min-h-[86px] border border-[#E4DFD6] shadow-full-card cursor-text"
          style={{
            backgroundColor: "#FAF8F4",
            borderColor: "#E4DFD6",
            boxShadow: "0px -2px 4px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <input
            type="text"
            value={input}
            onFocus={() => ctx?.openChat()}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you planning for?"
            className="font-b1 text-[#2E2A26] placeholder-[#2E2A26] outline-none w-full bg-transparent"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#4A69A9] text-white font-btn py-1.5 px-4 rounded-[8px] hover:bg-[#3A5384] transition shadow-xs cursor-pointer flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
