# OXIDE — Tape Saturation Plugin UI

A high-fidelity, skeuomorphic UI for the **OXIDE** analog tape saturation plugin
under the **Audio Intelligence** brand. Designed for VST/AU/AAX-style hosts and
ready to drop into a React app or import into Figma.

## What's in the box

| File | Purpose |
| --- | --- |
| `src/Oxide.tsx` | Modular React + Tailwind component. Drop into any React/Vite/Next project. |
| `preview.html` | Standalone, zero-build preview. Opens directly in a browser, also serves as the Figma source. |

Both files render the same UI from the same SVG primitives.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ░ AUDIO INTELLIGENCE   ↶ ↷ │ ‹ A: Default Preset* ▾ ›   A→B SETUP SAVE ≡│  ← top nav
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                  O   X   I   D   E         OVERSAMPLING [OFF|2X|4X]     │
│              — TAPE  SATURATION —              BYPASS ◯    POWER ●     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│   ⊙           ⊙           ⊙           ⊙           ⊙                     │
│ INPUT     SATURATION     BIAS        TONE       OUTPUT                  │
│  [IN]    [TAPE DRIVE]  [NORMAL]   [HF ADJUST]   [OUT]                   │
├─────────────────────────────────────────────────────────────────────────┤
│ TAPE CHARACTER │      ┌─────────┐  ┌─────────┐      │ OVERSAMPLING      │
│  ● CLASSIC     │      │   VU    │  │   VU    │      │  ○ OFF            │
│  ○ VINTAGE     │      │  LEFT   │  │  RIGHT  │      │  ● 2X             │
│  ○ MODERN      │      └─────────┘  └─────────┘      │  ○ 4X             │
├─────────────────────────────────────────────────────────────────────────┤
│ DESIGNED BY AUDIO INTELLIGENCE  │  ANALOG TAPE EMULATION  │  v1.0.0     │
└─────────────────────────────────────────────────────────────────────────┘
```

Total width: **980px** (fits comfortably in any plugin window).

## Using the React component

Copy `src/Oxide.tsx` into your project. Tailwind must be installed; no custom
config is required (all custom styling is inline via `style={...}` so the
component is portable).

```tsx
import Oxide from "./Oxide";

export default function App() {
  return (
    <div className="min-h-screen bg-black grid place-items-center p-10">
      <Oxide />
    </div>
  );
}
```

A global font is recommended:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Wiring up real state

The component is currently presentational. To make it interactive, lift the
following props to a parent:

| Sub-component | Props to control |
| --- | --- |
| `<Knob>` | `rotation` (-135 … +135), `display`, `range`, `unit` |
| `<LedToggle>` | `active: boolean` |
| `<RadioOption>` | `active: boolean` |
| `<PillGroup>` | `active: "OFF" \| "2X" \| "4X"` |
| `<VuMeter>` | `vu: number` (dB, -20 … +3) — needle angle is auto-mapped |

Mapping a normalized parameter `x ∈ [0,1]` to knob rotation:

```ts
const rotation = -135 + x * 270;
```

## Previewing without a build step

Just open `preview.html` in any modern browser:

```bash
# any of these work
python3 -m http.server 8080
npx serve .
# or just double-click preview.html
```

The page uses Tailwind CDN + React 18 UMD + Babel-standalone, so there's
nothing to install.

## Bringing the vectors into Figma

The whole UI is built from inline SVG (knobs, VU meters, LEDs, indicators)
plus CSS-styled `<div>`s for panels and shadows. Three good options:

1. **Easiest — copy a node from the running preview.**
   Open `preview.html` in Chrome → DevTools → right-click an `<svg>` element →
   *Copy → Copy outerHTML* → paste into a new `.svg` file → drag into Figma.
2. **Whole frame as SVG.**
   In DevTools, select the root `<div>` of the plugin, then *Copy → Copy
   outerHTML*. Wrap it in `<svg>` foreignObject if you need the CSS gradients
   to come along, or just screenshot for raster reference.
3. **Use the Figma plugin "html.to.design".**
   Point it at `preview.html` and it will reproduce the layout natively.

The SVG `<defs>` are centralized in `<SvgDefs>`, so all gradients, filters,
and patterns survive the copy intact.

## Design tokens

If you want to retune the palette, these are the values used throughout:

```
Charcoal panel    #1f1f1f → #0e0e0e   (linear, top → bottom)
Recessed well     #050505 → #1c1c1c   (linear, top → bottom)
Brushed bezel     #6a6a6a → #0e0e0e   (linear)
Knob face         #4a4a4a → #0a0a0a   (radial, top-light)
Amber accent      #ff7a10 / #ffa040 / #ffb060 / #ffc070
Amber glow        rgba(255,160,64, 0.6 – 0.95)
Parchment (VU)    #fff0b8 → #e8c878 → #a87a30 (radial, backlit)
Red zone (VU)     #b01818
Text — primary    #e8e8e8
Text — muted      #5a5a5a / #7a7a7a / #9a9a9a
Text — amber      #ffb060
```

## Components

```
SvgDefs        gradients, filters, patterns shared across the UI
BrandMark      heartbeat / waveform logo mark
Knob           rotary control with bezel, brushed dome, indicator + glow
LedToggle      rectangular button with amber LED strip
RadioOption    LED dot + label (for Tape Character / Oversampling)
PillGroup      segmented OFF / 2X / 4X selector
BypassSwitch   toggle pill in the header
PowerLed       glowing amber indicator
VuMeter        recessed analog meter with parchment face + needle
TopNav         brand + preset selector + action buttons
HeaderSection  OXIDE title + oversampling/bypass/power
KnobsRow       the 5 main controls
BottomSection  Tape Character / VU / Oversampling
Footer         credits + version
Oxide          root composition
```

## Versioning

`v1.0.0` — initial high-fidelity static layout.
