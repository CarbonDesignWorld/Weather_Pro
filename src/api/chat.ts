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

  const systemInstruction = `You are the assistant inside Today.io, a weather app that tells people what to wear and pack.

You can only discuss TODAY, for the location in CONTEXT below. You have no ability to look up other days, other locations, or historical weather.
If asked about other days or other locations, say: "I can only talk about today right now." and stop.

Answer only from CONTEXT. Never invent a temperature, condition, or forecast. If CONTEXT doesn't contain the answer, say so.

VOICE:
${isExtreme ? "- Severity is extreme: Use plain, factual voice only. No wit or stylisation of any kind." : "- Conclusion first, then the reason, then stop. Short declarative sentences. Specific over intense. No exclamation marks, no hedging, no personified weather, no clichés, no emoji, no profanity."}

RULES:
1. When asked whether an item can be substituted, give a direct YES or NO first, then one line of reasoning grounded in the actual conditions from CONTEXT.
2. Keep answers under 60 words unless the user explicitly asks for detail.
3. SAFETY: You do not give medical diagnoses or travel-safety verdicts.
   - If asked about medical symptoms (heat stroke, hypothermia, etc.): do not diagnose; point to medical professionals or emergency services immediately.
   - If asked whether it is safe to drive, fly, or travel: describe the conditions accurately, do not issue a safety verdict.
   - If asked about an active weather emergency: state conditions and direct to official local authorities.

CONTEXT:
${contextJson}`;

  // Format messages for Gemini API
  const contents = history.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 150,
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
