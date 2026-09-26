import React, { useState } from "react";
import { useWeather } from "../src/context/WeatherContext";
import { WEATHER_BACKGROUNDS } from "../src/lib/backgrounds";
import PrepareHeader from "../src/components/PrepareHeader";
import GreetingCard from "../src/components/GreetingCard";
import WeeklyForecast from "../src/components/WeeklyForecast";
import AgentChatBar from "../src/components/AgentChatBar";
import CenterHero from "../src/components/CenterHero";
import PreparationPanel from "../src/components/PreparationPanel";

export default function HomeScreen() {
  const ctx = useWeather();
  const brief = ctx?.brief;
  const isExpanded = Boolean(ctx?.chatOpen);

  // Resolved dynamic background theme based on weather
  const theme = brief?.weatherTheme || "cloudy";
  const bg = WEATHER_BACKGROUNDS[theme] || WEATHER_BACKGROUNDS.cloudy;

  return (
    <div
      className="relative min-h-screen w-full flex flex-col font-sans transition-all duration-700 ease-in-out overflow-x-hidden bg-[#FAF8F4]"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Subtle textured overlay for visual depth */}
      <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen max-w-[1234px] mx-auto w-full">
        {/* Top Header Navigation */}
        <PrepareHeader />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-2 lg:px-4 flex flex-col justify-center">
          {/* ================= DESKTOP 3-COLUMN LAYOUT (Figma node 416:8537 / Frame 211) ================= */}
          <div className="hidden lg:flex flex-row items-end justify-between w-full max-w-[1202px] mx-auto min-h-[713px] h-[713px]">
            {/* Left Column: Left side panel (426px x 697px / 713px with 8px left/right padding, Figma node 461:10584) */}
            <div
              data-name="left panel"
              className={`w-[426px] ${
                isExpanded ? "h-[713px]" : "h-[697px]"
              } px-2 flex flex-col justify-between items-start flex-shrink-0 transition-all duration-300`}
            >
              {!isExpanded && <GreetingCard />}

              {/* Weekly Forecast & Planning Agent Container (Figma node 461:10495 / 416:8537) */}
              <div
                data-name="Chat Window_Weekly forecast"
                className={`w-full max-w-[410px] rounded-[22px] p-2 border border-[#D5CFC4] bg-paper-glass effect-glass-bg transition-all duration-300 ease-in-out flex flex-col ${
                  isExpanded ? "h-[713px] justify-between gap-2" : "space-y-2"
                }`}
                style={{
                  backgroundColor: "rgba(240, 236, 228, 0.80)",
                  borderColor: "#D5CFC4",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <WeeklyForecast slots={brief?.weekly} />
                <AgentChatBar />
              </div>
            </div>

            {/* Center Stage: Full Outfit Model + Floating Pack Pill */}
            <div className="flex items-end justify-center flex-1 h-[713px] min-w-0">
              <CenterHero />
            </div>

            {/* Right Column: Complete Preparation Panel (289px x 713px) */}
            <div className="flex justify-end items-end flex-shrink-0 h-[713px]">
              <PreparationPanel />
            </div>
          </div>

          {/* ================= MOBILE STACKED LAYOUT (Figma: Sunny Mobile / Clear Mobile 464:10739) ================= */}
          <div className="flex lg:hidden flex-col items-center gap-6 w-full max-w-[353px] mx-auto pb-16">
            {/* 1. Greeting */}
            <GreetingCard />

            {/* 2. Center Outfit Visual Hero (Frame 130) */}
            <div className="w-full flex justify-center py-2">
              <CenterHero />
            </div>

            {/* 3. Preparation Details Card (Main Console Hug, 464:11077) */}
            <PreparationPanel />
          </div>
        </main>
      </div>

      {/* ================= MOBILE CHAT OVERLAY (Figma node 464:10329: Chat Open Mobile) ================= */}
      {isExpanded && (
        <div
          data-name="Mobile Chat Overlay"
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) ctx?.closeChat();
          }}
        >
          <div
            data-name="Chat Open Mobile"
            className="w-full max-w-[385px] h-[697px] max-h-[92vh] rounded-t-[28px] sm:rounded-[28px] p-3 border border-[#D5CFC4] bg-paper-glass effect-glass-bg flex flex-col justify-between shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "rgba(240, 236, 228, 0.94)",
              borderColor: "#D5CFC4",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <WeeklyForecast slots={brief?.weekly} />
            <AgentChatBar />
          </div>
        </div>
      )}
    </div>
  );
}
