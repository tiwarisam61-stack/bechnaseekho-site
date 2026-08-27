import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Timer, RotateCcw, Sparkles } from "lucide-react";
import type { QuizQuestion } from "@/lib/academy-courses";
import { ProgressBar } from "./progress-visuals";

const typeLabel: Record<QuizQuestion["type"], string> = {
  mcq: "Multiple Choice",
  scenario: "Scenario Based",
  blank: "Fill in the Blank",
  match: "Match the Following",
};

export type QuizResult = { score: number; correct: number; total: number };

export function QuizRunner({
  questions,
  passMark = 70,
  minutes,
  onPassed,
  submitLabel = "Submit answers",
  compact = false,
}: {
  questions: QuizQuestion[];
  passMark?: number;
  minutes?: number;
  onPassed?: (result: QuizResult) => void;
  submitLabel?: string;
  compact?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState((minutes ?? 0) * 60);

  useEffect(() => {
    if (!minutes || submitted) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [minutes, submitted]);

  const result = useMemo<QuizResult>(() => {
    const correct = questions.filter((q) => answers[q.id] === q.answer).length;
    return {
      correct,
      total: questions.length,
      score: Math.round((correct / questions.length) * 100),
    };
  }, [answers, questions]);

  const answeredAll = questions.every((q) => answers[q.id] !== undefined);
  const passed = submitted && result.score >= passMark;

  const submit = () => {
    setSubmitted(true);
    if (result.score >= passMark) onPassed?.(result);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    setSeconds((minutes ?? 0) * 60);
  };

  const weakTypes = questions
    .filter((q) => submitted && answers[q.id] !== q.answer)
    .map((q) => typeLabel[q.type]);
  const strongTypes = questions
    .filter((q) => submitted && answers[q.id] === q.answer)
    .map((q) => typeLabel[q.type]);
  const uniq = (a: string[]) => Array.from(new Set(a));

  return (
    <div className="space-y-5">
      {submitted ? (
        <div
          className={`animate-pop rounded-3xl border p-6 ${
            passed
              ? "border-accent/40 bg-accent-soft"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {passed ? "Passed" : "Not passed yet"}
              </p>
              <p className="text-4xl font-black tracking-tight">{result.score}%</p>
              <p className="text-sm font-medium text-muted-foreground">
                {result.correct} correct · {result.total - result.correct} wrong · pass mark{" "}
                {passMark}%
              </p>
            </div>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold transition-colors hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </button>
          </div>
          <div className="mt-4">
            <ProgressBar value={result.score} tone={passed ? "accent" : "brand"} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-card/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Strength areas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {strongTypes.length ? uniq(strongTypes).join(", ") : "Keep practising — no clear strengths yet."}
              </p>
            </div>
            <div className="rounded-2xl bg-card/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Improvement areas
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {weakTypes.length ? uniq(weakTypes).join(", ") : "None — excellent performance."}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-2xl bg-card/70 p-4 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p>
              <span className="font-bold text-foreground">Recommendation: </span>
              {passed
                ? "Strong performance. Move on to the next unit and apply one technique to a live opportunity today."
                : "Revisit the chapters covering your wrong answers, then retake. Reviewing the case studies usually adds 15-20%."}
            </p>
          </div>
        </div>
      ) : null}

      {minutes && !submitted ? (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-bold">
          <Timer className="h-4 w-4 text-secondary" />
          Suggested time remaining:{" "}
          <span className="tabular-nums">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
        </div>
      ) : null}

      <ol className="space-y-4">
        {questions.map((q, i) => {
          const chosen = answers[q.id];
          return (
            <li
              key={q.id}
              className={`rounded-3xl border border-border bg-card p-5 ${compact ? "" : "soft-shadow"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-soft text-xs font-black text-primary">
                  {i + 1}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {typeLabel[q.type]}
                </span>
              </div>
              <p className="mt-3 text-[15px] font-semibold leading-relaxed">{q.prompt}</p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = q.answer === oi;
                  let tone =
                    "border-border bg-background hover:border-secondary/60 hover:bg-primary-soft/40";
                  if (submitted && isCorrect) tone = "border-accent/60 bg-accent-soft";
                  else if (submitted && isChosen) tone = "border-destructive/50 bg-destructive/10";
                  else if (isChosen) tone = "border-secondary bg-primary-soft";
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${tone}`}
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px] font-black">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      ) : null}
                      {submitted && isChosen && !isCorrect ? (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <button
          onClick={submit}
          disabled={!answeredAll}
          className="btn-glow inline-flex w-full items-center justify-center rounded-xl brand-gradient px-5 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {answeredAll ? submitLabel : `Answer all ${questions.length} questions to submit`}
        </button>
      ) : null}
    </div>
  );
}
