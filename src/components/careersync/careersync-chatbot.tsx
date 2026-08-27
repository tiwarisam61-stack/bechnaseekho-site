import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How does the ATS score work?",
  "How do I build my resume?",
  "Which companies hire here?",
  "How do mock interviews work?",
];

const WELCOME: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the **CareerSync AI Assistant**. Ask me about resume building, ATS scores, mock interviews, jobs, or how to get hired faster.",
};

export function CareerSyncChatbot() {
  const { isAuthed, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Optimistic assistant bubble that we'll stream into
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Something went wrong." }));
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: err.error ?? "Sorry, I couldn't respond right now. Please try again.",
          };
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Network hiccup. Please try again in a moment.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating BechnaSeekho logo trigger */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[60] group"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_10px_40px_-8px_rgba(59,130,246,0.55)] ring-1 ring-black/5">
          {open ? (
            <X className="h-6 w-6 text-slate-700" />
          ) : (
            <img
              src="/favicon.png"
              alt="BechnaSeekho AI"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              draggable={false}
            />
          )}
          {!open && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-28 right-4 sm:right-6 z-[60] w-[min(94vw,400px)] h-[min(78vh,600px)] rounded-3xl overflow-hidden bg-white/95 backdrop-blur-2xl shadow-2xl ring-1 ring-black/10 flex flex-col"
          >
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30">
                  <img src="/favicon.png" alt="" className="h-7 w-7 object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[15px] leading-tight">BechnaSeekho AI</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-400/90 text-emerald-950 px-1.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-900 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[12px] text-white/80 leading-tight">Career expert · replies instantly</p>
                </div>
              </div>
            </div>

            {/* Body: gated by auth */}
            {!isAuthed ? (
              <div className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-slate-50/60 to-white flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center shadow-lg">
                  <LogIn className="h-7 w-7 text-white" />
                </div>
                <h4 className="mt-4 font-display font-bold text-lg text-slate-900">Log in to chat</h4>
                <p className="mt-2 text-sm text-slate-600 max-w-[280px]">
                  The BechnaSeekho AI assistant is available for signed-in members. Log in or create a free account to start chatting.
                </p>
                <div className="mt-5 flex gap-2">
                  <Link
                    to="/login"
                    search={{ role: "candidate" }}
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-white text-indigo-700 ring-1 ring-indigo-200 px-4 py-2 text-sm font-semibold hover:bg-indigo-50"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    search={{ role: "candidate" }}
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg"
                  >
                    Sign up free
                  </Link>
                </div>
                {authLoading && <p className="mt-4 text-xs text-slate-400">Checking session…</p>}
              </div>
            ) : (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-slate-50/60 to-white">
                  {messages.map((m, i) => (
                    <Bubble key={i} role={m.role} content={m.content} />
                  ))}
                  {loading && messages[messages.length - 1]?.content === "" && (
                    <div className="flex gap-1.5 pl-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-.3s]" />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-.15s]" />
                      <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                    </div>
                  )}

                  {messages.length <= 1 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => send(s)}
                          className="text-xs px-3 py-1.5 rounded-full bg-white ring-1 ring-slate-200 hover:ring-indigo-400 hover:bg-indigo-50 text-slate-700 transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="border-t border-slate-200/70 bg-white p-3 flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 rounded-full bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition px-4 py-2">
                    <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about jobs, resume, interviews…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition"
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, content }: Msg) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words ${isUser
            ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-br-md shadow-sm"
            : "bg-white text-slate-800 ring-1 ring-slate-200 rounded-bl-md shadow-sm"
          }`}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
    </div>
  );
}

// Minimal, safe markdown: **bold**, *italic*, `code`, bullets, links
function renderMarkdown(src: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let out = escape(src);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 text-[12px]">$1</code>');
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" class="text-indigo-600 underline underline-offset-2">$1</a>',
  );
  // simple bullets
  out = out.replace(/(^|\n)[-•]\s+([^\n]+)/g, "$1• $2");
  return out;
}
