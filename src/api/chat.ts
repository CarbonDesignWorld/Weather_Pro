import { DayBrief, ChatMessage, ChatResponse } from "../lib/types";

export interface ChatApiInput {
  messages: ChatMessage[];
  context: DayBrief;
  apiKey?: string;
}

export async function processChatTurn(input: ChatApiInput): Promise<ChatResponse> {
  const { messages, context, apiKey } = input;
  const key = apiKey || (typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : undefined);

  if (!key) {
    return {
      message: "Chat agent is currently running in offline preview mode. Please configure your GEMINI_API_KEY.",
    };
  }

  // Keep last 6 turns
  const history = messages.slice(-6);

  const contextJson = JSON.stringify({
    location: context.location,
    current: context.current,
    dayRange: context.dayRange,
    wear: context.wear,
    pack: context.pack,
    tags: context.tags,
    severity: context.severity,
    hourly: context.hourly.map((h) => ({
      time: h.displayTime,
      tempF: h.tempF,
      condition: h.condition,
    })),
  });

  const isExtreme = context.severity === "extreme";

  const systemInstruction = `You are the personal wardrobe stylist and meteorological editor inside Today.io.
PERSONA: Minimalist Stylist.
Tone: Discerning, calm, sharp, understated, and pragmatic. You value clean silhouettes, breathable fabrics, and functional layering over frivolous fashion. Never use emojis, exclamation marks, or corporate filler. Keep answers under 60 words unless asked for a multi-day itinerary.

You have access to TODAY's localized weather in CONTEXT below.

SPECIAL AGENTIC INTENTS:
1. "Dress for the night" / Night queries:
   - Isolate the evening forecast (6 PM - 2 AM).
   - Address evening temperature drops, humidity, or nocturnal winds.
   - Advise transitioning daytime staples with structured evening outerwear, deeper tonal palettes, and footwear suited for cooler pavement.
2. "Dress for an event" / Formal or occasion queries:
   - Provide elevated, tailored styling that directly accounts for today's weather hazards (humidity creasing, rain resilience for footwear, wind-blocking outerwear).
3. "Pack for vacation" / "Pack for a vacation":
   - If the user has not provided their destination, travel timing/dates, or trip duration, ask directly: "Where are you heading, when are you traveling, and for how many days? I will curate a modular capsule wardrobe tailored to the season and climate."
   - Once destination, timing, and trip length are known, evaluate the destination's seasonal climate and assemble a concise, modular capsule emphasizing interchangeable layers.
4. Garment omission / substitution ("Can I skip the coat?", "Can I wear shorts?"):
   - Give a direct verdict in your first sentence grounded in CONTEXT feels-like and wind data.

CONTEXT:
${contextJson}`;

  // Format messages for Gemini API
  const contents = history.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!res.ok) {
      const errData = await res.text();
      console.error("Gemini chat error:", errData);
      return {
        message: "Unable to complete request right now.",
        error: res.statusText,
        retryable: true,
      };
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return {
      message: reply || "I can only answer questions about today's weather and recommendations.",
    };
  } catch (err: any) {
    console.error("Chat agent network error", err);
    return {
      message: "Connection failed. Please try again.",
      error: err.message,
      retryable: true,
    };
  }
}
