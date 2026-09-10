import {
  IconId,
  BodyZone,
  SlotType,
  TempBasis,
  SeverityLevel,
  TemperatureTagId,
  SkyTagId,
  MoistureTagId,
  DayRange,
  CurrentConditions,
} from "./types";
import { getWMOInfo } from "./constants";

export interface RuleDefinition {
  id: IconId;
  name: string;
  slot: SlotType;
  zone: BodyZone;
  tempBasis: TempBasis;
  tempMin?: number;
  tempMax?: number;
  precipProbMin?: number;
  windMin?: number;
  windMax?: number; // for umbrella suppression
  uvMin?: number;
  requires?: "rain" | "snow" | "clear";
  priority: number; // lower number = higher priority
}

export const RULES: RuleDefinition[] = [
  // Outer layer
  { id: "heavy_coat", name: "Heavy Coat", slot: "Wear", zone: "Outer", tempBasis: "Low", tempMax: 40.0, priority: 1 },
  { id: "rain_jacket", name: "Rain Jacket", slot: "Wear", zone: "Outer", tempBasis: "Low", tempMin: 40.0, tempMax: 70.0, precipProbMin: 50.0, requires: "rain", priority: 1 },
  { id: "light_coat", name: "Light Coat", slot: "Wear", zone: "Outer", tempBasis: "Low", tempMin: 40.0, tempMax: 58.0, priority: 2 },
  { id: "wind_breaker", name: "Wind Breaker", slot: "Wear", zone: "Outer", tempBasis: "Low", tempMin: 50.0, tempMax: 72.0, windMin: 18.0, priority: 2 },
  { id: "extra_layer", name: "Extra layer", slot: "Wear", zone: "Outer", tempBasis: "Low", tempMin: 58.0, tempMax: 68.0, priority: 4 },

  // Top
  { id: "t_shirt", name: "T Shirt", slot: "Wear", zone: "Top", tempBasis: "High", tempMin: 68.0, priority: 1 },
  { id: "long_sleeves", name: "Long Sleeves", slot: "Wear", zone: "Top", tempBasis: "High", tempMax: 68.0, priority: 2 },

  // Bottom
  { id: "shorts", name: "Shorts", slot: "Wear", zone: "Bottom", tempBasis: "High", tempMin: 72.0, priority: 1 },
  { id: "long_pants", name: "Long Pants", slot: "Wear", zone: "Bottom", tempBasis: "High", tempMax: 72.0, priority: 1 },

  // Feet
  { id: "rain_boots", name: "Rain Boots", slot: "Wear", zone: "Feet", tempBasis: "Low", precipProbMin: 60.0, requires: "rain", priority: 1 },
  { id: "boots", name: "Boots", slot: "Wear", zone: "Feet", tempBasis: "Low", tempMax: 40.0, priority: 1 },
  { id: "closed_shoes", name: "Closed Shoes", slot: "Wear", zone: "Feet", tempBasis: "High", tempMin: 40.0, tempMax: 80.0, priority: 2 },
  { id: "warm_socks", name: "Warm Socks", slot: "Wear", zone: "Feet", tempBasis: "Low", tempMax: 35.0, priority: 3 },

  // Head
  { id: "beanie", name: "Beanie", slot: "Wear", zone: "Head", tempBasis: "Low", tempMax: 40.0, priority: 1 },
  { id: "sun_hat", name: "Sun hat", slot: "Wear", zone: "Head", tempBasis: "High", tempMin: 78.0, uvMin: 6.0, priority: 1 },

  // Wear Accessories
  { id: "gloves", name: "Gloves", slot: "Wear", zone: "Accessory", tempBasis: "Low", tempMax: 38.0, priority: 1 },
  { id: "scarf", name: "Scarf", slot: "Wear", zone: "Accessory", tempBasis: "Low", tempMax: 35.0, priority: 2 },
  { id: "shades", name: "Shades", slot: "Wear", zone: "Accessory", tempBasis: "High", uvMin: 5.0, requires: "clear", priority: 3 },

  // Pack items (all Accessory zone)
  // Umbrella: requires rain, precip >= 40%, wind must be < 18mph (suppress at high wind)
  { id: "umbrella", name: "Umbrella", slot: "Pack", zone: "Accessory", tempBasis: "High", precipProbMin: 40.0, windMax: 18.0, requires: "rain", priority: 1 },
  { id: "water_bottle", name: "Water Bottle", slot: "Pack", zone: "Accessory", tempBasis: "High", tempMin: 75.0, priority: 1 },
  { id: "sun_screen", name: "Sun Screen", slot: "Pack", zone: "Accessory", tempBasis: "High", uvMin: 6.0, priority: 2 },
  { id: "lip_balm", name: "Lip balm", slot: "Pack", zone: "Accessory", tempBasis: "Low", tempMax: 40.0, windMin: 15.0, priority: 3 },
];

export interface RulesEngineInput {
  current: CurrentConditions;
  dayRange: DayRange;
}

export interface RulesEngineOutput {
  wearIcons: IconId[];
  packIcons: IconId[];
  tags: [TemperatureTagId, SkyTagId, MoistureTagId];
  confidence: number | null;
  severity: SeverityLevel;
}

export function computeSeverity(highF: number, lowF: number, windMph: number, wmoCode: number): SeverityLevel {
  if (highF >= 105 || lowF <= 5 || wmoCode === 96 || wmoCode === 99) {
    return "extreme";
  }
  if (highF >= 95 || lowF <= 20 || windMph >= 35 || wmoCode === 95) {
    return "elevated";
  }
  return "normal";
}

export function computeDailyTags(
  highF: number,
  wmoCode: number,
  precipProb: number,
  humidity: number,
): [TemperatureTagId, SkyTagId, MoistureTagId] {
  // 1. Temperature tag
  let tempTag: TemperatureTagId = "cold";
  if (highF >= 88) tempTag = "hot";
  else if (highF >= 72) tempTag = "warm";
  else if (highF >= 58) tempTag = "mild";
  else if (highF >= 45) tempTag = "cool";
  else tempTag = "cold";

  // 2. Sky tag
  let skyTag: SkyTagId = "cloudy";
  if (wmoCode === 0 || wmoCode === 1) {
    skyTag = "sunny";
  } else {
    skyTag = "cloudy";
  }

  // 3. Moisture tag
  let moistureTag: MoistureTagId = "dry";
  if (precipProb >= 50) {
    moistureTag = "wet";
  } else if (humidity >= 70) {
    moistureTag = "humid";
  } else {
    moistureTag = "dry";
  }

  return [tempTag, skyTag, moistureTag];
}

export function evaluateRules(input: RulesEngineInput): RulesEngineOutput {
  const { current, dayRange } = input;
  const wmo = getWMOInfo(current.conditionCode);

  const lowF = dayRange.minTempF;
  const highF = dayRange.maxTempF;
  const precipProb = Math.max(current.precipProbability, dayRange.maxPrecipProb ?? 0);
  const windMph = Math.max(current.windMph, dayRange.maxWindMph ?? 0);
  const uv = Math.max(current.uvIndex, dayRange.maxUvIndex ?? 0);

  const passedRules: Array<RuleDefinition & { distanceRatio: number }> = [];

  for (const rule of RULES) {
    const temp = rule.tempBasis === "Low" ? lowF : highF;

    if (rule.tempMin !== undefined && temp < rule.tempMin) continue;
    if (rule.tempMax !== undefined && temp > rule.tempMax) continue;
    if (rule.precipProbMin !== undefined && precipProb < rule.precipProbMin) continue;
    if (rule.windMin !== undefined && windMph < rule.windMin) continue;
    if (rule.windMax !== undefined && windMph >= rule.windMax) continue; // wind suppression
    if (rule.uvMin !== undefined && uv < rule.uvMin) continue;

    if (rule.requires === "rain" && !wmo.isRain) continue;
    if (rule.requires === "snow" && !wmo.isSnow) continue;
    if (rule.requires === "clear" && !wmo.isClear) continue;

    // Calculate boundary distance for confidence metric
    let minDistance = 1.0;
    if (rule.tempMin !== undefined) {
      const d = Math.abs(temp - rule.tempMin) / 10.0;
      if (d < minDistance) minDistance = d;
    }
    if (rule.tempMax !== undefined) {
      const d = Math.abs(temp - rule.tempMax) / 10.0;
      if (d < minDistance) minDistance = d;
    }

    passedRules.push({ ...rule, distanceRatio: minDistance });
  }

  // Group by slot & body zone, keep only the highest-priority candidate in each zone
  function selectTopCandidates(slot: SlotType, maxCount: number): IconId[] {
    const slotRules = passedRules.filter((r) => r.slot === slot);

    if (slot === "Wear") {
      const byZone = new Map<BodyZone, (typeof slotRules)[0]>();
      for (const r of slotRules) {
        const existing = byZone.get(r.zone);
        if (!existing || r.priority < existing.priority) {
          byZone.set(r.zone, r);
        }
      }

      // Sort survivors by priority, then take up to maxCount
      const survivors = Array.from(byZone.values()).sort((a, b) => a.priority - b.priority);

      // Invariants enforcement:
      // Invariant: Never both Shorts and Long Pants
      const ids = survivors.map((s) => s.id);
      if (ids.includes("shorts") && ids.includes("long_pants")) {
        // High temp resolves
        if (highF >= 72) {
          const idx = survivors.findIndex((s) => s.id === "long_pants");
          if (idx !== -1) survivors.splice(idx, 1);
        } else {
          const idx = survivors.findIndex((s) => s.id === "shorts");
          if (idx !== -1) survivors.splice(idx, 1);
        }
      }

      // Invariant: Never both Heavy Coat and T Shirt as outermost layer
      if (ids.includes("heavy_coat") && ids.includes("t_shirt")) {
        const idx = survivors.findIndex((s) => s.id === "t_shirt");
        if (idx !== -1) survivors.splice(idx, 1);
      }

      return survivors.slice(0, maxCount).map((s) => s.id);
    } else {
      // Pack items: all accessory zone, take top priority items up to maxCount (now 4)
      const survivors = slotRules.sort((a, b) => a.priority - b.priority);
      return survivors.slice(0, maxCount).map((s) => s.id);
    }
  }

  const wearIcons = selectTopCandidates("Wear", 4);
  const packIcons = selectTopCandidates("Pack", 4);

  // Confidence computation:
  // confidence = round(100 * min(distance across all triggered rules), capped at 99)
  // if confidence < 70 -> return null
  let confidence: number | null = null;
  if (passedRules.length > 0) {
    const minDistance = Math.min(...passedRules.map((r) => r.distanceRatio));
    // Scale distance ratio to 70-99 range
    const rawConf = Math.round(70 + minDistance * 25);
    const score = Math.min(99, Math.max(50, rawConf));
    confidence = score >= 70 ? score : null;
  }

  const severity = computeSeverity(highF, lowF, windMph, current.conditionCode);
  const tags = computeDailyTags(highF, current.conditionCode, precipProb, current.humidity);

  return {
    wearIcons,
    packIcons,
    tags,
    confidence,
    severity,
  };
}
