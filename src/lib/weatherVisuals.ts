/**
 * Today.io — Weather Visuals & Temperature Color Gradients
 */

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

// Curated high-res atmospheric loops (reliable Unsplash visual scenes)
export const WEATHER_VISUALS = {
  clear_day: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1200&q=80",
  clear_night: "https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?auto=format&fit=crop&w=1200&q=80",
  partly_cloudy_day: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80",
  partly_cloudy_night: "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&w=1200&q=80",
  cloudy: "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1200&q=80",
  fog: "https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1200&q=80",
  rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
  heavy_rain: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80",
  thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1200&q=80",
  snow: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1200&q=80",
};

export function getWeatherVisual(conditionCode: number, isDay: boolean): string {
  // Clear sky
  if (conditionCode === 0 || conditionCode === 1) {
    return isDay ? WEATHER_VISUALS.clear_day : WEATHER_VISUALS.clear_night;
  }
  // Partly cloudy
  if (conditionCode === 2) {
    return isDay ? WEATHER_VISUALS.partly_cloudy_day : WEATHER_VISUALS.partly_cloudy_night;
  }
  // Overcast
  if (conditionCode === 3) {
    return WEATHER_VISUALS.cloudy;
  }
  // Fog
  if (conditionCode === 45 || conditionCode === 48) {
    return WEATHER_VISUALS.fog;
  }
  // Drizzle / light rain
  if ([51, 53, 55, 61, 80].includes(conditionCode)) {
    return WEATHER_VISUALS.rain;
  }
  // Heavy rain
  if ([63, 65, 66, 67, 81, 82].includes(conditionCode)) {
    return WEATHER_VISUALS.heavy_rain;
  }
  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(conditionCode)) {
    return WEATHER_VISUALS.snow;
  }
  // Thunderstorm
  if ([95, 96, 99].includes(conditionCode)) {
    return WEATHER_VISUALS.thunderstorm;
  }

  return isDay ? WEATHER_VISUALS.partly_cloudy_day : WEATHER_VISUALS.partly_cloudy_night;
}
