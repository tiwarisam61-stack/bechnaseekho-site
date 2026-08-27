import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { scoreRating } from "@/lib/ats.schema";

type Props = { score: number; size?: number; label?: string };

export function ScoreGauge({ score, size = 220, label = "Overall ATS Score" }: Props) {
  const [shown, setShown] = useState(0);
  const rating = scoreRating(score);

  useEffect(() => {
    let frame = 0;
    const total = 42;
    const id = window.setInterval(() => {
      frame += 1;
      const eased = 1 - Math.pow(1 - frame / total, 3);
      setShown(Math.round(score * eased));
      if (frame >= total) {
        setShown(Math.round(score));
        window.clearInterval(id);
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [score]);

  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone =
    rating.tone === "success"
      ? "var(--success)"
      : rating.tone === "warning"
        ? "var(--warning)"
        : rating.tone === "danger"
          ? "var(--danger)"
          : "var(--primary)";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${Math.round(score)} out of 100, rated ${rating.label}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * shown) / 100}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.12s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold tracking-tight text-foreground">{shown}</span>
          <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={[
              "size-5",
              i <= Math.round(rating.stars) ? "fill-accent text-accent" : "text-border",
            ].join(" ")}
          />
        ))}
      </div>
      <p className="mt-2 text-lg font-bold text-foreground">{rating.label}</p>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
