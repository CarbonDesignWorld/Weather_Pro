import React from "react";
import { useWeather } from "../context/WeatherContext";

export default function PrepareHeader() {
  const ctx = useWeather();
  const location = ctx?.location;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 z-20">
      {/* Brand Monogram "P" */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center justify-center transition-transform hover:scale-105" aria-label="Prepare Home">
          <img src="/logo.png" alt="Prepare Logo" className="h-9 w-9 object-contain" />
        </a>
      </div>

      {/* Mobile Location Search Pill in Header */}
      <div className="lg:hidden flex items-center bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D5CFC4] shadow-xs cursor-pointer"
        onClick={() => ctx?.openLocationModal()}
      >
        <span className="text-xs mr-1 text-[#4A69A9]">📍</span>
        <span className="text-xs font-medium text-[#2E2A26] truncate max-w-[150px]">
          {location ? `${location.city}, ${location.region}` : "Select Location"}
        </span>
      </div>

      {/* Right Actions: Desktop Auth vs Mobile Profile */}
      <div className="flex items-center gap-3">
        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            className="bg-[#4A69A9] text-white px-5 py-1.5 rounded-full text-xs font-medium hover:bg-[#3A5384] transition shadow-xs cursor-pointer"
          >
            Sign Up
          </button>
          <button
            type="button"
            className="bg-[#4A69A9] text-white px-5 py-1.5 rounded-full text-xs font-medium hover:bg-[#3A5384] transition shadow-xs cursor-pointer"
          >
            Log In
          </button>
        </div>

        {/* Mobile Circle Action Buttons */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            aria-label="Profile"
            className="w-8 h-8 rounded-full bg-[#4A69A9] text-white flex items-center justify-center text-xs shadow-xs"
          >
            👤
          </button>
          <button
            type="button"
            aria-label="Chat"
            onClick={() => ctx?.openChatWithPrompt("What should I prepare for today?")}
            className="w-8 h-8 rounded-full bg-[#4A69A9] text-white flex items-center justify-center text-xs shadow-xs"
          >
            💬
          </button>
        </div>
      </div>
    </header>
  );
}
