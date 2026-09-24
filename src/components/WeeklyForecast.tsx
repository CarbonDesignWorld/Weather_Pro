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
      <h2 className="text-[#2E2A26] text-base font-semibold tracking-tight mb-2.5 font-sans">
        Weekly Forecast
      </h2>
      <div className="grid grid-cols-5 gap-2 w-full">
        {displaySlots.map((slot, idx) => (
          <div
            key={idx}
            className="bg-white/95 rounded-[14px] p-2 flex flex-col items-center justify-between border border-[#E4DFD6] shadow-xs min-h-[96px] transition-transform hover:scale-[1.02]"
          >
            <span className="text-[11px] font-medium text-[#6B655B] tracking-tight">
              {slot.dayName.slice(0, 3)}
            </span>
            <div
              className="w-5 h-5 rounded-full my-1 shadow-xs"
              style={{ background: getConditionColor(slot.conditionCode) }}
              title={slot.condition || "Weather"}
            />
            <div className="text-center">
              <div className="text-xs font-semibold text-[#2E2A26] leading-none">
                {slot.maxTempF}°F
              </div>
              <div className="text-[10px] text-[#8C857B] mt-0.5 leading-none">
                {slot.maxTempC}°C
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
