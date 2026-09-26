import React from "react";
import { useWeather } from "../context/WeatherContext";
import { getNarrativeWearDescription, getNarrativeBringDescription } from "../lib/constants";
import { getFeelsLikeOrbStyle } from "./WeeklyForecast";
import ConditionTags from "./ConditionTags";
import calendarIcon from "../assets/figma_svgs/calendar_icon.svg";
import clockIcon from "../assets/figma_svgs/clock_icon.svg";
import thermometerIcon from "../assets/figma_svgs/thermometer_icon.svg";

export default function PreparationPanel() {
  const ctx = useWeather();
  const brief = ctx?.brief;
  const current = brief?.current;
  const location = ctx?.location;

  const tempF = current?.tempF ?? 72;
  const tempC = current?.tempC ?? 22;
  const condition = current?.condition ?? "Clear";
  const confidence = brief?.confidence ?? 94;

  // Feels-like orb style with exact color scale and multi-tier progressive glow
  const orb = getFeelsLikeOrbStyle(tempF);

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

  // Hourly slots (up to 24 slots for horizontal scrolling)
  const hourlySlots = brief?.hourly && brief.hourly.length > 0 
    ? brief.hourly 
    : [
        { displayTime: "9:00 am", tempF: 30, tempC: 6, conditionCode: 0 },
        { displayTime: "10:00 am", tempF: 30, tempC: 6, conditionCode: 0 },
        { displayTime: "11:00 am", tempF: 30, tempC: 6, conditionCode: 1 },
        { displayTime: "12:00 pm", tempF: 32, tempC: 0, conditionCode: 1 },
        { displayTime: "1:00 pm", tempF: 35, tempC: 2, conditionCode: 3 },
        { displayTime: "2:00 pm", tempF: 37, tempC: 3, conditionCode: 3 },
        { displayTime: "3:00 pm", tempF: 40, tempC: 4, conditionCode: 0 },
        { displayTime: "4:00 pm", tempF: 38, tempC: 3, conditionCode: 0 },
      ];

  // Overview copy
  const overviewCopy = brief?.nowDescription || 
    (brief?.wear?.description 
      ? `You can expect ${condition.toLowerCase()} and steady conditions today. ${brief.wear.description}`
      : `You can expect a cold morning and a high chance of snow. Wear closed shoes, a heavy jacket, and gloves today.`);

  const wearNarrative = getNarrativeWearDescription(brief?.wear?.icons || [], tempF, condition);
  const bringNarrative = getNarrativeBringDescription(brief?.pack?.icons || [], tempF, condition);

  return (
    <div
      data-name="Main Console"
      className="w-full max-w-[353px] lg:w-[289px] lg:max-w-[289px] h-auto lg:h-[713px] lg:max-h-[713px] rounded-[22px] py-4 px-2 shadow-sm border border-[#D5CFC4] bg-paper-glass effect-glass-bg flex flex-col gap-4 text-[#2E2A26] overflow-clip lg:overflow-y-auto lg:no-scrollbar select-none min-w-0"
      style={{
        backgroundColor: "rgba(240, 236, 228, 0.80)",
        borderColor: "#D5CFC4",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* 1. Temperature Components (Figma: 278:14959) */}
      <div
        data-name="Temperature Components"
        className="flex items-center gap-[13px] px-4 py-2 flex-shrink-0"
      >
        {/* Large 32px Weather Orb with progressive glow */}
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: orb.color,
            boxShadow: `0 0 4px ${orb.color}, 0 0 10px ${orb.color}, 0 0 24px ${orb.color}`,
          }}
          title={`${orb.label}: ${tempF}°F`}
        />
        {/* Weather Label */}
        <span
          style={{
            fontFamily: '"Fira Sans", sans-serif',
            fontWeight: 500,
            fontSize: "27.65px",
            lineHeight: "150%",
            letterSpacing: "0px",
            color: orb.color,
            leadingTrim: "both",
            textEdge: "cap",
          }}
        >
          {orb.label}
        </span>
      </div>

      {/* Divider Line 1 */}
      <div className="w-full border-t border-[#E4DFD6]" />

      {/* 2. Side Panel Descriptive Card (Figma: 307:4596) */}
      <div
        data-name="Side Panel Descriptive Card"
        className="w-full bg-[#FAF8F4] rounded-[22px] p-4 border border-[#E4DFD6] shadow-xs flex flex-col gap-4 flex-shrink-0"
      >
        {/* Location Indicator (Figma: Location Indicator) */}
        <div
          data-name="Location Indicator"
          onClick={() => ctx?.openLocationModal()}
          className="w-full bg-white rounded-full px-4 py-2 border border-[#E4DFD6] flex items-center gap-2 cursor-pointer hover:border-[#4A69A9] transition shadow-2xs"
          title="Change location"
        >
          <svg
            width="13"
            height="18"
            viewBox="0 0 13 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 text-[#6B655B]"
          >
            <path
              d="M6.5 0C2.91 0 0 2.91 0 6.5C0 11.375 6.5 18 6.5 18C6.5 18 13 11.375 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 8.875C5.19 8.875 4.125 7.81 4.125 6.5C4.125 5.19 5.19 4.125 6.5 4.125C7.81 4.125 8.875 5.19 8.875 6.5C8.875 7.81 7.81 8.875 6.5 8.875Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-b1 text-[#2E2A26] truncate">
            {location ? `${location.city}, ${location.region || location.country || ""}` : "New York, New York 100032"}
          </span>
        </div>

        {/* Divider Line 2 */}
        <div className="w-full border-t border-[#E4DFD6]" />

        {/* Weather Details (Today's Overview + Tags + DateTime/Temp) */}
        <div data-name="Weather details" className="flex flex-col gap-3">
          {/* Frame 168: Overview + Condition Tags (Figma: Frame 168 itemSpacing=16) */}
          <div data-name="Frame 168" className="flex flex-col gap-4">
            {/* Today's Overview Heading & Copy (Figma: Frame 165 itemSpacing=24) */}
            <div data-name="Frame 165" className="flex flex-col gap-[24px]">
              <h3
                style={{
                  fontFamily: '"Fira Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: "23.04px",
                  lineHeight: "150%",
                  letterSpacing: "0px",
                  color: "#6B655B",
                  leadingTrim: "both",
                  textEdge: "cap",
                }}
              >
                Today's Overview
              </h3>
              <p className="font-b1 leading-[150%]">
                {overviewCopy}
              </p>
            </div>

            {/* Condition Tags (Figma: Condition Frame / Daily Tag - Temperature 278:14821) */}
            <ConditionTags condition={condition} windMph={current?.windMph} humidity={current?.humidity} />
          </div>

          {/* Date, Time & Temperature (Figma: Date, time frame 284:1306) */}
          <div data-name="Date, time frame" className="space-y-2 font-b1 pt-1">
            {/* Date */}
            <div className="flex items-center gap-2">
              <img src={calendarIcon} alt="Date" className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{dateStr}</span>
            </div>
            {/* Time */}
            <div className="flex items-center gap-2">
              <img src={clockIcon} alt="Time" className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{timeStr}</span>
            </div>
            {/* Temp */}
            <div className="flex items-center gap-2">
              <img src={thermometerIcon} alt="Temperature" className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{tempF}°F | {tempC}°C</span>
            </div>
          </div>
        </div>

        {/* Divider Line 1 */}
        <div className="w-full border-t border-[#E4DFD6]" />

        {/* Hourly Forecast (Figma: Frame 166) */}
        <div data-name="Frame 166" className="space-y-2">
          <h4
            style={{
              fontFamily: '"Fira Sans", sans-serif',
              fontWeight: 500,
              fontSize: "23.04px",
              lineHeight: "150%",
              letterSpacing: "0px",
              color: "#6B655B",
              leadingTrim: "both",
              textEdge: "cap",
            }}
          >
            Hourly Forecast
          </h4>
          {/* Horizontal scroll strip */}
          <div className="w-full overflow-x-auto no-scrollbar pb-1">
            <div className="flex flex-row items-center gap-2 min-w-max">
              {hourlySlots.map((h, idx) => {
                const hourOrb = getFeelsLikeOrbStyle(h.tempF);
                return (
                  <div
                    key={idx}
                    data-name="Weather Cell"
                    className="w-[71px] h-[80px] bg-[#FAF8F4] rounded-[12px] p-2 flex flex-col items-center justify-between border border-[#E4DFD6] shadow-2xs transition-transform hover:scale-[1.03] flex-shrink-0 select-none cursor-default"
                  >
                    {/* Icon and Degrees Frame */}
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <div
                        className="w-[19px] h-[19px] rounded-full flex-shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: hourOrb.color,
                          boxShadow: hourOrb.boxShadow,
                        }}
                        title={`${hourOrb.label}: ${h.tempF}°F`}
                      />
                      <div className="flex flex-col font-b3 text-[#6B655B] leading-[1.2] text-left">
                        <span>{h.tempF}°F</span>
                        <span>{h.tempC}°C</span>
                      </div>
                    </div>

                    {/* Divider Line 2 */}
                    <div className="w-full border-t border-[#E4DFD6]" />

                    {/* Hour Time */}
                    <span className="font-b3 text-[#2E2A26] font-normal tracking-[0.02em] truncate w-full text-center">
                      {h.displayTime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Confidence Indicator (Figma: Frame 23) - Positioned against right margin */}
      <div data-name="Frame 23" className="w-full flex justify-end px-4 py-4 flex-shrink-0">
        <span
          style={{
            fontFamily: '"Fira Sans", sans-serif',
            fontWeight: 500,
            fontSize: "23.04px",
            lineHeight: "150%",
            letterSpacing: "0px",
            color: "#A6412C",
          }}
        >
          Confidence {confidence}%
        </span>
      </div>

      {/* Divider Line 3 */}
      <div className="w-full border-t border-[#E4DFD6]" />

      {/* 4. What to wear (Figma: Frame Background Cell 237:9290 itemSpacing=24) */}
      <div
        data-name="Frame Background Cell"
        className="w-full px-4 py-2 flex flex-col gap-[24px] flex-shrink-0"
      >
        <h3
          style={{
            fontFamily: '"Fira Sans", sans-serif',
            fontWeight: 500,
            fontSize: "23.04px",
            lineHeight: "150%",
            letterSpacing: "0px",
            color: "#6B655B",
            leadingTrim: "both",
            textEdge: "cap",
          }}
        >
          What to wear
        </h3>
        <p className="font-b1 leading-[150%]">
          {wearNarrative}
        </p>
      </div>

      {/* 5. What to bring (Figma: Frame Background Cell 237:9310 itemSpacing=24) */}
      <div
        data-name="Frame Background Cell"
        className="w-full px-4 py-2 flex flex-col gap-[24px] flex-shrink-0"
      >
        <h3
          style={{
            fontFamily: '"Fira Sans", sans-serif',
            fontWeight: 500,
            fontSize: "23.04px",
            lineHeight: "150%",
            letterSpacing: "0px",
            color: "#6B655B",
            leadingTrim: "both",
            textEdge: "cap",
          }}
        >
          What to bring
        </h3>
        <p className="font-b1 leading-[150%]">
          {bringNarrative}
        </p>
      </div>

      {/* Divider Line 2 */}
      <div className="w-full border-t border-[#E4DFD6]" />

      {/* 6. Shop Card Preview (Figma: Shop Card Preview 307:4864) */}
      <div
        data-name="Shop Card Preview"
        className="w-full h-[94px] bg-[#2E2A26] rounded-[22px] border border-[#6B655B] text-white overflow-hidden relative shadow-xs flex-shrink-0 flex items-center justify-center"
      >
        {/* Background image strip (blurred) */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-30 blur-[2px]">
          <div className="w-[70px] h-[70px] rounded-[12px] bg-[#3E3833] border border-[#6B655B] flex-shrink-0" />
          <div className="w-[70px] h-[70px] rounded-[12px] bg-[#3E3833] border border-[#6B655B] flex-shrink-0" />
          <div className="w-[70px] h-[70px] rounded-[12px] bg-[#3E3833] border border-[#6B655B] flex-shrink-0" />
          <div className="w-[70px] h-[70px] rounded-[12px] bg-[#3E3833] border border-[#6B655B] flex-shrink-0" />
        </div>
        {/* Centered text overlay */}
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <p className="font-b1 !text-white font-normal leading-[120%] text-center">
            Explore whats trending this season
          </p>
          <span className="font-b3 !text-[#D5CFC4] font-normal uppercase tracking-wider text-[10px]">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
