type Variant = "horizontal" | "vertical" | "icon";
type Tone = "dark" | "light";

interface CareerSyncLogoProps {
  variant?: Variant;
  tone?: Tone;
  /** Icon size in px. Wordmark type scales relative to this. */
  size?: number;
  className?: string;
  title?: string;
}

export function CareerSyncLogo({
  variant = "horizontal",
  tone = "dark",
  size = 40,
  className,
  title = "CareerSync",
}: CareerSyncLogoProps) {
  const careerColor = tone === "dark" ? "#0F172A" : "#FFFFFF";

  const Icon = (
    <svg viewBox="0 0 48 48" width={size} height={size} role="img" aria-label={title} className="shrink-0">
      <defs>
        <linearGradient id="cs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="55%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="cs-grad-soft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#cs-grad)" />
      <path d="M34 15.5A12 12 0 1 0 34 32.5" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M31.5 18.5 L36.5 13.5 L36.5 20.5" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36.5 13.5 L29.5 13.5" fill="none" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="34" cy="32.5" r="3.2" fill="#FFFFFF" />
      <circle cx="34" cy="32.5" r="1.4" fill="url(#cs-grad-soft)" />
    </svg>
  );

  if (variant === "icon") return <span className={className}>{Icon}</span>;
  if (variant === "vertical") {
    return <div className={`inline-flex flex-col items-center gap-2 ${className ?? ""}`}>{Icon}<Wordmark size={size} careerColor={careerColor} /></div>;
  }
  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>{Icon}<Wordmark size={size} careerColor={careerColor} /></div>
  );
}

function Wordmark({ size, careerColor }: { size: number; careerColor: string }) {
  const fontSize = Math.round(size * 0.5);
  return (
    <span className="font-extrabold tracking-tight leading-none" style={{ fontSize, fontFamily: "'Sora', 'Inter', ui-sans-serif, system-ui" }}>
      <span style={{ color: careerColor }}>Career</span>
      <span style={{ backgroundImage: "linear-gradient(135deg,#2563EB 0%,#3B82F6 55%,#06B6D4 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Sync</span>
    </span>
  );
}
