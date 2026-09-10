import { DayBrief, GeneratedCopyResponse, ChatMessage, ChatResponse } from "./types";
import { generateCopy } from "../api/generate-copy";
import { processChatTurn } from "../api/chat";

export async function requestCopyGeneration(brief: DayBrief): Promise<GeneratedCopyResponse> {
  // Try server endpoint first
  try {
    const res = await fetch("/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current: brief.current,
        dayRange: brief.dayRange,
        wearIcons: brief.wear.icons,
        packIcons: brief.pack.icons,
        severity: brief.severity,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to direct handler
  }

  return generateCopy({
    current: brief.current,
    dayRange: brief.dayRange,
    wearIcons: brief.wear.icons,
    packIcons: brief.pack.icons,
    severity: brief.severity,
  });
}

export async function sendChatMessage(messages: ChatMessage[], context: DayBrief): Promise<ChatResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, context }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to direct handler
  }

  return processChatTurn({ messages, context });
}
