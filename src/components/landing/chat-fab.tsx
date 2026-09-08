import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, RefreshCw } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hey! 👋 I'm your BechnaSeekho AI assistant. Ask me about **CareerSync**, courses, pricing or how to get started.",
};

const SUGGESTIONS = [
  "How does CareerSync work?",
  "What courses do you offer?",
  "Show me your pricing",
  "How do I talk to a human?",
];

// Generate contextual follow-up chips based on the last assistant reply.
function followUps(text: string): string[] {
  const t = text.toLowerCase();
  if (t.includes("pricing") || t.includes("₹") || t.includes("plan"))
    return ["Compare Pro vs Free", "How do I upgrade?", "Any student discount?"];
  if (t.includes("resume") || t.includes("ats"))
    return ["Check my ATS score", "Show resume templates", "Book mock interview"];
  if (t.includes("course") || t.includes("cohort") || t.includes("learn"))
    return ["Trending courses", "Do you offer certification?", "Cohort start dates"];
  if (t.includes("job") || t.includes("hire") || t.includes("interview"))
    return ["Latest job openings", "How do referrals work?", "Prep for interview"];
  if (t.includes("whatsapp") || t.includes("human") || t.includes("support"))
    return ["What are your hours?", "Book a call", "Email support"];
  return ["Tell me more", "Show me pricing", "How do I sign up?"];
}

// Tiny inline markdown renderer for **bold** and bullet lists — no deps.
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      out.push(
        <ul key={out.length} className="my-1 ml-4 list-disc space-y-0.5">
          {bullets.map((b, i) => (
            <li key={i}>{inline(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  const inline = (s: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };
  lines.forEach((line, i) => {
    const m = /^\s*[-*]\s+(.*)/.exec(line);
    if (m) {
      bullets.push(m[1]);
    } else {
      flush();
      if (line.trim()) out.push(<p key={`p-${i}`}>{inline(line)}</p>);
    }
  });
  flush();
  return <div className="space-y-1.5">{out}</div>;
}

export function ChatFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch (err) {
      setMessages([
        ...next,
        { role: "assistant", content: `⚠️ ${(err as Error).message}` },
      ]);
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([GREETING]);
    setStreaming(false);
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with BechnaSeekho AI"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.55)]"
      >
        {/* pulse ring */}
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand/40" />
        )}
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-6 w-6" fill="currentColor" strokeWidth={0} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-emerald ring-2 ring-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-50 flex h-[560px] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-line shadow-[0_30px_80px_-20px_rgba(37,99,235,0.35)]"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-brand via-brand-2 to-brand p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold">BechnaSeekho AI</p>
                  <p className="flex items-center gap-1.5 text-xs text-white/85">
                    <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-emerald" />
                    Online — streams instantly
                  </p>
                </div>
                <button
                  onClick={reset}
                  aria-label="New chat"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-4 py-4">
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isStreamingHere = streaming && isLast && m.role === "assistant";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-br from-brand to-brand-2 text-white"
                          : "bg-white text-ink ring-1 ring-line"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <>
                          {m.content ? (
                            renderMarkdown(m.content)
                          ) : (
                            <span className="inline-flex gap-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft [animation-delay:-0.3s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft [animation-delay:-0.15s]" />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft" />
                            </span>
                          )}
                          {isStreamingHere && m.content && (
                            <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-brand align-middle" />
                          )}
                        </>
                      ) : (
                        m.content
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Initial suggestions */}
              {messages.length === 1 && !streaming && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-surface hover:shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Contextual follow-ups after an assistant reply */}
              {!streaming &&
                messages.length > 1 &&
                messages[messages.length - 1].role === "assistant" &&
                messages[messages.length - 1].content && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {followUps(messages[messages.length - 1].content).map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full bg-gradient-to-r from-brand/5 to-brand-2/5 px-3 py-1.5 text-xs font-medium text-brand ring-1 ring-brand/20 transition hover:-translate-y-0.5 hover:from-brand/10 hover:to-brand-2/10 hover:shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line bg-white p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about BechnaSeekho…"
                className="min-w-0 flex-1 rounded-full bg-surface px-4 py-2.5 text-sm outline-none ring-1 ring-line focus:ring-brand"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-md transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
