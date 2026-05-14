"use client";

/**
 * Ticker — horizontal infinite marquee strip.
 * Editorial accent between sections. Pauses on hover.
 */
export default function Ticker({ items }: { items: readonly string[] }) {
  const loop = [...items, ...items, ...items];
  return (
    <div
      className="group relative overflow-hidden border-y border-[color:var(--border)] py-3 bg-[color:var(--paper-deep)]"
      aria-hidden
    >
      <div className="flex w-max gap-12 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] font-mono text-xs uppercase tracking-[0.22em]">
        {loop.map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="text-[color:var(--fg-muted)]">{it}</span>
            <span className="text-[color:var(--accent)]">✦</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 38s linear infinite;
        }
      `}</style>
    </div>
  );
}
