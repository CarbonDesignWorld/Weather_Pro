import React from "react";
import { useWeather } from "../context/WeatherContext";
import { getNarrativeWearDescription, getNarrativeBringDescription } from "../lib/constants";

export default function PreparationPanel() {
  const ctx = useWeather();
  const brief = ctx?.brief;
  const current = brief?.current;
  const location = ctx?.location;

  const tempF = current?.tempF ?? 72;
  const tempC = current?.tempC ?? 22;
  const condition = current?.condition ?? "Clear";
  const confidence = brief?.confidence ?? 94;

  // Determine ambient aura status
  let auraColor = "#5B7FC7"; // default soft blue
  let auraLabel = "Mild";
  let auraTextColor = "#4A69A9";

  if (tempF <= 38 || condition.toLowerCase().includes("snow")) {
    auraColor = "#6A95B8";
    auraLabel = "Very Cold";
    auraTextColor = "#4A69A9";
  } else if (tempF <= 55) {
    auraColor = "#7FA9C7";
    auraLabel = "Cool";
    auraTextColor = "#4A69A9";
  } else if (tempF <= 72) {
    auraColor = "#91B3A8";
    auraLabel = "Comfortable";
    auraTextColor = "#3E6B5C";
  } else if (tempF <= 84) {
    auraColor = "#E59866";
    auraLabel = "Warm";
    auraTextColor = "#C45A45";
  } else {
    auraColor = "#D96B52";
    auraLabel = "Hot";
    auraTextColor = "#C45A45";
  }

  // Format current date and time
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = today.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  // Hourly slots (first 4 slots)
  const hourlySlots = brief?.hourly?.slice(0, 4) || [
    { displayTime: "9:00 am", tempF: 70, tempC: 21, conditionCode: 0 },
    { displayTime: "10:00 am", tempF: 72, tempC: 22, conditionCode: 0 },
    { displayTime: "11:00 am", tempF: 74, tempC: 23, conditionCode: 1 },
    { displayTime: "12:00 pm", tempF: 76, tempC: 24, conditionCode: 1 },
  ];

  // Overview copy
  const overviewCopy = brief?.nowDescription || 
    (brief?.wear?.description 
      ? `You can expect ${condition.toLowerCase()} and steady conditions today. ${brief.wear.description}`
      : `You can expect steady conditions today with comfortable temperatures. Wear breathable layers.`);

  const wearNarrative = getNarrativeWearDescription(brief?.wear?.icons || [], tempF, condition);
  const bringNarrative = getNarrativeBringDescription(brief?.pack?.icons || [], tempF, condition);

  return (
    <div
      data-name="Preparation Panel"
      className="w-full max-w-[390px] rounded-[28px] p-5 shadow-xl border border-white/60 flex flex-col gap-4 text-[#2E2A26] overflow-y-auto"
      style={{
        backgroundColor: "rgba(240, 236, 228, 0.94)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Top Ambient Aura Status */}
      <div className="flex items-center gap-3 pt-1">
        <div
          className="w-6 h-6 rounded-full blur-[2px] shadow-sm flex-shrink-0"
          style={{ backgroundColor: auraColor }}
        />
        <span
          className="text-[22px] font-bold tracking-tight font-sans"
          style={{ color: auraTextColor }}
        >
          {auraLabel}
        </span>
      </div>

      {/* Inner White Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E4DFD6] flex flex-col gap-3.5">
        {/* Location Search Pill */}
        <div
          onClick={() => ctx?.openLocationModal()}
          className="flex items-center justify-between bg-white border border-[#D5CFC4] rounded-full px-3.5 py-1.5 cursor-pointer transition hover:border-[#4A69A9]"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs text-[#4A69A9]">📍</span>
            <span className="text-xs font-medium text-[#2E2A26] truncate">
              {location ? `${location.city}, ${location.region}` : "Select Location"}
            </span>
          </div>
          <span className="text-[10px] text-[#8C857B] uppercase tracking-wider font-semibold">
            Change
          </span>
        </div>

        <div className="border-b border-[#E4DFD6]" />

        {/* Today's Overview */}
        <div className="space-y-1.5">
          <h3 className="font-serif-editorial font-bold text-[15px] text-[#2E2A26]">
            Today’s Overview
          </h3>
          <p className="font-serif-editorial text-[12.5px] text-[#4A453E] leading-[1.5]">
            {overviewCopy}
          </p>
        </div>

        {/* Weather Tag Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-[#5076B8] text-white text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-xs">
            <span>✦</span> {condition.split(" ")[0]}
          </span>
          <span className="bg-[#5076B8] text-white text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-xs">
            <span>❄</span> {auraLabel}
          </span>
          <span className="bg-[#5076B8] text-white text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-xs">
            <span>༄</span> {current?.windMph ? `${current.windMph} mph` : "Calm"}
          </span>
        </div>

        {/* Date, Time & Current Temperature */}
        <div className="space-y-1 text-xs text-[#6B655B] font-medium pt-1">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span>{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌡</span>
            <span className="font-semibold text-[#2E2A26]">
              {tempF}°F | {tempC}°C
            </span>
          </div>
        </div>

        <div className="border-b border-[#E4DFD6]" />

        {/* Hourly Forecast */}
        <div className="space-y-2">
          <h4 className="font-serif-editorial font-bold text-[14px] text-[#2E2A26]">
            Hourly Forecast
          </h4>
          <div className="grid grid-cols-4 gap-1.5">
            {hourlySlots.map((h, i) => (
              <div
                key={i}
                className="bg-[#FAF8F4] border border-[#E4DFD6] rounded-xl p-2 flex flex-col items-center gap-1 shadow-2xs"
              >
                <div
                  className="w-4 h-4 rounded-full shadow-xs"
                  style={{
                    background:
                      h.tempF >= 75
                        ? "radial-gradient(circle, #F4A261 0%, #E76F51 100%)"
                        : "radial-gradient(circle, #7FA9C7 0%, #4A69A9 100%)",
                  }}
                />
                <div className="text-center">
                  <div className="text-[11px] font-semibold text-[#2E2A26] leading-none">
                    {h.tempF}°F
                  </div>
                  <div className="text-[9px] text-[#8C857B] mt-0.5 leading-none">
                    {h.tempC}°C
                  </div>
                </div>
                <span className="text-[9px] text-[#6B655B] leading-none mt-0.5">
                  {h.displayTime.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="text-center py-1">
        <span className="font-sans font-bold text-[18px] text-[#C45A45] tracking-tight">
          Confidence {confidence}%
        </span>
      </div>

      {/* What to wear */}
      <div className="space-y-1.5">
        <h3 className="font-serif-editorial font-bold text-[16px] text-[#2E2A26]">
          What to wear
        </h3>
        <p className="font-serif-editorial text-[12.5px] text-[#4A453E] leading-[1.5]">
          {wearNarrative}
        </p>
      </div>

      {/* What to bring */}
      <div className="space-y-1.5">
        <h3 className="font-serif-editorial font-bold text-[16px] text-[#2E2A26]">
          What to bring
        </h3>
        <p className="font-serif-editorial text-[12.5px] text-[#4A453E] leading-[1.5]">
          {bringNarrative}
        </p>
      </div>

      {/* Trending Banner (Shop Card Preview) */}
      <div className="w-full pt-1">
        <img
          src="/trending_banner.png"
          alt="Explore whats trending this season"
          className="w-full h-auto rounded-2xl shadow-sm object-cover border border-[#D5CFC4]"
        />
      </div>
    </div>
  );
}
