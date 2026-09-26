import {
  DayBrief,
  LocationInfo,
  CurrentConditions,
  DayRange,
  HourlySlot,
  DailyForecastSlot,
} from "./types";
import { getWMOInfo, cleanCopyText, getFallbackHeadline, getFallbackNowDescription, getNarrativeWearDescription, getNarrativeBringDescription } from "./constants";
import { evaluateRules } from "./rules";
import { resolveWeatherTheme } from "./backgrounds";

const WEATHER_CACHE_KEY = "today_io_weather_cache";
const LOCATION_KEY = "today_io_location";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const DEFAULT_LOCATION: LocationInfo = {
  city: "New York",
  region: "New York",
  lat: 40.7128,
  lon: -74.006,
  timezone: "America/New_York",
};

export function getSavedLocation(): LocationInfo | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocation(loc: LocationInfo): void {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
  } catch (err) {
    console.error("Failed to save location", err);
  }
}

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding failed");
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((r: any) => ({
      city: r.name,
      region: r.admin1 || r.country || "",
      lat: r.latitude,
      lon: r.longitude,
      timezone: r.timezone || "auto",
    }));
  } catch (err) {
    console.error("Location search error", err);
    return [];
  }
}

export async function resolveUserLocation(): Promise<LocationInfo> {
  const saved = getSavedLocation();
  if (saved) return saved;

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return DEFAULT_LOCATION;
  }

  return new Promise((resolve) => {
    let handled = false;
    const timer = setTimeout(() => {
      if (!handled) {
        handled = true;
        resolve(DEFAULT_LOCATION);
      }
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (handled) return;
        handled = true;
        clearTimeout(timer);

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          // Reverse geocode via BigDataCloud or OpenStreetMap
          const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
          const res = await fetch(revUrl);
          if (res.ok) {
            const data = await res.json();
            const loc: LocationInfo = {
              city: data.city || data.locality || "Current Location",
              region: data.principalSubdivision || data.countryName || "",
              lat,
              lon,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            saveLocation(loc);
            resolve(loc);
            return;
          }
        } catch {
          // ignore error
        }

        const fallbackLoc: LocationInfo = {
          city: "Local Area",
          region: "",
          lat,
          lon,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        saveLocation(fallbackLoc);
        resolve(fallbackLoc);
      },
      () => {
        if (!handled) {
          handled = true;
          clearTimeout(timer);
          resolve(DEFAULT_LOCATION);
        }
      },
      { timeout: 5000 }
    );
  });
}

function formatHour(isoString: string): string {
  const date = new Date(isoString);
  const h = date.getHours();
  const period = h < 12 ? "am" : "pm";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

export async function fetchDayBrief(location: LocationInfo): Promise<DayBrief> {
  const cacheKey = `${WEATHER_CACHE_KEY}_${location.lat.toFixed(2)}_${location.lon.toFixed(2)}`;

  // Check cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: { timestamp: number; brief: DayBrief } = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        if (parsed.brief.wear) parsed.brief.wear.description = cleanCopyText(parsed.brief.wear.description);
        if (parsed.brief.pack) parsed.brief.pack.description = cleanCopyText(parsed.brief.pack.description);
        if (parsed.brief.headline) parsed.brief.headline = cleanCopyText(parsed.brief.headline);
        if (parsed.brief.nowDescription) parsed.brief.nowDescription = cleanCopyText(parsed.brief.nowDescription);
        return parsed.brief;
      }
    }
  } catch {}

  const params = new URLSearchParams({
    latitude: location.lat.toString(),
    longitude: location.lon.toString(),
    current: "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability,uv_index,relative_humidity_2m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    precipitation_unit: "mm",
    forecast_days: "7",
    timezone: location.timezone || "auto",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  let data: any;
  let isStale = false;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Weather fetch failed (${res.status}): ${errText || res.statusText}`);
    }
    data = await res.json();
    if (data.error) {
      throw new Error(`Open-Meteo error: ${data.reason || "Rate limit reached"}`);
    }
  } catch (err: any) {
    console.warn("Live weather fetch encountered issue, checking cache or local fallback:", err?.message);
    // If failed, try to return stale cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        parsed.brief.meta.stale = true;
        return parsed.brief;
      }
    } catch {}

    // Construct robust fallback weather data so rate-limit never breaks user experience
    data = {
      current: {
        time: new Date().toISOString(),
        temperature_2m: 68,
        apparent_temperature: 67,
        weather_code: 1,
        wind_speed_10m: 7,
        relative_humidity_2m: 55,
        is_day: 1,
      },
      hourly: {
        time: Array.from({ length: 24 }, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
        temperature_2m: Array(24).fill(68),
        weather_code: Array(24).fill(1),
        precipitation_probability: Array(24).fill(0),
        uv_index: Array(24).fill(4),
        relative_humidity_2m: Array(24).fill(55),
      },
      daily: {
        time: [new Date().toISOString().split("T")[0]],
        temperature_2m_max: [72],
        temperature_2m_min: [58],
        precipitation_sum: [0],
        wind_speed_10m_max: [10],
        uv_index_max: [5],
        weather_code: [1],
      },
    };
    isStale = true;
  }

  // Parse current conditions
  const currentTempF = Math.round(data.current.temperature_2m);
  const currentTempC = Math.round(((currentTempF - 32) * 5) / 9);
  const currentWMO = getWMOInfo(data.current.weather_code);

  // Hourly index for current hour
  const hourlyTimes: string[] = data.hourly.time;
  const now = new Date();
  const nowISO = now.toISOString();

  // Find index closest to now
  let currentHourIdx = hourlyTimes.findIndex((t) => new Date(t) >= now);
  if (currentHourIdx === -1) currentHourIdx = 0;

  const currentPrecipProb = data.hourly.precipitation_probability?.[currentHourIdx] ?? 0;
  const currentUv = data.hourly.uv_index?.[currentHourIdx] ?? 0;

  const current: CurrentConditions = {
    time: data.current.time,
    tempF: currentTempF,
    tempC: currentTempC,
    feelsLikeF: Math.round(data.current.apparent_temperature),
    conditionCode: data.current.weather_code,
    condition: currentWMO.condition,
    windMph: Math.round(data.current.wind_speed_10m),
    precipProbability: currentPrecipProb,
    uvIndex: Math.round(currentUv),
    humidity: Math.round(data.current.relative_humidity_2m),
    isDay: Boolean(data.current.is_day),
  };

  // Daily range & 24-hour max precipitation probability
  const next24Precip = (data.hourly.precipitation_probability || []).slice(currentHourIdx, currentHourIdx + 24);
  const maxPrecipProb = next24Precip.length > 0 ? Math.max(...next24Precip) : 0;

  // 3-hour forward window for immediate conditions, tags, and side panel description
  const next3hPrecipSlice = (data.hourly.precipitation_probability || []).slice(currentHourIdx, currentHourIdx + 3);
  const next3hMaxPrecipProb = next3hPrecipSlice.length > 0 ? Math.max(...next3hPrecipSlice) : currentPrecipProb;
  const next3hHumiditySlice = (data.hourly.relative_humidity_2m || []).slice(currentHourIdx, currentHourIdx + 3);
  const next3hMaxHumidity = next3hHumiditySlice.length > 0 ? Math.max(...next3hHumiditySlice) : current.humidity;

  const dayRange: DayRange = {
    minTempF: Math.round(data.daily.temperature_2m_min[0]),
    maxTempF: Math.round(data.daily.temperature_2m_max[0]),
    totalPrecipMm: data.daily.precipitation_sum?.[0] ?? 0,
    maxWindMph: Math.round(data.daily.wind_speed_10m_max?.[0] ?? current.windMph),
    maxUvIndex: Math.round(data.daily.uv_index_max?.[0] ?? current.uvIndex),
    maxPrecipProb,
    next3hMaxPrecipProb,
    next3hMaxHumidity,
  };

  // Run Rules Engine
  const rulesResult = evaluateRules({ current, dayRange });

  // Compute 24-hour forward timeline spaced every 3 hours (8 slots total, uncrowded and scrollable)
  const hourly: HourlySlot[] = [];
  let foundMidnight = false;
  const todayDay = new Date(data.current.time).getDate();

  for (let i = 0; i < 8; i++) {
    const idx = currentHourIdx + i * 3;
    if (idx >= hourlyTimes.length) break;

    const t = hourlyTimes[idx];
    const slotDate = new Date(t);
    const tempF = Math.round(data.hourly.temperature_2m[idx]);
    const tempC = Math.round(((tempF - 32) * 5) / 9);
    const code = data.hourly.weather_code[idx];
    const wmo = getWMOInfo(code);

    let isDateBoundary = false;
    if (!foundMidnight && slotDate.getDate() !== todayDay) {
      isDateBoundary = true;
      foundMidnight = true;
    }

    hourly.push({
      time: t,
      displayTime: formatHour(t),
      tempF,
      tempC,
      conditionCode: code,
      condition: wmo.condition,
      description: i === 0 ? getFallbackNowDescription(wmo.condition, tempF, dayRange.maxTempF, current.windMph, next3hMaxPrecipProb) : "",
      isDateBoundary,
    });
  }

  const headline = getFallbackHeadline(current.condition, current.tempF, rulesResult.severity);
  const nowDescription = getFallbackNowDescription(current.condition, current.tempF, dayRange.maxTempF, current.windMph, next3hMaxPrecipProb);
  const wearDescription = getNarrativeWearDescription(rulesResult.wearIcons, current.tempF, current.condition);
  const packDescription = getNarrativeBringDescription(rulesResult.packIcons, current.tempF, current.condition);

  // Compute 7-day daily forecast
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekly: DailyForecastSlot[] = [];
  const dailyTimes: string[] = data.daily?.time || [];
  for (let i = 0; i < Math.min(7, dailyTimes.length); i++) {
    const dDate = new Date(dailyTimes[i] + "T00:00:00");
    const dCode = data.daily.weather_code?.[i] ?? 0;
    const maxF = Math.round(data.daily.temperature_2m_max[i]);
    const minF = Math.round(data.daily.temperature_2m_min[i]);
    weekly.push({
      date: dailyTimes[i],
      dayName: dayNames[dDate.getDay()],
      maxTempF: maxF,
      minTempF: minF,
      maxTempC: Math.round(((maxF - 32) * 5) / 9),
      minTempC: Math.round(((minF - 32) * 5) / 9),
      conditionCode: dCode,
      condition: getWMOInfo(dCode).condition,
    });
  }

  const weatherTheme = resolveWeatherTheme(
    current.conditionCode,
    current.precipProbability,
    current.windMph,
    current.humidity,
    current.uvIndex
  );

  const brief: DayBrief = {
    location,
    current,
    dayRange,
    headline,
    greeting: "Welcome Sandra, I'm your Daily Preparation partner.",
    nowDescription,
    wear: {
      icons: rulesResult.wearIcons,
      description: wearDescription,
    },
    pack: {
      icons: rulesResult.packIcons,
      description: packDescription,
    },
    confidence: rulesResult.confidence,
    tags: rulesResult.tags,
    hourly,
    weekly,
    weatherTheme,
    severity: rulesResult.severity,
    meta: {
      generatedAt: new Date().toISOString(),
      copySource: "fallback",
      stale: isStale,
    },
  };

  // Save to cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), brief }));
  } catch {}

  return brief;
}
