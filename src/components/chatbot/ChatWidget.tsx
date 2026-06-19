"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { ChatMessage } from "@/types/chatbot";

// ── Suggested questions ───────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  "Which course should I choose?",
  "How do I renew my membership?",
  "What e-books are available?",
  "How can I access my course?",
  "How do I contact support?",
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! 👋 I'm the **CivilEzy AI Assistant**. I can help you with course information, membership, e-books, and more.\n\nWhat would you like to know?",
  timestamp: new Date(),
  source: "faq",
};

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

// ── Render bold + line-breaks from markdown-ish text ─────────────────────────
function renderText(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.45)",
            animation: `cw-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
        alignItems: "flex-end",
        gap: "7px",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            flexShrink: 0,
          }}
        >
          🤖
        </div>
      )}
      <div
        style={{
          maxWidth: "78%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            padding: "9px 13px",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isUser
              ? "linear-gradient(135deg,#FF6200,#FF8534)"
              : "rgba(255,255,255,0.08)",
            color: "#fff",
            fontSize: "13px",
            lineHeight: "1.6",
            border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
            wordBreak: "break-word",
          }}
        >
          {renderText(msg.content)}
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.28)",
            marginTop: "3px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {formatTime(msg.timestamp)}
          {msg.source === "faq" && (
            <span style={{ color: "rgba(52,211,153,0.65)", fontSize: "9px" }}>✓ FAQ</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ChatWidget ───────────────────────────────────────────────────────────
export default function ChatWidget() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => generateId());
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [unread, setUnread] = useState(0);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open, loading, scrollToBottom]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 160);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || loading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: q,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setShowSuggestions(false);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, sessionId, userId: "anonymous" }),
        });

        const data = await res.json();

        const botMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content:
            data.response ||
            "Sorry, I couldn't get a response. Please try again or contact us on WhatsApp.",
          timestamp: new Date(),
          source: data.source ?? "ai",
          confidence: data.confidence,
        };

        setMessages((prev) => [...prev, botMsg]);
        if (!open) setUnread((n) => n + 1);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please check your internet or reach us on WhatsApp at 90723 45630.",
            timestamp: new Date(),
            source: "error" as const,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId, open]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowSuggestions(true);
  };

  // Hide on admin routes (after all hooks)
  if (!mounted || pathname.startsWith("/admin")) return null;

  return (
    <>
      {/*
       * ── FAB SYSTEM — RIGHT SIDE (AI Chatbot) ──────────────────────────────
       *
       * VERTICAL STACK (right side, bottom → top):
       *   24px  ─ ChatWidget FAB        (56×56, z-index: 970)
       *   96px  ─ FloatingSupportButton (44px tall, z-index: 960)
       *
       * PANEL: opens upward from just above FAB.
       *   Panel bottom: 92px (just above FAB top edge at 24+56+12=92px gap)
       *   Panel covers FloatingSupportButton when open — acceptable since
       *   users can use the chat to get support. Button reappears on close.
       *
       * OPPOSITE SIDE: WhatsApp FAB sits at bottom-left (z-index: 950).
       *
       * ── RESPONSIVE POSITIONS ──────────────────────────────────────────────
       *
       * Desktop  (≥ 768px) : FAB bottom: 24px,  right: 24px
       * Tablet   (640-767)  : FAB bottom: 24px,  right: 20px
       * Mobile   (< 640px)  : FAB bottom: 78px,  right: 16px
       *                       (clears StickyCTA bar height ~54px + 24px gap)
       *
       * Panel:
       * Desktop/Tablet : fixed 380×510px, bottom: 92px, right: 24/20px
       * Mobile         : full-width overlay, bottom: 0, border-radius top only
       */}
      <style>{`
        /* ── Animations ── */
        @keyframes cw-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30%            { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes cw-panel-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cw-btn-pulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(255,98,0,0.45), 0 0 0 0 rgba(255,98,0,0.4); }
          50%       { box-shadow: 0 6px 24px rgba(255,98,0,0.45), 0 0 0 8px rgba(255,98,0,0); }
        }

        /* ── FAB button ── */
        #cw-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 970;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6200, #FF8534);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #fff;
          box-shadow: 0 6px 24px rgba(255,98,0,0.45);
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
          touch-action: manipulation;
          animation: cw-btn-pulse 2.8s ease-in-out infinite;
        }
        #cw-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 10px 36px rgba(255,98,0,0.62);
          animation: none;
        }
        #cw-fab-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f87171;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          font-family: Nunito, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #060D1A;
          pointer-events: none;
        }

        /* ── Chat panel ── */
        #cw-panel {
          position: fixed;
          bottom: 92px;
          right: 24px;
          z-index: 965;
          width: 370px;
          height: 510px;
          max-height: calc(100dvh - 110px);
          background: #0B1E3D;
          border: 1px solid rgba(255,98,0,0.22);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,98,0,0.08);
          font-family: Nunito, sans-serif;
          animation: cw-panel-in 0.26s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Scrollbar inside messages area ── */
        #cw-messages::-webkit-scrollbar       { width: 3px; }
        #cw-messages::-webkit-scrollbar-track { background: transparent; }
        #cw-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        /* ─────────────────────────────────────────────────────────────────────
         * TABLET  640px – 767px
         * ────────────────────────────────────────────────────────────────────── */
        @media (min-width: 640px) and (max-width: 767px) {
          #cw-fab   { bottom: 24px !important; right: 20px !important; }
          #cw-panel { bottom: 92px !important; right: 20px !important; width: 350px !important; }
        }

        /* ─────────────────────────────────────────────────────────────────────
         * MOBILE  < 640px
         * FAB sits above StickyCTA bar (~54px) with 24px margin = 78px.
         * Panel becomes a near-full-screen sheet from the bottom.
         * ────────────────────────────────────────────────────────────────────── */
        @media (max-width: 639px) {
          #cw-fab {
            bottom: 78px !important;
            right: 16px !important;
            width: 52px !important;
            height: 52px !important;
            font-size: 20px !important;
          }
          #cw-panel {
            /* Full-width sheet sliding up from bottom */
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 88dvh !important;
            max-height: 88dvh !important;
            border-radius: 20px 20px 0 0 !important;
            border-left: none !important;
            border-right: none !important;
            border-bottom: none !important;
          }
        }

        /* ─────────────────────────────────────────────────────────────────────
         * LARGE SCREENS  ≥ 1400px: subtle extra margin
         * ────────────────────────────────────────────────────────────────────── */
        @media (min-width: 1400px) {
          #cw-fab   { bottom: 28px !important; right: 28px !important; }
          #cw-panel { bottom: 98px !important; right: 28px !important; }
        }
      `}</style>

      {/* ── FAB Toggle Button ── */}
      <button
        id="cw-fab"
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? "Close AI Assistant" : "Open CivilEzy AI Assistant"}
        aria-expanded={open}
        title="CivilEzy AI Assistant"
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span id="cw-fab-badge" aria-label={`${unread} unread messages`}>
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div id="cw-panel" role="dialog" aria-label="CivilEzy AI Assistant chat">

          {/* ── Panel Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg,rgba(255,98,0,0.18),rgba(255,133,52,0.08))",
              borderBottom: "1px solid rgba(255,98,0,0.18)",
              padding: "13px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#FF6200,#FF8534)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  flexShrink: 0,
                  boxShadow: "0 3px 12px rgba(255,98,0,0.35)",
                }}
              >
                🤖
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#fff",
                    lineHeight: 1.15,
                  }}
                >
                  CivilEzy AI
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#34d399",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.45)" }}>
                    Online · Ask me anything
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={clearChat}
                title="Clear conversation"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: "10.5px",
                  fontFamily: "Nunito, sans-serif",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            id="cw-messages"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Suggested questions — shown only before first user message */}
            {showSuggestions && messages.length === 1 && (
              <div style={{ marginTop: "6px" }}>
                <p
                  style={{
                    fontSize: "10.5px",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "7px",
                    letterSpacing: "0.02em",
                  }}
                >
                  Try asking:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{
                        background: "rgba(255,98,0,0.07)",
                        border: "1px solid rgba(255,98,0,0.18)",
                        borderRadius: "10px",
                        padding: "7px 12px",
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "Nunito, sans-serif",
                        transition: "background 0.15s, border-color 0.15s",
                        lineHeight: 1.4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,98,0,0.14)";
                        e.currentTarget.style.borderColor = "rgba(255,98,0,0.38)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,98,0,0.07)";
                        e.currentTarget.style.borderColor = "rgba(255,98,0,0.18)";
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "7px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#FF6200,#FF8534)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    padding: "9px 13px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px 16px 16px 4px",
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ── */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              padding: "10px 12px",
              display: "flex",
              gap: "7px",
              background: "rgba(0,0,0,0.25)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              disabled={loading}
              maxLength={500}
              aria-label="Type your question"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "11px",
                padding: "9px 13px",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
                fontFamily: "Nunito, sans-serif",
                opacity: loading ? 0.6 : 1,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,98,0,0.45)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background:
                  loading || !input.trim()
                    ? "rgba(255,255,255,0.06)"
                    : "linear-gradient(135deg,#FF6200,#FF8534)",
                border: "none",
                color:
                  loading || !input.trim() ? "rgba(255,255,255,0.25)" : "#fff",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "17px",
                flexShrink: 0,
                transition: "background 0.18s",
              }}
            >
              ➤
            </button>
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              padding: "5px 12px 9px",
              textAlign: "center",
              fontSize: "10px",
              color: "rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.25)",
              flexShrink: 0,
              lineHeight: 1.5,
            }}
          >
            CivilEzy AI · Urgent help?{" "}
            <a
              href="https://wa.me/919072345630"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "rgba(255,133,52,0.55)", textDecoration: "none" }}
            >
              WhatsApp 90723 45630
            </a>
          </div>
        </div>
      )}
    </>
  );
}
