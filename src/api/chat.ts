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

  const systemInstruction = `You are the personal weather and wardrobe assistant inside Today.io.
Your job is to answer the user's questions about today's weather and what to wear or pack.

You can only discuss TODAY, for the location in CONTEXT below. You have no ability to look up other days, other locations, or historical weather.
If asked about other days or other locations, say: "I can only talk about today right now." and stop.

Answer only from CONTEXT. Never invent a temperature, condition, or forecast. If CONTEXT doesn't contain the answer, say so.

RULES:
1. When asked whether an item can be skipped, omitted, or substituted (e.g. "Can I skip the jacket?", "Can I wear shorts?", "Should I bring an umbrella?"):
   - Give a direct YES or NO first.
   - Then provide 1 to 2 clear, helpful sentences explaining why based on the temperature, wind, and conditions from CONTEXT.
2. Maintain a natural, concise, and helpful tone. Do not output lone fragments like just a temperature number. Provide complete, helpful sentences.
3. Keep answers under 60 words unless the user explicitly asks for detail.
4. SAFETY: You do not give medical diagnoses or travel-safety verdicts.
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`,
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
