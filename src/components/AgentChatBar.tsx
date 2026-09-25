import React, { useState } from "react";
import { useWeather } from "../context/WeatherContext";

export default function AgentChatBar() {
  const ctx = useWeather();
  const [input, setInput] = useState("");

  const handleChipClick = (prompt: string) => {
    ctx?.openChatWithPrompt(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    ctx?.openChatWithPrompt(input.trim());
    setInput("");
  };

  return (
    <div
      data-name="Chat Window views"
      className="bg-white rounded-[22px] p-2 flex flex-col gap-2 shadow-xs"
    >
      {/* Quick Action Chips (Prompt Suggestions) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => handleChipClick("How should I dress for tonight?")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Dress for the night
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("What should I wear for a formal or outdoor event today?")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Dress for an event
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("What key items should I pack for vacation this week?")}
          className="bg-[#4A69A9] text-white font-b2 py-2 px-4 rounded-full hover:bg-[#3A5384] transition shadow-2xs whitespace-nowrap cursor-pointer flex-shrink-0"
        >
          Pack for vacation
        </button>
      </div>

      {/* Chat Box Container */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-[#FAF8F4] rounded-[22px] p-4 flex flex-col justify-between gap-3 min-h-[86px] border border-[#E4DFD6]/60">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you planning for?"
            className="font-b1 text-[#2E2A26] placeholder-[#2E2A26] outline-none w-full bg-transparent"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#4A69A9] text-white font-btn py-1.5 px-4 rounded-lg hover:bg-[#3A5384] transition shadow-xs cursor-pointer flex-shrink-0"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
