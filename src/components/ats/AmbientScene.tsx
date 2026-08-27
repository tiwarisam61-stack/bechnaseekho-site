/**
 * Ambient premium background: gradient blobs, glowing rings, neural lines,
 * floating keyword pills and data particles. Pure CSS/SVG, transform+opacity
 * only, pointer-events none. Zero images, no WebGL — stays at 60fps.
 */

const KEYWORDS = ["React", "Leadership", "SQL", "Roadmap", "Python", "Stakeholders", "Figma", "Agile"];

const POSITIONS = [
  { top: "10%", left: "1%", delay: "0s", dur: "13s" },
  { top: "28%", left: "95%", delay: "1.6s", dur: "15s" },
  { top: "52%", left: "1.5%", delay: "3s", dur: "17s" },
  { top: "66%", left: "94%", delay: "0.8s", dur: "14s" },
  { top: "82%", left: "2%", delay: "2.2s", dur: "16s" },
  { top: "18%", left: "96%", delay: "4s", dur: "18s" },
  { top: "44%", left: "96%", delay: "2.8s", dur: "15s" },
  { top: "90%", left: "95%", delay: "1.2s", dur: "17s" },
];


export function AmbientScene() {
  return (
    <div className="ambient-scene" aria-hidden="true">
      <span className="ambient-blob ambient-blob-a" />
      <span className="ambient-blob ambient-blob-b" />
      <span className="ambient-blob ambient-blob-c" />

      <span className="ambient-ring ambient-ring-a" />
      <span className="ambient-ring ambient-ring-b" />

      <span className="ambient-cube ambient-cube-a" />
      <span className="ambient-cube ambient-cube-b" />

      <svg className="ambient-net" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <g stroke="var(--primary)" strokeWidth="0.7" opacity="0.16" fill="none">
          <path d="M60 620 L240 480 L430 560 L640 400 L860 470 L1140 320" />
          <path d="M40 220 L260 300 L470 180 L700 260 L930 150 L1160 240" />
          <path d="M240 480 L260 300" />
          <path d="M640 400 L700 260" />
          <path d="M860 470 L930 150" />
        </g>
        <g fill="var(--primary)" opacity="0.28">
          {[
            [240, 480],
            [430, 560],
            [640, 400],
            [860, 470],
            [260, 300],
            [470, 180],
            [700, 260],
            [930, 150],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
          ))}
        </g>
      </svg>

      {POSITIONS.map((p, i) => (
        <span
          key={KEYWORDS[i]}
          className="ambient-pill"
          style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
        >
          {KEYWORDS[i]}
        </span>
      ))}

      {[6, 18, 34, 52, 66, 79, 92].map((left, i) => (
        <span
          key={left}
          className="lab-particle"
          style={{
            left: `${left}%`,
            top: `${(i * 14 + 10) % 90}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${9 + (i % 3) * 3}s`,
          }}
        />
      ))}
    </div>
  );
}
