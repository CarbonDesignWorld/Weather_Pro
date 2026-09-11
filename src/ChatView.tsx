import React, { useState, useEffect, useRef } from "react";
import { DayBrief, ChatMessage } from "./lib/types";
import { sendChatMessage } from "./lib/apiClient";

type MessageItem = {
  id: string | number;
  role: "user" | "assistant";
  text: string;
};

type Props = {
  open: boolean;
  initialMessage: string | null;
  brief: DayBrief | null;
  onClose: () => void;
};

export default function ChatView({ open, initialMessage, brief, onClose }: Props) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // When a prompt is clicked or opened with seed, send initial message
  useEffect(() => {
    if (open && initialMessage && brief) {
      const userMsg: MessageItem = { id: Date.now(), role: "user", text: initialMessage };
      setMessages([userMsg]);
      sendMessageInternal(initialMessage, [userMsg]);
    } else if (!open) {
      setMessages([]);
      setInput("");
      setErrorMsg(null);
      setLoading(false);
    }
  }, [open, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessageInternal(text: string, currentHistory: MessageItem[]) {
    if (!text.trim() || !brief) return;
    setLoading(true);
    setErrorMsg(null);

    const apiMessages: ChatMessage[] = currentHistory.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const res = await sendChatMessage(apiMessages, brief);
      if (res.message) {
        const agentMsg: MessageItem = {
          id: Date.now() + 1,
          role: "assistant",
          text: res.message,
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to reach agent");
    } finally {
      setLoading(false);
    }
  }

  function handleSend(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: MessageItem = { id: Date.now(), role: "user", text: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    sendMessageInternal(text.trim(), updated);
  }

  return (
    <div
      className="fixed inset-0 lg:top-[93px] lg:left-[320px] xl:left-[360px] 2xl:left-[395px] z-50 flex flex-col bg-[#faf8f4]"
      style={{
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(20px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end px-[16px] lg:px-[32px] pt-[12px] lg:pt-[16px] pb-[8px] shrink-0">
        <button
          onClick={onClose}
          className="cursor-pointer bg-transparent border-none text-[#6b655b] underline text-[16px] transition-colors duration-150 hover:text-[#2e2a26]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          Close
        </button>
      </div>

      {/* Chat card */}
      <div
        className="flex-1 flex flex-col mx-[12px] lg:mx-[24px] mb-[16px] lg:mb-[24px] min-h-0 rounded-[28px] lg:rounded-[42px] overflow-hidden shadow-[0px_2px_12px_rgba(28,42,68,0.06)] border border-[#e4dfd6] bg-white"
      >
        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-[16px] lg:px-[32px] pt-[20px] lg:pt-[32px] pb-[16px] flex flex-col gap-[14px] lg:gap-[16px] min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-12 text-[#6b655b] text-[15px]" style={{ fontFamily: "Inter, sans-serif" }}>
              Ask anything about today&apos;s weather, what to wear, or item substitutions.
            </div>
          )}

          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="bg-[#faf8f4] text-[#6b655b] border border-[#e4dfd6] rounded-[20px] px-[16px] lg:px-[20px] py-[12px] lg:py-[14px] max-w-[85%] lg:max-w-[60%] text-[15px] shadow-[0px_1px_4px_rgba(28,42,68,0.04)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div
                  className="bg-[#f0ece4] text-[#6b655b] border border-[#e4dfd6] rounded-[20px] px-[16px] lg:px-[20px] py-[12px] lg:py-[14px] max-w-[85%] lg:max-w-[60%] text-[15px] shadow-[0px_1px_4px_rgba(28,42,68,0.04)] leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {msg.text}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="flex justify-start">
              <div
                className="bg-[#f0ece4] border border-[#e4dfd6] rounded-[20px] px-[20px] py-[14px] text-[#6b655b] text-[14px] italic shadow-[0px_1px_4px_rgba(28,42,68,0.04)]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Thinking...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-center py-2 text-red-600 text-[14px]">
              {errorMsg}.{" "}
              <button
                onClick={() => {
                  const lastUser = [...messages].reverse().find((m) => m.role === "user");
                  if (lastUser) sendMessageInternal(lastUser.text, messages);
                }}
                className="underline cursor-pointer bg-transparent border-none text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 px-[14px] lg:px-[24px] pb-[14px] lg:pb-[24px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="rounded-[22px] flex items-center px-[14px] lg:px-[20px] py-[10px] lg:py-[16px] gap-[10px] lg:gap-[12px] border border-[#e4dfd6]"
            style={{ background: "#faf8f4" }}
          >
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about today"
              maxLength={500}
              className="flex-1 bg-transparent border-none outline-none text-[#6b655b] text-[16px] placeholder-[#6b655b]"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`shrink-0 rounded-[14px] px-[16px] py-[8px] text-[14px] font-medium border-none transition-colors duration-150 ${
                input.trim() && !loading
                  ? "bg-[#4a69a9] hover:bg-[#3a5384] active:bg-[#2a3d61] text-white cursor-pointer shadow-[0px_2px_8px_rgba(28,42,68,0.25)]"
                  : "bg-[#d5cfc4] text-[#6b655b] cursor-not-allowed"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
