import React from "react";
import { IconId } from "../lib/types";
import { ICONS } from "../lib/constants";
import svgPaths from "#imports/svg-7a2pt52j2y";

interface WeatherIconItemProps {
  id: IconId;
  className?: string;
  size?: number;
}

export default function WeatherIconItem({ id, className = "", size = 44 }: WeatherIconItemProps) {
  const meta = ICONS[id];
  const label = meta ? meta.ariaLabel : id;

  const renderGlyph = () => {
    switch (id) {
      case "t_shirt":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.p24c7b70} fill="#5B7FC7" />
          </svg>
        );
      case "shorts":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.p2cafffb0} fill="#5B7FC7" />
          </svg>
        );
      case "sun_hat":
        return (
          <svg className="size-[34px]" fill="none" height="34" viewBox="0 0 34 34" width="34">
            <path d={svgPaths.pc1d7670} fill="#5B7FC7" />
          </svg>
        );
      case "heavy_coat":
      case "light_coat":
      case "rain_jacket":
      case "wind_breaker":
      case "extra_layer":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.p2d822f0} fill="#5B7FC7" />
          </svg>
        );
      case "long_sleeves":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.p24c7b70} fill="#5B7FC7" />
          </svg>
        );
      case "long_pants":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.p2cafffb0} fill="#5B7FC7" />
          </svg>
        );
      case "water_bottle":
        return (
          <svg className="h-[29px] w-[17px]" fill="none" height="29" viewBox="0 0 17.0601 29" width="17">
            <path clipRule="evenodd" d={svgPaths.p2b951680} fill="#5B7FC7" fillRule="evenodd" />
          </svg>
        );
      case "sun_screen":
        return (
          <svg className="size-[44px]" fill="none" height="44" viewBox="0 0 44 44" width="44">
            <path d={svgPaths.p1271ba00} fill="#5B7FC7" />
          </svg>
        );
      case "shades":
        return (
          <svg className="h-[11px] w-[28px]" fill="none" height="11" viewBox="0 0 28 11" width="28">
            <path d={svgPaths.p2f13c100} fill="#5B7FC7" />
            <path d={svgPaths.pf412200} fill="#5B7FC7" />
            <path d={svgPaths.p2f0d48b0} fill="#5B7FC7" />
            <path d={svgPaths.p2305ee80} fill="#5B7FC7" />
          </svg>
        );
      case "umbrella":
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 24 24" width="28" stroke="#5B7FC7" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 0a9 9 0 019 9H3a9 9 0 019-9zm0 9v9a2 2 0 01-2 2" />
          </svg>
        );
      case "lip_balm":
        return (
          <svg className="size-[24px]" fill="none" height="24" viewBox="0 0 24 24" width="24" stroke="#5B7FC7" strokeWidth="2">
            <rect x="7" y="6" width="10" height="16" rx="2" strokeLinecap="round" />
            <rect x="9" y="2" width="6" height="4" rx="1" strokeLinecap="round" />
          </svg>
        );
      case "boots":
      case "rain_boots":
      case "closed_shoes":
      case "warm_socks":
        return (
          <svg className="size-[26px]" fill="none" height="26" viewBox="0 0 24 24" width="26" stroke="#5B7FC7" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-8 4 4 4-6 4 10H4z" />
          </svg>
        );
      case "beanie":
      case "scarf":
      case "gloves":
      default:
        return (
          <svg className="size-[28px]" fill="none" height="28" viewBox="0 0 28 28" width="28">
            <path d={svgPaths.pc1d7670} fill="#5B7FC7" />
          </svg>
        );
    }
  };

  return (
    <div
      role="img"
      aria-label={label}
      title={meta?.name || label}
      className={`bg-[#f0ece4] flex items-center justify-center rounded-[22px] shrink-0 p-[8px] size-[44px] ${className}`}
    >
      {renderGlyph()}
    </div>
  );
}
