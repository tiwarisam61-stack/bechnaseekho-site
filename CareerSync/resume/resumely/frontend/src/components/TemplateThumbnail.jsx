import React from "react";

/**
 * A miniature preview of a template rendered inside a scaled A4 canvas.
 * Wraps the real template component so thumbnails always reflect the actual design.
 */
export default function TemplateThumbnail({ children, scale = 0.28 }) {
  return (
    <div
      className="relative overflow-hidden bg-white border border-zinc-200 group-hover:border-zinc-900 transition-colors"
      style={{ width: 794 * scale, height: 1123 * scale }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: 794,
          height: 1123,
          pointerEvents: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}

