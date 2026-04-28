import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import MangroveQuiz from "./MangroveQuiz.jsx";
import Footer from "./Footer.jsx";

const stages = [
  {
    min: 1,
    max: 10,
    threshold: 1,
    title: "Early Roots",
    short: "Roots",
    visual: "A few fragile seedlings cling to the bare coast.",
    fact: "Even a small cluster of mangrove roots can help anchor coastal soil and trap sediment.",
    impact: "starting a fragile coastal patch",
    interpretation:
      "Early roots begin stabilizing soil and creating the first layer of coastal protection.",
    consequence: "Sediment begins to stabilize",
    signal: "Early protection",
    loss: {
      title: "Bare Coast",
      short: "Exposed",
      visual: "Bare mudflat exposed to surf and tide, with no roots to hold the soil.",
      fact: "Without root networks, even small waves can pull sediment off the shore.",
      interpretation:
        "Bare soil is exposed, making the shoreline easier for waves and tides to erode.",
      impact: "exposing your coast to erosion",
      consequence: "Soil becomes exposed",
      signal: "Exposed shoreline",
    },
  },
  {
    min: 11,
    max: 50,
    threshold: 10,
    title: "Nursery Life",
    short: "Nursery",
    visual: "Young fish begin to shelter between the roots.",
    fact: "Mangroves can provide nursery habitat where young fish and crabs grow up more safely.",
    impact: "creating a Nursery for young marine life",
    interpretation:
      "Young marine life gains shelter, helping support fisheries and coastal biodiversity.",
    consequence: "Nursery habitat starts forming",
    signal: "Habitat support",
    loss: {
      title: "Empty Nursery",
      short: "Empty",
      visual: "Open water with nowhere for young fish or crabs to shelter.",
      fact: "Without sheltered roots, juvenile marine species lose vital nursery habitat.",
      interpretation:
        "Young fish and crabs lose shelter, weakening the nursery habitat that supports marine life.",
      impact: "watching marine life vanish",
      consequence: "Nursery habitat is lost",
      signal: "Habitat loss",
    },
  },
  {
    min: 51,
    max: 100,
    threshold: 50,
    title: "Coastal Protection",
    short: "Protection",
    visual: "Waves break and calm before they reach the shore.",
    fact: "Dense mangrove belts can help reduce wave energy and slow coastal erosion.",
    impact: "helping build Coastal Protection",
    interpretation:
      "The coastline gains a natural buffer that can help reduce wave impact and erosion.",
    consequence: "Wave impact can be reduced",
    signal: "Coastal buffering",
    loss: {
      title: "Open Shore",
      short: "Battered",
      visual: "Waves slam directly into the shore with no buffer to slow them.",
      fact: "Without mangrove belts, wave energy reaches the coast unchecked.",
      interpretation:
        "Waves hit the shore more directly, increasing erosion pressure on the coast.",
      impact: "leaving the coast unbuffered",
      consequence: "Wave impact increases",
      signal: "Direct wave pressure",
    },
  },
  {
    min: 101,
    max: 300,
    threshold: 100,
    title: "Biodiversity Hub",
    short: "Biodiversity",
    visual: "Birds wheel above, crabs return to the mud, life fills the canopy.",
    fact: "Maturing mangrove zones can support biodiversity across mud, water, and canopy.",
    impact: "helping build a Biodiversity Hub",
    interpretation:
      "A living ecosystem begins to support birds, crabs, fish, and healthier coastal habitats.",
    consequence: "Biodiversity becomes more active",
    signal: "Ecosystem recovery",
    loss: {
      title: "Quiet Coast",
      short: "Declining",
      visual: "Quiet skies, empty mud, fading sounds of life.",
      fact: "Without canopy, mud, and roots, biodiversity fades across the system.",
      interpretation:
        "Biodiversity fades as birds, fish, and crabs lose the habitat they depend on.",
      impact: "letting storms reach further inland",
      consequence: "Biodiversity declines",
      signal: "Ecosystem decline",
    },
  },
  {
    min: 301,
    max: 1000,
    threshold: 300,
    title: "Living Coastline",
    short: "Forest",
    visual: "A full mangrove forest — calm water, abundant life, a protected coast.",
    fact: "Healthy mangrove forests can store blue carbon and contribute to long-term coastal resilience.",
    impact: "growing a Living Coastline",
    interpretation:
      "A resilient coastline forms, supporting biodiversity, carbon storage, and natural coastal protection.",
    consequence: "Coastal resilience increases",
    signal: "Resilient shoreline",
    loss: {
      title: "Fragile Coast",
      short: "Vulnerable",
      visual: "Storms reach inland; the coast has no defenders left.",
      fact: "Without forests, coastal systems become fragile and vulnerable to storms.",
      interpretation:
        "The coastline becomes fragile and vulnerable, increasing erosion and flood risk for nearby communities.",
      impact: "watching your coastline collapse",
      consequence: "Flood and erosion risk rises",
      signal: "High vulnerability",
    },
  },
];

const lossStatCards = [
  {
    label: "Coastal Protection",
    value: "Lost",
    text: "Without root networks, shorelines lose their natural buffer against erosion.",
  },
  {
    label: "Marine Nursery",
    value: "Empty",
    text: "Without sheltered roots, young marine life loses essential habitat.",
  },
  {
    label: "Blue Carbon",
    value: "Released",
    text: "Without intact mangroves, stored carbon can be released back to the atmosphere.",
  },
];

const sliderMarkers = [
  { value: 1, pct: 0 },
  { value: 10, pct: 10 },
  { value: 50, pct: 25 },
  { value: 100, pct: 40 },
  { value: 300, pct: 65 },
  { value: 1000, pct: 100 },
];

function valueToPct(value) {
  const v = Math.max(1, Math.min(1000, value));
  for (let i = 0; i < sliderMarkers.length - 1; i++) {
    const a = sliderMarkers[i];
    const b = sliderMarkers[i + 1];
    if (v >= a.value && v <= b.value) {
      const t = (v - a.value) / (b.value - a.value);
      return a.pct + t * (b.pct - a.pct);
    }
  }
  return 100;
}

function pctToValue(pct) {
  const p = Math.max(0, Math.min(100, pct));
  for (let i = 0; i < sliderMarkers.length - 1; i++) {
    const a = sliderMarkers[i];
    const b = sliderMarkers[i + 1];
    if (p >= a.pct && p <= b.pct) {
      const t = (p - a.pct) / (b.pct - a.pct);
      return Math.round(a.value + t * (b.value - a.value));
    }
  }
  return 1000;
}

const treePositions = [
  [10, 67, 0.78],
  [17, 62, 0.88],
  [24, 70, 0.72],
  [30, 57, 1],
  [37, 65, 0.86],
  [43, 54, 1.05],
  [50, 68, 0.78],
  [55, 58, 0.96],
  [61, 50, 1.08],
  [66, 65, 0.82],
  [72, 55, 1],
  [78, 62, 0.86],
  [84, 52, 1.08],
  [90, 64, 0.82],
  [13, 50, 1.04],
  [22, 45, 1.12],
  [34, 42, 1.16],
  [46, 41, 1.18],
  [58, 38, 1.2],
  [70, 41, 1.14],
  [82, 43, 1.18],
  [19, 32, 1.1],
  [32, 29, 1.22],
  [48, 27, 1.26],
  [64, 29, 1.18],
  [80, 31, 1.22],
];

const fishPositions = [
  [18, 78],
  [29, 83],
  [41, 77],
  [54, 85],
  [68, 79],
  [78, 86],
  [87, 77],
  [35, 90],
  [62, 90],
  [12, 86],
];

const birdPositions = [
  [18, 21],
  [31, 17],
  [58, 15],
  [73, 22],
  [84, 18],
  [44, 12],
  [10, 24],
];

const crabPositions = [
  [23, 73],
  [62, 72],
  [81, 68],
  [40, 75],
  [13, 71],
];

function getStage(count) {
  return stages.find((stage) => count >= stage.min && count <= stage.max) ?? stages[0];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function articleFor(title) {
  return /^[aeiou]/i.test(title) ? "an" : "a";
}

function Tree({ x, y, scale, index, visible }) {
  return (
    <motion.div
      className="absolute origin-bottom"
      style={{ left: `${x}%`, top: `${y}%` }}
      transformTemplate={(_, generatedTransform) => `translate(-50%, -100%) ${generatedTransform}`}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? scale : scale * 0.52,
        y: visible ? 0 : 16,
      }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.018, 0.22), ease: "easeOut" }}
    >
      <div className="relative h-24 w-16">
        <div className="absolute left-1/2 top-8 h-12 w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-800 to-amber-950" />
        <div className="absolute left-1/2 top-16 h-8 w-10 -translate-x-1/2">
          <span className="root root-left" />
          <span className="root root-center" />
          <span className="root root-right" />
        </div>
        <span className="leaf leaf-a" />
        <span className="leaf leaf-b" />
        <span className="leaf leaf-c" />
        <span className="leaf leaf-d" />
      </div>
    </motion.div>
  );
}

function Fish({ x, y, index, visible }) {
  return (
    <motion.div
      className="fish absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? [0, 8, 0] : 0, scale: visible ? 1 : 0.6 }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        x: { duration: 3.4 + index * 0.2, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

function Bird({ x, y, index, visible }) {
  return (
    <motion.div
      className="bird absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? [0, -6, 0] : 0, scale: visible ? 1 : 0.72 }}
      transition={{
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
        y: { duration: 2.8 + index * 0.24, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

function Crab({ x, y, visible }) {
  return (
    <motion.div
      className="crab absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.55, y: visible ? 0 : 10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    />
  );
}

function CoastlineScene({ count, stage, withMangroves = true }) {
  const forestProgress = count / 1000;
  // Loss mode: slider value drives a 0..1 gradient of how much is lost.
  const lossIntensity = withMangroves ? 0 : clamp(count / 1000, 0, 1);

  let visibleTrees;
  let visibleFish;
  let visibleBirds;
  let visibleCrabs;
  let treeGrowth;

  if (withMangroves) {
    if (count <= 10) visibleTrees = Math.max(1, Math.round(count / 3.5));
    else if (count <= 50) visibleTrees = 3 + Math.round((count - 10) / 12);
    else if (count <= 100) visibleTrees = 6 + Math.round((count - 50) / 8);
    else if (count <= 300) visibleTrees = 12 + Math.round((count - 100) / 30);
    else visibleTrees = Math.min(treePositions.length, 19 + Math.round((count - 300) / 100));

    treeGrowth = 0.4 + clamp(count / 340, 0, 1) * 0.6;

    if (count <= 10) visibleFish = 0;
    else if (count <= 50) visibleFish = 2 + Math.round((count - 10) / 13);
    else if (count <= 100) visibleFish = 5 + Math.round((count - 50) / 25);
    else visibleFish = Math.min(fishPositions.length, 7 + Math.round((count - 100) / 300));

    if (count <= 100) visibleBirds = 0;
    else if (count <= 300) visibleBirds = 1 + Math.round((count - 100) / 35);
    else visibleBirds = Math.min(birdPositions.length, 7);

    if (count <= 100) visibleCrabs = 0;
    else if (count <= 300) visibleCrabs = 1 + Math.round((count - 100) / 50);
    else visibleCrabs = Math.min(crabPositions.length, 5);
  } else {
    // Loss-mode: slider grows the LOSS. Higher count -> emptier coast.
    // Low (1-50): a few sparse remnant trees + reduced animals.
    // Mid (50-300): no trees, no animals.
    // High (300-1000): completely empty + max desaturation handled below.
    if (count <= 10) visibleTrees = 6;
    else if (count <= 50) visibleTrees = Math.max(1, 6 - Math.round((count - 10) / 9));
    else visibleTrees = 0;

    if (count <= 10) visibleFish = 4;
    else if (count <= 50) visibleFish = Math.max(1, 4 - Math.round((count - 10) / 12));
    else visibleFish = 0;

    if (count <= 10) visibleBirds = 2;
    else if (count <= 50) visibleBirds = count <= 30 ? 1 : 0;
    else visibleBirds = 0;

    if (count <= 10) visibleCrabs = 1;
    else if (count <= 30) visibleCrabs = 1;
    else visibleCrabs = 0;

    // Remnant trees look weaker as loss grows.
    treeGrowth = 0.85 - lossIntensity * 0.35;
  }

  const waveMotion = withMangroves
    ? 38 - forestProgress * 32
    : 28 + lossIntensity * 50;
  const waveOpacity = withMangroves
    ? 1 - forestProgress * 0.6
    : 0.7 + lossIntensity * 0.3;
  const waveHeight = withMangroves
    ? 1.25 - forestProgress * 0.7
    : 0.95 + lossIntensity * 0.85;
  const fragility = withMangroves
    ? clamp(1 - (count - 1) / 14, 0, 1)
    : lossIntensity * 0.55;
  const foam = withMangroves
    ? clamp((count - 50) / 80, 0, 1)
    : clamp(lossIntensity * 1.1, 0, 1);
  const ecosystem = withMangroves ? clamp((count - 300) / 400, 0, 1) : 0;
  const lossOverlay = withMangroves ? 0 : 0.18 + lossIntensity * 0.45;
  const sceneFilter = withMangroves
    ? "none"
    : `saturate(${(1 - lossIntensity * 0.7).toFixed(3)}) brightness(${(1 - lossIntensity * 0.28).toFixed(3)})`;

  return (
    <div
      className="relative isolate min-h-[400px] overflow-hidden rounded-[2rem] border border-white/30 bg-ocean-900 shadow-glow transition-[filter] duration-500 sm:min-h-[520px]"
      style={{ filter: sceneFilter }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(148,231,238,0.44),transparent_26%),linear-gradient(180deg,#07364a_0%,#0a6783_46%,#cda563_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/20 to-transparent" />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,206,140,0.32),transparent_55%)]"
        animate={{ opacity: ecosystem }}
        transition={{ duration: 0.6 }}
      />

      <motion.div
        className="absolute left-[-12%] right-[-12%] top-[39%] h-56 rounded-[48%] bg-cyan-300/25 blur-md"
        animate={{ scaleY: waveHeight, opacity: waveOpacity }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {[0, 1, 2, 3].map((wave) => (
        <motion.div
          key={wave}
          className="wave-line absolute left-[-18%] w-[136%]"
          style={{
            top: `${46 + wave * 8}%`,
            borderTopWidth: withMangroves ? 3 : 3 + Math.round(lossIntensity * 2),
            borderTopColor: withMangroves
              ? "rgba(255,255,255,0.58)"
              : `rgba(255,255,255,${(0.55 + lossIntensity * 0.35).toFixed(3)})`,
          }}
          animate={{
            x: [0, wave % 2 ? -waveMotion : waveMotion, 0],
            opacity: waveOpacity,
          }}
          transition={{
            duration: (withMangroves ? 5.5 : 4.4 - lossIntensity * 1.4) + wave * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {!withMangroves &&
        [0, 1].map((extra) => (
          <motion.div
            key={`loss-wave-${extra}`}
            className="wave-line absolute left-[-18%] w-[136%]"
            style={{
              top: `${78 + extra * 6}%`,
              borderTopWidth: 3 + Math.round(lossIntensity * 2),
              borderTopColor: `rgba(255,255,255,${(0.4 + lossIntensity * 0.35).toFixed(3)})`,
            }}
            animate={{
              x: [0, extra % 2 ? -(30 + lossIntensity * 30) : 30 + lossIntensity * 30, 0],
              opacity: 0.15 + lossIntensity * 0.75,
            }}
            transition={{
              duration: 3.4 - lossIntensity * 1.0 + extra * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <motion.div
        className="pointer-events-none absolute inset-x-[5%] top-[60%] h-10 rounded-[50%] bg-white/30 blur-md"
        animate={{ opacity: foam * 0.7, scaleX: 1 + foam * 0.2 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-[8%] top-[58%] h-[3px] rounded-full bg-white/80 blur-[1px]"
        animate={{ opacity: foam * 0.85 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="absolute inset-x-[-8%] bottom-[-12%] h-[47%] rounded-[50%_50%_0_0] bg-gradient-to-b from-sand-200 via-sand-300 to-amber-950"
        animate={{ y: forestProgress > 0.3 ? -8 : 0 }}
        transition={{ duration: 0.6 }}
      />
      <div className="absolute inset-x-0 bottom-[23%] h-14 bg-gradient-to-b from-amber-950/0 via-amber-950/25 to-amber-950/0" />

      {treePositions.map(([x, y, scale], index) => (
        <Tree key={`${x}-${y}`} x={x} y={y} scale={scale * treeGrowth} index={index} visible={index < visibleTrees} />
      ))}

      {fishPositions.map(([x, y], index) => (
        <Fish key={`${x}-${y}`} x={x} y={y} index={index} visible={index < visibleFish} />
      ))}

      {birdPositions.map(([x, y], index) => (
        <Bird key={`${x}-${y}`} x={x} y={y} index={index} visible={index < visibleBirds} />
      ))}

      {crabPositions.map(([x, y], index) => (
        <Crab key={`${x}-${y}`} x={x} y={y} visible={index < visibleCrabs} />
      ))}

      <motion.div
        className="pointer-events-none absolute inset-0 bg-slate-700/50 mix-blend-multiply"
        animate={{ opacity: fragility * 0.55 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-slate-900/60 mix-blend-multiply"
        animate={{ opacity: lossOverlay }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
        {stage.title}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.title}
          className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/30 bg-ocean-950/75 p-5 text-white shadow-card backdrop-blur-xl sm:left-8 sm:right-auto sm:max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanSoft">Current stage</p>
          <h3 className="mt-2 text-2xl font-semibold">{stage.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/80">{stage.visual}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ImpactIcon({ type }) {
  const common = "mx-auto h-14 w-14 text-cyanSoft";

  if (type === "shield") {
    return (
      <svg className={common} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M32 8 51 15v15c0 12-8 21-19 26-11-5-19-14-19-26V15l19-7Z" fill="currentColor" opacity="0.22" />
        <path d="M32 8 51 15v15c0 12-8 21-19 26-11-5-19-14-19-26V15l19-7Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <path d="M22 33c6-7 13-7 20 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "fish") {
    return (
      <svg className={common} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M10 34c10-15 27-16 40-2l6-8v22l-6-8c-13 14-30 13-40-4Z" fill="currentColor" opacity="0.22" />
        <path d="M10 34c10-15 27-16 40-2l6-8v22l-6-8c-13 14-30 13-40-4Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="25" cy="31" r="2.5" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 53c10-10 18-20 18-31a18 18 0 0 0-36 0c0 11 8 21 18 31Z" fill="currentColor" opacity="0.2" />
      <path d="M32 53c10-10 18-20 18-31a18 18 0 0 0-36 0c0 11 8 21 18 31Z" stroke="currentColor" strokeWidth="4" />
      <path d="M32 43V22m0 10c-6 0-10-3-12-8m12 8c6 0 10-3 12-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function InfoCard({ title, body, type }) {
  return (
    <motion.article
      className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 text-center text-white shadow-card backdrop-blur"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <ImpactIcon type={type} />
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/70">{body}</p>
    </motion.article>
  );
}

function StatCard({ label, text, value }) {
  return (
    <div className="rounded-3xl border border-ocean-900/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean-700">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-ocean-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [withMangroves, setWithMangroves] = useState(true);
  const stage = useMemo(() => getStage(count), [count]);
  const stageIndex = stages.findIndex((item) => item.title === stage.title);
  const active = withMangroves ? stage : { ...stage, ...stage.loss };
  const realWorldText = active.consequence;
  const impactSignalText = active.signal;
  const sliderPct = valueToPct(count);
  const impactPercent = Math.round((count / 1000) * 100);
  const thresholdLabel =
    stage.threshold === 1 ? "1 mangrove" : `${stage.threshold.toLocaleString()} mangroves`;

  const impactMessage = withMangroves
    ? `With ${count.toLocaleString()} mangroves planted, my coastline becomes ${articleFor(stage.title)} ${stage.title}. Mangroves help protect coasts, support marine life, and build climate resilience.`
    : `At this level of mangrove loss, the coastline becomes ${articleFor(stage.loss.title)} ${stage.loss.title}. Without mangroves, coastlines lose natural protection, habitat, and resilience.`;
  const visibleStatCards = withMangroves
    ? null
    : lossStatCards;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(impactMessage);
      } else {
        const ta = document.createElement("textarea");
        ta.value = impactMessage;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const scrollToSimulator = () => {
    document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-sand-100 text-ocean-950">
      <section className="relative isolate min-h-[92vh] px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(130deg,#062332_0%,#07506c_46%,#1d4f35_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-sand-100 to-transparent" />
        <div className="absolute left-1/2 top-12 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyanSoft/20 blur-3xl" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 shadow-card backdrop-blur">
              <span className="h-5 w-5 rounded-full border-4 border-cyanSoft border-b-mangrove-500" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">Living Coastlines</span>
          </div>
          <button
            className="hidden rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:block"
            onClick={scrollToSimulator}
          >
            Open simulator
          </button>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-20 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyanSoft">Educational coastal campaign</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Mangrove Impact Simulator
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
              Explore how mangroves shape two possible futures for our coastlines — one restored, one exposed.
            </p>
            <button
              onClick={scrollToSimulator}
              className="mt-9 rounded-full bg-cyanSoft px-7 py-4 text-base font-bold text-ocean-950 shadow-glow transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-cyanSoft/30"
            >
              Explore the coastline
            </button>
          </motion.div>

          <motion.div
            className="relative min-h-[460px] overflow-hidden rounded-[2.25rem] border border-white/20 bg-white/10 p-4 shadow-glow backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <CoastlineScene count={620} stage={stages[4]} />
          </motion.div>
        </div>
      </section>

      <section id="simulator" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-center gap-2 sm:mb-10">
            <div
              role="tablist"
              aria-label="Mangrove scenario"
              className="inline-flex rounded-full border border-ocean-900/10 bg-white p-1 shadow-card"
            >
              <button
                role="tab"
                aria-selected={withMangroves}
                onClick={() => {
                  setWithMangroves(true);
                  setCount(1);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-mangrove-500 ${
                  withMangroves
                    ? "bg-mangrove-800 text-white shadow-card ring-2 ring-mangrove-500/30"
                    : "text-ocean-700 hover:text-ocean-950"
                }`}
              >
                With Mangroves
              </button>
              <button
                role="tab"
                aria-selected={!withMangroves}
                onClick={() => {
                  setWithMangroves(false);
                  setCount(1);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 ${
                  !withMangroves
                    ? "bg-ocean-950 text-white shadow-card ring-2 ring-ocean-700/30"
                    : "text-ocean-700 hover:text-ocean-950"
                }`}
              >
                Without Mangroves
              </button>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              With mangroves shows restoration. Without mangroves shows what is lost.
            </p>
            <AnimatePresence mode="wait">
              {!withMangroves && (
                <motion.p
                  key="loss-label"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean-700"
                >
                  This is your coastline without mangroves.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${withMangroves ? "with" : "without"}-${stage.title}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`mx-auto mb-8 max-w-3xl text-center text-xl font-semibold leading-snug sm:text-2xl ${
                withMangroves ? "text-ocean-950" : "text-ocean-900"
              }`}
            >
              {withMangroves ? (
                <>
                  With <span className="text-mangrove-700">{count.toLocaleString()} mangroves planted</span>, your coast becomes {articleFor(stage.title)} <span className="text-mangrove-700">{stage.title}</span>.
                </>
              ) : (
                <>
                  At this level of <span className="text-ocean-950">mangrove loss</span>, your coast becomes {articleFor(stage.loss.title)} <span className="text-ocean-950">{stage.loss.title}</span>.
                </>
              )}
            </motion.p>
          </AnimatePresence>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <CoastlineScene count={count} stage={active} withMangroves={withMangroves} />

            <div className="rounded-[2rem] border border-ocean-900/10 bg-white/[0.86] p-6 shadow-card backdrop-blur md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-ocean-700">
                {withMangroves ? "Planting scenario" : "Loss scenario"}
              </p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    {withMangroves ? "Current mangrove count" : "Mangroves lost"}
                  </p>
                  <p className="mt-1 text-5xl font-semibold text-ocean-950">{count.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${
                      withMangroves ? "bg-mangrove-800" : "bg-ocean-950"
                    }`}
                  >
                    Stage {stageIndex + 1} of {stages.length}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {withMangroves
                      ? `${stage.short} stage begins at ${thresholdLabel}`
                      : "This is what happens when mangroves are lost."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-ocean-950" htmlFor="mangrove-slider">
                  {withMangroves ? "Mangroves planted" : "Mangroves lost"}
                </label>
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                    withMangroves ? "text-mangrove-700" : "text-ocean-700"
                  }`}
                >
                  {withMangroves ? "Drag to grow your coastline" : "Drag to see what is lost"}
                </span>
              </div>

              <div className="mt-4 -mx-1 flex flex-wrap gap-1.5">
                {stages.map((s, i) => {
                  const labelText = withMangroves ? s.short : s.loss.short;
                  const activeClass = withMangroves
                    ? "bg-mangrove-800 text-white shadow-card"
                    : "bg-ocean-950 text-white shadow-card";
                  return (
                    <span
                      key={s.title}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                        i === stageIndex ? activeClass : "bg-ocean-900/5 text-ocean-700"
                      }`}
                    >
                      {labelText}
                    </span>
                  );
                })}
              </div>

              <p
                className={`mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                  withMangroves ? "text-mangrove-700" : "text-ocean-700"
                }`}
              >
                {withMangroves
                  ? `You are in the top ${impactPercent}% of mangrove impact`
                  : "Even large numbers cannot compensate for missing ecosystems"}
              </p>

              <input
                id="mangrove-slider"
                className="plant-slider mt-2 w-full"
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={sliderPct}
                style={{ "--slider-progress": `${sliderPct}%` }}
                onChange={(event) => setCount(pctToValue(Number(event.target.value)))}
                aria-valuemin={1}
                aria-valuemax={1000}
                aria-valuenow={count}
                aria-valuetext={`${count.toLocaleString()} mangroves`}
                aria-label="Number of mangroves to plant"
              />

              <div className="relative mt-3 h-10 select-none">
                {sliderMarkers.map((m, i) => {
                  const isFirst = i === 0;
                  const isLast = i === sliderMarkers.length - 1;
                  const translate = isFirst
                    ? "translateX(0)"
                    : isLast
                      ? "translateX(-100%)"
                      : "translateX(-50%)";
                  const reached = count >= m.value;
                  const tickAlign = isFirst ? 0 : isLast ? "100%" : "50%";
                  return (
                    <div
                      key={m.value}
                      className="absolute top-0 flex flex-col"
                      style={{ left: `${m.pct}%`, transform: translate }}
                    >
                      <span
                        className={`block h-2 w-px ${reached ? "bg-mangrove-800" : "bg-ocean-900/25"}`}
                        style={{ marginLeft: tickAlign }}
                      />
                      <span
                        className={`mt-1 text-[10px] font-semibold tabular-nums ${
                          reached ? "text-mangrove-800" : "text-slate-500"
                        }`}
                      >
                        {m.value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className={`mt-8 rounded-3xl p-6 text-white transition-colors duration-500 ${
                  withMangroves
                    ? "bg-gradient-to-br from-ocean-950 to-mangrove-900"
                    : "bg-gradient-to-br from-slate-900 to-ocean-950"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyanSoft">
                  {withMangroves ? "Impact fact" : "What is lost"}
                </p>
                <h2 className="mt-3 text-3xl font-semibold">{active.title}</h2>
                <p className="mt-3 leading-7 text-white/80">{active.fact}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {visibleStatCards
                  ? visibleStatCards.map((card) => (
                      <StatCard
                        key={card.label}
                        label={card.label}
                        value={card.value}
                        text={card.text}
                      />
                    ))
                  : (
                    <>
                      <StatCard
                        label="Coastal Protection"
                        value={count > 50 ? "Growing" : "Emerging"}
                        text="Root networks can help buffer shorelines as planting density and survival improve."
                      />
                      <StatCard
                        label="Marine Nursery"
                        value={count > 10 ? "Active" : "Starting"}
                        text="Sheltered roots support habitat complexity for young marine life."
                      />
                      <StatCard
                        label="Blue Carbon"
                        value={count > 300 ? "Strong" : "Building"}
                        text="Healthy mangrove ecosystems can store carbon in biomass and coastal soils."
                      />
                    </>
                  )}
              </div>
            </div>
          </div>

          <MangroveQuiz
            currentCount={count}
            mode={withMangroves ? "withMangroves" : "withoutMangroves"}
          />
        </div>
      </section>

      <section className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-ocean-900/10 bg-white p-7 shadow-card sm:p-10">
            <p
              className={`text-xs font-bold uppercase tracking-[0.25em] ${
                withMangroves ? "text-mangrove-700" : "text-ocean-700"
              }`}
            >
              {withMangroves ? "Interpretation" : "What is lost"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ocean-950 sm:text-3xl">
              What does your impact mean?
            </h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={`interp-${withMangroves ? "with" : "without"}-${stage.title}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-5 max-w-3xl text-lg leading-8 text-ocean-900 sm:text-xl"
              >
                {active.interpretation}
              </motion.p>
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <motion.div
                key={`cons-${withMangroves ? "with" : "without"}-${stage.title}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white/70 rounded-xl p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-card"
              >
                <p className="text-xs uppercase tracking-wide mb-1">Real-world consequence</p>
                <p className="text-sm">{realWorldText}</p>
              </motion.div>
              <motion.div
                key={`sig-${withMangroves ? "with" : "without"}-${stage.title}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                className="bg-white/70 rounded-xl p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-card"
              >
                <p className="text-xs uppercase tracking-wide mb-1">Impact signal</p>
                <p className="text-sm">{impactSignalText}</p>
              </motion.div>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              These are educational indicators, not exact per-tree calculations. Actual outcomes depend on species, density, age, location, and ecosystem condition.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-ocean-900/10 bg-white p-7 shadow-card sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-mangrove-700">
              Why this matters for city life
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-ocean-950 sm:text-3xl">
              From the coastline to the city.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ocean-900 sm:text-lg">
              Even if you live in the city, mangroves help protect the places you live, work, and travel through.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              Without them, these protections weaken — and cities can feel the impact through flooding, erosion, food security, and climate risk.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-ocean-900/10 bg-mangrove-500/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-mangrove-700/30 hover:bg-mangrove-500/[0.1] hover:shadow-card">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-mangrove-700">
                  Flood protection
                </p>
                <p className="mt-3 text-sm leading-6 text-ocean-900">
                  Helps reduce wave impact and coastal flooding pressure, especially in low-lying urban areas.
                </p>
              </div>

              <div className="rounded-2xl border border-ocean-900/10 bg-mangrove-500/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-mangrove-700/30 hover:bg-mangrove-500/[0.1] hover:shadow-card">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-mangrove-700">
                  Cleaner, safer coastlines
                </p>
                <p className="mt-3 text-sm leading-6 text-ocean-900">
                  Traps sediment and helps reduce shoreline erosion, keeping coastal edges more stable.
                </p>
              </div>

              <div className="rounded-2xl border border-ocean-900/10 bg-mangrove-500/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-mangrove-700/30 hover:bg-mangrove-500/[0.1] hover:shadow-card">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-mangrove-700">
                  Livelihood and food security
                </p>
                <p className="mt-3 text-sm leading-6 text-ocean-900">
                  Supports fish, crabs, and shrimp habitats that many coastal communities depend on.
                </p>
              </div>

              <div className="rounded-2xl border border-ocean-900/10 bg-mangrove-500/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-mangrove-700/30 hover:bg-mangrove-500/[0.1] hover:shadow-card">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-mangrove-700">
                  Climate resilience
                </p>
                <p className="mt-3 text-sm leading-6 text-ocean-900">
                  Stores blue carbon and helps cities adapt to sea-level rise and stronger storms.
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              Impact depends on local conditions, mangrove health, and coastal planning.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-mangrove-700/20 bg-gradient-to-br from-mangrove-900 via-ocean-950 to-ocean-900 p-7 text-white shadow-glow sm:p-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyanSoft/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-mangrove-500/15 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyanSoft">
                  {withMangroves ? "Your Mangrove Impact" : "What gets lost without mangroves"}
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  {withMangroves ? (
                    <>
                      With <span className="text-cyanSoft">{count.toLocaleString()} mangroves planted</span>, your coast becomes {articleFor(stage.title)}{" "}
                      <span className="text-cyanSoft">{stage.title}</span>.
                    </>
                  ) : (
                    <>
                      At this level of <span className="text-cyanSoft">mangrove loss</span>, your coast becomes {articleFor(stage.loss.title)}{" "}
                      <span className="text-cyanSoft">{stage.loss.title}</span>.
                    </>
                  )}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                  {withMangroves
                    ? "Share your scenario to inspire others. Real-world outcomes vary — mangroves help when species, density, and conditions support healthy growth."
                    : "Even large numbers cannot compensate for missing ecosystems. Restoration matters more than replacement."}
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanSoft">Shareable message</p>
                <p className="text-sm leading-7 text-white/85">{impactMessage}</p>
                <button
                  onClick={handleCopy}
                  aria-live="polite"
                  className={`mt-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-cyanSoft/30 ${
                    copied
                      ? "bg-mangrove-500 text-ocean-950"
                      : "bg-cyanSoft text-ocean-950 hover:-translate-y-0.5 hover:bg-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied to clipboard
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                      </svg>
                      Copy impact message
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-ocean-950 px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyanSoft">Why Mangroves Matter</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">Small forests with shoreline-scale benefits.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              type="shield"
              title="Protects coastlines"
              body="Mangrove roots help hold sediment in place and can reduce erosion where local conditions support healthy growth."
            />
            <InfoCard
              type="fish"
              title="Supports marine life"
              body="Root systems create sheltered spaces that support fish, crabs, and other coastal species during vulnerable life stages."
            />
            <InfoCard
              type="carbon"
              title="Stores carbon"
              body="Mangroves can store blue carbon in wood, roots, and waterlogged soils when ecosystems remain intact."
            />
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-mangrove-700/20 bg-gradient-to-br from-mangrove-900 via-ocean-950 to-ocean-900 p-7 text-white shadow-glow sm:p-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyanSoft/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-mangrove-500/15 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyanSoft">Take it further</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  Small roots. Bigger resilience.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Mangrove restoration is not only about trees. It is about safer coastlines, stronger ecosystems, and communities that are better prepared for climate risks.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanSoft">Your next step</p>
                <button
                  onClick={handleCopy}
                  aria-live="polite"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-cyanSoft/30 ${
                    copied
                      ? "bg-mangrove-500 text-ocean-950"
                      : "bg-cyanSoft text-ocean-950 hover:-translate-y-0.5 hover:bg-white"
                  }`}
                >
                  {copied ? "Copied to clipboard" : "Copy my impact message"}
                </button>
                <button
                  onClick={scrollToSimulator}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cyanSoft/20"
                >
                  Back to simulator
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-ocean-900/10 bg-white p-6 text-sm leading-6 text-slate-600 shadow-card">
          This simulator is an educational visualization. Actual mangrove impact depends on species, age, density, location, and ecosystem condition.
        </div>
      </footer>

      <Footer />
    </main>
  );
}
