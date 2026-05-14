"use client";

/**
 * HeroPulse — Editorial "glass anatomical heart" with Volt-purple liquid,
 * floating bubbles, surface waves, and a live ECG pulse.
 *
 * Pure SVG + SMIL. Sits on a light paper background. Inspired by photoreal
 * fluid renders, but reduced to an editorial silhouette that respects the
 * site's Editorial × AI tone.
 */
export default function HeroPulse() {
  // ───── Anatomical heart silhouette ─────
  // ViewBox 0 0 120 140, asymmetric apex, dual top "vessels" (aorta + pulmonary).
  const heart =
    "M 52 134 " +
    "C 14 124, 2 96, 6 70 " +
    "C 10 44, 22 30, 34 32 " +
    "C 32 18, 38 6, 48 6 " +
    "C 56 6, 58 20, 56 28 " +
    "C 56 32, 60 32, 62 28 " +
    "C 64 18, 72 14, 78 18 " +
    "C 84 24, 80 32, 74 36 " +
    "C 92 40, 108 64, 106 92 " +
    "C 104 118, 84 132, 52 134 Z";

  // ───── ECG PQRST cycle (50 units wide), baseline y=52, sits above liquid ─────
  const ecgCycle =
    " l 8 0 q 2 -5 4 0 l 4 0 l 1 4 l 1 -22 l 1 24 l 1 -6 l 6 0 q 3 -8 6 0 l 18 0";
  const ecgPath = `M -50 52${ecgCycle.repeat(6)}`;

  // ───── Animated liquid surface (sinusoidal wave that slides horizontally) ─────
  // Period = 30 units. Animation translates -30 over one cycle => seamless loop.
  const wavePath =
    "M -30 78 " +
    "Q -22.5 71 -15 78 T 0 78 T 15 78 T 30 78 T 45 78 T 60 78 " +
    "T 75 78 T 90 78 T 105 78 T 120 78 T 135 78 T 150 78 " +
    "L 150 142 L -30 142 Z";

  const bubbles = [
    { x: 26, r: 1.8, dur: 4.6, delay: 0.0, peak: 38 },
    { x: 48, r: 1.2, dur: 5.6, delay: 1.4, peak: 44 },
    { x: 66, r: 2.1, dur: 4.2, delay: 0.4, peak: 36 },
    { x: 82, r: 1.0, dur: 3.9, delay: 2.2, peak: 50 },
    { x: 38, r: 0.9, dur: 6.0, delay: 3.0, peak: 46 },
    { x: 92, r: 0.7, dur: 5.0, delay: 2.7, peak: 42 },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[440px] mx-auto">
      <svg
        viewBox="-8 -8 136 156"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        <defs>
          {/* Volt halo behind heart — gives the glass something to refract */}
          <radialGradient id="halo" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.30" />
            <stop offset="65%" stopColor="var(--volt)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
          </radialGradient>

          {/* Glass body — subtle vertical white→volt-tint gradient */}
          <linearGradient id="glassBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EFEAFF" stopOpacity="0.7" />
          </linearGradient>

          {/* Liquid gradient (Volt purple, deeper at bottom) */}
          <linearGradient id="liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9479FF" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#4E33CC" stopOpacity="0.98" />
          </linearGradient>

          {/* Specular highlight blob */}
          <radialGradient id="shine" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop offset="55%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Soft drop shadow for elevation */}
          <filter id="dropS" x="-30%" y="-20%" width="160%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" />
            <feOffset dx="0" dy="5" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.22" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip interior to heart silhouette */}
          <clipPath id="heartClip">
            <path d={heart} />
          </clipPath>

          {/* Horizontal fade for ECG (hide left/right seam) */}
          <linearGradient id="ecgFade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="1" />
            <stop offset="82%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="ecgMask">
            <rect x="-30" y="-30" width="200" height="200" fill="url(#ecgFade)" />
          </mask>
        </defs>

        {/* Volt halo */}
        <circle cx="58" cy="74" r="62" fill="url(#halo)" />

        {/* Glass body with shadow */}
        <g filter="url(#dropS)">
          <path d={heart} fill="url(#glassBody)" />
        </g>

        {/* Inside the heart */}
        <g clipPath="url(#heartClip)">
          {/* Liquid base (solid below the wave line) */}
          <rect x="-10" y="80" width="140" height="80" fill="url(#liquid)" />

          {/* Animated wave surface */}
          <g>
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-30 0"
              dur="4.4s"
              repeatCount="indefinite"
            />
            <path d={wavePath} fill="url(#liquid)" />
            {/* Second wave layer for parallax depth */}
            <path
              d={wavePath}
              fill="#9479FF"
              opacity="0.45"
              transform="translate(8 3)"
            />
          </g>

          {/* Surface meniscus highlight (thin white line near liquid top) */}
          <g opacity="0.55">
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="-30 0"
              dur="4.4s"
              repeatCount="indefinite"
            />
            <path
              d="M -30 78 Q -22.5 71 -15 78 T 0 78 T 15 78 T 30 78 T 45 78 T 60 78 T 75 78 T 90 78 T 105 78 T 120 78 T 135 78 T 150 78"
              fill="none"
              stroke="white"
              strokeWidth="0.55"
              strokeOpacity="0.7"
            />
          </g>

          {/* Bubbles rising through the liquid */}
          {bubbles.map((b, i) => (
            <g key={i}>
              <circle cx={b.x} cy={130} r={b.r} fill="white" opacity="0">
                <animate
                  attributeName="cy"
                  from="130"
                  to={String(b.peak)}
                  dur={`${b.dur}s`}
                  begin={`${b.delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.65;0.65;0"
                  keyTimes="0;0.15;0.8;1"
                  dur={`${b.dur}s`}
                  begin={`${b.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* ECG pulse in the upper chamber (above liquid surface) */}
          <g mask="url(#ecgMask)">
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="-50 0"
                dur="3.4s"
                repeatCount="indefinite"
              />
              <path
                d={ecgPath}
                fill="none"
                stroke="var(--volt)"
                strokeOpacity="0.95"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>

        {/* Specular highlights — outer glass surface */}
        <ellipse cx="28" cy="20" rx="14" ry="9" fill="url(#shine)" opacity="0.7" />
        <ellipse
          cx="34"
          cy="46"
          rx="2.6"
          ry="6"
          fill="white"
          opacity="0.4"
          transform="rotate(-18 34 46)"
        />
        <circle cx="78" cy="14" r="1.6" fill="white" opacity="0.65" />

        {/* Hairline rim outline (Volt purple, glass edge feel) */}
        <path
          d={heart}
          fill="none"
          stroke="var(--volt)"
          strokeOpacity="0.4"
          strokeWidth="0.6"
        />

        {/* Tiny editorial caption */}
        <g
          fontFamily="ui-monospace, JetBrains Mono, monospace"
          fontSize="3.2"
          fill="currentColor"
          opacity="0.45"
        >
          <text x="58" y="146" textAnchor="middle" letterSpacing="0.4">
            CARDIAC · 72 BPM
          </text>
        </g>
      </svg>
    </div>
  );
}
