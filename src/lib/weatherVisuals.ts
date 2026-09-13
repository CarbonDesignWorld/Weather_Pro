/**
 * Today.io — Weather Visuals & Temperature Color Gradients
 * Outfit-based Photography & Thermal Timeline
 */

import { getWMOInfo } from "./constants";

export interface TempColorStop {
  tempF: number;
  color: string;
}

export const TEMP_COLOR_STOPS: TempColorStop[] = [
  { tempF: 20, color: "#6A95B8" }, // Deep ice blue
  { tempF: 35, color: "#7FA9C7" }, // Slate ice blue
  { tempF: 48, color: "#91B3A8" }, // Cool sage
  { tempF: 60, color: "#BAC99E" }, // Mild soft green/sand
  { tempF: 72, color: "#E5BF7D" }, // Soft golden amber
  { tempF: 82, color: "#E59866" }, // Warm apricot
  { tempF: 95, color: "#D96B52" }, // Terracotta / warm coral
];

export function getTemperatureColor(tempF: number): string {
  if (tempF <= 25) return "#6A95B8";
  if (tempF <= 38) return "#7FA9C7";
  if (tempF <= 52) return "#91B3A8";
  if (tempF <= 65) return "#BAC99E";
  if (tempF <= 76) return "#E5BF7D";
  if (tempF <= 86) return "#E59866";
  return "#D96B52";
}

export function getTimelineGradient(hourly: Array<{ tempF: number }>): string {
  if (!hourly || hourly.length === 0) {
    return "linear-gradient(to bottom, #7FA9C7, #E5BF7D)";
  }
  const stops = hourly.map((h, index) => {
    const color = getTemperatureColor(h.tempF);
    const pct = Math.round((index / (hourly.length - 1)) * 100);
    return `${color} ${pct}%`;
  });
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export interface OutfitVisual {
  id: string;
  src: string;
  alt: string;
  outfitDescription: string;
}

export const OUTFIT_VISUALS: Record<string, OutfitVisual> = {
  hot_sunny: {
    id: "hot_sunny",
    src: "/visuals/hot_sunny.jpg",
    alt: "Summer outfit — boxy black cotton tee, bone linen shorts, minimal leather slide sandals, angular black wraparound sunglasses",
    outfitDescription: "Oversized boxy black cotton tee tucked loosely into tailored mid-thigh shorts in bone linen, minimal leather slide sandals, angular black wraparound sunglasses.",
  },
  warm_rain: {
    id: "warm_rain",
    src: "/visuals/warm_rain.jpg",
    alt: "Warm rain outfit — black tee and bone linen shorts, translucent clear PVC raincoat, chunky black rain boots, matte black umbrella",
    outfitDescription: "Black cotton tee and linen shorts, glossy chunky black rain boots mid-calf, translucent clear PVC raincoat worn open over the outfit, holding a matte black umbrella open above the head.",
  },
  mild_clear: {
    id: "mild_clear",
    src: "/visuals/mild_clear.jpg",
    alt: "Mild weather outfit — fitted charcoal long-sleeve crewneck, cropped black trousers, chunky black leather derbies, rectangular sunglasses",
    outfitDescription: "Fitted charcoal long-sleeve crewneck, straight-leg black trousers cropped at the ankle, chunky black leather derbies, thin rectangular dark sunglasses.",
  },
  cool_overcast: {
    id: "cool_overcast",
    src: "/visuals/cool_overcast.jpg",
    alt: "Cool overcast outfit — heavyweight oversized slate grey hoodie, relaxed dark denim, scuffed black combat boots",
    outfitDescription: "Heavyweight oversized hoodie in washed slate grey, hood down, relaxed dark denim, scuffed black leather combat boots laced high.",
  },
  cold_dry: {
    id: "cold_dry",
    src: "/visuals/cold_dry.jpg",
    alt: "Cold weather outfit — boxy oversized charcoal wool overcoat, tapered black trousers, ribbed beanie, chunky oatmeal scarf",
    outfitDescription: "Boxy oversized heavy wool overcoat in deep charcoal, layered long-sleeve underneath, tapered black wool trousers, ribbed black beanie, oversized chunky knit scarf in oatmeal wrapped twice.",
  },
  cold_rain: {
    id: "cold_rain",
    src: "/visuals/cold_rain.jpg",
    alt: "Cold rain outfit — long black waterproof trench, knit sweater, dark slim trousers, waterproof boots, umbrella, gloves",
    outfitDescription: "Long black waterproof trench shell over a knit sweater, dark slim trousers, waterproof lace-up boots, black umbrella, leather gloves.",
  },
  snow_freezing: {
    id: "snow_freezing",
    src: "/visuals/snow_freezing.jpg",
    alt: "Snow and freezing outfit — cropped puffer parka with fur-trimmed hood, insulated black snow pants, heavy lug-sole winter boots, thick gloves, neck gaiter",
    outfitDescription: "Cropped puffer parka with fur-trimmed hood up, insulated black snow pants, heavy lug-sole winter boots, thick gloves, neck gaiter pulled to the chin.",
  },
  windy_transitional: {
    id: "windy_transitional",
    src: "/visuals/windy_transitional.jpg",
    alt: "Windy outfit — cropped nylon windbreaker shell collar up, layered tee, wide-leg cargo pants, sneakers",
    outfitDescription: "Cropped nylon windbreaker shell, collar up, layered over a tee, wide-leg cargo pants, low-profile sneakers, hair visibly moving.",
  },
  high_sun_arid: {
    id: "high_sun_arid",
    src: "/visuals/high_sun_arid.jpg",
    alt: "High sun and heat outfit — loose bone linen long-sleeve, relaxed linen trousers, wide-brim black hat, dark sunglasses, woven mules",
    outfitDescription: "Loose bone-colored linen long-sleeve shirt, relaxed linen trousers, wide-brim black hat, dark sunglasses, woven mules.",
  },
};

/**
 * Selects the definitive 24-hour daily outfit visual based on compound weather forecast metrics.
 */
export function getOutfitVisual(
  highF: number,
  conditionCode: number,
  windMph: number = 0,
  uvIndex: number = 0,
  humidity: number = 50,
  precipProb: number = 0,
): OutfitVisual {
  const wmo = getWMOInfo(conditionCode);

  // 1. Freezing or Snow always takes top priority
  if (wmo.isSnow || highF <= 28) {
    return OUTFIT_VISUALS.snow_freezing;
  }

  // 2. Cold + Rain
  if (highF < 52 && (wmo.isRain || precipProb >= 45)) {
    return OUTFIT_VISUALS.cold_rain;
  }

  // 3. Cold dry weather
  if (highF < 48) {
    return OUTFIT_VISUALS.cold_dry;
  }

  // 4. Warm + Rain (raincoat, umbrella, rain boots over summer shorts)
  if (highF >= 65 && (wmo.isRain || precipProb >= 45)) {
    return OUTFIT_VISUALS.warm_rain;
  }

  // 5. Windy transitional weather
  if (windMph >= 18 && highF >= 50 && highF <= 76 && !wmo.isRain) {
    return OUTFIT_VISUALS.windy_transitional;
  }

  // 6. High sun / Arid intense heat (high UV, hot, dry air)
  if (highF >= 86 && (uvIndex >= 7 || humidity < 40)) {
    return OUTFIT_VISUALS.high_sun_arid;
  }

  // 7. Hot / Sunny summer day
  if (highF >= 76) {
    return OUTFIT_VISUALS.hot_sunny;
  }

  // 8. Cool / Overcast weather
  if (highF >= 48 && highF < 60) {
    return OUTFIT_VISUALS.cool_overcast;
  }

  // 9. Mild / Clear (comfortable 60-75°F)
  return OUTFIT_VISUALS.mild_clear;
}

// Backward-compatible getWeatherVisual wrapper
export function getWeatherVisual(conditionCode: number, isDay: boolean = true): string {
  return OUTFIT_VISUALS.mild_clear.src;
}
