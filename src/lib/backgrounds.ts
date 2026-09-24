import { WeatherTheme } from "./types";
import { getWMOInfo } from "./constants";

export const WEATHER_BACKGROUNDS: Record<WeatherTheme, { src: string; alt: string; label: string }> = {
  cloudy: {
    src: "/backgrounds/cloudy.jpg",
    alt: "Cloudy day woven canvas tapestry",
    label: "Cloudy",
  },
  snowy: {
    src: "/backgrounds/snowy.jpg",
    alt: "Snowy day frosty woven tapestry",
    label: "Snowy",
  },
  rainy: {
    src: "/backgrounds/rainy.jpg",
    alt: "Rainy day woven tapestry with cloud and umbrella",
    label: "Rainy",
  },
  clear_sky: {
    src: "/backgrounds/clear_sky.jpg",
    alt: "Clear sky gentle blue tapestry",
    label: "Clear sky",
  },
  sunny: {
    src: "/backgrounds/sunny.jpg",
    alt: "Sunny day golden amber woven tapestry",
    label: "Sunny",
  },
  humid: {
    src: "/backgrounds/humid.jpg",
    alt: "Humid day warm misty woven tapestry",
    label: "Humid",
  },
  windy: {
    src: "/backgrounds/windy.jpg",
    alt: "Windy day sweeping pointillist wind tapestry",
    label: "Windy",
  },
};

export function resolveWeatherTheme(
  conditionCode: number,
  precipProb: number = 0,
  windMph: number = 0,
  humidity: number = 50,
  uvIndex: number = 5
): WeatherTheme {
  const wmo = getWMOInfo(conditionCode);

  if (wmo.isSnow || conditionCode >= 71) {
    return "snowy";
  }

  if (wmo.isRain || precipProb >= 45) {
    return "rainy";
  }

  if (windMph >= 18) {
    return "windy";
  }

  if (humidity >= 78 && !wmo.isRain) {
    return "humid";
  }

  if (conditionCode === 0) {
    return uvIndex >= 6 ? "sunny" : "clear_sky";
  }

  if (conditionCode <= 2) {
    return uvIndex >= 6 ? "sunny" : "clear_sky";
  }

  return "cloudy";
}
