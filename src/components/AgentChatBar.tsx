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
    <div className="w-full space-y-3">
      {/* Quick Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => handleChipClick("How should I dress for tonight?")}
          className="bg-[#4A69A9] text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium hover:bg-[#3A5384] transition shadow-xs whitespace-nowrap cursor-pointer"
        >
          Dress for the night
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("What should I wear for a formal or outdoor event today?")}
          className="bg-[#4A69A9] text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium hover:bg-[#3A5384] transition shadow-xs whitespace-nowrap cursor-pointer"
        >
          Dress for an event
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("What key items should I pack for vacation this week?")}
          className="bg-[#4A69A9] text-white text-[11px] px-3.5 py-1.5 rounded-full font-medium hover:bg-[#3A5384] transition shadow-xs whitespace-nowrap cursor-pointer"
        >
          Pack for vacation
        </button>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white rounded-2xl p-1.5 pl-4 flex items-center justify-between border border-[#E4DFD6] shadow-xs">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you planning for?"
            className="text-xs lg:text-sm text-[#2E2A26] placeholder-[#8C857B] outline-none flex-1 bg-transparent pr-2"
          />
          <button
            type="submit"
            className="bg-[#4A69A9] text-white text-xs px-4 py-2 rounded-xl font-medium hover:bg-[#3A5384] transition shadow-xs cursor-pointer flex-shrink-0"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
