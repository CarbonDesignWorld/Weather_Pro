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
  stateCode: "NY",
  postalCode: "10001",
  country: "United States",
  lat: 40.7128,
  lon: -74.006,
  timezone: "America/New_York",
};

export function formatLocation(loc: LocationInfo | null | undefined): string {
  if (!loc) return "Locating...";
  const stateOrRegion = loc.stateCode || loc.region;

  if (loc.city && stateOrRegion) {
    const stateZip = loc.postalCode ? `${stateOrRegion} ${loc.postalCode}` : stateOrRegion;
    return `${loc.city}, ${stateZip}`;
  }

  if (loc.city) {
    return loc.postalCode ? `${loc.city} ${loc.postalCode}` : loc.city;
  }

  if (stateOrRegion) {
    return loc.postalCode ? `${stateOrRegion} ${loc.postalCode}` : stateOrRegion;
  }

  return loc.postalCode || "Current Location";
}

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
  const clean = query.trim();
  if (!clean || clean.length < 2) return [];

  // 1. Check if 5-digit US zip code
  if (/^\d{5}(-\d{4})?$/.test(clean)) {
    const zip5 = clean.slice(0, 5);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip5}`);
      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          const p = data.places[0];
          return [
            {
              city: p["place name"],
              region: p["state"],
              stateCode: p["state abbreviation"],
              postalCode: zip5,
              country: data["country"] || "United States",
              lat: parseFloat(p["latitude"]),
              lon: parseFloat(p["longitude"]),
              timezone: "auto",
              isCustom: true,
            },
          ];
        }
      }
    } catch (err) {
      console.warn("Zip code search error:", err);
    }
  }

  // 2. Query Open-Meteo for city/region/state/landmark search
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=8&language=en&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Geocoding failed");
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((r: any) => {
      const postCode = r.postcodes && r.postcodes.length > 0 ? r.postcodes[0] : "";
      return {
        city: r.name,
        region: r.admin1 || r.country || "",
        postalCode: postCode,
        country: r.country || "",
        lat: r.latitude,
        lon: r.longitude,
        timezone: r.timezone || "auto",
        isCustom: true,
      };
    });
  } catch (err) {
    console.error("Location search error", err);
    return [];
  }
}

export async function detectLocationViaIP(): Promise<LocationInfo | null> {
  try {
    const res = await fetch("https://ipwho.is/");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          city: data.city || "Current Location",
          region: data.region || data.country || "",
          stateCode: data.region_code || "",
          postalCode: data.postal || "",
          country: data.country || "",
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }
    }
  } catch (err) {
    console.warn("IP geolocation (ipwho.is) failed:", err);
  }

  try {
    const res = await fetch("https://freeipapi.com/api/json");
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude) {
        return {
          city: data.cityName || "Current Location",
          region: data.regionName || data.countryName || "",
          stateCode: data.regionName?.length === 2 ? data.regionName : "",
          postalCode: data.zipCode || "",
          country: data.countryName || "",
          lat: data.latitude,
          lon: data.longitude,
          timezone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }
    }
  } catch (err) {
    console.warn("IP geolocation fallback failed:", err);
  }

  return null;
}

export async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  try {
    const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(revUrl);
    if (res.ok) {
      const data = await res.json();
      const rawStateCode = data.principalSubdivisionCode ? data.principalSubdivisionCode.replace(/^US-/, "") : "";
      return {
        city: data.city || data.locality || "Current Location",
        region: data.principalSubdivision || data.countryName || "",
        stateCode: rawStateCode.length <= 3 ? rawStateCode : "",
        postalCode: data.postcode || "",
        country: data.countryName || "",
        lat,
        lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }
  } catch (err) {
    console.warn("Reverse geocode failed:", err);
  }

  return {
    city: "Local Area",
    region: "",
    lat,
    lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function resolveUserLocation(forceRefresh = false): Promise<LocationInfo> {
  const saved = getSavedLocation();
  // If user explicitly picked a custom location and forceRefresh is false, keep it
  if (saved && saved.isCustom && !forceRefresh) {
    return saved;
  }

  // 1. Try high-accuracy browser geolocation if available
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 4000,
          maximumAge: 300000,
        });
      });
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      saveLocation(loc);
      return loc;
    } catch {
      // Browser prompt dismissed, denied, or timed out -> fall through to IP detection
    }
  }

  // 2. Fallback to fast IP geolocation (detects city, state, zip without permission prompts)
  const ipLoc = await detectLocationViaIP();
  if (ipLoc) {
    saveLocation(ipLoc);
    return ipLoc;
  }

  // 3. Fallback to saved or DEFAULT_LOCATION
  return saved || DEFAULT_LOCATION;
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

  // Compute 24-hour forward timeline with every single hour (24 consecutive hourly slots)
  const hourly: HourlySlot[] = [];
  let foundMidnight = false;
  const todayDay = new Date(data.current.time).getDate();

  const totalHours = Math.min(24, hourlyTimes.length - currentHourIdx);
  for (let i = 0; i < totalHours; i++) {
    const idx = currentHourIdx + i;
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

  // Compute 7-day daily forecast (abbreviated day names for compact weather cells)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
