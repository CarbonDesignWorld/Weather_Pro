import React from "react";
import { DailyForecastSlot } from "../lib/types";
import { useWeather } from "../context/WeatherContext";

interface WeeklyForecastProps {
  slots?: DailyForecastSlot[];
}

interface OrbStyle {
  color: string;
  boxShadow: string;
  label: string;
}

export function getFeelsLikeOrbStyle(tempF: number): OrbStyle {
  if (tempF <= 35) {
    return {
      color: "#7FA9C7",
      boxShadow: "0 0 2px #7FA9C7, 0 0 4px #7FA9C7, 0 0 13px #7FA9C7",
      label: "Very Cold",
    };
  }
  if (tempF <= 50) {
    return {
      color: "#8FAFC4",
      boxShadow: "0 0 3px #8FAFC4, 0 0 6px #8FAFC4, 0 0 22px #8FAFC4",
      label: "Cold",
    };
  }
  if (tempF <= 64) {
    return {
      color: "#9CB8A8",
      boxShadow: "0 0 2px #9CB8A8, 0 0 4px #9CB8A8, 0 0 13px #9CB8A8",
      label: "Cool",
    };
  }
  if (tempF <= 72) {
    return {
      color: "#D3C423",
      boxShadow: "0 0 3px #D3C423, 0 0 6px #D3C423, 0 0 20px #D3C423",
      label: "Mild",
    };
  }
  if (tempF <= 84) {
    return {
      color: "#E5A86E",
      boxShadow: "0 0 2px #E5A86E, 0 0 4px #E5A86E, 0 0 13px #E5A86E",
      label: "Warm",
    };
  }
  return {
    color: "#D9755B",
    boxShadow: "0 0 2px #D9755B, 0 0 4px #D9755B, 0 0 13px #D9755B",
    label: "Hot",
  };
}

export default function WeeklyForecast({ slots = [] }: WeeklyForecastProps) {
  const ctx = useWeather();
  const isExpandedOrOpen = Boolean(ctx?.chatOpen);

  // Default mock 7-day slots if API is still loading
  const displaySlots = slots.length > 0 ? slots.slice(0, 7) : [
    { dayName: "Monday", maxTempF: 75, maxTempC: 24, conditionCode: 0, date: "", minTempF: 60, minTempC: 16, condition: "Sunny" },
    { dayName: "Tuesday", maxTempF: 72, maxTempC: 22, conditionCode: 1, date: "", minTempF: 58, minTempC: 14, condition: "Clear" },
    { dayName: "Wednesday", maxTempF: 68, maxTempC: 20, conditionCode: 61, date: "", minTempF: 54, minTempC: 12, condition: "Rain" },
    { dayName: "Thursday", maxTempF: 70, maxTempC: 21, conditionCode: 3, date: "", minTempF: 55, minTempC: 13, condition: "Overcast" },
    { dayName: "Friday", maxTempF: 74, maxTempC: 23, conditionCode: 0, date: "", minTempF: 59, minTempC: 15, condition: "Sunny" },
    { dayName: "Saturday", maxTempF: 60, maxTempC: 16, conditionCode: 61, date: "", minTempF: 48, minTempC: 9, condition: "Rain" },
    { dayName: "Sunday", maxTempF: 61, maxTempC: 16, conditionCode: 3, date: "", minTempF: 50, minTempC: 10, condition: "Overcast" },
  ];

  return (
    <div className="w-full">
      {/* Header Frame (Figma Frame 155 / Frame 122) */}
      <div className="flex items-center justify-between mb-2">
        <h2
          style={{
            fontFamily: '"Fira Sans", sans-serif',
            fontWeight: 500,
            fontSize: "23.04px",
            lineHeight: "150%",
            letterSpacing: "0px",
            color: "#6B655B",
          }}
        >
          Weekly Forecast
        </h2>

        {/* Close Icon — Only appears when expanded or Chat Window_Weekly forecast is open */}
        {isExpandedOrOpen && (
          <button
            type="button"
            data-name="Close Icon"
            onClick={() => ctx?.closeChat()}
            aria-label="Close"
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition cursor-pointer flex-shrink-0"
            title="Close forecast"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#4A69A9]"
            >
              <circle cx="9" cy="9" r="8" fill="#4A69A9" />
              <path
                d="M6 6L12 12M12 6L6 12"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 7-Day Horizontal Scroll Track (Figma Frame 113) */}
      <div className="w-full overflow-x-auto no-scrollbar pb-1">
        <div className="flex flex-row items-center gap-2 min-w-max">
          {displaySlots.map((slot, idx) => {
            const orb = getFeelsLikeOrbStyle(slot.maxTempF);

            return (
              <div
                key={idx}
                data-name="Weather Cell"
                className="w-[71px] h-[80px] bg-[#FAF8F4] rounded-[12px] py-2 px-1 flex flex-col items-center justify-between border border-[#E4DFD6] shadow-2xs transition-transform hover:scale-[1.03] flex-shrink-0 select-none cursor-default"
              >
                {/* Day Name */}
                <span className="font-b3 text-[#2E2A26] font-normal tracking-[0.02em] truncate w-full text-center">
                  {slot.dayName}
                </span>

                {/* Divider Line 2 */}
                <div className="w-full border-t border-[#E4DFD6]" />

                {/* Icon and Temp Frame */}
                <div className="flex items-center justify-center gap-1.5 w-full px-0.5">
                  {/* Glowing Weather Orb */}
                  <div
                    className="w-[19px] h-[19px] rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: orb.color,
                      boxShadow: orb.boxShadow,
                    }}
                    title={`${orb.label}: ${slot.maxTempF}°F`}
                  />

                  {/* Temperature Stack */}
                  <div className="flex flex-col font-b3 text-[#6B655B] leading-[1.2] text-left">
                    <span>{slot.maxTempF}°F</span>
                    <span>{slot.maxTempC}°C</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
