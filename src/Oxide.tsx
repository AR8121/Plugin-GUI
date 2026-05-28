import React from "react";

/**
 * OXIDE — Tape Saturation Plugin UI
 * Brand: Audio Intelligence
 *
 * Self-contained React + Tailwind component. All vector elements are
 * authored as inline SVG so the component can be rendered in a browser
 * AND copy-pasted (via DevTools "Copy → outerHTML") straight into Figma.
 *
 * Required Tailwind: standard install (no custom config necessary).
 * Recommended font: Inter or Roboto loaded globally.
 */

// ---------------------------------------------------------------------------
// Shared SVG <defs> — gradients, filters, patterns reused across the UI.
// Rendered once at the top of the plugin so individual components stay light.
// ---------------------------------------------------------------------------
const SvgDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
    <defs>
      {/* ---------- Brushed metal panel (knob bezel, top frame) ---------- */}
      <linearGradient id="ox-brushed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5a5a5a" />
        <stop offset="35%" stopColor="#3a3a3a" />
        <stop offset="65%" stopColor="#262626" />
        <stop offset="100%" stopColor="#171717" />
      </linearGradient>

      {/* ---------- Knob face (dark dome) ---------- */}
      <radialGradient id="ox-knob-face" cx="50%" cy="32%" r="70%">
        <stop offset="0%" stopColor="#4a4a4a" />
        <stop offset="45%" stopColor="#2a2a2a" />
        <stop offset="80%" stopColor="#161616" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </radialGradient>

      {/* ---------- Knob bezel ring ---------- */}
      <linearGradient id="ox-knob-bezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6a6a6a" />
        <stop offset="50%" stopColor="#2e2e2e" />
        <stop offset="100%" stopColor="#0e0e0e" />
      </linearGradient>

      {/* ---------- Recessed surface (VU well, LED bar wells) ---------- */}
      <linearGradient id="ox-recess" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050505" />
        <stop offset="100%" stopColor="#1c1c1c" />
      </linearGradient>

      {/* ---------- VU parchment / backlit yellow ---------- */}
      <radialGradient id="ox-parchment" cx="50%" cy="120%" r="120%">
        <stop offset="0%" stopColor="#fff0b8" />
        <stop offset="55%" stopColor="#e8c878" />
        <stop offset="100%" stopColor="#a87a30" />
      </radialGradient>

      {/* ---------- LED amber gradient ---------- */}
      <radialGradient id="ox-led" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffe4a8" />
        <stop offset="45%" stopColor="#ffa040" />
        <stop offset="100%" stopColor="#a04008" />
      </radialGradient>

      {/* ---------- Indicator amber stripe ---------- */}
      <linearGradient id="ox-amber-bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ff7a10" />
        <stop offset="50%" stopColor="#ffb44a" />
        <stop offset="100%" stopColor="#ff7a10" />
      </linearGradient>

      {/* ---------- Soft drop shadow under knobs ---------- */}
      <filter id="ox-knob-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="4" result="off" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.55" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ---------- Inner shadow (recessed wells) ---------- */}
      <filter id="ox-inner-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="2" />
        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
        <feFlood floodColor="#000" floodOpacity="0.85" />
        <feComposite in2="shadowDiff" operator="in" />
        <feComposite in2="SourceGraphic" operator="over" />
      </filter>

      {/* ---------- Amber glow filter (LEDs, indicators) ---------- */}
      <filter id="ox-amber-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feFlood floodColor="#ffa040" floodOpacity="0.9" />
        <feComposite in2="blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ---------- Brushed-metal hatch pattern (subtle) ---------- */}
      <pattern id="ox-brush-pattern" x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
        <rect width="2" height="2" fill="#000" fillOpacity="0" />
        <line x1="0" y1="0" x2="2" y2="0" stroke="#fff" strokeOpacity="0.025" />
      </pattern>
    </defs>
  </svg>
);

// ---------------------------------------------------------------------------
// Heartbeat / waveform brand mark (left of the wordmark)
// ---------------------------------------------------------------------------
const BrandMark: React.FC = () => (
  <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
    <path
      d="M1 11 H7 L9 4 L13 18 L17 7 L20 14 L23 11 H33"
      stroke="#ffa040"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(0 0 3px rgba(255,160,64,0.55))" }}
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Knob
// ---------------------------------------------------------------------------
type KnobProps = {
  label: string;
  /** -135 (full left) … +135 (full right). Caller decides mapping. */
  rotation: number;
  /** main display value, e.g. "+3.2" */
  display: string;
  /** small range hint under the value, e.g. "-24 … +24 dB" */
  range: string;
  /** unit shown next to the value, e.g. "dB" or "%" */
  unit?: string;
};

const Knob: React.FC<KnobProps> = ({ label, rotation, display, range, unit }) => {
  // 33 ticks around the perimeter, drawn between -135° and +135°
  const ticks = Array.from({ length: 25 }, (_, i) => -135 + (i * 270) / 24);

  return (
    <div className="flex flex-col items-center select-none">
      <span className="text-[10px] tracking-[0.32em] text-neutral-400 mb-2">{label}</span>

      <svg width="124" height="124" viewBox="0 0 124 124">
        {/* outer tick marks */}
        {ticks.map((t, i) => {
          const rad = (t * Math.PI) / 180;
          const r1 = 58;
          const r2 = i % 6 === 0 ? 52 : 54;
          const x1 = 62 + Math.sin(rad) * r1;
          const y1 = 62 - Math.cos(rad) * r1;
          const x2 = 62 + Math.sin(rad) * r2;
          const y2 = 62 - Math.cos(rad) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 6 === 0 ? "#888" : "#444"}
              strokeWidth={i % 6 === 0 ? 1.2 : 0.8}
              strokeLinecap="round"
            />
          );
        })}

        <g filter="url(#ox-knob-shadow)">
          {/* bezel (outer ring) */}
          <circle cx="62" cy="62" r="50" fill="url(#ox-knob-bezel)" />
          {/* recessed lip */}
          <circle cx="62" cy="62" r="46" fill="#0a0a0a" />
          {/* dome / face */}
          <circle cx="62" cy="62" r="42" fill="url(#ox-knob-face)" />
          {/* brushed hatch overlay */}
          <circle cx="62" cy="62" r="42" fill="url(#ox-brush-pattern)" opacity="0.6" />
          {/* highlight rim */}
          <circle cx="62" cy="62" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          {/* subtle top-light highlight */}
          <ellipse cx="62" cy="46" rx="22" ry="8" fill="rgba(255,255,255,0.05)" />
        </g>

        {/* indicator line + glow */}
        <g transform={`rotate(${rotation} 62 62)`}>
          <rect
            x="60.5"
            y="22"
            width="3"
            height="20"
            rx="1.2"
            fill="url(#ox-amber-bar)"
            style={{ filter: "drop-shadow(0 0 5px rgba(255,160,64,0.95))" }}
          />
        </g>

        {/* center cap */}
        <circle cx="62" cy="62" r="5" fill="#101010" stroke="#2a2a2a" strokeWidth="1" />
      </svg>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-white text-base font-medium tracking-wide">{display}</span>
        {unit && <span className="text-neutral-500 text-[10px] tracking-widest">{unit}</span>}
      </div>
      <span className="text-neutral-600 text-[9px] tracking-[0.18em]">{range}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// LED toggle (the rectangular button under each knob)
// ---------------------------------------------------------------------------
const LedToggle: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div
    className="mt-3 w-[108px] rounded-[5px] px-3 pt-2 pb-2 flex flex-col items-center"
    style={{
      background: "linear-gradient(180deg,#262626 0%, #141414 100%)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.6)",
    }}
  >
    <div
      className="h-[3px] w-full rounded-full"
      style={{
        background: active ? "linear-gradient(90deg,#ff7a10,#ffc070,#ff7a10)" : "#2a2a2a",
        boxShadow: active
          ? "0 0 6px rgba(255,160,64,0.9), 0 0 12px rgba(255,140,40,0.5)"
          : "inset 0 1px 1px rgba(0,0,0,0.7)",
      }}
    />
    <span
      className="mt-1.5 text-[9px] tracking-[0.22em] font-medium"
      style={{ color: active ? "#ffb060" : "#9a9a9a" }}
    >
      {label}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Radio option (Tape Character / Oversampling panels)
// ---------------------------------------------------------------------------
const RadioOption: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <div className="flex items-center gap-3 py-1.5">
    <span
      className="inline-block w-[10px] h-[10px] rounded-full"
      style={{
        background: active ? "radial-gradient(circle at 35% 30%, #ffe4a8, #ff8a20 60%, #6a2a00)" : "#0a0a0a",
        boxShadow: active
          ? "0 0 6px rgba(255,160,64,0.9), 0 0 12px rgba(255,140,40,0.45), inset 0 0 2px rgba(255,255,255,0.4)"
          : "inset 0 1px 2px rgba(0,0,0,0.9), 0 0 0 1px #1f1f1f",
      }}
    />
    <span
      className="text-[11px] tracking-[0.24em] font-medium"
      style={{ color: active ? "#ffb060" : "#7a7a7a" }}
    >
      {label}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// VU meter
// ---------------------------------------------------------------------------
const VuMeter: React.FC<{ label: string; vu: number /* dB, -20..+3 */ }> = ({ label, vu }) => {
  // Map VU value to needle angle. Real VUs are non-linear; we hand-tune.
  const mapVu = (v: number) => {
    // -20 → -55°, 0 → +20°, +3 → +50°
    if (v <= 0) return -55 + ((v + 20) / 20) * 75;
    return 20 + (v / 3) * 30;
  };
  const angle = mapVu(vu);

  // Geometry: pivot below the visible face, arc above.
  const cx = 150;
  const cy = 220; // pivot off-canvas (canvas is 0..170 in y)
  const R = 155;

  const tick = (v: number, label?: string, isMajor = false, isRed = false) => {
    const a = mapVu(v);
    const rad = (a * Math.PI) / 180;
    const r1 = R - (isMajor ? 18 : 10);
    const r2 = R - 2;
    const x1 = cx + Math.sin(rad) * r1;
    const y1 = cy - Math.cos(rad) * r1;
    const x2 = cx + Math.sin(rad) * r2;
    const y2 = cy - Math.cos(rad) * r2;
    const lr = R - 30;
    const lx = cx + Math.sin(rad) * lr;
    const ly = cy - Math.cos(rad) * lr;
    return (
      <g key={`t-${v}`}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isRed ? "#a01818" : "#2a1a08"}
          strokeWidth={isMajor ? 1.4 : 0.8}
          strokeLinecap="round"
        />
        {label && (
          <text
            x={lx}
            y={ly + 3}
            textAnchor="middle"
            fontSize="9"
            fontFamily="Inter, Roboto, sans-serif"
            fontWeight="600"
            fill={isRed ? "#9a1212" : "#3a2208"}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="172" viewBox="0 0 300 172">
        {/* Outer dark frame */}
        <rect x="0" y="0" width="300" height="172" rx="8" fill="#070707" />
        {/* Recessed parchment well */}
        <rect
          x="6"
          y="6"
          width="288"
          height="160"
          rx="4"
          fill="url(#ox-parchment)"
          filter="url(#ox-inner-shadow)"
        />
        {/* Inner shadow ring on top edge */}
        <rect
          x="6"
          y="6"
          width="288"
          height="160"
          rx="4"
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="1"
        />

        {/* Arc baseline */}
        <path
          d={`M ${cx + Math.sin((-55 * Math.PI) / 180) * (R - 2)} ${cy - Math.cos((-55 * Math.PI) / 180) * (R - 2)}
              A ${R - 2} ${R - 2} 0 0 1 ${cx + Math.sin((50 * Math.PI) / 180) * (R - 2)} ${cy - Math.cos((50 * Math.PI) / 180) * (R - 2)}`}
          stroke="#2a1a08"
          strokeWidth="1"
          fill="none"
        />

        {/* Red zone arc above 0 VU */}
        <path
          d={`M ${cx + Math.sin((20 * Math.PI) / 180) * (R - 2)} ${cy - Math.cos((20 * Math.PI) / 180) * (R - 2)}
              A ${R - 2} ${R - 2} 0 0 1 ${cx + Math.sin((50 * Math.PI) / 180) * (R - 2)} ${cy - Math.cos((50 * Math.PI) / 180) * (R - 2)}`}
          stroke="#b01818"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* ticks + labels */}
        {tick(-20, "20", true)}
        {tick(-15)}
        {tick(-10, "10", true)}
        {tick(-7, "7")}
        {tick(-5, "5", true)}
        {tick(-3, "3")}
        {tick(-1)}
        {tick(0, "0", true)}
        {tick(1, "+1", false, true)}
        {tick(3, "+3", true, true)}

        {/* "VU" cartouche */}
        <text
          x={cx}
          y={120}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fontFamily="Inter, Roboto, sans-serif"
          fill="#2a1a08"
          letterSpacing="2"
        >
          VU
        </text>

        {/* dB label */}
        <text
          x={cx}
          y={138}
          textAnchor="middle"
          fontSize="8"
          fontFamily="Inter, Roboto, sans-serif"
          fill="#5a3a18"
          letterSpacing="2"
        >
          dB
        </text>

        {/* channel label */}
        <text
          x={20}
          y={28}
          fontSize="9"
          fontWeight="700"
          fontFamily="Inter, Roboto, sans-serif"
          letterSpacing="3"
          fill="#3a2208"
        >
          {label}
        </text>

        {/* Needle */}
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          {/* shadow */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - R + 4}
            stroke="rgba(0,0,0,0.35)"
            strokeWidth="2.2"
            transform="translate(1.5,1.5)"
            strokeLinecap="round"
          />
          {/* needle */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={cy - R + 4}
            stroke="#0a0a0a"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* counterweight */}
          <circle cx={cx} cy={cy + 6} r="3" fill="#0a0a0a" />
        </g>

        {/* pivot screw */}
        <circle cx={cx} cy={cy} r="9" fill="#1a1a1a" stroke="#000" />
        <circle cx={cx} cy={cy} r="5" fill="url(#ox-knob-bezel)" />
        <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="#000" strokeWidth="1" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Top navigation bar
// ---------------------------------------------------------------------------
const TopNav: React.FC = () => (
  <div
    className="flex items-center justify-between px-5 h-[46px] border-b border-black/80"
    style={{
      background: "linear-gradient(180deg,#1c1c1c,#0a0a0a)",
      boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)",
    }}
  >
    {/* Left: brand */}
    <div className="flex items-center gap-2.5">
      <BrandMark />
      <span className="text-[11px] tracking-[0.32em] text-neutral-300 font-medium">
        AUDIO INTELLIGENCE
      </span>
    </div>

    {/* Center: undo/redo + preset selector */}
    <div className="flex items-center gap-2">
      <NavBtn>↶</NavBtn>
      <NavBtn>↷</NavBtn>
      <div className="mx-2 h-5 w-px bg-neutral-700" />
      <NavBtn>‹</NavBtn>
      <div
        className="px-4 h-7 flex items-center rounded-[3px] text-[11px] tracking-widest text-neutral-200 min-w-[240px] justify-center"
        style={{
          background: "linear-gradient(180deg,#0a0a0a,#1a1a1a)",
          boxShadow:
            "inset 0 1px 2px rgba(0,0,0,0.9), inset 0 -1px 0 rgba(255,255,255,0.03), 0 0 0 1px #2a2a2a",
        }}
      >
        <span className="text-[#ffb060] mr-2">A:</span>
        <span>Default Preset</span>
        <span className="text-[#ffb060] ml-1">*</span>
        <span className="ml-3 text-neutral-500">▾</span>
      </div>
      <NavBtn>›</NavBtn>
    </div>

    {/* Right: action buttons */}
    <div className="flex items-center gap-2">
      <NavBtn wide>A → B</NavBtn>
      <NavBtn wide>SETUP A</NavBtn>
      <NavBtn wide>SAVE</NavBtn>
      <NavBtn>≡</NavBtn>
    </div>
  </div>
);

const NavBtn: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => (
  <button
    className={`h-7 ${wide ? "px-3" : "w-7"} rounded-[3px] text-[10px] tracking-widest text-neutral-300 font-medium flex items-center justify-center transition`}
    style={{
      background: "linear-gradient(180deg,#2a2a2a,#141414)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(0,0,0,0.6)",
    }}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Header section: title + oversampling/bypass/power
// ---------------------------------------------------------------------------
const HeaderSection: React.FC = () => (
  <div className="relative px-6 pt-6 pb-3 flex items-start justify-between">
    {/* spacer to keep title centered */}
    <div className="w-[200px]" />

    {/* Title block */}
    <div className="flex flex-col items-center">
      <h1
        className="text-white text-[42px] leading-none font-light"
        style={{
          letterSpacing: "0.5em",
          textShadow: "0 0 18px rgba(255,160,64,0.18), 0 2px 0 rgba(0,0,0,0.6)",
          fontFamily: "Inter, Roboto, sans-serif",
        }}
      >
        O X I D E
      </h1>
      <div
        className="mt-3 text-[10px] font-medium"
        style={{ letterSpacing: "0.5em", color: "#ffb060" }}
      >
        — TAPE SATURATION —
      </div>
    </div>

    {/* Right cluster */}
    <div className="flex flex-col items-end gap-3 w-[200px]">
      <div className="flex items-center gap-3">
        <span className="text-[9px] tracking-[0.32em] text-neutral-400">OVERSAMPLING</span>
        <PillGroup options={["OFF", "2X", "4X"]} active="2X" />
      </div>
      <div className="flex items-center gap-4">
        <BypassSwitch />
        <PowerLed />
      </div>
    </div>
  </div>
);

const PillGroup: React.FC<{ options: string[]; active: string }> = ({ options, active }) => (
  <div
    className="flex rounded-[3px] overflow-hidden"
    style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.85), 0 0 0 1px #2a2a2a" }}
  >
    {options.map((o) => {
      const isActive = o === active;
      return (
        <span
          key={o}
          className="px-2.5 h-[22px] flex items-center text-[10px] font-semibold tracking-[0.22em]"
          style={{
            background: isActive ? "linear-gradient(180deg,#3a2008,#1a0a02)" : "#0c0c0c",
            color: isActive ? "#ffc070" : "#5a5a5a",
            textShadow: isActive ? "0 0 6px rgba(255,160,64,0.9)" : "none",
            borderRight: "1px solid #000",
          }}
        >
          {o}
        </span>
      );
    })}
  </div>
);

const BypassSwitch: React.FC = () => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] tracking-[0.28em] text-neutral-400 mb-1.5">BYPASS</span>
    <div
      className="w-[42px] h-[22px] rounded-full p-[3px] flex items-center"
      style={{
        background: "linear-gradient(180deg,#0a0a0a,#1c1c1c)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9), 0 0 0 1px #2a2a2a",
      }}
    >
      <div
        className="w-[16px] h-[16px] rounded-full"
        style={{
          background: "linear-gradient(180deg,#5a5a5a,#1f1f1f)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      />
    </div>
  </div>
);

const PowerLed: React.FC = () => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] tracking-[0.28em] text-neutral-400 mb-1.5">POWER</span>
    <div
      className="w-[14px] h-[14px] rounded-full"
      style={{
        background: "radial-gradient(circle at 35% 30%, #fff0c0, #ff8a20 55%, #5a1a00)",
        boxShadow:
          "0 0 8px rgba(255,160,64,0.95), 0 0 16px rgba(255,140,40,0.6), inset 0 0 2px rgba(255,255,255,0.6)",
      }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// Knobs row
// ---------------------------------------------------------------------------
const KnobsRow: React.FC = () => (
  <div
    className="mx-6 my-4 px-6 py-7 rounded-md flex items-start justify-around"
    style={{
      background:
        "linear-gradient(180deg,#1f1f1f 0%,#171717 50%,#0e0e0e 100%)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.6)",
    }}
  >
    <div className="flex flex-col items-center">
      <Knob label="INPUT" rotation={-30} display="+3.2" range="-24 … +24" unit="dB" />
      <LedToggle label="IN" active />
    </div>
    <div className="flex flex-col items-center">
      <Knob label="SATURATION" rotation={45} display="62" range="0 — 100" unit="%" />
      <LedToggle label="TAPE DRIVE" active={false} />
    </div>
    <div className="flex flex-col items-center">
      <Knob label="BIAS" rotation={20} display="+0.25" range="-1.0 … +1.0" />
      <LedToggle label="NORMAL" active />
    </div>
    <div className="flex flex-col items-center">
      <Knob label="TONE" rotation={-60} display="-22" range="-100 … +100" />
      <LedToggle label="HF ADJUST" active={false} />
    </div>
    <div className="flex flex-col items-center">
      <Knob label="OUTPUT" rotation={10} display="-1.5" range="-24 … +24" unit="dB" />
      <LedToggle label="OUT" active />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Bottom section: Tape Character / VU Meters / Oversampling
// ---------------------------------------------------------------------------
const BottomSection: React.FC = () => (
  <div className="mx-6 mb-4 grid grid-cols-[1fr_auto_1fr] gap-4">
    {/* Left: Tape Character */}
    <Panel title="TAPE CHARACTER">
      <div className="px-4 py-2">
        <RadioOption label="CLASSIC" active />
        <RadioOption label="VINTAGE" active={false} />
        <RadioOption label="MODERN" active={false} />
      </div>
    </Panel>

    {/* Center: VU meters */}
    <Panel title="OUTPUT METERING" wide>
      <div className="flex gap-4 px-4 py-3">
        <div className="flex flex-col items-center">
          <VuMeter label="LEFT" vu={-5} />
        </div>
        <div className="flex flex-col items-center">
          <VuMeter label="RIGHT" vu={-4.2} />
        </div>
      </div>
    </Panel>

    {/* Right: Oversampling */}
    <Panel title="OVERSAMPLING">
      <div className="px-4 py-2">
        <RadioOption label="OFF" active={false} />
        <RadioOption label="2X" active />
        <RadioOption label="4X" active={false} />
      </div>
    </Panel>
  </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode; wide?: boolean }> = ({
  title,
  children,
  wide,
}) => (
  <div
    className={`rounded-md ${wide ? "" : "min-w-[180px]"}`}
    style={{
      background: "linear-gradient(180deg,#1f1f1f,#0e0e0e)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.6), 0 3px 8px rgba(0,0,0,0.5)",
    }}
  >
    <div
      className="px-4 py-1.5 text-[9px] tracking-[0.32em] font-semibold border-b border-black/80"
      style={{ color: "#ffb060", textShadow: "0 0 6px rgba(255,160,64,0.5)" }}
    >
      {title}
    </div>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const Footer: React.FC = () => (
  <div
    className="px-6 h-[40px] grid grid-cols-3 items-center text-[9px] tracking-[0.28em] border-t border-black/80"
    style={{
      background: "linear-gradient(180deg,#0e0e0e,#050505)",
      color: "#5a5a5a",
    }}
  >
    <span className="justify-self-start">DESIGNED BY AUDIO INTELLIGENCE</span>
    <div className="justify-self-center text-center">
      <div className="text-neutral-300 font-medium">ANALOG TAPE EMULATION</div>
      <div className="mt-0.5" style={{ color: "#ffb060" }}>
        — HAND CRAFTED SOUND —
      </div>
    </div>
    <span className="justify-self-end">v1.0.0</span>
  </div>
);

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------
const Oxide: React.FC = () => (
  <div
    className="relative w-[980px] mx-auto rounded-lg overflow-hidden text-neutral-200"
    style={{
      // outer brushed dark frame
      background:
        "radial-gradient(ellipse at top, #2a2a2a 0%, #141414 45%, #0a0a0a 100%)",
      boxShadow:
        "0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px #000, inset 0 1px 0 rgba(255,255,255,0.05)",
      fontFamily: "Inter, Roboto, system-ui, sans-serif",
    }}
  >
    <SvgDefs />
    <TopNav />
    <HeaderSection />
    <KnobsRow />
    <BottomSection />
    <Footer />

    {/* faint top vignette */}
    <div
      className="pointer-events-none absolute inset-0 rounded-lg"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(255,255,255,0.04), transparent 55%)",
      }}
    />
  </div>
);

export default Oxide;
