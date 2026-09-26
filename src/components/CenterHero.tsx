import React from "react";
import { useWeather } from "../context/WeatherContext";
import { getOutfitVisual } from "../lib/weatherVisuals";

export default function CenterHero() {
  const ctx = useWeather();
  const brief = ctx?.brief;

  const visual = getOutfitVisual(
    brief?.dayRange?.maxTempF ?? brief?.current?.tempF ?? 75,
    brief?.current?.conditionCode ?? 0,
    brief?.current?.windMph ?? 0,
    brief?.current?.uvIndex ?? 5,
    brief?.current?.humidity ?? 50,
    brief?.dayRange?.next3hMaxPrecipProb ?? brief?.current?.precipProbability ?? 0,
    brief?.wear?.icons ?? []
  );

  return (
    <div
      data-name="Frame 171"
      className="relative flex flex-col items-center justify-end w-full max-w-[353px] lg:max-w-[467px] h-[386px] lg:h-[641px] select-none"
    >
      {/* Model Silhouette touching the floor baseline */}
      <div className="relative w-full h-full flex items-end justify-center">
        <img
          src={visual.src}
          alt={visual.alt}
          className="h-full w-auto object-contain object-bottom drop-shadow-[0_12px_24px_rgba(46,42,38,0.22)] transition-all duration-500"
        />
      </div>

      {/* Floating Pack Item Card (Figma node 431:21782 / Frame 172) - Aligned to floor */}
      <div
        data-name="Frame 172"
        className="absolute bottom-0 right-0 lg:right-2 w-[102px] h-[102px] rounded-[12px] shadow-full-card transition-transform hover:scale-105 active:scale-95 cursor-pointer select-none z-10"
        style={{
          boxShadow: "0px -2px 4px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px 1px rgba(0, 0, 0, 0.05)",
        }}
        onClick={() => ctx?.openOverlay("pack")}
        title="View packed items"
      >
        <img
          src="/pack_umbrella.png"
          alt="Pack umbrella alert"
          className="w-full h-full object-contain rounded-[12px]"
        />
      </div>
    </div>
  );
}
