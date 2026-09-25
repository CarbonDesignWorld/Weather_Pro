import React from "react";
import { DailyForecastSlot } from "../lib/types";

interface WeeklyForecastProps {
  slots?: DailyForecastSlot[];
}

export default function WeeklyForecast({ slots = [] }: WeeklyForecastProps) {
  // Default mock slots if API is still loading
  const displaySlots = slots.length > 0 ? slots.slice(0, 5) : [
    { dayName: "Monday", maxTempF: 75, maxTempC: 24, conditionCode: 0 },
    { dayName: "Tuesday", maxTempF: 72, maxTempC: 22, conditionCode: 1 },
    { dayName: "Wednesday", maxTempF: 68, maxTempC: 20, conditionCode: 61 },
    { dayName: "Thursday", maxTempF: 70, maxTempC: 21, conditionCode: 3 },
    { dayName: "Friday", maxTempF: 74, maxTempC: 23, conditionCode: 0 },
  ];

  function getConditionColor(code: number): string {
    if (code >= 71) return "radial-gradient(circle, #A5C8E4 0%, #6A95B8 100%)"; // snow
    if (code >= 51) return "radial-gradient(circle, #7FA9C7 0%, #4A69A9 100%)"; // rain
    if (code >= 45) return "radial-gradient(circle, #D5CFC4 0%, #91B3A8 100%)"; // overcast/fog
    if (code >= 1 && code <= 3) return "radial-gradient(circle, #BAC99E 0%, #91B3A8 100%)"; // partly cloudy
    return "radial-gradient(circle, #F4A261 0%, #E76F51 100%)"; // sunny
  }

  return (
    <div className="w-full">
      <h2 className="font-h4 text-[#6B655B] mb-2">
        Weekly Forecast
      </h2>
      <div className="grid grid-cols-5 gap-1.5 w-full">
        {displaySlots.map((slot, idx) => (
          <div
            key={idx}
            data-name="Weather Cell"
            className="bg-[#FAF8F4] rounded-[12px] py-2 px-1 flex flex-col items-center gap-1.5 border border-[#E4DFD6] shadow-2xs transition-transform hover:scale-[1.02]"
          >
            {/* Day Name */}
            <span className="font-b3 text-[#2E2A26] font-normal tracking-[0.02em] truncate w-full text-center">
              {slot.dayName}
            </span>

            {/* Divider Line 2 */}
            <div className="w-full border-t border-[#E4DFD6]" />

            {/* Icon and Temp Frame */}
            <div className="flex items-center justify-center gap-1.5 w-full px-0.5">
              <div
                className="w-[19px] h-[19px] rounded-full flex-shrink-0 shadow-xs"
                style={{ background: getConditionColor(slot.conditionCode) }}
                title={slot.condition || "Weather"}
              />
              <div className="flex flex-col font-b3 text-[#6B655B] leading-[1.2] text-left">
                <span>{slot.maxTempF}°F</span>
                <span>{slot.maxTempC}°C</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
