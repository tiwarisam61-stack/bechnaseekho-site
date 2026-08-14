import { useEffect, useMemo, useState } from "react";

const colors = ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--warning)"];

export function Confetti({ fire }: { fire: boolean }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fire) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 5000);
    return () => clearTimeout(t);
  }, [fire]);

  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 3 + Math.random() * 2.2,
        drift: `${(Math.random() - 0.5) * 220}px`,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
            ["--drift" as string]: p.drift,
          }}
        />
      ))}
    </div>
  );
}
