import { useState, useEffect, useRef } from "react";

type Message = {
  id: number;
  role: "user" | "agent";
  text: string;
};

type Props = {
  open: boolean;
  initialMessage: string | null;
  onClose: () => void;
};

export default function ChatView({ open, initialMessage, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // When a prompt is clicked, seed it as the first message
  useEffect(() => {
    if (open && initialMessage) {
      const userMsg: Message = { id: 1, role: "user", text: initialMessage };
      const agentMsg: Message = { id: 2, role: "agent", text: "Agents message displays here." };
      setMessages([userMsg, agentMsg]);
      setNextId(3);
    }
    if (!open) {
      setMessages([]);
      setInput("");
      setNextId(1);
    }
  }, [open, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextId, role: "user", text: text.trim() };
    const agentMsg: Message = { id: nextId + 1, role: "agent", text: "Agents message displays here." };
    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setNextId((n) => n + 2);
    setInput("");
  }

  return (
    // Page layer — #faf8f4, holds Close and the chat card
    <div
      className="fixed z-40 flex flex-col"
      style={{
        top: 93,
        left: 395,
        right: 0,
        bottom: 0,
        background: "#faf8f4",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(20px)",
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Close — sits in the page background above the card */}
      <div className="flex justify-end px-[32px] pt-[16px] pb-[8px] shrink-0">
        <button
          onClick={onClose}
          className="cursor-pointer bg-transparent border-none text-[#6b655b] underline text-[16px] transition-colors duration-150 hover:text-[#2e2a26]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          Close
        </button>
      </div>

      {/* Chat card — #f0ece4 rounded container */}
      <div className="flex-1 flex flex-col mx-[24px] mb-[24px] min-h-0 rounded-[42px] overflow-hidden" style={{ background: "#f0ece4" }}>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto px-[32px] pt-[32px] pb-[16px] flex flex-col gap-[16px] min-h-0">
          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="bg-white rounded-[20px] px-[20px] py-[14px] max-w-[60%] text-[#2e2a26] text-[15px] shadow-[0px_1px_4px_rgba(28,42,68,0.08)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div
                  className="bg-white rounded-[20px] px-[20px] py-[14px] max-w-[60%] text-[#6b655b] text-[15px] shadow-[0px_1px_4px_rgba(28,42,68,0.08)]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {msg.text}
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input — inside the card, same light bg as home screen chat box */}
        <div className="shrink-0 px-[24px] pb-[24px]">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="rounded-[22px] flex items-center px-[20px] py-[16px] gap-[12px]"
            style={{ background: "#faf8f4" }}
          >
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about today.."
              className="flex-1 bg-transparent border-none outline-none text-[#2e2a26] text-[16px] placeholder-[#6b655b]"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              type="submit"
              className="shrink-0 bg-[#4a69a9] hover:bg-[#3a5384] active:bg-[#2a3d61] text-white rounded-[14px] px-[16px] py-[8px] text-[14px] cursor-pointer border-none transition-colors duration-150 hover:shadow-[0px_2px_8px_2px_rgba(28,42,68,0.3)]"
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
