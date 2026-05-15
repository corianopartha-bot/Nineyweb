/**
 * HeroPulse — kept for backward-compat import paths.
 * New visual: the stacked NINE / Y· wordmark with a solid acid square
 * stamped at the apex (matches the JIEJOE-style hero in page.tsx).
 *
 * If you no longer use this in the page, you can delete this file.
 */
export default function HeroPulse() {
  return (
    <div className="hero-mark">
      <div className="row">
        <span>NINE</span>
        <span className="dotMark" />
      </div>
      <div className="row">
        <span className="stroke">
          Y<span className="punct">·</span>
        </span>
      </div>

      <style>{`
        .hero-mark {
          font-family: var(--sans);
          font-weight: 700;
          font-size: clamp(80px, 16vw, 280px);
          line-height: 0.84;
          letter-spacing: -0.06em;
        }
        .hero-mark .row {
          display: flex;
          align-items: baseline;
          gap: 18px;
        }
        .hero-mark .stroke {
          -webkit-text-stroke: 2px var(--ink);
          -webkit-text-fill-color: transparent;
          color: transparent;
          transition: -webkit-text-stroke 0.35s;
        }
        .hero-mark .punct {
          color: var(--acid);
          -webkit-text-fill-color: var(--acid);
        }
        .hero-mark .dotMark {
          width: 36px;
          height: 36px;
          background: var(--acid);
          display: inline-block;
          align-self: flex-end;
          margin-bottom: 14px;
        }
        @media (max-width: 1024px) {
          .hero-mark .dotMark { width: 20px; height: 20px; }
        }
      `}</style>
    </div>
  );
}
