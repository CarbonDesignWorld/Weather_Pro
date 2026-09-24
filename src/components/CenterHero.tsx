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
    <div className="relative flex flex-col items-center justify-end w-full max-w-[440px] h-[520px] lg:h-[640px] select-none">
      {/* Model Silhouette */}
      <div className="relative w-full h-full flex items-end justify-center">
        <img
          src={visual.src}
          alt={visual.alt}
          className="max-h-[92%] w-auto object-contain drop-shadow-[0_12px_24px_rgba(46,42,38,0.22)] transition-all duration-500"
        />
      </div>

      {/* Floating Pack Item Card */}
      <div
        className="absolute bottom-4 right-2 lg:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md border border-white/80 flex flex-col items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
        onClick={() => ctx?.openOverlay("pack")}
        title="View packed items"
      >
        <img
          src="/pack_umbrella.png"
          alt="Pack item"
          className="w-14 h-14 object-contain"
        />
        <span className="bg-[#4A453E] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Pack
        </span>
      </div>
    </div>
  );
}
