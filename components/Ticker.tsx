"use client";

export default function Ticker({ items }: { items: readonly string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="track">
        {loop.map((it, i) => (
          <span key={i} className="it">
            {it}
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: var(--bg);
          overflow: hidden;
          padding: 22px 0;
        }
        .track {
          display: flex;
          gap: 48px;
          white-space: nowrap;
          animation: scroll 42s linear infinite;
          font-family: var(--mono);
          font-size: 14px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          will-change: transform;
        }
        .track:hover {
          animation-play-state: paused;
        }
        .it {
          display: inline-flex;
          align-items: center;
          gap: 48px;
          color: var(--ink);
        }
        .it::after {
          content: "✦";
          color: var(--acid);
        }
        @keyframes scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
