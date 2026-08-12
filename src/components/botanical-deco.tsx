"use client";

import { motion } from "framer-motion";

/** A single stylized leaf SVG used as floating decoration. */
export function LeafShape({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M32 4C16 12 8 24 8 38c0 12 9 22 24 22s24-10 24-22C56 24 48 12 32 4z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M32 10v44M32 22c-7 2-12 6-15 11M32 22c7 2 12 6 15 11M32 34c-5 1-9 4-11 8M32 34c5 1 9 4 11 8"
        stroke="oklch(0.99 0.02 140)"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Floating leaves scattered in the background. Pure decoration. */
export function FloatingLeaves() {
  const leaves = [
    { top: "8%", left: "6%", size: 70, delay: 0, slow: false, opacity: 0.18 },
    { top: "18%", left: "88%", size: 54, delay: 1.2, slow: true, opacity: 0.14 },
    { top: "62%", left: "4%", size: 46, delay: 0.6, slow: true, opacity: 0.12 },
    { top: "72%", left: "92%", size: 64, delay: 1.8, slow: false, opacity: 0.16 },
    { top: "40%", left: "94%", size: 38, delay: 0.3, slow: false, opacity: 0.1 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className={l.slow ? "animate-float-leaf-slow" : "animate-float-leaf"}
          style={{
            position: "absolute",
            top: l.top,
            left: l.left,
            width: l.size,
            height: l.size,
            opacity: l.opacity,
            color: "var(--primary)",
            animationDelay: `${l.delay}s`,
          }}
        >
          <LeafShape className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

/** Animated scanning grid overlay used on the camera/scanner. */
export function ScanGrid({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute inset-0 ring-4 ring-inset ring-primary/40 rounded-2xl" />
      {/* Corner brackets */}
      {[
        "left-2 top-2 border-l-4 border-t-4 rounded-tl-xl",
        "right-2 top-2 border-r-4 border-t-4 rounded-tr-xl",
        "left-2 bottom-2 border-l-4 border-b-4 rounded-bl-xl",
        "right-2 bottom-2 border-r-4 border-b-4 rounded-br-xl",
      ].map((c) => (
        <div
          key={c}
          className={`absolute h-10 w-10 border-primary ${c}`}
        />
      ))}
      {/* Moving scan line */}
      <div className="absolute left-2 right-2 h-1 animate-scan-line bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_18px_var(--primary)]" />
    </div>
  );
}
