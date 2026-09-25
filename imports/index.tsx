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
      <div className="relative z-10 flex flex-col min-h-screen max-w-[1440px] mx-auto w-full">
        {/* Top Header Navigation */}
        <PrepareHeader />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 lg:px-8 py-2 lg:py-6">
          {/* ================= DESKTOP 3-COLUMN LAYOUT ================= */}
          <div className="hidden lg:grid grid-cols-[380px_1fr_380px] gap-8 items-start justify-between w-full h-full min-h-[700px]">
            {/* Left Column: Greeting + Weekly Forecast & Agent Chat */}
            <div className="flex flex-col gap-6 justify-start w-full">
              <GreetingCard />

              {/* Weekly Forecast & Planning Agent Container */}
              <div
                className="w-full max-w-[390px] rounded-[24px] p-2 shadow-lg border border-white/50 space-y-2"
                style={{
                  backgroundColor: "rgba(240, 236, 228, 0.92)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <WeeklyForecast slots={brief?.weekly} />
                <AgentChatBar />
              </div>
            </div>

            {/* Center Stage: Full Outfit Model + Floating Pack Pill */}
            <div className="flex items-center justify-center w-full h-full">
              <CenterHero />
            </div>

            {/* Right Column: Complete Preparation Panel */}
            <div className="flex justify-end w-full">
              <PreparationPanel />
            </div>
          </div>

          {/* ================= MOBILE STACKED LAYOUT ================= */}
          <div className="flex lg:hidden flex-col items-center gap-6 w-full max-w-[420px] mx-auto pb-16">
            {/* 1. Greeting */}
            <GreetingCard />

            {/* 2. Center Outfit Visual Hero */}
            <div className="w-full flex justify-center py-2">
              <CenterHero />
            </div>

            {/* 3. Preparation Details Card */}
            <PreparationPanel />

            {/* 4. Weekly Forecast & Planning Agent */}
            <div
              className="w-full rounded-[24px] p-2 shadow-md border border-white/50 space-y-2"
              style={{
                backgroundColor: "rgba(240, 236, 228, 0.94)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <WeeklyForecast slots={brief?.weekly} />
              <AgentChatBar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
