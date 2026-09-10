import { IconId, SeverityLevel, TemperatureTagId, SkyTagId, MoistureTagId } from "./types";

export interface WMOInfo {
  code: number;
  condition: string;
  isRain: boolean;
  isSnow: boolean;
  isClear: boolean;
}

export const WMO_CODES: Record<number, WMOInfo> = {
  0: { code: 0, condition: "Clear sky", isRain: false, isSnow: false, isClear: true },
  1: { code: 1, condition: "Mainly clear", isRain: false, isSnow: false, isClear: true },
  2: { code: 2, condition: "Partly cloudy", isRain: false, isSnow: false, isClear: false },
  3: { code: 3, condition: "Overcast", isRain: false, isSnow: false, isClear: false },
  45: { code: 45, condition: "Fog", isRain: false, isSnow: false, isClear: false },
  48: { code: 48, condition: "Freezing fog", isRain: false, isSnow: false, isClear: false },
  51: { code: 51, condition: "Light drizzle", isRain: true, isSnow: false, isClear: false },
  53: { code: 53, condition: "Drizzle", isRain: true, isSnow: false, isClear: false },
  55: { code: 55, condition: "Heavy drizzle", isRain: true, isSnow: false, isClear: false },
  61: { code: 61, condition: "Light rain", isRain: true, isSnow: false, isClear: false },
  63: { code: 63, condition: "Rain", isRain: true, isSnow: false, isClear: false },
  65: { code: 65, condition: "Heavy rain", isRain: true, isSnow: false, isClear: false },
  66: { code: 66, condition: "Freezing rain", isRain: true, isSnow: false, isClear: false },
  67: { code: 67, condition: "Heavy freezing rain", isRain: true, isSnow: false, isClear: false },
  71: { code: 71, condition: "Light snow", isRain: false, isSnow: true, isClear: false },
  73: { code: 73, condition: "Snow", isRain: false, isSnow: true, isClear: false },
  75: { code: 75, condition: "Heavy snow", isRain: false, isSnow: true, isClear: false },
  77: { code: 77, condition: "Snow grains", isRain: false, isSnow: true, isClear: false },
  80: { code: 80, condition: "Light showers", isRain: true, isSnow: false, isClear: false },
  81: { code: 81, condition: "Showers", isRain: true, isSnow: false, isClear: false },
  82: { code: 82, condition: "Violent showers", isRain: true, isSnow: false, isClear: false },
  85: { code: 85, condition: "Snow showers", isRain: false, isSnow: true, isClear: false },
  86: { code: 86, condition: "Heavy snow showers", isRain: false, isSnow: true, isClear: false },
  95: { code: 95, condition: "Thunderstorm", isRain: true, isSnow: false, isClear: false },
  96: { code: 96, condition: "Thunderstorm with hail", isRain: true, isSnow: false, isClear: false },
  99: { code: 99, condition: "Severe thunderstorm with hail", isRain: true, isSnow: false, isClear: false },
};

export function getWMOInfo(code: number): WMOInfo {
  return (
    WMO_CODES[code] ?? {
      code,
      condition: "Partly cloudy",
      isRain: false,
      isSnow: false,
      isClear: false,
    }
  );
}

export interface IconMeta {
  id: IconId;
  name: string;
  slot: "Wear" | "Pack";
  zone: "Outer" | "Top" | "Bottom" | "Feet" | "Head" | "Accessory";
  ariaLabel: string;
}

export const ICONS: Record<IconId, IconMeta> = {
  heavy_coat: { id: "heavy_coat", name: "Heavy Coat", slot: "Wear", zone: "Outer", ariaLabel: "Heavy coat" },
  light_coat: { id: "light_coat", name: "Light Coat", slot: "Wear", zone: "Outer", ariaLabel: "Light coat" },
  rain_jacket: { id: "rain_jacket", name: "Rain Jacket", slot: "Wear", zone: "Outer", ariaLabel: "Rain jacket" },
  wind_breaker: { id: "wind_breaker", name: "Wind Breaker", slot: "Wear", zone: "Outer", ariaLabel: "Windbreaker" },
  extra_layer: { id: "extra_layer", name: "Extra layer", slot: "Wear", zone: "Outer", ariaLabel: "Extra layer" },
  long_sleeves: { id: "long_sleeves", name: "Long Sleeves", slot: "Wear", zone: "Top", ariaLabel: "Long sleeves" },
  t_shirt: { id: "t_shirt", name: "T Shirt", slot: "Wear", zone: "Top", ariaLabel: "T-shirt" },
  long_pants: { id: "long_pants", name: "Long Pants", slot: "Wear", zone: "Bottom", ariaLabel: "Long pants" },
  shorts: { id: "shorts", name: "Shorts", slot: "Wear", zone: "Bottom", ariaLabel: "Shorts" },
  boots: { id: "boots", name: "Boots", slot: "Wear", zone: "Feet", ariaLabel: "Boots" },
  rain_boots: { id: "rain_boots", name: "Rain Boots", slot: "Wear", zone: "Feet", ariaLabel: "Rain boots" },
  closed_shoes: { id: "closed_shoes", name: "Closed Shoes", slot: "Wear", zone: "Feet", ariaLabel: "Closed shoes" },
  sandals: { id: "sandals", name: "Sandals", slot: "Wear", zone: "Feet", ariaLabel: "Sandals" },
  warm_socks: { id: "warm_socks", name: "Warm Socks", slot: "Wear", zone: "Feet", ariaLabel: "Warm socks" },
  beanie: { id: "beanie", name: "Beanie", slot: "Wear", zone: "Head", ariaLabel: "Beanie" },
  sun_hat: { id: "sun_hat", name: "Sun hat", slot: "Wear", zone: "Head", ariaLabel: "Sun hat" },
  scarf: { id: "scarf", name: "Scarf", slot: "Wear", zone: "Accessory", ariaLabel: "Scarf" },
  gloves: { id: "gloves", name: "Gloves", slot: "Wear", zone: "Accessory", ariaLabel: "Gloves" },
  shades: { id: "shades", name: "Shades", slot: "Wear", zone: "Accessory", ariaLabel: "Sunglasses" },
  umbrella: { id: "umbrella", name: "Umbrella", slot: "Pack", zone: "Accessory", ariaLabel: "Umbrella" },
  water_bottle: { id: "water_bottle", name: "Water Bottle", slot: "Pack", zone: "Accessory", ariaLabel: "Water bottle" },
  sun_screen: { id: "sun_screen", name: "Sun Screen", slot: "Pack", zone: "Accessory", ariaLabel: "Sunscreen" },
  lip_balm: { id: "lip_balm", name: "Lip balm", slot: "Pack", zone: "Accessory", ariaLabel: "Lip balm" },
};

export const TAG_LABELS: Record<TemperatureTagId | SkyTagId | MoistureTagId, string> = {
  hot: "Hot",
  warm: "Warm",
  mild: "Mild",
  cool: "Cool",
  cold: "Cold",
  sunny: "Sunny",
  cloudy: "Cloudy",
  wet: "Wet",
  humid: "Humid",
  dry: "Dry",
};

export function getFallbackHeadline(condition: string, tempF: number, severity: SeverityLevel): string {
  if (severity === "extreme") return "Extreme conditions";
  if (tempF >= 80) return "Dress light today";
  if (tempF <= 45) return "Layer up today";
  if (condition.toLowerCase().includes("rain")) return "Grab a raincoat";
  return "Dress light today";
}

export function getFallbackWearDescription(icons: IconId[]): string {
  const names = icons.map((id) => ICONS[id]?.name ?? id);
  if (names.length === 0) return "Dress comfortably for today's weather.";
  return `Wear ${names.slice(0, -1).join(", ")}${names.length > 1 ? " and " : ""}${names[names.length - 1]}.`;
}

export function getFallbackPackDescription(icons: IconId[]): string {
  const names = icons.map((id) => ICONS[id]?.name ?? id);
  if (names.length === 0) return "No extra items needed today.";
  return `Pack ${names.slice(0, -1).join(", ")}${names.length > 1 ? " and " : ""}${names[names.length - 1]}.`;
}

export function getFallbackNowDescription(condition: string, tempF: number): string {
  return `${condition}, ${Math.round(tempF)}°F.`;
}
