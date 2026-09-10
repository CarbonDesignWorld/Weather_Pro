/**
 * Today.io — Canonical Data Contract & Type Definitions
 * Based on Build Specification v1, Wear & Pack Rules, and Chat Agent Spec.
 */

export type IconId =
  // Wear items
  | "heavy_coat"
  | "light_coat"
  | "rain_jacket"
  | "wind_breaker"
  | "extra_layer"
  | "long_sleeves"
  | "t_shirt"
  | "long_pants"
  | "shorts"
  | "boots"
  | "rain_boots"
  | "closed_shoes"
  | "sandals"
  | "warm_socks"
  | "beanie"
  | "sun_hat"
  | "scarf"
  | "gloves"
  | "shades"
  // Pack items
  | "umbrella"
  | "water_bottle"
  | "sun_screen"
  | "lip_balm";

export type BodyZone = "Outer" | "Top" | "Bottom" | "Feet" | "Head" | "Accessory";

export type SlotType = "Wear" | "Pack";

export type TempBasis = "Low" | "High";

export type SeverityLevel = "normal" | "elevated" | "extreme";

export type TemperatureTagId = "hot" | "warm" | "mild" | "cool" | "cold";
export type SkyTagId = "sunny" | "cloudy";
export type MoistureTagId = "wet" | "dry" | "humid";

export type TagId = TemperatureTagId | SkyTagId | MoistureTagId;

export interface LocationInfo {
  city: string;
  region: string;
  lat: number;
  lon: number;
  timezone: string;
}

export interface CurrentConditions {
  time: string; // ISO 8601 local
  tempF: number;
  tempC: number;
  feelsLikeF: number;
  conditionCode: number; // Open-Meteo WMO code
  condition: string; // "Light rain"
  windMph: number;
  precipProbability: number; // 0-100
  uvIndex: number;
  humidity: number; // relative humidity percentage
  isDay: boolean;
}

export interface DayRange {
  minTempF: number;
  maxTempF: number;
  totalPrecipMm: number;
  maxWindMph: number;
  maxUvIndex: number;
  maxPrecipProb: number;
}

export interface HourlySlot {
  time: string; // ISO 8601
  displayTime: string; // "12:00 pm"
  tempF: number;
  tempC: number;
  conditionCode: number;
  condition: string;
  description: string; // generated or fallback
  isDateBoundary: boolean; // true on first slot after midnight
}

export interface DayBrief {
  location: LocationInfo;
  current: CurrentConditions;
  dayRange: DayRange;
  headline: string; // LLM or fallback
  greeting: string; // Static "Hey,"
  nowDescription?: string; // Atmospheric conditions brief for Weather Message Box
  wear: {
    icons: IconId[]; // max 4
    description: string; // LLM or fallback
  };
  pack: {
    icons: IconId[]; // max 4 (updated per user)
    description: string; // LLM or fallback
  };
  confidence: number | null; // 70-99, null if below 70
  tags: [TemperatureTagId, SkyTagId, MoistureTagId]; // exactly 3
  hourly: HourlySlot[]; // 9-hour forward window crossing midnight
  severity: SeverityLevel;
  meta: {
    generatedAt: string;
    copySource: "llm" | "fallback";
    stale: boolean;
  };
}

export interface GeneratedCopyResponse {
  headline: string;
  wearDescription: string;
  packDescription: string;
  nowDescription: string;
}

export interface ChatMessage {
  id?: string | number;
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  context: DayBrief;
}

export interface ChatResponse {
  message: string;
  error?: string;
  retryable?: boolean;
}
