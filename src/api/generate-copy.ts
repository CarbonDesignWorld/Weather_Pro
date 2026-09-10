import { DayBrief, GeneratedCopyResponse, IconId, SeverityLevel } from "../lib/types";
import { ICONS, getFallbackHeadline, getFallbackWearDescription, getFallbackPackDescription, getFallbackNowDescription } from "../lib/constants";

export interface GenerateCopyInput {
  current: DayBrief["current"];
  dayRange: DayBrief["dayRange"];
  wearIcons: IconId[];
  packIcons: IconId[];
  severity: SeverityLevel;
}

export async function generateCopy(
  input: GenerateCopyInput,
  apiKey?: string
): Promise<GeneratedCopyResponse> {
  const { current, dayRange, wearIcons, packIcons, severity } = input;

  const fallback: GeneratedCopyResponse = {
    headline: getFallbackHeadline(current.condition, current.tempF, severity),
    wearDescription: getFallbackWearDescription(wearIcons),
    packDescription: getFallbackPackDescription(packIcons),
    nowDescription: getFallbackNowDescription(current.condition, current.tempF),
  };

  const key = apiKey || (typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : undefined);
  if (!key) {
    return fallback;
  }

  const wearNames = wearIcons.map((id) => ICONS[id]?.name || id).join(", ");
  const packNames = packIcons.map((id) => ICONS[id]?.name || id).join(", ");

  let voiceTone = "Blunt, dry, and confident. Short declarative sentences. Specific over intense. No exclamation marks, no hedging, no personified weather, no clichés, no emoji.";
  if (severity === "elevated") {
    voiceTone = "Blunt but no wit. Straight facts and instruction only. Serious weather conditions.";
  } else if (severity === "extreme") {
    voiceTone = "Plain and factual only. No stylisation or humor of any kind. Dangerous weather conditions.";
  }

  const systemInstruction = `You write the editorial copy for Today.io, a weather utility app that tells people what to wear and pack today in one glance.

TONE: ${voiceTone}

CRITICAL RULES:
1. You MUST describe ONLY the exact items in WEAR_ITEMS and PACK_ITEMS. Never recommend or name any garment or item not in those lists.
2. Character limits (STRICT):
   - headline: 20 to 110 characters.
   - wearDescription: 30 to 180 characters.
   - packDescription: 30 to 180 characters.
   - nowDescription: 20 to 90 characters.
3. Respond in valid, strict JSON ONLY. No markdown fences, no explanatory text.`;

  const prompt = `Current Weather: ${current.condition}, ${current.tempF}°F (Feels like ${current.feelsLikeF}°F).
Day Range: Low ${dayRange.minTempF}°F / High ${dayRange.maxTempF}°F. Rain probability: ${current.precipProbability}%. Wind: ${current.windMph} mph.
WEAR_ITEMS: ${wearNames || "None"}
PACK_ITEMS: ${packNames || "None"}
Severity: ${severity}

Return strict JSON:
{
  "headline": "Short punchy headline summary (20-110 chars)",
  "wearDescription": "Why to wear these specific items (30-180 chars)",
  "packDescription": "Why to pack these specific items (30-180 chars)",
  "nowDescription": "Current moment conditions summary (20-90 chars)"
}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      console.warn("Gemini generate-copy failed, using fallback", res.statusText);
      return fallback;
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return fallback;

    const parsed = JSON.parse(rawText);

    // Validate budget lengths and sanity
    return {
      headline: (parsed.headline && parsed.headline.slice(0, 110)) || fallback.headline,
      wearDescription: (parsed.wearDescription && parsed.wearDescription.slice(0, 180)) || fallback.wearDescription,
      packDescription: (parsed.packDescription && parsed.packDescription.slice(0, 180)) || fallback.packDescription,
      nowDescription: (parsed.nowDescription && parsed.nowDescription.slice(0, 90)) || fallback.nowDescription,
    };
  } catch (err) {
    console.error("Copy generation error", err);
    return fallback;
  }
}
