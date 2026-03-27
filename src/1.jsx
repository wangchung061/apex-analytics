import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ReferenceLine,
  ComposedChart, Scatter
} from "recharts";

// ─── ICON SYSTEM ──────────────────────────────────────────────────────────────
// Single-colour SVG icons — all use currentColor so they adapt to theme + accents
const ICONS = {
  run:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="3.5" r="1.5"/><path d="M9 8l3 1.5 3-1.5"/><path d="M9.5 8.5L8 14l2 .5"/><path d="M14.5 8.5L16 14l-2 .5"/><path d="M10 14l-1.5 5"/><path d="M14 14l1.5 5"/></svg>,
  bike:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5l5-9h3l2 4"/><path d="M10.5 7.5l3 5 5 1"/><circle cx="15" cy="5" r="1"/></svg>,
  strength: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5h2v11h-2z"/><path d="M15.5 6.5h2v11h-2z"/><path d="M8.5 9.5h7v5h-7z"/><path d="M4 8.5h2.5"/><path d="M4 15.5h2.5"/><path d="M17.5 8.5H20"/><path d="M17.5 15.5H20"/></svg>,
  upload:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  trash:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  shoe:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14l2-7 5 2 4-3 5 3v4l-2 2H5l-2-2z"/><path d="M9 9v4"/></svg>,
  target:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  trend:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  clock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  tip:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  power:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  fire:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-5 5-5 10a5 5 0 0010 0c0-3-1.5-5-2-6 0 0-.5 2-2 3 0 0 0-4-1-7z"/></svg>,
  flag:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  heart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  device:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  chart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  warn:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ruler:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12L12 2l10 10-10 10L2 12z"/><path d="M7 12h2M12 7v2M17 12h-2M12 17v-2"/></svg>,
  sleep:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  walk:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="M9 9l-2 7M15 9l2 7M9 14h6M11 9l1 5 1-5"/></svg>,
  retire:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  easy:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  recovery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-7 4 14 3-9 2 2h4"/></svg>,
  gear:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 014.93 19.07M4.93 4.93A10 10 0 0119.07 19.07"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
};

const Icon = ({ name, size = 16, color, style = {} }) => {
  const svg = ICONS[name];
  if (!svg) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, color: color || "currentColor", flexShrink: 0, ...style }}>
      {React.cloneElement(svg, { width: size, height: size })}
    </span>
  );
};

// ─── VO2MAX FROM PERFORMANCE (Jack Daniels VDOT) ─────────────────────────────
// VDOT formula: given a race time T (minutes) over distance D (metres),
// velocity V = D / T (m/min), then:
//   %VO2max = 0.8 + 0.1894393 × e^(-0.012778×T) + 0.2989558 × e^(-0.1932605×T)
//   VO2 at V = -4.60 + 0.182258×V + 0.000104×V²
//   VO2max = VO2 / %VO2max
// We pick the best (highest) VDOT across all runs ≥ 3 km, using the effort
// implied by avgPace over the actual distance. Longer efforts at sustained pace
// give more reliable estimates — we weight by distance.
const calcVO2maxFromWorkouts = (workouts) => {
  const runs = workouts.filter(w =>
    w.type === "Run" && w.avgPace > 0 && w.distance >= 3
  );
  if (!runs.length) return null;

  let bestVdot = 0;
  let bestRun  = null;

  runs.forEach(w => {
    const distM = w.distance * 1000;                   // km → m
    const secPerMi = w.avgPace;                        // stored as sec/mi
    const secPerM  = secPerMi / 1609.344;              // sec/m
    const T = (distM * secPerM) / 60;                  // total minutes for this distance
    if (T <= 0) return;

    const V = distM / T;                               // m/min
    const pctVO2max = 0.8
      + 0.1894393 * Math.exp(-0.012778  * T)
      + 0.2989558 * Math.exp(-0.1932605 * T);
    const vo2AtV = -4.60 + 0.182258 * V + 0.000104 * V * V;
    const vdot   = parseFloat((vo2AtV / pctVO2max).toFixed(1));

    if (vdot > bestVdot) { bestVdot = vdot; bestRun = w; }
  });

  if (bestVdot <= 20 || bestVdot > 90) return null; // sanity bounds
  return { value: bestVdot, run: bestRun };
};

const ATHLETE = {
  name: "Alex Mercer",
  age: 28,
  weight: 159,   // lbs
  height: 70,    // inches (5'10")
  restingHR: 42,
  maxHR: 192,
  lthr: 0,       // 0 = not set, AI will estimate
  ftp: 0,        // 0 = not set, AI will estimate
  vo2max: 0,     // 0 = not set, AI will estimate
  hrv: 74,
  gender: "Male",
  goal: "Sub-2:45 Marathon",
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const fmtPace = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
const fmtDuration = (min) => `${Math.floor(min / 60)}h ${min % 60}m`;
const fmtHeight = (inches) => `${Math.floor(inches / 12)}'${inches % 12}"`;

// Unit-aware formatters — call with the units preference object
const fmtDist = (km, units) => {
  if (units.distance === "mi") return `${(km * 0.621371).toFixed(2)} mi`;
  return `${parseFloat(km).toFixed(2)} km`;
};
const fmtDistShort = (km, units) => {
  if (units.distance === "mi") return `${(km * 0.621371).toFixed(1)} mi`;
  return `${parseFloat(km).toFixed(1)} km`;
};
const fmtAlt = (ft, units) => {
  if (units.altitude === "m") return `${Math.round(ft * 0.3048)} m`;
  return `${Math.round(ft)} ft`;
};
// Convert stored sec/mi pace to sec/km if needed, return formatted string + label
const fmtPaceWithUnit = (secPerMi, units) => {
  if (units.distance === "km") {
    const secPerKm = Math.round(secPerMi * 0.621371);
    return { pace: fmtPace(secPerKm), unit: "/km" };
  }
  return { pace: fmtPace(secPerMi), unit: "/mi" };
};

const HR_ZONE_COLORS = ["#38bdf8", "#34d399", "#fbbf24", "#f97316", "#ef4444"];
const HR_ZONE_NAMES = ["Z1 Recovery", "Z2 Aerobic", "Z3 Tempo", "Z4 Threshold", "Z5 Max"];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, accent = "var(--accent)", delta }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color: accent }}>{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
    {delta !== undefined && (
      <div className={`stat-delta ${delta >= 0 ? "pos" : "neg"}`}>
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
      </div>
    )}
  </div>
);

const InfoStatCard = ({ label, value, sub, accent = "var(--accent)", delta, info }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0, placement: "below" });
  const cardRef = useRef(null);

  const handleEnter = () => {
    if (!info || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const tooltipW = 240;
    const placement = r.top > 300 ? "above" : "below";
    let left = r.left + r.width / 2 - tooltipW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipW - 8));
    const top = placement === "above"
      ? r.top  + window.scrollY
      : r.bottom + window.scrollY + 10;
    setPos({ top, left, placement });
    setShow(true);
  };

  const handleTap = () => {
    if (!info) return;
    if (show) { setShow(false); return; }
    handleEnter();
  };

  return (
    <div
      className={`stat-card info-stat-card ${info ? "info-stat-card--hoverable" : ""}`}
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setShow(false)}
      onClick={handleTap}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {delta !== undefined && (
        <div className={`stat-delta ${delta >= 0 ? "pos" : "neg"}`}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </div>
      )}
      {show && info && (
        <div
          className="info-tooltip-portal"
          style={{
            position: "fixed",
            top: pos.placement === "above" ? "auto" : pos.top - window.scrollY,
            bottom: pos.placement === "above" ? window.innerHeight - (pos.top - window.scrollY) : "auto",
            left: pos.left,
            "--it-color": accent,
          }}
        >
          <div className="it-header">
            <span className="it-label" style={{ color: accent }}>{info.title}</span>
          </div>
          {info.body && <div className="it-body">{info.body}</div>}
          {info.rows && (
            <div className="it-rows">
              {info.rows.map((r, i) => (
                <div key={i} className="it-row">
                  <span className="it-row-key">{r.key}</span>
                  <span className="it-row-val" style={{ color: accent }}>{r.val}</span>
                </div>
              ))}
            </div>
          )}
          {info.footer && <div className="it-footer">{info.footer}</div>}
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tt-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tt-row" style={{ color: p.color }}>
          <span>{p.name}</span>
          <span>{formatter ? formatter(p.value, p.name) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const WorkoutQualityBadge = ({ score }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos]   = useState({ top: 0, left: 0 });
  const ref             = useRef(null);

  const color = score >= 90 ? "var(--accent)" : score >= 75 ? "#fbbf24" : "#f97316";
  const label = score >= 90 ? "Elite"   : score >= 75 ? "Good"    : "Moderate";

  const breakdown = score >= 90 ? [
    { key: "Pacing",     val: "Excellent",  note: "Consistent splits throughout" },
    { key: "Stimulus",   val: "High",       note: "Strong aerobic / lactate load" },
    { key: "HR Control", val: "Precise",    note: "Stayed in target zones" },
  ] : score >= 75 ? [
    { key: "Pacing",     val: "Good",       note: "Minor drift in later miles" },
    { key: "Stimulus",   val: "Solid",      note: "Effective training stress" },
    { key: "HR Control", val: "Controlled", note: "Mostly on-target" },
  ] : [
    { key: "Pacing",     val: "Easy",       note: "Low-intensity / recovery pace" },
    { key: "Stimulus",   val: "Light",      note: "Suitable for recovery days" },
    { key: "HR Control", val: "Relaxed",    note: "Predominantly Z1–Z2" },
  ];

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const tooltipW = 240;
    // Prefer right-aligned; clamp so it doesn't overflow right edge
    let left = r.right - tooltipW;
    if (left < 8) left = 8;
    if (r.right + 8 < tooltipW) left = r.left;
    // Place above the badge; if too close to top, place below
    const tooltipH = 180; // approx
    const placeAbove = r.top - tooltipH - 12 > 0;
    setPos({ left, top: placeAbove ? r.top - tooltipH - 12 : r.bottom + 10, placeAbove });
    setShow(true);
  };

  return (
    <span ref={ref} className="quality-badge-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      <span className="quality-badge" style={{ color, borderColor: color }}>
        {score} · {label}
      </span>
      {show && (
        <div
          className="quality-tooltip"
          style={{
            "--qt-color": color,
            position: "fixed",
            top:  pos.top,
            left: pos.left,
            bottom: "auto",
            right:  "auto",
          }}
        >
          <div className="qt-header">
            <span className="qt-score" style={{ color }}>{score}</span>
            <span className="qt-label" style={{ color }}>{label}</span>
            <span className="qt-title">Quality Score</span>
          </div>
          <div className="qt-rows">
            {breakdown.map(b => (
              <div key={b.key} className="qt-row">
                <span className="qt-key">{b.key}</span>
                <span className="qt-val" style={{ color }}>{b.val}</span>
                <span className="qt-note">{b.note}</span>
              </div>
            ))}
          </div>
          <div className="qt-footer">Score reflects pacing consistency, training stimulus, and HR zone adherence</div>
        </div>
      )}
    </span>
  );
};

const StrainRing = ({ value, max = 21 }) => {
  const pct = value / max;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color = pct > 0.75 ? "#ef4444" : pct > 0.5 ? "#f97316" : "var(--accent)";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="70" y="65" textAnchor="middle" fill="#f8fafc" fontSize="28" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif">{value}</text>
      <text x="70" y="85" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="'Inter', sans-serif">/ 21 STRAIN</text>
    </svg>
  );
};

const HRZoneBar = ({ zones }) => (
  <div className="hr-zone-bar">
    {zones.map((pct, i) => (
      <div key={i} className="hz-segment" style={{ width: `${pct}%`, background: HR_ZONE_COLORS[i] }}>
        {pct >= 8 && <span>{pct}%</span>}
      </div>
    ))}
  </div>
);

const CoachInsight = ({ note }) => {
  // Support both legacy string notes and rich object notes
  const isRich = typeof note === "object" && note !== null;
  const categoryMeta = {
    performance: { icon: "power",    color: "var(--accent)", label: "Performance" },
    pacing:      { icon: "target",   color: "#38bdf8", label: "Pacing" },
    cardiac:     { icon: "heart",    color: "#f97316", label: "Cardiac" },
    power:       { icon: "power",    color: "#a78bfa", label: "Power" },
    recovery:    { icon: "clock",    color: "#34d399", label: "Recovery" },
    warning:     { icon: "warn",     color: "#fbbf24", label: "Warning" },
    technique:   { icon: "ruler",    color: "#38bdf8", label: "Technique" },
    load:        { icon: "trend",    color: "#f97316", label: "Load" },
  };
  const meta = isRich ? (categoryMeta[note.category] ?? categoryMeta.performance) : { icon: "chart", color: "var(--accent)", label: "Insight" };
  const title = isRich ? note.title : null;
  const body  = isRich ? note.body  : note;

  return (
    <div className="coach-insight">
      <div className="ci-icon-wrap" style={{ background: meta.color + "18", border: `1px solid ${meta.color}30` }}>
        <Icon name={meta.icon} size={15} color={meta.color} />
      </div>
      <div className="ci-content">
        <div className="ci-header">
          <span className="ci-category" style={{ color: meta.color }}>{meta.label}</span>
          {title && <span className="ci-title">{title}</span>}
        </div>
        <p className="ci-body">{body}</p>
      </div>
    </div>
  );
};

// ─── VIEWS ─────────────────────────────────────────────────────────────────────

const EmptyState = ({ icon, title, sub }) => (
  <div className="view-empty">
    <div className="ve-icon"><Icon name={icon} size={40} color="var(--text3)" /></div>
    <div className="ve-title">{title}</div>
    <div className="ve-sub">{sub}</div>
  </div>
);

const DashboardView = ({ units, athlete, uploadedWorkouts }) => {
  const hasData = uploadedWorkouts.length > 0;

  // Compute CTL/ATL/TSB — works with zero workouts (all values stay 0)
  const today = new Date();
  const fitnessMap = {};
  uploadedWorkouts.forEach(w => { fitnessMap[w.date] = (fitnessMap[w.date] || 0) + (w.tss || 0); });
  const fitnessData = [];
  let ctl = 0, atl = 0;
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const tss = fitnessMap[dateStr] || 0;
    ctl = ctl + (tss - ctl) / 42;
    atl = atl + (tss - atl) / 7;
    fitnessData.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ctl: parseFloat(ctl.toFixed(1)),
      atl: parseFloat(atl.toFixed(1)),
      tsb: parseFloat((ctl - atl).toFixed(1)),
    });
  }
  const latest = fitnessData[fitnessData.length - 1];

  // Weekly load
  const weeklyMap = {};
  uploadedWorkouts.forEach(w => {
    const d = new Date(w.date + "T12:00:00");
    const weekStart = new Date(d); weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!weeklyMap[key]) weeklyMap[key] = { week: key, km: 0, tss: 0, sessions: 0 };
    weeklyMap[key].km = parseFloat((weeklyMap[key].km + (w.distance || 0)).toFixed(1));
    weeklyMap[key].tss += (w.tss || 0);
    weeklyMap[key].sessions += 1;
  });
  const weeklyLoad = Object.values(weeklyMap).sort((a, b) => new Date(a.week) - new Date(b.week)).slice(-8);

  const distUnit = units.distance === "mi" ? "mi" : "km";

  // VO2max
  const perfVO2maxDash = calcVO2maxFromWorkouts(uploadedWorkouts);
  const resolvedVO2maxDash = (parseFloat(athlete.vo2max) || 0) > 0
    ? { value: parseFloat(athlete.vo2max) }
    : perfVO2maxDash
    ? { value: perfVO2maxDash.value }
    : { value: parseFloat((15 * (parseInt(athlete.maxHR)||192) / (parseInt(athlete.restingHR)||42)).toFixed(1)) };

  // Readiness — defaults to 50 when no data
  const readinessPct  = hasData ? Math.min(100, Math.max(0, Math.round(50 + latest.tsb * 1.5))) : 50;
  const readinessLabel =
    !hasData           ? "No Data"     :
    readinessPct >= 75 ? "Race Ready"  :
    readinessPct >= 55 ? "Good"        :
    readinessPct >= 35 ? "Moderate"    : "Recover";
  const readinessColor =
    !hasData           ? "var(--card-border)" :
    readinessPct >= 75 ? "#00d4aa"  :
    readinessPct >= 55 ? "#e8ff47"  :
    readinessPct >= 35 ? "#f97316"  : "#ef4444";

  // Last workout
  const lastWorkout = hasData
    ? [...uploadedWorkouts].sort((a,b) => new Date(b.date) - new Date(a.date))[0]
    : null;
  const daysSinceLast = lastWorkout
    ? Math.floor((today - new Date(lastWorkout.date + "T12:00:00")) / 86400000)
    : null;

  const suggestion =
    !hasData           ? "Import a workout to get your readiness score." :
    readinessPct >= 75 ? "You're primed for a hard session or race effort." :
    readinessPct >= 55 ? "A quality aerobic or tempo run is appropriate." :
    readinessPct >= 35 ? "Keep it easy — aerobic or recovery pace only." :
                         "Rest or a very easy walk. Let your body recover.";

  // This week distance
  const weekStart = new Date(today); 
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekDist = uploadedWorkouts
    .filter(w => new Date(w.date + "T00:00:00") >= weekStart)
    .reduce((s, w) => s + (w.distance || 0), 0);
  const weekDistFmt = units.distance === "mi"
    ? `${(weekDist * 0.621371).toFixed(1)} mi`
    : `${weekDist.toFixed(1)} km`;

  // Ring geometry
  const R = 80, STROKE = 10;
  const circ = 2 * Math.PI * R;
  const dash = circ * (readinessPct / 100);


  const QUOTES = [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Champions aren't made in gyms. They're made from something deep inside them.", author: "Muhammad Ali" },
    { text: "Run when you can, walk when you have to, crawl if you must. Just never give up.", author: "Dean Karnazes" },
    { text: "It never gets easier. You just get stronger.", author: "Unknown" },
    { text: "The body achieves what the mind believes.", author: "Unknown" },
    { text: "Pain is temporary. Quitting lasts forever.", author: "Lance Armstrong" },
    { text: "Every mile is two in winter.", author: "George Herbert" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "The miracle isn't that I finished. The miracle is that I had the courage to start.", author: "John Bingham" },
    { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Ryun" },
    { text: "Some seek the comfort of their therapist's office. Others head to the woods and run.", author: "Michael R. Mantell" },
    { text: "Ask yourself: Can I give more? The answer is always yes.", author: "Beau Hightower" },
    { text: "There will be days you don't think you can run a marathon. Those are the days you go.", author: "Unknown" },
    { text: "No matter how slow you go, you're still lapping everyone on the couch.", author: "Unknown" },
    { text: "Believe that you can run farther or faster. Believe that you're young enough, old enough, strong enough.", author: "Hal Higdon" },
    { text: "You have a choice. You can throw in the towel or use it to wipe the sweat off your face.", author: "Unknown" },
    { text: "First, master the fundamentals.", author: "Larry Bird" },
    { text: "Do something today that your future self will thank you for.", author: "Unknown" },
    { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
    { text: "Don't limit your challenges. Challenge your limits.", author: "Unknown" },
    { text: "Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts.", author: "Dan Gable" },
    { text: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito" },
    { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips" },
    { text: "Success is usually just around the corner from where you stopped.", author: "Unknown" },
    { text: "One run can change your day. Many runs can change your life.", author: "Unknown" },
    { text: "Make each day your masterpiece.", author: "John Wooden" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "Winning isn't everything, but wanting to win is.", author: "Vince Lombardi" },
    { text: "The harder the battle, the sweeter the victory.", author: "Les Brown" },
  ];

  const dayIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  const todayQuote = QUOTES[dayIndex];

  return (
    <div className="dash-mobile">

      {/* ── Daily quote ── */}
      <div className="dash-quote">
        <div className="dash-quote-text">"{todayQuote.text}"</div>
        <div className="dash-quote-author">— {todayQuote.author}</div>
      </div>

      {/* ── Readiness focal card ── */}
      <div className="card dash-readiness-card">
        <div className="drc-label">Today's Readiness</div>
        <div className="drc-ring-wrap">
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: "visible" }}>
            <circle cx="100" cy="100" r={R} fill="none" stroke="var(--card-border)" strokeWidth={STROKE} />
            {hasData && (
              <>
                <circle
                  cx="100" cy="100" r={R} fill="none"
                  stroke={readinessColor} strokeWidth={STROKE + 6}
                  strokeDasharray={`${dash} ${circ}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  opacity="0.15"
                  style={{ filter: "blur(4px)" }}
                />
                <circle
                  cx="100" cy="100" r={R} fill="none"
                  stroke={readinessColor} strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${circ}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
                />
              </>
            )}
            <text x="100" y="88" textAnchor="middle" fill={hasData ? "var(--text1)" : "var(--text3)"} fontSize="42" fontWeight="700" fontFamily="'Barlow Condensed',sans-serif">
              {hasData ? readinessPct : "—"}
            </text>
            <text x="100" y="108" textAnchor="middle" fill={hasData ? readinessColor : "var(--text3)"} fontSize="13" fontWeight="600" fontFamily="'Barlow Condensed',sans-serif" letterSpacing="1">
              {readinessLabel.toUpperCase()}
            </text>
          </svg>
        </div>
        <div className="drc-suggestion">{suggestion}</div>

        {/* Supporting mini-stats */}
        <div className="drc-stats">
          <div className="drc-stat">
            <div className="drc-stat-val" style={{ color: hasData ? "#38bdf8" : "var(--text3)" }}>{hasData ? latest.ctl.toFixed(0) : "—"}</div>
            <div className="drc-stat-lbl">Fitness</div>
          </div>
          <div className="drc-stat-divider" />
          <div className="drc-stat">
            <div className="drc-stat-val" style={{ color: hasData ? "#f97316" : "var(--text3)" }}>{hasData ? latest.atl.toFixed(0) : "—"}</div>
            <div className="drc-stat-lbl">Fatigue</div>
          </div>
          <div className="drc-stat-divider" />
          <div className="drc-stat">
            <div className="drc-stat-val" style={{ color: hasData ? (latest.tsb >= 0 ? "#00d4aa" : "#f97316") : "var(--text3)" }}>
              {hasData ? `${latest.tsb >= 0 ? "+" : ""}${latest.tsb.toFixed(0)}` : "—"}
            </div>
            <div className="drc-stat-lbl">Form</div>
          </div>
          <div className="drc-stat-divider" />
          <div className="drc-stat">
            {(() => {
              const hasVO2 = (parseFloat(athlete.vo2max) || 0) > 0 || perfVO2maxDash;
              return (
                <>
                  <div className="drc-stat-val" style={{ color: hasVO2 ? "var(--accent)" : "var(--text3)" }}>
                    {hasVO2
                      ? <>{resolvedVO2maxDash.value}<span style={{ fontSize: 9, color: "var(--text3)", marginLeft: 2, fontFamily: "Inter, sans-serif", fontWeight: 400 }}>ml/kg</span></>
                      : "—"}
                  </div>
                  <div className="drc-stat-lbl">VO2max</div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="dash-quick-row">
        <div className="dash-quick-card">
          <Icon name="trend" size={14} color={hasData ? "var(--accent)" : "var(--text3)"} />
          <div className="dqc-val" style={{ color: hasData ? "var(--text1)" : "var(--text3)" }}>{hasData ? weekDistFmt : "—"}</div>
          <div className="dqc-lbl">This week</div>
        </div>
        <div className="dash-quick-card">
          <Icon name="run" size={14} color={hasData ? "#38bdf8" : "var(--text3)"} />
          <div className="dqc-val" style={{ color: hasData ? "var(--text1)" : "var(--text3)" }}>{uploadedWorkouts.length || "—"}</div>
          <div className="dqc-lbl">Activities</div>
        </div>
        <div className="dash-quick-card">
          <Icon name="clock" size={14} color={hasData ? "#f97316" : "var(--text3)"} />
          <div className="dqc-val" style={{ color: hasData ? "var(--text1)" : "var(--text3)" }}>{daysSinceLast !== null ? `${daysSinceLast}d` : "—"}</div>
          <div className="dqc-lbl">Since last run</div>
        </div>
      </div>

      {/* ── Last workout ── */}
      <div className="card dash-last-workout">
        <div className="dlw-header">
          <span className="dlw-label">Last Activity</span>
          {lastWorkout && <span className="dlw-date">{new Date(lastWorkout.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>}
        </div>
        {lastWorkout ? (
          <>
            <div className="dlw-name">{lastWorkout.name}</div>
            <div className="dlw-stats">
              <span>{fmtDist(lastWorkout.distance, units)}</span>
              <span className="dlw-dot">·</span>
              <span>{fmtDuration(lastWorkout.duration)}</span>
              <span className="dlw-dot">·</span>
              <span>{fmtPaceWithUnit(lastWorkout.avgPace, units).pace}{fmtPaceWithUnit(lastWorkout.avgPace, units).unit}</span>
            </div>
          </>
        ) : (
          <div className="dlw-empty">Import a workout to see your last activity here</div>
        )}
      </div>

      {/* ── Fitness trend chart ── always shown, empty state if no data ── */}
      <div className="card full-width chart-card">
        <h3>Fitness Trend</h3>
        <p className="card-sub">Fitness · Fatigue · Form — 90 days</p>
        {hasData ? (
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={fitnessData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} interval={20} />
              <YAxis tick={{ fill: "var(--text3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ctl" fill="rgba(232,255,71,.08)" stroke="#e8ff47" strokeWidth={2} name="Fitness" dot={false} />
              <Area type="monotone" dataKey="atl" fill="rgba(249,115,22,.08)" stroke="#f97316" strokeWidth={1.5} name="Fatigue" dot={false} />
              <Line type="monotone" dataKey="tsb" stroke="#38bdf8" strokeWidth={1.5} name="Form" dot={false} strokeDasharray="4 3" />
              <ReferenceLine y={0} stroke="var(--card-border)" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="dash-chart-empty">
            <div className="dash-chart-empty-bars">
              {[30,50,40,65,45,70,55].map((h, i) => (
                <div key={i} className="dash-chart-empty-bar" style={{ height: h }} />
              ))}
            </div>
            <div className="dash-chart-empty-label">Import workouts to see your fitness trend</div>
          </div>
        )}
      </div>

    </div>
  );
};


// ─── GPX / CSV PARSERS ────────────────────────────────────────────────────────

// ─── SHARED COACH NOTE GENERATOR ─────────────────────────────────────────────
const generateCoachNotes = ({ totalKm, totalMi, durationMin, avgPace, avgHR, maxHR, hasHR, elevGain, tss, hrZones, avgPower }) => {
  const zoneNames = ["Z1 Recovery", "Z2 Aerobic", "Z3 Tempo", "Z4 Threshold", "Z5 VO2max"];
  const dominantZone = hrZones ? hrZones.indexOf(Math.max(...hrZones)) : 1;
  const aerobicPct = hrZones ? hrZones[0] + hrZones[1] : 0;
  const highIntensityPct = hrZones ? hrZones[3] + hrZones[4] : 0;
  const paceMin = Math.floor(avgPace / 60);
  const paceSec = String(avgPace % 60).padStart(2, "0");
  const notes = [];

  notes.push({
    category: "pacing",
    title: "Pace & Distance Summary",
    body: `Covered ${totalKm.toFixed(2)} km (${(totalMi ?? totalKm * 0.621371).toFixed(2)} mi) in ${Math.floor(durationMin / 60)}h ${Math.round(durationMin % 60)}m at an average of ${paceMin}:${paceSec}/mi. ${avgPace < 420 ? "High-intensity output — prioritise 48h recovery before your next quality session." : avgPace < 510 ? "Solid aerobic pace — good marathon-specific stimulus." : "Easy aerobic pace — ideal for recovery and fat oxidation."}`
  });

  if (hasHR && hrZones) {
    notes.push({
      category: "cardiac",
      title: "Heart Rate Zone Profile",
      body: `Dominant zone was ${zoneNames[dominantZone]} at ${hrZones[dominantZone]}% of the session. ${aerobicPct > 60 ? `${aerobicPct}% aerobic time — excellent base-building stimulus.` : highIntensityPct > 30 ? `${highIntensityPct}% in Z4–Z5 — significant lactate demand. Ensure 48h recovery before next hard effort.` : "Balanced zone distribution — a well-structured mixed effort."}${avgHR && maxHR ? ` Working intensity: ${Math.round(avgHR / maxHR * 100)}% of max HR (${avgHR}/${maxHR} bpm).` : ""}`
    });
  }

  if (elevGain > 150) {
    notes.push({
      category: "performance",
      title: "Elevation & Muscular Load",
      body: `${elevGain} ft of gain adds meaningful muscular demand beyond what flat pace captures. Your true effort is higher than raw pace suggests. Expect elevated DOMS in glutes and calves 24–36 hours post-run if this exceeds your typical climbing volume. Grade-adjusted pace accounts for the additional intensity on climbs.`
    });
  }

  if (avgPower) {
    notes.push({
      category: "power",
      title: "Running Power",
      body: `Average running power of ${avgPower}W recorded. Power responds instantly to terrain — unlike HR or pace — making it the most reliable real-time intensity metric on varied courses. Track this across similar efforts to identify neuromuscular fatigue trends before they show up as pace decline.`
    });
  }

  notes.push({
    category: "recovery",
    title: "Recovery Recommendation",
    body: `Session TSS of ${tss} is a ${tss < 50 ? "low" : tss < 100 ? "moderate" : "high"} training stress. ${tss < 50 ? "Full recovery expected within 12–18h." : tss < 100 ? "Allow 24–36h before your next quality session." : "Allow 48h+ before the next hard effort. Prioritise sleep and 20–30g protein within 45 minutes of finishing."}`
  });

  return notes;
};

// ─── WORKOUT CLASSIFIER ──────────────────────────────────────────────────────
// Returns { label, color, icon } based on HR zones, pace, and duration
const classifyWorkout = ({ hrZones, avgPace, durationMin, avgHR, maxHR }) => {
  const z1z2 = hrZones ? hrZones[0] + hrZones[1] : 0;
  const z4z5 = hrZones ? hrZones[3] + hrZones[4] : 0;
  const z3   = hrZones ? hrZones[2] : 0;

  // Compute pace variability from a coarse check — high z4/z5 with short duration = intervals
  if (z4z5 >= 35 && durationMin < 70)
    return { label: "Interval", color: "#ef4444", icon: "power" };
  if (z4z5 >= 20 && z3 >= 20)
    return { label: "Tempo",    color: "#f97316", icon: "fire" };
  if (z4z5 >= 25 && durationMin >= 70)
    return { label: "Race",     color: "#a78bfa", icon: "flag" };
  if (durationMin >= 90 && z1z2 >= 40)
    return { label: "Long Run", color: "#38bdf8", icon: "run" };
  if (z1z2 >= 70)
    return { label: "Easy Run", color: "#34d399", icon: "easy" };
  if (z1z2 >= 55 && durationMin < 50)
    return { label: "Recovery", color: "#34d399", icon: "clock" };
  return { label: "Aerobic",   color: "var(--accent)", icon: "easy" };
};

// ─── LAP GENERATOR FROM STREAM ───────────────────────────────────────────────
// Builds km (or mile) splits from a stream when no lap records exist
const generateLapsFromStream = (stream, splitDistKm = 1.0) => {
  if (!stream || stream.length < 2) return [];
  const laps = [];
  let lapStart = 0;
  let lapStartDist = stream[0]?.distance ?? 0;
  let lapNum = 1;
  let hrSum = 0, hrCount = 0, cadSum = 0, cadCount = 0;

  for (let i = 1; i < stream.length; i++) {
    const p = stream[i];
    if (p.hr) { hrSum += p.hr; hrCount++; }
    if (p.cadence && p.cadence > 60 && p.cadence < 240) { cadSum += p.cadence; cadCount++; }
    const distSoFar = (p.distance ?? 0) - lapStartDist;
    if (distSoFar >= splitDistKm || i === stream.length - 1) {
      const startPt = stream[lapStart];
      const durationSec = ((p.time ?? 0) - (startPt.time ?? 0)) * 60;
      const distKm = parseFloat(distSoFar.toFixed(3));
      const distMi = distKm * 0.621371;
      const paceSec = distMi > 0.05 && durationSec > 0
        ? Math.round((durationSec / 60) / distMi * 60)
        : null;
      laps.push({
        lap:         lapNum++,
        durationSec: Math.round(durationSec),
        distKm,
        avgHR:       hrCount > 0 ? Math.round(hrSum / hrCount) : null,
        avgCadence:  cadCount > 0 ? Math.round(cadSum / cadCount) : null,
        paceSec:     paceSec && paceSec > 200 && paceSec < 1200 ? paceSec : null,
      });
      lapStart = i;
      lapStartDist = p.distance ?? 0;
      hrSum = 0; hrCount = 0; cadSum = 0; cadCount = 0;
    }
  }
  return laps;
};


// Implements just enough of the FIT protocol to extract activity records:
// header → definition messages → data messages → record fields (HR, speed,
// distance, altitude, cadence, power, timestamp, position).

const parseFIT = async (arrayBuffer, fileName = "", athleteMaxHR = 190, customZones = null, athleteRestingHR = 50) => {
  const bytes = new Uint8Array(arrayBuffer);
  const view  = new DataView(arrayBuffer);

  // ── FIT file header ──────────────────────────────────────────────────────
  const headerSize = bytes[0];
  if (headerSize < 12) throw new Error("Not a valid FIT file (header too small).");
  const magic = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
  if (magic !== ".FIT") throw new Error("Not a valid FIT file (missing .FIT signature).");

  // ── FIT global message numbers we care about ─────────────────────────────
  const MESG_FILE_ID   = 0;
  const MESG_ACTIVITY  = 34;
  const MESG_SESSION   = 18;
  const MESG_RECORD    = 20;   // per-second data points
  const MESG_EVENT     = 21;
  const MESG_LAP       = 19;

  // ── FIT base type sizes ──────────────────────────────────────────────────
  const BASE_TYPE_SIZE = {
    0x00: 1, 0x01: 1, 0x02: 1, 0x83: 2, 0x84: 2,
    0x85: 4, 0x86: 4, 0x88: 4, 0x89: 8, 0x8A: 1,
    0x07: 1, 0x0A: 1, 0x8B: 2, 0x8C: 2,
  };
  const getSize = (t) => BASE_TYPE_SIZE[t] ?? 1;

  // ── Definition message registry: localMsgNum → {globalMsgNum, fields} ───
  const defs = {};

  // ── Output accumulator ───────────────────────────────────────────────────
  const records   = [];   // MESG_RECORD rows
  const lapRecords = [];  // MESG_LAP rows
  let sessionMeta = {};   // from MESG_SESSION
  let deviceInfo  = null; // from MESG_FILE_ID
  // Derive a readable name from the file name (strip extension, replace underscores/hyphens)
  let activityName = fileName
    ? fileName.replace(/\.fit$/i, "").replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim()
    : "FIT Activity";

  // ── Walk the byte stream ─────────────────────────────────────────────────
  let pos = headerSize;
  const dataEnd = view.getUint32(4, true) + headerSize; // excludes CRC

  while (pos < dataEnd - 1) {
    const recordHeader = bytes[pos++];
    const isCompressedTimestamp = (recordHeader & 0x80) !== 0;

    if (isCompressedTimestamp) {
      // Compressed timestamp message — use existing definition
      const localNum = (recordHeader >> 5) & 0x03;
      const def = defs[localNum];
      if (!def) { pos--; break; }
      // Skip field data (we don't parse compressed-timestamp records fully)
      let skip = 0;
      def.fields.forEach(f => skip += f.size);
      pos += skip;
      continue;
    }

    const isDefinition = (recordHeader & 0x40) !== 0;
    const localMsgNum  = recordHeader & 0x0F;

    if (isDefinition) {
      // ── Definition message ──────────────────────────────────────────────
      const hasDeveloperData = (recordHeader & 0x20) !== 0;
      pos++;                                   // reserved
      const arch         = bytes[pos++];        // 0=little, 1=big
      const littleEndian = arch === 0;
      const globalMsgNum = littleEndian
        ? view.getUint16(pos, true)
        : view.getUint16(pos, false);
      pos += 2;
      const numFields = bytes[pos++];
      const fields = [];
      for (let i = 0; i < numFields; i++) {
        const fieldDef  = bytes[pos++];
        const fieldSize = bytes[pos++];
        const baseType  = bytes[pos++];
        fields.push({ fieldDef, size: fieldSize, baseType, littleEndian });
      }
      if (hasDeveloperData) {
        const numDevFields = bytes[pos++];
        for (let i = 0; i < numDevFields; i++) {
          const fieldNum  = bytes[pos++]; // field number
          const fieldSize = bytes[pos++];
          const devIdx    = bytes[pos++]; // developer data index
          fields.push({ fieldDef: -1, size: fieldSize, baseType: 0x07, littleEndian: true, dev: true });
        }
      }
      defs[localMsgNum] = { globalMsgNum, fields, littleEndian };

    } else {
      // ── Data message ────────────────────────────────────────────────────
      const def = defs[localMsgNum];
      if (!def) { pos++; continue; }

      const row = {};
      def.fields.forEach(f => {
        if (f.dev) { pos += f.size; return; }
        const le = def.littleEndian;
        let val;
        try {
          switch (f.size) {
            case 1: val = view.getUint8(pos); break;
            case 2: val = le ? view.getUint16(pos, true) : view.getUint16(pos, false); break;
            case 4: val = le ? view.getUint32(pos, true) : view.getUint32(pos, false); break;
            default: val = view.getUint8(pos); break;
          }
        } catch { val = 0; }
        row[f.fieldDef] = val;
        pos += f.size;
      });

      // FIT epoch offset: seconds since Dec 31 1989
      const FIT_EPOCH_MS = 631065600000;

      if (def.globalMsgNum === MESG_RECORD) {
        // Field definitions for MESG_RECORD:
        // 0=position_lat, 1=position_long, 2=altitude, 3=heart_rate,
        // 4=cadence, 5=distance, 6=speed, 7=power, 8=compressed_speed_distance,
        // 9=grade, 13=temperature, 253=timestamp
        const ts        = row[253] != null ? new Date(row[253] * 1000 + FIT_EPOCH_MS) : null;
        const hr        = row[3]   != null && row[3]   < 255  ? row[3]   : null;
        const cad       = row[4]   != null && row[4]   < 255  ? row[4] * 2 : null; // one-sided→full
        const power     = row[7]   != null && row[7]   < 65535 ? row[7]  : null;
        const distM     = row[5]   != null && row[5]   < 0xFFFFFFFF ? row[5] / 100 : null;  // cm→m
        const altM      = row[2]   != null && row[2]   < 0xFFFF ? (row[2] / 5) - 500 : null; // see FIT SDK
        const speedMs   = row[6]   != null && row[6]   < 0xFFFF ? row[6] / 1000 : null;      // mm/s→m/s
        const lat       = row[0]   != null && row[0]   !== 0x7FFFFFFF ? row[0] / 11930465 : null;
        const lon       = row[1]   != null && row[1]   !== 0x7FFFFFFF ? row[1] / 11930465 : null;

        // pace in sec/mile from speed
        let pace = null;
        if (speedMs && speedMs > 0.5) {
          const miPerSec = speedMs * 0.000621371;
          pace = Math.round(1 / miPerSec);
        }

        records.push({ ts, hr, cad, power, distM, altFt: altM != null ? altM * 3.28084 : null, pace, lat, lon });

      } else if (def.globalMsgNum === MESG_FILE_ID) {
        // Fields: 1=manufacturer, 2=product/garmin_product, 4=serial_number
        // FIT Manufacturer IDs (partial): 1=Garmin, 32=Wahoo, 104=Coros, 70=Polar, 23=Suunto
        const mfgId  = row[1];
        const prodId = row[2];
        const MFG = { 1: "Garmin", 32: "Wahoo", 104: "COROS", 70: "Polar", 23: "Suunto", 255: "Unknown" };
        // Garmin product IDs (partial common ones)
        const GARMIN_PROD = {
          2697: "Forerunner 245", 2988: "Forerunner 255", 3066: "Forerunner 265",
          2544: "Forerunner 945", 3110: "Forerunner 955", 3558: "Forerunner 165",
          2888: "Fenix 6", 3290: "Fenix 7", 3887: "Fenix 8",
          3110: "Epix Gen 2", 4005: "Forerunner 165",
          2900: "Instinct 2",   2348: "Vivoactive 4",
        };
        const mfgName  = MFG[mfgId] ?? `Device (${mfgId})`;
        const prodName = mfgId === 1 && GARMIN_PROD[prodId] ? GARMIN_PROD[prodId] : null;
        deviceInfo = prodName ? `${mfgName} ${prodName}` : mfgName;
      } else if (def.globalMsgNum === MESG_SESSION) {
        // Fields: 2=start_time, 7=total_elapsed_time, 9=total_distance,
        // 14=avg_speed, 15=max_speed, 16=avg_power, 17=max_power,
        // 18=total_ascent, 19=total_descent, 253=timestamp
        sessionMeta = {
          totalDistM:  row[9]  != null && row[9]  < 0xFFFFFFFF ? row[9] / 100 : null,
          durationSec: row[7]  != null ? row[7] / 1000 : null,
          avgSpeedMs:  row[14] != null && row[14] < 0xFFFF ? row[14] / 1000 : null,
          totalAscent: row[18] != null && row[18] < 0xFFFF ? row[18] : null,
          startTime:   row[2]  != null ? new Date(row[2] * 1000 + FIT_EPOCH_MS) : null,
        };
      } else if (def.globalMsgNum === MESG_LAP) {
        // LAP fields: 7=total_elapsed_time(/1000→s), 9=total_distance(/100→m),
        // 15=avg_heart_rate, 16=max_heart_rate, 13=avg_speed(/1000→m/s),
        // 5=avg_cadence (full cadence already doubled by device), 253=timestamp
        const lapDurationSec = row[7]  != null && row[7]  < 0xFFFFFFFF ? row[7] / 1000  : null;
        const lapDistM       = row[9]  != null && row[9]  < 0xFFFFFFFF ? row[9] / 100   : null;
        const lapAvgHR       = row[15] != null && row[15] < 255         ? row[15]        : null;
        const lapMaxHR       = row[16] != null && row[16] < 255         ? row[16]        : null;
        const lapAvgSpeedMs  = row[13] != null && row[13] < 0xFFFF      ? row[13] / 1000 : null;
        const lapAvgCadence  = row[5]  != null && row[5]  < 255         ? row[5] * 2     : null; // one-sided→full
        if (lapDurationSec != null && lapDurationSec > 5) {
          const lapDistKm = lapDistM != null ? lapDistM / 1000 : null;
          let lapPaceSec = null;
          if (lapAvgSpeedMs && lapAvgSpeedMs > 0.3) {
            lapPaceSec = Math.round(1 / (lapAvgSpeedMs * 0.000621371));
          } else if (lapDistKm && lapDistKm > 0.05 && lapDurationSec > 0) {
            const lapMi = lapDistKm * 0.621371;
            lapPaceSec = Math.round((lapDurationSec / 60) / lapMi * 60);
          }
          lapRecords.push({
            durationSec:  Math.round(lapDurationSec),
            distKm:       lapDistKm != null ? parseFloat(lapDistKm.toFixed(3)) : null,
            avgHR:        lapAvgHR,
            maxHR:        lapMaxHR,
            avgCadence:   lapAvgCadence && lapAvgCadence > 60 && lapAvgCadence < 240 ? lapAvgCadence : null,
            paceSec:      lapPaceSec && lapPaceSec > 200 && lapPaceSec < 1200 ? lapPaceSec : null,
          });
        }
      }
    }
  }

  if (records.length === 0) throw new Error("No activity records found in FIT file. The file may be a device config or course file rather than an activity.");

  // ── Build stream ─────────────────────────────────────────────────────────
  const startTs = records.find(r => r.ts)?.ts ?? null;
  let cumulativeKm = 0;

  const toRad = d => d * Math.PI / 180;
  const haversine = (a, b) => {
    if (!a.lat || !b.lat) return 0;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  };

  const stream = records.map((r, i) => {
    const elapsedMin = startTs && r.ts ? (r.ts - startTs) / 60000 : i / 60;

    // prefer FIT-computed cumulative distance, fall back to haversine
    if (r.distM != null) {
      cumulativeKm = r.distM / 1000;
    } else if (i > 0) {
      cumulativeKm += haversine(records[i-1], r);
    }

    return {
      time:      Math.round(elapsedMin),
      distance:  parseFloat(cumulativeKm.toFixed(3)),
      elevation: r.altFt ?? 100,
      hr:        r.hr,
      cadence:   r.cad,
      pace:      r.pace ? Math.min(Math.max(r.pace, 240), 900) : null,
      power:     r.power,
      lat:       r.lat,
      lon:       r.lon,
    };
  });

  // Downsample to ≤300 points
  const step = Math.max(1, Math.floor(stream.length / 300));
  const sampledStream = stream.filter((_, i) => i % step === 0);

  // ── Aggregate stats ──────────────────────────────────────────────────────
  const totalKm   = sessionMeta.totalDistM != null
    ? sessionMeta.totalDistM / 1000
    : cumulativeKm;
  const durationMin = sessionMeta.durationSec != null
    ? sessionMeta.durationSec / 60
    : (stream[stream.length - 1]?.time ?? 40);

  const hasHR    = stream.some(r => r.hr != null);
  const hrValues = stream.filter(r => r.hr != null && r.hr > 0).map(r => r.hr);
  const avgHR    = hrValues.length ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length) : null;
  const maxHR    = hrValues.length ? Math.max(...hrValues) : null;

  const hasPower    = stream.some(r => r.power != null);
  const powerValues = stream.filter(r => r.power != null && r.power > 0).map(r => r.power);
  const avgPower    = powerValues.length ? Math.round(powerValues.reduce((a, b) => a + b, 0) / powerValues.length) : 0;

  // Avg pace: derive from session totals (most accurate) → session avg speed → point average
  let avgPace;
  if (totalKm > 0 && durationMin > 0) {
    // Most reliable: total moving distance / total moving time
    const totalMi = totalKm * 0.621371;
    avgPace = Math.round((durationMin / totalMi) * 60);
  } else if (sessionMeta.avgSpeedMs && sessionMeta.avgSpeedMs > 0) {
    const miPerSec = sessionMeta.avgSpeedMs * 0.000621371;
    avgPace = Math.round(1 / miPerSec);
  } else {
    const validPaces = stream.filter(r => r.pace && r.pace > 250 && r.pace < 800);
    avgPace = validPaces.length
      ? Math.round(validPaces.reduce((s, r) => s + r.pace, 0) / validPaces.length)
      : 480;
  }
  // Sanity clamp: 4:00/mi – 20:00/mi
  avgPace = Math.min(Math.max(avgPace, 240), 1200);

  const elevArr  = stream.map(r => r.elevation).filter(Boolean);
  const elevGain = sessionMeta.totalAscent != null
    ? Math.round(sessionMeta.totalAscent * 3.28084)  // m→ft
    : elevArr.length > 1
      ? Math.round(elevArr.reduce((sum, e, i) => i > 0 && e > elevArr[i-1] ? sum + (e - elevArr[i-1]) : sum, 0))
      : 0;

  const date = (sessionMeta.startTime ?? startTs ?? new Date()).toISOString().split("T")[0];

  // HR zone distribution using athlete's actual zone boundaries
  const hrZones = [0, 0, 0, 0, 0];
  if (hasHR) {
    const bounds = customZones ?? (() => {
      const hrr = Math.max(athleteMaxHR - athleteRestingHR, 1);
      return [0.60, 0.70, 0.80, 0.90].map(p => Math.round(athleteRestingHR + hrr * p));
    })();
    hrValues.forEach(h => {
      if      (h <= bounds[0]) hrZones[0]++;
      else if (h <= bounds[1]) hrZones[1]++;
      else if (h <= bounds[2]) hrZones[2]++;
      else if (h <= bounds[3]) hrZones[3]++;
      else                     hrZones[4]++;
    });
    const total = hrZones.reduce((a, b) => a + b, 0) || 1;
    hrZones.forEach((_, i) => hrZones[i] = Math.round(hrZones[i] / total * 100));
    const diff = 100 - hrZones.reduce((a, b) => a + b, 0);
    hrZones[hrZones.indexOf(Math.max(...hrZones))] += diff;
  } else {
    hrZones[0] = 10; hrZones[1] = 30; hrZones[2] = 35; hrZones[3] = 20; hrZones[4] = 5;
  }

  const tss = Math.round((durationMin / 60) * 65);
  const workoutType = classifyWorkout({ hrZones, avgPace, durationMin, avgHR, maxHR });

  // Use real lap records from FIT; fall back to 1km stream splits
  const laps = lapRecords.length > 0
    ? lapRecords.map((l, i) => ({ lap: i + 1, ...l }))
    : generateLapsFromStream(sampledStream, 1.0);

  // Generate rich coach insights from the parsed data
  const dominantZone = hrZones.indexOf(Math.max(...hrZones));
  const coachNotes = generateCoachNotes({ totalKm, totalMi: totalKm * 0.621371, durationMin, avgPace, avgHR, maxHR, hasHR, elevGain, tss, hrZones, avgPower: hasPower ? avgPower : null });

  // Extract GPS track (subsample to max 500 points for map rendering)
  const gpsPoints = sampledStream.filter(p => p.lat != null && p.lon != null);
  const gpsTrack  = gpsPoints.length > 0 ? gpsPoints.map(p => [p.lat, p.lon]) : null;

  return {
    id:          Date.now(),
    name:        activityName || "FIT Activity",
    date,
    type:        "Run",
    workoutType,
    laps,
    device:      deviceInfo,
    duration:    Math.round(durationMin),
    distance:    parseFloat(totalKm.toFixed(2)),
    tss,
    avgHR:       avgHR ?? 145,
    maxHR:       maxHR ?? 170,
    avgPace,
    normPace:    Math.round(avgPace * 0.97),
    avgPower,
    normPower:   hasPower ? Math.round(avgPower * 1.04) : 0,
    elevGain,
    calories:    Math.round(durationMin * 10),
    hrZones,
    quality:     Math.min(99, Math.round(60 + Math.random() * 30)),
    coachNotes,
    stream:      sampledStream,
    gpsTrack,
    source:      "fit",
  };
};

const parseGPX = (xmlText, athleteMaxHR = 190, customZones = null, athleteRestingHR = 50) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const trkpts = Array.from(doc.querySelectorAll("trkpt"));
  if (trkpts.length === 0) throw new Error("No track points found in GPX file.");

  const nameEl = doc.querySelector("name");
  const name = nameEl ? nameEl.textContent.trim() : "Uploaded Run";

  // Build stream from trackpoints
  const rawStream = trkpts.map((pt) => {
    const lat = parseFloat(pt.getAttribute("lat"));
    const lon = parseFloat(pt.getAttribute("lon"));
    const eleEl = pt.querySelector("ele");
    const timeEl = pt.querySelector("time");
    const hrEl = pt.querySelector("hr, HeartRateBpm value, gpxtpx\\:hr, ns3\\:hr");
    const cadEl = pt.querySelector("cad, gpxtpx\\:cad, ns3\\:cad");
    return {
      lat, lon,
      ele: eleEl ? parseFloat(eleEl.textContent) * 3.28084 : null, // m→ft
      time: timeEl ? new Date(timeEl.textContent) : null,
      hr: hrEl ? parseInt(hrEl.textContent) : null,
      cad: cadEl ? parseInt(cadEl.textContent) * 2 : null, // Garmin stores one-sided cadence
    };
  }).filter(p => p.lat && p.lon);

  if (rawStream.length < 2) throw new Error("Not enough track points.");

  // Compute distance between consecutive points using Haversine
  const toRad = d => d * Math.PI / 180;
  const haversine = (a, b) => {
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  };

  let cumulativeKm = 0;
  const startTime = rawStream[0].time;

  const stream = rawStream.map((pt, i) => {
    if (i > 0) cumulativeKm += haversine(rawStream[i-1], pt);
    const elapsedMin = (startTime && pt.time) ? (pt.time - startTime) / 60000 : i * 0.1;
    // Pace in sec/mile from instantaneous speed
    let pace = 480; // default 8:00/mi
    if (i > 0 && rawStream[i-1].time && pt.time) {
      const dtMin = (pt.time - rawStream[i-1].time) / 60000;
      const dKm = haversine(rawStream[i-1], pt);
      if (dKm > 0 && dtMin > 0) {
        const kmPerMin = dKm / dtMin;
        const miPerMin = kmPerMin * 0.621371;
        pace = Math.round(1 / miPerMin * 60);
      }
    }
    return {
      time: Math.round(elapsedMin),
      distance: parseFloat(cumulativeKm.toFixed(3)),
      elevation: pt.ele ?? 100,
      hr: pt.hr ?? null,
      cadence: pt.cad ?? null,
      pace: Math.min(Math.max(pace, 240), 900), // clamp 4:00–15:00/mi
      power: null,
      lat: pt.lat,
      lon: pt.lon,
    };
  });

  // Downsample to ~200 points max for performance
  const step = Math.max(1, Math.floor(stream.length / 200));
  const sampledStream = stream.filter((_, i) => i % step === 0);

  const totalKm = cumulativeKm;
  const totalMi = totalKm * 0.621371;
  const durationMin = startTime && rawStream[rawStream.length-1].time
    ? (rawStream[rawStream.length-1].time - startTime) / 60000
    : stream[stream.length-1].time;

  const hasHR = stream.some(p => p.hr != null && p.hr > 0);
  const hrPts = stream.filter(p => p.hr != null && p.hr > 0);
  const avgHR = hrPts.length ? Math.round(hrPts.reduce((s,p)=>s+p.hr,0)/hrPts.length) : null;
  const maxHR = hrPts.length ? Math.max(...hrPts.map(p=>p.hr)) : null;

  const validPaces = stream.filter(p => p.pace > 250 && p.pace < 800);
  // Derive from ground-truth totals; fall back to point average only if totals missing
  const avgPace = totalKm > 0 && durationMin > 0
    ? Math.min(Math.max(Math.round((durationMin / totalMi) * 60), 240), 1200)
    : validPaces.length ? Math.round(validPaces.reduce((s,p)=>s+p.pace,0)/validPaces.length) : 480;

  const elevArr = stream.map(p=>p.elevation).filter(Boolean);
  const elevGain = elevArr.length > 1
    ? Math.round(elevArr.reduce((sum,e,i) => i > 0 && e > elevArr[i-1] ? sum + (e - elevArr[i-1]) : sum, 0))
    : 0;

  const tss = Math.round((durationMin / 60) * 65); // rough aerobic TSS estimate

  const date = startTime ? startTime.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

  // HR zone distribution using athlete's actual zone boundaries
  const hrZones = [0,0,0,0,0];
  if (hasHR) {
    const bounds = customZones ?? (() => {
      const hrr = Math.max(athleteMaxHR - athleteRestingHR, 1);
      return [0.60, 0.70, 0.80, 0.90].map(p => Math.round(athleteRestingHR + hrr * p));
    })();
    stream.filter(p=>p.hr).forEach(p => {
      if      (p.hr <= bounds[0]) hrZones[0]++;
      else if (p.hr <= bounds[1]) hrZones[1]++;
      else if (p.hr <= bounds[2]) hrZones[2]++;
      else if (p.hr <= bounds[3]) hrZones[3]++;
      else                        hrZones[4]++;
    });
    const total = hrZones.reduce((a,b)=>a+b,0);
    hrZones.forEach((_, i) => hrZones[i] = Math.round(hrZones[i]/total*100));
    // ensure sum = 100
    const diff = 100 - hrZones.reduce((a,b)=>a+b,0);
    hrZones[hrZones.indexOf(Math.max(...hrZones))] += diff;
  } else {
    hrZones[0]=10; hrZones[1]=30; hrZones[2]=35; hrZones[3]=20; hrZones[4]=5;
  }

  // Extract device from GPX creator attribute
  const gpxEl = doc.querySelector("gpx");
  const creator = gpxEl ? gpxEl.getAttribute("creator") || "" : "";
  let gpxDevice = null;
  if (creator) {
    if (/garmin/i.test(creator))      gpxDevice = creator.replace(/garmin\s*/i, "Garmin ").trim();
    else if (/strava/i.test(creator)) gpxDevice = "Strava Export";
    else if (/wahoo/i.test(creator))  gpxDevice = "Wahoo";
    else if (/coros/i.test(creator))  gpxDevice = "COROS";
    else if (/polar/i.test(creator))  gpxDevice = "Polar";
    else if (/suunto/i.test(creator)) gpxDevice = "Suunto";
    else gpxDevice = creator.slice(0, 40);
  }

  // GPS track for map rendering
  const gpsPoints = sampledStream.filter(p => p.lat != null && p.lon != null);
  const gpsTrack  = gpsPoints.length > 0 ? gpsPoints.map(p => [p.lat, p.lon]) : null;

  return {
    id: Date.now(),
    name,
    date,
    type: "Run",
    device: gpxDevice,
    workoutType: classifyWorkout({ hrZones, avgPace, durationMin, avgHR, maxHR }),
    laps: generateLapsFromStream(sampledStream, 1.0),
    duration: Math.round(durationMin),
    distance: parseFloat(totalKm.toFixed(2)),
    tss,
    avgHR: avgHR ?? 145,
    maxHR: maxHR ?? 170,
    avgPace,
    normPace: Math.round(avgPace * 0.97),
    avgPower: 0,
    normPower: 0,
    elevGain,
    calories: Math.round(durationMin * 10),
    hrZones,
    quality: Math.min(99, Math.round(60 + Math.random() * 30)),
    coachNotes: generateCoachNotes({ totalKm, totalMi, durationMin, avgPace, avgHR, maxHR, hasHR, elevGain, tss, hrZones }),
    stream: sampledStream,
    gpsTrack,
    source: "gpx",
  };
};

const parseCSV = (text) => {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g,"_"));

  const col = (row, ...names) => {
    for (const n of names) {
      const idx = headers.indexOf(n);
      if (idx >= 0 && row[idx] !== undefined && row[idx].trim() !== "") return row[idx].trim();
    }
    return null;
  };

  const rows = lines.slice(1).map(l => l.split(","));

  // Single-row summary CSV (one row = one workout, like a Strava export summary)
  if (rows.length === 1) {
    const r = rows[0];
    const distKm = parseFloat(col(r,"distance","distance__km_","dist_km","kilometers") ?? col(r,"distance__mi_","miles","dist_mi") ?? 0);
    const isMi = headers.some(h=>h.includes("mi")&&!h.includes("min")) && !headers.some(h=>h.includes("km"));
    const km = isMi ? distKm * 1.60934 : distKm;
    const durationMin = parseFloat(col(r,"moving_time","elapsed_time","duration","time_minutes","duration_min") ?? 0) / 60 || parseFloat(col(r,"duration_min","time_min") ?? 40);
    const date = col(r,"date","activity_date","start_date") ?? new Date().toISOString().split("T")[0];
    const name = col(r,"name","activity_name","title") ?? "Uploaded Run";
    const avgHR = parseInt(col(r,"average_heartrate","avg_hr","heart_rate") ?? 0) || 145;
    const elevGain = parseInt(col(r,"elevation_gain","elev_gain","total_elevation_gain") ?? 0) || 0;
    const avgPace = km > 0 && durationMin > 0 ? Math.round((durationMin / (km * 0.621371)) * 60) : 480;

    const stream = [];
    for (let i = 0; i <= Math.round(durationMin); i++) {
      const t = i / Math.max(durationMin, 1);
      stream.push({
        time: i,
        distance: parseFloat((i * km / durationMin).toFixed(3)),
        elevation: Math.round(100 + Math.sin(t * Math.PI * 4) * elevGain * 0.3),
        hr: Math.round(avgHR + t * 10),
        pace: Math.round(avgPace * (1 + t * 0.05)),
        power: null,
        cadence: null,
      });
    }

    const csvHrZones = [10,25,35,22,8];
    const csvTss = Math.round(durationMin / 60 * 65);
    return [{
      id: Date.now(),
      name: name.replace(/^"/, "").replace(/"$/, ""),
      date: date.replace(/^"/, "").replace(/"$/, "").split("T")[0],
      type: "Run",
      workoutType: classifyWorkout({ hrZones: csvHrZones, avgPace, durationMin, avgHR, maxHR: avgHR + 15 }),
      laps: generateLapsFromStream(stream, 1.0),
      duration: Math.round(durationMin),
      distance: parseFloat(km.toFixed(2)),
      tss: csvTss,
      avgHR,
      maxHR: avgHR + 15,
      avgPace,
      normPace: Math.round(avgPace * 0.97),
      avgPower: 0, normPower: 0,
      elevGain,
      calories: Math.round(durationMin * 10),
      hrZones: csvHrZones,
      quality: Math.round(65 + Math.random() * 25),
      coachNotes: generateCoachNotes({ totalKm: km, totalMi: km * 0.621371, durationMin, avgPace, avgHR, maxHR: avgHR + 15, hasHR: true, elevGain, tss: csvTss, hrZones: csvHrZones }),
      stream,
      source: "csv",
    }];
  }

  // Multi-row stream CSV (one row = one data point)
  const stream = rows.map((r, i) => {
    const timeRaw = col(r,"time","elapsed_time","seconds","time_s");
    const timeSec = timeRaw ? parseFloat(timeRaw) : i * 5;
    const hrRaw = col(r,"heart_rate","hr","heartrate");
    const paceRaw = col(r,"pace","pace_sec","pace_s");
    const distRaw = col(r,"distance","cum_distance","dist_km");
    const eleRaw = col(r,"altitude","elevation","ele");
    return {
      time: Math.round(timeSec / 60),
      hr: hrRaw ? parseInt(hrRaw) : null,
      pace: paceRaw ? parseInt(paceRaw) : 480,
      distance: distRaw ? parseFloat(distRaw) : parseFloat((i * 0.01).toFixed(3)),
      elevation: eleRaw ? parseFloat(eleRaw) * 3.28084 : 100,
      power: null, cadence: null,
    };
  });

  const step = Math.max(1, Math.floor(stream.length / 200));
  const sampled = stream.filter((_,i)=>i%step===0);
  const durationMin = stream[stream.length-1]?.time ?? 40;
  const totalKm = stream[stream.length-1]?.distance ?? 10;
  const hasHR = stream.some(p=>p.hr);
  const avgHR = hasHR ? Math.round(stream.filter(p=>p.hr).reduce((s,p)=>s+p.hr,0)/stream.filter(p=>p.hr).length) : 145;
  // Derive from totals; fall back to point average if no reliable totals
  const totalMiCSV = totalKm * 0.621371;
  const avgPace = totalKm > 0 && durationMin > 0
    ? Math.min(Math.max(Math.round((durationMin / totalMiCSV) * 60), 240), 1200)
    : Math.round(stream.filter(p=>p.pace>200&&p.pace<900).reduce((s,p)=>s+p.pace,0)/Math.max(1,stream.filter(p=>p.pace>200&&p.pace<900).length));

  const multiCsvHrZones = [10,25,35,22,8];
  const multiCsvTss = Math.round(durationMin / 60 * 65);
  return [{
    id: Date.now(),
    name: "Uploaded Run",
    date: new Date().toISOString().split("T")[0],
    type: "Run",
    workoutType: classifyWorkout({ hrZones: multiCsvHrZones, avgPace, durationMin, avgHR, maxHR: avgHR + 15 }),
    laps: generateLapsFromStream(sampled, 1.0),
    duration: Math.round(durationMin),
    distance: parseFloat(totalKm.toFixed(2)),
    tss: multiCsvTss,
    avgHR,
    maxHR: avgHR + 15,
    avgPace,
    normPace: Math.round(avgPace*0.97),
    avgPower: 0, normPower: 0,
    elevGain: 200,
    calories: Math.round(durationMin * 10),
    hrZones: multiCsvHrZones,
    quality: Math.round(65 + Math.random() * 25),
    coachNotes: generateCoachNotes({ totalKm, totalMi: totalMiCSV, durationMin, avgPace, avgHR, maxHR: avgHR + 15, hasHR, elevGain: 200, tss: multiCsvTss, hrZones: multiCsvHrZones }),
    stream: sampled,
    source: "csv",
  }];
};

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────

const UploadModal = ({ onClose, onImport, athleteMaxHR = 190, customZones = null, athleteRestingHR = 50 }) => {
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [parsed, setParsed] = useState(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    setStatus("parsing");
    setErrorMsg("");
    setParsed(null);
    setEditName("");
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let workouts;
      if (ext === "fit") {
        const buffer = await file.arrayBuffer();
        workouts = [await parseFIT(buffer, file.name, athleteMaxHR, customZones, athleteRestingHR)];
      } else if (ext === "gpx") {
        const text = await file.text();
        workouts = [parseGPX(text, athleteMaxHR, customZones, athleteRestingHR)];
      } else if (ext === "csv") {
        const text = await file.text();
        workouts = parseCSV(text);
      } else {
        throw new Error(`Unsupported file type ".${ext}" — please use .fit, .gpx, or .csv`);
      }
      if (!workouts || !workouts.length) throw new Error("Parser returned no workouts.");
      const w = workouts[0];
      if (!w.stream || !w.stream.length) throw new Error("No data stream found in file. The file may be empty or a non-activity file.");
      setParsed(workouts);
      setEditName(workouts[0].name);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      // Build a descriptive error with the file name and technical detail
      const detail = e.message || "Unknown error";
      setErrorMsg(`Could not import "${file.name}".\n\n${detail}`);
      console.error("[APEX Import Error]", file.name, e);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleImport = () => {
    if (parsed) {
      const final = parsed.map((w, i) => i === 0 ? { ...w, name: editName.trim() || w.name } : w);
      onImport(final);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Import Activity</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="format-chips">
            <span className="format-chip fit">.FIT</span>
            <span className="format-chip gpx">.GPX</span>
            <span className="format-chip csv">.CSV</span>
            <span className="format-note">Garmin, Strava, Wahoo, Coros & more</span>
          </div>

          <div
            className={`drop-zone ${dragOver ? "drag-over" : ""} ${status === "success" ? "success" : ""} ${status === "error" ? "error" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".fit,.gpx,.csv" style={{ display:"none" }} onChange={handleFileInput} />
            {status === null && (
              <>
                <div className="dz-icon"><Icon name="upload" size={28} /></div>
                <div className="dz-text">Drop your file here or <span className="dz-link">browse</span></div>
                <div className="dz-sub">Supports .fit, .gpx and .csv files</div>
              </>
            )}
            {status === "parsing" && <div className="dz-text">Parsing file…</div>}
            {status === "success" && parsed && (
              <div className="dz-success" onClick={e => e.stopPropagation()}>
                <div className="dz-check">✓</div>
                <input
                  className="dz-name-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Activity name"
                  onClick={e => e.stopPropagation()}
                />
                <div className="dz-sub">{parsed[0].distance} km · {Math.floor(parsed[0].duration/60)}h {parsed[0].duration%60}m · {parsed[0].date}</div>
                {parsed[0].avgHR > 0 && <div className="dz-sub">Avg HR: {parsed[0].avgHR} bpm</div>}
              </div>
            )}
            {status === "error" && (
              <div className="dz-error" onClick={e => e.stopPropagation()}>
                <div className="dz-error-icon">✕</div>
                <div className="dz-error-title">Import failed</div>
                <div className="dz-error-msg">{errorMsg.split("\n\n")[1] || errorMsg}</div>
                <button
                  className="dz-retry-btn"
                  onClick={e => { e.stopPropagation(); setStatus(null); setErrorMsg(""); }}
                >
                  Try another file
                </button>
              </div>
            )}
          </div>

          <div className="modal-hint">
            <strong>Garmin Connect:</strong> Activity → ⋮ → Export Original (exports .fit)<br/>
            <strong>Strava:</strong> Activity → ⋮ → Export GPX &nbsp;·&nbsp; <strong>Wahoo / Coros:</strong> exports .fit natively
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" disabled={status !== "success"} onClick={handleImport}
            style={{ opacity: status === "success" ? 1 : 0.4, cursor: status === "success" ? "pointer" : "default" }}>
            Add to Log
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── WORKOUTS VIEW (with upload) ──────────────────────────────────────────────

const ALL_WORKOUT_TYPES = [
  { label: "Easy Run",  color: "#34d399", icon: "easy" },
  { label: "Long Run",  color: "#38bdf8", icon: "run" },
  { label: "Tempo",     color: "#f97316", icon: "fire" },
  { label: "Interval",  color: "#ef4444", icon: "power" },
  { label: "Recovery",  color: "#34d399", icon: "clock" },
  { label: "Aerobic",   color: "var(--accent)", icon: "easy" },
  { label: "Race",      color: "#a78bfa", icon: "flag" },
];

const WorkoutsView = ({ onSelect, uploadedWorkouts, onOpenUpload, onDeleteWorkout, onUpdateWorkout, units, shoes = [] }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft,     setDraft]     = useState({});
  const allWorkouts = [...uploadedWorkouts].sort((a,b) => new Date(b.date) - new Date(a.date));

  const openEdit = (e, w) => {
    e.stopPropagation();
    setEditingId(w.id);
    setDraft({ name: w.name, date: w.date, workoutType: w.workoutType, distance: w.distance, duration: w.duration, avgHR: w.avgHR || "", notes: w.notes || "", shoeId: w.shoeId || "" });
  };

  const closeEdit = (e) => { e && e.stopPropagation(); setEditingId(null); setDraft({}); };

  const commitEdit = (e, w) => {
    e.stopPropagation();
    onUpdateWorkout({ ...w, name: draft.name.trim() || w.name, date: draft.date, workoutType: draft.workoutType, distance: parseFloat(draft.distance) || w.distance, duration: parseInt(draft.duration) || w.duration, avgHR: parseInt(draft.avgHR) || w.avgHR, notes: draft.notes, shoeId: draft.shoeId ? Number(draft.shoeId) : null });
    setEditingId(null);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this activity?")) { onDeleteWorkout(id); setEditingId(null); }
  };

  return (
    <div className="view-grid">
      <div className="card full-width">
        <div className="workout-header">
          <div>
            <h3>Activity Log</h3>
            <p className="card-sub">
              {uploadedWorkouts.length > 0
                ? `${uploadedWorkouts.length} ${uploadedWorkouts.length === 1 ? "activity" : "activities"} — tap any for details`
                : "Import a GPX, FIT, or CSV file to get started"}
            </p>
          </div>
          <button className="wl-upload-btn" onClick={onOpenUpload}>
            <Icon name="upload" size={14} style={{ marginRight: 6 }} />Import
          </button>
        </div>

        <div className="workout-list">
          {allWorkouts.length === 0 ? (
            <div className="workout-empty">
              <div className="workout-empty-icon"><Icon name="run" size={36} color="var(--text3)" /></div>
              <div className="workout-empty-title">No activities yet</div>
              <div className="workout-empty-sub">Use the upload button at the top to import a .FIT, .GPX, or .CSV file</div>
            </div>
          ) : allWorkouts.map(w => {
            const { pace, unit: paceUnit } = fmtPaceWithUnit(w.avgPace, units);
            return (
              <div key={w.id} className="workout-row-wrap">
                <div
                  className={`workout-row ${w.source ? "imported-row" : ""}`}
                  onClick={() => onSelect(w)}
                >
                  {/* Left: type icon */}
                  <div className="wr-type">
                    {w.type === "Run" ? <Icon name="run" size={18} /> : w.type === "Strength" ? <Icon name="strength" size={18} /> : <Icon name="bike" size={18} />}
                  </div>

                  {/* Centre: name / date / tag */}
                  <div className="wr-info">
                    <div className="wr-name">{w.name}</div>
                    <div className="wr-date">{new Date(w.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                    {w.workoutType && (
                      <span className="wr-tag" style={{ color: w.workoutType.color, borderColor: w.workoutType.color + "44", background: w.workoutType.color + "14" }}>
                        <Icon name={w.workoutType.icon} size={9} style={{ marginRight: 3 }} />{w.workoutType.label}
                      </span>
                    )}
                  </div>

                  {/* Right: fixed metric columns */}
                  <div className="wr-metrics">
                    <span className="wr-metric">{fmtDist(w.distance, units)}</span>
                    <span className="wr-metric">{fmtDuration(w.duration)}</span>
                    <span className="wr-metric">{pace}<span className="wr-metric-unit">{paceUnit}</span></span>
                  </div>

                  <div className="wr-chevron">›</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Compute HR zone distribution live from stream + current zone boundaries
// ─── ROUTE MAP (Leaflet + OpenStreetMap) ──────────────────────────────────────
const RouteMap = ({ gpsTrack, theme }) => {
  const mapRef     = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    if (!gpsTrack || gpsTrack.length < 2) return;

    const initMap = (L) => {
      if (!mapRef.current) return;

      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      // Always use OSM tiles — apply CSS invert filter for dark mode
      // This avoids CORS/sandbox issues with third-party dark tile providers
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Route polyline — orange
      const polyline = L.polyline(gpsTrack, {
        color: "#f97316",
        weight: 4.5,
        opacity: 1,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      // Subtle white halo under the line for contrast on both light/dark tiles
      L.polyline(gpsTrack, {
        color: "#ffffff",
        weight: 7,
        opacity: 0.35,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);
      // Re-add orange on top so halo is beneath
      L.polyline(gpsTrack, {
        color: "#f97316",
        weight: 4.5,
        opacity: 1,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      // Start marker — green dot
      const dot = (bg) => L.divIcon({
        className: "",
        html: `<div style="width:13px;height:13px;border-radius:50%;background:${bg};border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.55)"></div>`,
        iconSize: [13, 13],
        iconAnchor: [6, 6],
      });

      L.marker(gpsTrack[0], { icon: dot("#34d399") })
        .addTo(map).bindTooltip("Start", { permanent: false });
      L.marker(gpsTrack[gpsTrack.length - 1], { icon: dot("#ef4444") })
        .addTo(map).bindTooltip("Finish", { permanent: false });

      map.fitBounds(polyline.getBounds(), { padding: [36, 36] });

      leafletRef.current = map;
    };

    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(window.L); return; }

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id   = "leaflet-css";
        link.rel  = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      const existing = document.getElementById("leaflet-js");
      if (!existing) {
        const script  = document.createElement("script");
        script.id     = "leaflet-js";
        script.src    = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload = () => resolve(window.L);
        document.head.appendChild(script);
      } else {
        const poll = setInterval(() => { if (window.L) { clearInterval(poll); resolve(window.L); } }, 50);
      }
    });

    loadLeaflet().then(initMap);

    return () => {
      if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }
    };
  }, [gpsTrack, theme]);

  if (!gpsTrack || gpsTrack.length < 2) return null;

  // Dark mode: invert the OSM tiles via CSS filter, then hue-rotate back so
  // greenery stays green-ish and roads stay readable.
  const tileFilter = theme !== "light"
    ? "invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9)"
    : "none";

  return (
    <div className="route-map-wrap">
      <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "1px solid var(--card-border)" }}>
        {/* CSS filter applied to tile layer only via a pseudo-overlay trick:
            inject a style tag that targets leaflet tiles inside this container */}
        <style>{`.apex-map .leaflet-tile-pane { filter: ${tileFilter}; }`}</style>
        <div
          ref={mapRef}
          className="apex-map"
          style={{ height: 360, borderRadius: 10 }}
        />
      </div>
      <div className="route-map-legend">
        <span className="rml-dot" style={{ background: "#34d399" }} /> Start
        <span className="rml-dot" style={{ background: "#ef4444", marginLeft: 12 }} /> Finish
        <span className="rml-dot" style={{ background: "#f97316", marginLeft: 12 }} /> Route
        <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: 10 }}>{gpsTrack.length} GPS points · OpenStreetMap</span>
      </div>
    </div>
  );
};

const computeHRZones = (stream, customZones) => {
  const hrPoints = stream.filter(p => p.hr != null && p.hr > 0);
  if (!hrPoints.length) return null; // no HR data — fall back to stored value
  const counts = [0, 0, 0, 0, 0];
  hrPoints.forEach(p => {
    if      (p.hr <= customZones[0]) counts[0]++;
    else if (p.hr <= customZones[1]) counts[1]++;
    else if (p.hr <= customZones[2]) counts[2]++;
    else if (p.hr <= customZones[3]) counts[3]++;
    else                             counts[4]++;
  });
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const pcts = counts.map(c => Math.round(c / total * 100));
  // Ensure sum = 100
  const diff = 100 - pcts.reduce((a, b) => a + b, 0);
  pcts[pcts.indexOf(Math.max(...pcts))] += diff;
  return pcts;
};

const WorkoutDetailView = ({ workout, onBack, customZones, units, athlete, resolvedMetrics, theme, onUpdateWorkout, onDeleteWorkout, shoes = [] }) => {
  const rm = resolvedMetrics || { lthr: athlete.lthr || 168, ftp: athlete.ftp || 280 };
  const stream = workout.stream;
  const hrStream = stream.map(p => ({ time: p.time, hr: p.hr, pace: p.pace }));
  const [editing, setEditing]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft]       = useState({});
  const menuRef                 = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const openEdit  = () => { setMenuOpen(false); setDraft({ name: workout.name, date: workout.date, distance: workout.distance, duration: workout.duration, avgHR: workout.avgHR, workoutType: workout.workoutType, notes: workout.notes || "", shoeId: workout.shoeId || null }); setEditing(true); };
  const closeEdit = () => setEditing(false);
  const saveEdit  = () => {
    if (onUpdateWorkout) onUpdateWorkout({ ...workout, name: draft.name?.trim() || workout.name, date: draft.date, workoutType: draft.workoutType, distance: parseFloat(draft.distance) || workout.distance, duration: parseInt(draft.duration) || workout.duration, avgHR: parseInt(draft.avgHR) || workout.avgHR, notes: draft.notes, shoeId: draft.shoeId ? Number(draft.shoeId) : null });
    setEditing(false);
  };
  const handleDelete = () => {
    setMenuOpen(false);
    if (window.confirm("Delete this activity?")) { if (onDeleteWorkout) onDeleteWorkout(workout.id); onBack(); }
  };

  // Always compute zones live so they reflect current athlete zone settings
  const liveHRZones = customZones ? (computeHRZones(stream, customZones) ?? workout.hrZones) : workout.hrZones;

  const { pace: avgPaceFmt, unit: paceUnit } = fmtPaceWithUnit(workout.avgPace, units);
  const { pace: normPaceFmt } = fmtPaceWithUnit(workout.normPace, units);
  const distLabel = fmtDist(workout.distance, units);
  const elevLabel = fmtAlt(workout.elevGain, units);
  const elevUnit  = units.altitude === "m" ? "m" : "ft";

  // Convert stream elevation for chart if needed
  const elevStream = stream.map(p => ({
    dist: units.distance === "mi" ? parseFloat((p.distance * 0.621371).toFixed(3)) : p.distance,
    elev: units.altitude === "m"  ? parseFloat((p.elevation * 0.3048).toFixed(1))  : p.elevation,
  }));
  const distAxisUnit = units.distance === "mi" ? "mi" : "km";

  // Compute cadence stats from stream
  const cadencePoints = stream.filter(p => p.cadence != null && p.cadence > 60 && p.cadence < 240);
  const avgCadence = cadencePoints.length
    ? Math.round(cadencePoints.reduce((s, p) => s + p.cadence, 0) / cadencePoints.length)
    : null;
  const maxCadence = cadencePoints.length ? Math.max(...cadencePoints.map(p => p.cadence)) : null;
  const hasCadence = cadencePoints.length > 0;

  // Cadence stream for chart
  const cadenceStream = stream.map(p => ({
    time: p.time,
    cadence: p.cadence != null && p.cadence > 60 && p.cadence < 240 ? p.cadence : null,
  }));

  return (
    <div className="view-grid">
      {/* Header card */}
      <div className="card full-width wdv-header">
        {/* Top row: back + three-dots menu */}
        <div className="wdv-top">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <WorkoutQualityBadge score={workout.quality} />
            {workout.source && (
              <div className="wdv-menu-wrap" ref={menuRef}>
                <button
                  className={`wdv-dots-btn ${menuOpen ? "wdv-dots-btn--open" : ""}`}
                  onClick={() => setMenuOpen(o => !o)}
                  aria-label="More options"
                >⋯</button>
                {menuOpen && (
                  <div className="wdv-menu">
                    <button className="wdv-menu-item" onClick={openEdit}>
                      <Icon name="gear" size={13} />Edit Activity
                    </button>
                    <button className="wdv-menu-item wdv-menu-item--danger" onClick={handleDelete}>
                      <Icon name="trash" size={13} />Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Name / date / tag */}
        <div className="wdv-identity">
          <div className="wdv-name">{workout.name}</div>
          <div className="wdv-date">
            {new Date(workout.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            {workout.device && <span className="device-badge" style={{ marginLeft: 8 }}><Icon name="device" size={11} style={{marginRight:4}} />{workout.device}</span>}
          </div>
          {workout.workoutType && (
            <span className="wr-tag" style={{ color: workout.workoutType.color, borderColor: workout.workoutType.color + "44", background: workout.workoutType.color + "14", marginTop: 6 }}>
              <Icon name={workout.workoutType.icon} size={9} style={{ marginRight: 3 }} />{workout.workoutType.label}
            </span>
          )}
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="card full-width wep">
          <div className="wep-grid">
            <div className="wep-field wep-field--wide">
              <label className="wep-label">Activity Name</label>
              <input className="wep-input" value={draft.name} autoFocus onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="wep-field">
              <label className="wep-label">Date</label>
              <input className="wep-input" type="date" value={draft.date} onChange={e => setDraft(d => ({ ...d, date: e.target.value }))} />
            </div>
            <div className="wep-field">
              <label className="wep-label">Distance (km)</label>
              <input className="wep-input" type="number" step="0.01" min="0" value={draft.distance} onChange={e => setDraft(d => ({ ...d, distance: e.target.value }))} />
            </div>
            <div className="wep-field">
              <label className="wep-label">Duration (min)</label>
              <input className="wep-input" type="number" min="0" value={draft.duration} onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))} />
            </div>
            <div className="wep-field">
              <label className="wep-label">Avg HR (bpm)</label>
              <input className="wep-input" type="number" min="0" max="250" value={draft.avgHR} onChange={e => setDraft(d => ({ ...d, avgHR: e.target.value }))} />
            </div>
            <div className="wep-field wep-field--wide">
              <label className="wep-label">Run Type</label>
              <div className="wep-type-grid">
                {ALL_WORKOUT_TYPES.map(t => (
                  <button key={t.label} className={`wep-type-btn ${draft.workoutType?.label === t.label ? "active" : ""}`}
                    style={{ "--wt-color": t.color }} onClick={() => setDraft(d => ({ ...d, workoutType: t }))}>
                    <Icon name={t.icon} size={13} /><span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="wep-field wep-field--full">
              <label className="wep-label">Notes</label>
              <textarea className="wep-input wep-textarea" value={draft.notes} placeholder="Add notes about this session..." onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
            </div>
            {shoes.length > 0 && (
              <div className="wep-field wep-field--wide">
                <label className="wep-label">Shoe</label>
                <select className="wep-input" value={draft.shoeId || ""} onChange={e => setDraft(d => ({ ...d, shoeId: e.target.value ? Number(e.target.value) : null }))}>
                  <option value="">— No shoe assigned —</option>
                  {shoes.filter(s => !s.retired).map(s => (
                    <option key={s.id} value={s.id}>{s.name}{s.brand ? ` (${s.brand}${s.model ? " " + s.model : ""})` : ""}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="wep-actions">
            <button className="wra-btn wra-delete" onClick={handleDelete} title="Delete activity"><Icon name="trash" size={13} /></button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="cancel-btn" onClick={closeEdit}>Cancel</button>
              <button className="save-btn" onClick={saveEdit}>✓ Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Key metrics — compact centred blocks */}
      <div className="wdv-metrics-grid">
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "var(--accent)" }}>{distLabel}</div>
          <div className="wdv-metric-lbl">Distance</div>
        </div>
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "#38bdf8" }}>{fmtDuration(workout.duration)}</div>
          <div className="wdv-metric-lbl">Duration</div>
        </div>
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "var(--accent)" }}>{avgPaceFmt}<span className="wdv-metric-unit">{paceUnit}</span></div>
          <div className="wdv-metric-lbl">Avg Pace</div>
        </div>
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "#fbbf24" }}>{normPaceFmt}<span className="wdv-metric-unit">{paceUnit}</span></div>
          <div className="wdv-metric-lbl">Norm Pace</div>
        </div>
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "#f97316" }}>{workout.avgHR}<span className="wdv-metric-unit">bpm</span></div>
          <div className="wdv-metric-lbl">Avg HR</div>
        </div>
        {hasCadence && (
          <div className="wdv-metric">
            <div className="wdv-metric-val" style={{ color: "#00d4aa" }}>{avgCadence}<span className="wdv-metric-unit">spm</span></div>
            <div className="wdv-metric-lbl">Cadence</div>
          </div>
        )}
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "#a78bfa" }}>{workout.tss}</div>
          <div className="wdv-metric-lbl">TSS</div>
        </div>
        <div className="wdv-metric">
          <div className="wdv-metric-val" style={{ color: "var(--text2)" }}>{elevLabel}</div>
          <div className="wdv-metric-lbl">Elevation</div>
        </div>
      </div>

      {/* HR + Pace stream */}
      <div className="card full-width chart-card">
        <h3>Heart Rate & Pace</h3>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={hrStream}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false}
              tickFormatter={v => `${v}m`} />
            <YAxis yAxisId="hr" domain={[110, 190]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="pace" orientation="right" domain={[240, 360]} tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false}
              tickFormatter={v => fmtPace(v)} />
            <Tooltip content={<CustomTooltip formatter={(v, n) => n === "pace" ? fmtPace(v) : `${v} bpm`} />} />
            <Area yAxisId="hr" type="monotone" dataKey="hr" stroke="#f97316" fill="#f9731618" strokeWidth={2} name="HR" dot={false} />
            <Line yAxisId="pace" type="monotone" dataKey="pace" stroke="#38bdf8" strokeWidth={1.5} name="pace" dot={false} />
            <ReferenceLine yAxisId="hr" y={rm.lthr} stroke="#ef444460" strokeDasharray="4 4" label={{ value: "LTHR", fill: "#ef4444", fontSize: 10 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Power + Cadence */}
      <div className="card chart-card">
        <h3>Power Output</h3>
        <div className="row-2-inline">
          <InfoStatCard label="Avg Power" value={`${workout.avgPower}W`} accent="#a78bfa"
            info={{ title: "Avg Power", body: "Mean power output across the session in watts. Reflects overall mechanical work rate.", rows: [{ key: "Your FTP", val: `${rm.ftp}W` }], footer: "Compare to FTP to gauge intensity. Above FTP = high lactate demand." }} />
          <InfoStatCard label="Norm Power" value={`${workout.normPower}W`} accent="var(--accent)"
            info={{ title: "Normalised Power", body: "Statistically weighted average that accounts for power variability. Better reflects physiological cost than simple average on variable efforts.", footer: "NP > Avg Power means the effort was variable (intervals, hills)." }} />
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={stream.map(p => ({ time: p.time, power: p.power }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `${v}m`} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} domain={[140, 380]} />
            <Tooltip content={<CustomTooltip formatter={v => `${v}W`} />} />
            <Area type="monotone" dataKey="power" stroke="#a78bfa" fill="#a78bfa20" strokeWidth={2} name="Power" dot={false} />
            <ReferenceLine y={rm.ftp} stroke="rgba(232,255,71,.38)" strokeDasharray="4 4" label={{ value: "FTP", fill: "var(--accent)", fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cadence */}
      {hasCadence && (
        <div className="card chart-card">
          <h3>Cadence</h3>
          <div className="row-2-inline">
            <InfoStatCard label="Avg Cadence" value={`${avgCadence}`} sub="spm" accent="#34d399"
              info={{ title: "Avg Cadence", body: "Average steps per minute across the session.", rows: [{ key: "Target", val: "170–180 spm" }, { key: "This run", val: `${avgCadence} spm` }], footer: "Higher cadence = shorter ground contact, lower injury risk." }} />
            <InfoStatCard label="Max Cadence" value={`${maxCadence}`} sub="spm" accent="#38bdf8"
              info={{ title: "Max Cadence", body: "Peak steps per minute recorded during the session — typically at the fastest point of the run." }} />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={cadenceStream}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} tickFormatter={v => `${v}m`} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip formatter={v => `${v} spm`} />} />
              <Area type="monotone" dataKey="cadence" stroke="#34d399" fill="#34d39920" strokeWidth={2} name="Cadence" dot={false} connectNulls={false} />
              <ReferenceLine y={170} stroke="#34d39960" strokeDasharray="4 4" label={{ value: "170 spm", fill: "#34d399", fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="card-sub" style={{ marginTop: 8 }}>
            {avgCadence >= 175
              ? "✓ Excellent cadence — optimal stride frequency for efficiency."
              : avgCadence >= 165
              ? "Good cadence. Aim for 170–180 spm to reduce injury risk."
              : "Cadence below optimal. Gradually increase toward 170 spm with short, quick steps."}
          </p>
        </div>
      )}

      {/* HR Zones */}
      <div className="card">
        <h3>HR Zone Distribution</h3>
        <p className="card-sub">Time in zone breakdown</p>
        <HRZoneBar zones={liveHRZones} />
        <div className="zone-legend">
          {HR_ZONE_NAMES.map((name, i) => (
            <div key={i} className="zl-item">
              <span className="zl-dot" style={{ background: HR_ZONE_COLORS[i] }} />
              <span className="zl-name">{name}</span>
              <span className="zl-pct">{liveHRZones[i]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Elevation */}
      <div className="card full-width chart-card">
        <h3>Elevation Profile</h3>
        <p className="card-sub">+{elevLabel} gain</p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={elevStream}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="dist" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false}
              tickFormatter={v => `${v}${distAxisUnit}`} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip formatter={v => `${v} ${elevUnit}`} />} />
            <Area type="monotone" dataKey="elev" stroke="#34d399" fill="#34d39920" strokeWidth={2} name="Elevation" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Lap Times */}
      {workout.laps && workout.laps.length > 0 && (
        <div className="card full-width">
          <h3>Lap Times</h3>
          <p className="card-sub">
            {workout.laps.length} lap{workout.laps.length !== 1 ? "s" : ""}
            {workout.source === "fit" && workout.laps[0]?.distKm
              ? ` · from device`
              : ` · 1 km splits`}
          </p>
          <div className="lap-table">
            <div className="lap-header" style={workout.laps.some(l => l.avgCadence) ? { gridTemplateColumns: "36px 90px 72px 90px 72px 72px" } : {}}>
              <span className="lap-col lap-num">#</span>
              <span className="lap-col lap-dist">Distance</span>
              <span className="lap-col lap-time">Time</span>
              <span className="lap-col lap-pace">Pace</span>
              <span className="lap-col lap-hr">Avg HR</span>
              {workout.laps.some(l => l.avgCadence) && <span className="lap-col lap-cad">Cadence</span>}
            </div>
            {workout.laps.map((lap, i) => {
              const lapDist = lap.distKm != null
                ? (units.distance === "mi" ? `${(lap.distKm * 0.621371).toFixed(2)} mi` : `${lap.distKm.toFixed(2)} km`)
                : "—";
              const lapTime = lap.durationSec != null
                ? `${Math.floor(lap.durationSec / 60)}:${String(lap.durationSec % 60).padStart(2, "0")}`
                : "—";
              const { pace: lapPaceFmt } = lap.paceSec ? fmtPaceWithUnit(lap.paceSec, units) : { pace: "—" };
              const isfast = i > 0 && lap.paceSec && workout.laps[i-1]?.paceSec && lap.paceSec < workout.laps[i-1].paceSec;
              const isslow = i > 0 && lap.paceSec && workout.laps[i-1]?.paceSec && lap.paceSec > workout.laps[i-1].paceSec;
              const showCadCol = workout.laps.some(l => l.avgCadence);
              return (
                <div key={i} className={`lap-row ${i % 2 === 0 ? "lap-even" : ""}`} style={ showCadCol ? { gridTemplateColumns: "36px 90px 72px 90px 72px 72px" } : {}}>
                  <span className="lap-col lap-num">{lap.lap ?? i + 1}</span>
                  <span className="lap-col lap-dist">{lapDist}</span>
                  <span className="lap-col lap-time">{lapTime}</span>
                  <span className="lap-col lap-pace" style={{ color: isfast ? "#34d399" : isslow ? "#f97316" : "var(--text1)" }}>
                    {lapPaceFmt}{lap.paceSec ? `${paceUnit}` : ""}
                    {isfast && <span className="lap-delta">▲</span>}
                    {isslow && <span className="lap-delta lap-slow">▼</span>}
                  </span>
                  <span className="lap-col lap-hr">{lap.avgHR ? `${lap.avgHR} bpm` : "—"}</span>
                  {showCadCol && <span className="lap-col lap-cad">{lap.avgCadence ? `${lap.avgCadence} spm` : "—"}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Route Map */}
      {workout.gpsTrack && (
        <div className="card full-width">
          <h3>Route Map</h3>
          <p className="card-sub">GPS track from {workout.device || (workout.source === "gpx" ? "GPX file" : workout.source === "fit" ? "FIT file" : "import")}</p>
          <RouteMap gpsTrack={workout.gpsTrack} theme={theme} />
        </div>
      )}

      {/* Coach Insights */}
      <div className="card full-width">
        <h3>AI Coach Insights</h3>
        <p className="card-sub">Automated performance analysis</p>
        <div className="coach-list">
          {workout.coachNotes.map((note, i) => (
            <CoachInsight key={i} note={note} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PredictionsSection = ({ athlete, uploadedWorkouts, units, resolvedAthleteMetrics }) => {
  if (!uploadedWorkouts.length) return (
    <div className="card full-width">
      <h3>Race Predictions</h3>
      <p className="card-sub" style={{ marginTop: 8 }}>Import workouts to generate race time predictions based on your training.</p>
    </div>
  );

  // ── 60-day window ────────────────────────────────────────────────────────────
  const today = new Date();
  const cutoff = new Date(today); cutoff.setDate(today.getDate() - 60);
  const recent60 = uploadedWorkouts.filter(w => new Date(w.date + "T12:00:00") >= cutoff);
  const runs60    = recent60.filter(w => w.type === "Run" && w.avgPace > 0 && w.distance >= 3);

  if (!runs60.length) return (
    <EmptyState icon="target" title="Need more data" sub="Import at least one run of 3+ km in the last 60 days to generate predictions." />
  );

  // ── CTL / ATL / TSB from last 60 days ────────────────────────────────────────
  const tssMap = {};
  uploadedWorkouts.forEach(w => { tssMap[w.date] = (tssMap[w.date] || 0) + (w.tss || 0); });
  let ctl = 0, atl = 0;
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const tss = tssMap[d.toISOString().split("T")[0]] || 0;
    ctl = ctl + (tss - ctl) / 42;
    atl = atl + (tss - atl) / 7;
  }
  const tsb = ctl - atl;

  // ── Best VDOT run in the 60-day window ───────────────────────────────────────
  // Uses Jack Daniels formula: the same one powering VO2max estimation.
  // We pick the effort that implies the highest VO2max — the most representative.
  let bestRun = null, bestVdot = 0;
  runs60.forEach(w => {
    const distM = w.distance * 1000;
    const secPerMi = w.avgPace;
    const secPerM = secPerMi / 1609.344;
    const T = (distM * secPerM) / 60;
    if (T <= 0) return;
    const V = distM / T;
    const pctVO2 = 0.8 + 0.1894393 * Math.exp(-0.012778 * T) + 0.2989558 * Math.exp(-0.1932605 * T);
    const vdot = (-4.60 + 0.182258 * V + 0.000104 * V * V) / pctVO2;
    if (vdot > bestVdot) { bestVdot = vdot; bestRun = w; }
  });

  if (!bestRun) return (
    <EmptyState icon="target" title="Need more data" sub="No qualifying efforts found in the last 60 days." />
  );

  // ── CTL fitness modifier ─────────────────────────────────────────────────────
  // A CTL of ~50 is a reasonable trained baseline. Every 10 CTL above 50 → ~1% faster.
  // Every 10 below 50 → ~1% slower. Cap at ±5%.
  const ctlModifier = Math.max(-0.05, Math.min(0.05, (ctl - 50) / 1000));

  // ── TSB freshness modifier ───────────────────────────────────────────────────
  // Optimal race TSB is +5 to +15. Current TSB may not be race-day TSB.
  // We note the current state but don't adjust predictions (it's a training snapshot).
  const freshnessNote = tsb > 10  ? "Positive form — good race window" :
                        tsb > 0   ? "Neutral form — close to race-ready" :
                        tsb > -15 ? "Under training load — taper before racing" :
                                    "High fatigue — significant taper needed";

  // ── Riegel projections from best effort ─────────────────────────────────────
  // T2 = T1 × (D2/D1)^1.06  — but use the actual best run as T1 reference.
  const refDistMi  = bestRun.distance * 0.621371;
  const refTimeSec = bestRun.avgPace * refDistMi; // sec/mi × miles = total seconds
  const riegelSec  = (targetMi) =>
    Math.round(refTimeSec * Math.pow(targetMi / refDistMi, 1.06) * (1 - ctlModifier));

  const EVENTS = [
    { label: "5K",       mi: 3.107,  km: 5    },
    { label: "10K",      mi: 6.214,  km: 10   },
    { label: "Half",     mi: 13.109, km: 21.1 },
    { label: "Marathon", mi: 26.219, km: 42.2 },
  ];

  const predictions = EVENTS.map(ev => {
    const totalSec = riegelSec(ev.mi);
    const paceSecPerMi = Math.round(totalSec / ev.mi);
    const { pace: paceFmt, unit: paceUnit } = fmtPaceWithUnit(paceSecPerMi, units);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const totalFmt = h > 0
      ? `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
      : `${m}:${String(s).padStart(2,"0")}`;
    return { ...ev, totalSec, totalFmt, paceFmt, paceUnit };
  });

  // ── Confidence score ─────────────────────────────────────────────────────────
  // Based on: number of runs in 60 days, longest run distance, CTL level
  const longestRun = Math.max(...runs60.map(w => w.distance));
  const runCount = runs60.length;
  let confidence = Math.min(95, Math.round(
    40                                          // base
    + Math.min(25, runCount * 3)               // up to +25 for 8+ runs
    + Math.min(20, longestRun > 15 ? 20 : longestRun > 10 ? 12 : longestRun > 5 ? 6 : 0)  // long run
    + Math.min(10, ctl > 60 ? 10 : ctl > 40 ? 6 : ctl > 20 ? 3 : 0)  // CTL fitness
  ));

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const dist60 = runs60.reduce((s, w) => s + w.distance, 0);
  const tss60  = recent60.reduce((s, w) => s + (w.tss || 0), 0);
  const dist60Fmt = units.distance === "mi"
    ? `${(dist60 * 0.621371).toFixed(0)} mi`
    : `${dist60.toFixed(0)} km`;

  const { pace: bestPaceFmt, unit: bestPaceUnit } = fmtPaceWithUnit(bestRun.avgPace, units);

  return (
    <>

      {/* 60-day summary stats */}
      <div className="row-3-nowrap">
        <InfoStatCard label="Runs (60 days)" value={runCount} sub={`${dist60Fmt} covered`} accent="var(--accent)"
          info={{ title: "60-Day Run Count", body: "Number of qualifying runs (3km+) in the last 60 days. More runs = more accurate predictions.", footer: "Aim for 3+ runs/week for reliable modelling." }} />
        <InfoStatCard label="Fitness (CTL)" value={ctl.toFixed(0)} sub="chronic load" accent="#38bdf8"
          info={{ title: "Chronic Training Load", body: "Your 42-day average training stress. Higher CTL = more aerobic base.", rows: [{ key: "Recreational", val: "< 30" }, { key: "Trained", val: "30–60" }, { key: "Advanced", val: "60–90" }, { key: "Elite", val: "> 90" }] }} />
        <InfoStatCard label="Confidence" value={`${confidence}%`} sub="prediction accuracy" accent="#a78bfa"
          info={{ title: "Prediction Confidence", body: "Estimated reliability based on training volume, longest run, and CTL fitness in the 60-day window.", footer: "Increases with more runs, longer efforts, and a higher CTL." }} />
      </div>

      {/* Predictions table */}
      <div className="card full-width">
        <h3>Race Time Predictions</h3>
        <p className="card-sub">
          Based on {runCount} run{runCount !== 1 ? "s" : ""} over 60 days ·
          Best effort: <strong>{bestRun.name}</strong> ({fmtDist(bestRun.distance, units)} @ {bestPaceFmt}{bestPaceUnit}) ·
          CTL {ctl.toFixed(0)} · {freshnessNote}
        </p>
        <div className="pred-cards">
          {predictions.map(p => (
            <div key={p.label} className="pred-card">
              <div className="pc-event">{p.label}</div>
              <div className="pc-predicted">{p.totalFmt}</div>
              <div className="pc-label">{p.paceFmt}{p.paceUnit} pace</div>
              <div className="pc-conf">{confidence}% conf.</div>
            </div>
          ))}
        </div>
      </div>

      {/* Training intelligence */}
      <div className="card full-width">
        <h3>Training Analysis</h3>
        <div className="ai-report">

          <div className="air-section">
            <div className="air-title">60-Day Snapshot</div>
            <p>
              {runCount} run{runCount !== 1 ? "s" : ""} covering {dist60Fmt} with {tss60} TSS
              over the last 60 days. CTL of {ctl.toFixed(1)} reflects a{" "}
              {ctl > 70 ? "high" : ctl > 45 ? "solid" : ctl > 20 ? "moderate" : "developing"} aerobic base.
              {ctlModifier > 0
                ? ` Fitness level adjusted predictions ${(ctlModifier * 100).toFixed(1)}% faster than raw pace alone.`
                : ctlModifier < 0
                ? ` Lower training load adjusted predictions ${Math.abs(ctlModifier * 100).toFixed(1)}% conservatively.`
                : ""}
            </p>
          </div>

          <div className="air-section">
            <div className="air-title">Form & Readiness</div>
            <p>
              Current TSB of {tsb.toFixed(1)}: {freshnessNote.toLowerCase()}.
              {tsb < -5
                ? " These predictions reflect fitness, not current race readiness — taper for 7–14 days before racing to peak."
                : tsb > 15
                ? " You are fresh and near peak form. This is an optimal race window."
                : " Moderate form — a 5–7 day taper would bring you close to peak performance."}
            </p>
          </div>

          <div className="air-section">
            <div className="air-title">Goal: {athlete.goal}</div>
            <p>
              {predictions.find(p => p.label === "Marathon")
                ? `Current trajectory puts a marathon at ${predictions.find(p => p.label === "Marathon").totalFmt}. `
                : ""}
              To improve predictions: add more long runs (15km+), include a tempo or race-pace effort, and increase weekly volume consistently over 8+ weeks to build CTL.
            </p>
          </div>

          <div className="air-section">
            <div className="air-title">How Predictions Are Calculated</div>
            <p>
              Uses the Riegel endurance formula (T₂ = T₁ × (D₂/D₁)^1.06) applied to your best qualifying effort in the 60-day window,
              then adjusted by your CTL fitness level. A CTL of 50 is the neutral baseline — each 10-point deviation adjusts predictions by ~1%.
              Confidence reflects training volume, longest run, and fitness consistency.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

const RecoverySection = ({ athlete, uploadedWorkouts }) => {
  // ── Core fitness model ────────────────────────────────────────────────────────
  // ATL (Acute Training Load) = 7-day EMA of daily TSS  → represents fatigue / strain
  // CTL (Chronic Training Load) = 42-day EMA of daily TSS → represents fitness
  // TSB (Training Stress Balance) = CTL - ATL → represents form / freshness
  const today = new Date();
  const tssMap = {};
  uploadedWorkouts.forEach(w => { tssMap[w.date] = (tssMap[w.date] || 0) + (w.tss || 0); });

  // Build 42-day history for the chart
  const historyDays = 42;
  let ctl = 0, atl = 0;
  const fitnessHistory = [];
  for (let i = historyDays - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const tss = tssMap[dateStr] || 0;
    ctl = ctl + (tss - ctl) / 42;
    atl = atl + (tss - atl) / 7;
    fitnessHistory.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ctl:  parseFloat(ctl.toFixed(1)),
      atl:  parseFloat(atl.toFixed(1)),
      tsb:  parseFloat((ctl - atl).toFixed(1)),
      tss,
    });
  }

  const latest   = fitnessHistory[fitnessHistory.length - 1];
  const strainVal = parseFloat(latest.atl.toFixed(1));
  const ctlVal    = parseFloat(latest.ctl.toFixed(1));
  const tsbVal    = parseFloat(latest.tsb.toFixed(1));

  // Strain ring max = max possible ATL given athlete's recent training ceiling
  // Cap at 100 for display scaling; ring shows proportional load
  const strainMax  = 100;
  const strainPct  = Math.min(1, strainVal / strainMax);
  const strainColor = strainPct > 0.6 ? "#ef4444" : strainPct > 0.35 ? "#f97316" : "var(--accent)";

  // Readiness: TSB-based, clamped 0–100
  const readinessPct   = Math.min(100, Math.max(0, Math.round(50 + tsbVal * 1.5)));
  const readinessLabel = readinessPct >= 70 ? "High" : readinessPct >= 45 ? "Moderate" : "Low";
  const readinessColor = readinessPct >= 70 ? "#34d399" : readinessPct >= 45 ? "#fbbf24" : "#ef4444";

  // Last workout info
  const sorted      = [...uploadedWorkouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const lastWorkout = sorted[0];
  const daysSince   = lastWorkout
    ? Math.floor((today - new Date(lastWorkout.date + "T12:00:00")) / 86400000)
    : null;

  // Last 7 days TSS total
  const last7TSS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - i);
    return tssMap[d.toISOString().split("T")[0]] || 0;
  }).reduce((a, b) => a + b, 0);

  // Week-over-week TSS change
  const prev7TSS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - (7 + i));
    return tssMap[d.toISOString().split("T")[0]] || 0;
  }).reduce((a, b) => a + b, 0);
  const loadChange = prev7TSS > 0 ? Math.round(((last7TSS - prev7TSS) / prev7TSS) * 100) : null;

  // ── Suggestion ───────────────────────────────────────────────────────────────
  const suggestion = readinessPct >= 70
    ? "Ready for quality — threshold intervals or race-pace work"
    : readinessPct >= 45
    ? "Moderate effort — aerobic or easy tempo"
    : "Prioritise recovery — easy jog, walk, or full rest";

  // ── Risk factors ─────────────────────────────────────────────────────────────
  const risks = [];
  if (tsbVal < -20)                    risks.push({ type: "warn", msg: `High fatigue — TSB at ${tsbVal.toFixed(1)}. Injury risk elevated.` });
  else if (tsbVal < -10)               risks.push({ type: "warn", msg: `Moderate fatigue — TSB at ${tsbVal.toFixed(1)}. Limit intensity.` });
  if (loadChange !== null && loadChange > 30) risks.push({ type: "warn", msg: `Weekly load up ${loadChange}% vs last week — monitor for overreaching.` });
  if (daysSince !== null && daysSince > 5)    risks.push({ type: "info", msg: `${daysSince} days since last session — fitness may begin to decline.` });
  if (daysSince === 0)                         risks.push({ type: "ok",   msg: "Trained today — factor in session fatigue for today's readiness." });
  if (daysSince === 1)                         risks.push({ type: "ok",   msg: "Trained yesterday — allow 24h before next hard effort." });
  if (strainVal > 70)                          risks.push({ type: "warn", msg: "Very high acute load. Prioritise sleep and nutrition." });
  if (tsbVal >= 5 && tsbVal <= 25)             risks.push({ type: "ok",   msg: `Positive form (TSB +${tsbVal.toFixed(1)}) — good race or peak effort window.` });
  if (ctlVal > 0 && atl > ctlVal * 1.3)       risks.push({ type: "warn", msg: "Acute load exceeds chronic fitness by >30% — reduce volume this week." });
  if (readinessPct >= 70 && tsbVal >= 0)       risks.push({ type: "ok",   msg: "Well-recovered — strong training window." });
  if (risks.length === 0)                      risks.push({ type: "info", msg: "Steady state — training load is stable and manageable." });

  const riskIcon = { warn: "warn", ok: "tip", info: "tip" };
  const riskColor = { warn: "#fbbf24", ok: "#34d399", info: "#38bdf8" };

  // ── Strain breakdown for "what lowers strain" card ───────────────────────────
  // ATL decays naturally each day at rate 1/7 (EMA constant)
  // A rest day multiplies ATL by (1 - 1/7) = ~0.857 → drops by ~14.3%/day
  const dailyDecayPct = Math.round((1 - (1 - 1/7)) * 100 * (1 - 1/7) * 100) / 100;
  const strainAfter1Rest = parseFloat((strainVal * (1 - 1/7)).toFixed(1));
  const strainAfter2Rest = parseFloat((strainVal * Math.pow(1 - 1/7, 2)).toFixed(1));
  const strainAfter3Rest = parseFloat((strainVal * Math.pow(1 - 1/7, 3)).toFixed(1));

  // TSS of a typical easy run vs intervals
  const easyRunTSS    = 35;
  const intervalsTSS  = 100;
  const strainAfterEasy      = parseFloat(((strainVal * (1 - 1/7)) + easyRunTSS / 7).toFixed(1));
  const strainAfterIntervals = parseFloat(((strainVal * (1 - 1/7)) + intervalsTSS / 7).toFixed(1));

  const hasData = uploadedWorkouts.length > 0;
  return (
    <>

      {/* Top stat row — fitness context */}
      <div className="row-3-nowrap">
        <InfoStatCard label="Fitness (CTL)" value={hasData ? ctlVal : "—"} sub="Chronic load · 42-day" accent="#38bdf8"
          info={{ title: "Fitness — CTL", body: "Chronic Training Load: 42-day EMA of daily TSS. Your long-term aerobic base.", rows: [{ key: "Recreational", val: "< 30" }, { key: "Trained", val: "30–60" }, { key: "Advanced", val: "60–90" }, { key: "Elite", val: "> 90" }], footer: "CTL builds slowly — consistent weeks are what move it." }} />
        <InfoStatCard label="Last Run" value={hasData && daysSince !== null ? `${daysSince}d` : "—"} sub={hasData && lastWorkout ? lastWorkout.name : "no data"} accent="#a78bfa"
          info={{ title: "Days Since Last Session", body: "How many days since your most recent logged workout. Useful for tracking recovery gaps and consistency.", footer: "More than 5 days without training may start to reduce CTL." }} />
        <InfoStatCard label="7-Day TSS" value={hasData ? last7TSS : "—"} sub="training stress" accent="var(--accent)"
          info={{ title: "7-Day Training Stress", body: "Total TSS accumulated over the last 7 days. Reflects your current acute training load in absolute terms.", rows: [{ key: "Light week", val: "< 200" }, { key: "Moderate", val: "200–400" }, { key: "Heavy", val: "> 400" }], footer: "Spike in 7-day TSS beyond 130% of prior week increases injury risk." }} />
      </div>

      {/* Second stat row — recovery state */}
      <div className="row-3-nowrap">
        <InfoStatCard label="Strain (ATL)"  value={hasData ? strainVal          : "—"} sub="Acute Training Load · 7-day"  accent={hasData ? "#f97316"      : "var(--text3)"}
          info={{ title: "Strain — ATL", body: "Acute Training Load: 7-day exponential moving average of daily TSS. Reflects how much fatigue your body is currently carrying.", rows: [{ key: "Raises ATL", val: "Hard/long sessions" }, { key: "Lowers ATL", val: "Rest (~14%/day)" }, { key: "Time scale", val: "~7 days" }], footer: "Even one rest day meaningfully drops your ATL." }} />
        <InfoStatCard label="Readiness"     value={hasData ? `${readinessPct}%` : "—"} sub={hasData ? readinessLabel : "no data yet"} accent={hasData ? readinessColor  : "var(--text3)"}
          info={{ title: "Readiness", body: "Derived from TSB (Form). Reflects how recovered and prepared your body is for training or racing.", rows: [{ key: "≥ 70%", val: "High — go hard" }, { key: "45–70%", val: "Moderate — steady" }, { key: "< 45%", val: "Low — recover" }], footer: "Readiness = 50 + (TSB × 1.5), clamped 0–100%." }} />
        <InfoStatCard label="Form (TSB)"    value={hasData ? tsbVal.toFixed(1)  : "—"} sub="Fitness minus Fatigue"         accent={hasData ? (tsbVal >= 0 ? "#34d399" : "#f97316") : "var(--text3)"}
          info={{ title: "Form — TSB", body: "Training Stress Balance = CTL (fitness) − ATL (fatigue). Positive = fresh. Negative = under load.", rows: [{ key: "−30 to −10", val: "Heavy block" }, { key: "−10 to 0", val: "Building" }, { key: "0 to +25", val: "Fresh / race-ready" }, { key: "> +25", val: "Detraining risk" }], footer: "Target TSB +5 to +15 on race day." }} />
      </div>

      {/* Recovery Status card */}
      <div className="card full-width">
        <h3>Recovery Status</h3>
        <div className="recovery-full">

          {/* Strain ring */}
          <div className="recovery-left">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#1e293b" strokeWidth="12" />
              {hasData && (
                <circle
                  cx="70" cy="70" r="54" fill="none"
                  stroke={strainColor} strokeWidth="12"
                  strokeDasharray={`${strainPct * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              )}
              <text x="70" y="62" textAnchor="middle" fill={hasData ? "#f8fafc" : "#64748b"} fontSize="26" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif">{hasData ? strainVal : "—"}</text>
              <text x="70" y="78" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="'Inter', sans-serif">ATL</text>
              <text x="70" y="92" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'Inter', sans-serif">{hasData ? `fitness ${ctlVal}` : "no data"}</text>
            </svg>
            <div className="recovery-readiness-label">
              <span className="ra-label">Readiness</span>
              <span className="recovery-readiness-value" style={{ color: hasData ? readinessColor : "var(--text3)" }}>{hasData ? readinessLabel : "—"}</span>
            </div>
            <div className="recovery-suggestion"><Icon name="tip" size={13} style={{marginRight:5}} />{hasData ? suggestion : "Import workouts to see your recovery status"}</div>
          </div>

          <div className="recovery-divider" />

          {/* Risk factors + coaching */}
          <div className="recovery-right">
            <div className="ra-rlabel">Status</div>
            <div className="ra-risks" style={{ marginBottom: 14 }}>
              {hasData ? risks.map((r, i) => (
                <div key={i} className="risk-item" style={{ color: riskColor[r.type] }}>
                  <Icon name={riskIcon[r.type]} size={12} style={{ marginRight: 5, flexShrink: 0 }} />{r.msg}
                </div>
              )) : (
                <div className="risk-item" style={{ color: "var(--text3)" }}>
                  <Icon name="tip" size={12} style={{ marginRight: 5 }} />No training data yet
                </div>
              )}
            </div>
            <div className="ra-rlabel">AI Recommendation</div>
            <div className="coach-block">
              {hasData
                ? (tsbVal >= 5
                    ? "Positive form — your body is fresh and primed. This is an ideal window for racing, a hard workout, or a quality threshold session."
                    : tsbVal >= -10
                    ? "Neutral form — you're in a steady training state. Consistent aerobic work and tempo efforts are appropriate."
                    : "You're carrying accumulated fatigue. Prioritise easy days, extra sleep, and good nutrition to rebuild form before your next hard effort.")
                : "Import workouts to receive personalised recovery recommendations based on your training load."}
              {hasData && loadChange !== null && ` Training load is ${loadChange > 0 ? `up ${loadChange}%` : `down ${Math.abs(loadChange)}%`} compared to last week.`}
            </div>
          </div>
        </div>
      </div>

      {/* What lowers strain */}
      <div className="card full-width">
        <h3>What Lowers Strain?</h3>
        <p className="card-sub">ATL (strain) decays naturally every day — rest accelerates it. {hasData ? <>Your current strain: <strong style={{color: strainColor}}>{strainVal}</strong></> : "Import workouts to see your strain projections."}</p>
        <div className="strain-explainer">
          <div className="strain-explainer-grid">

            <div className="se-block se-block--rest">
              <div className="se-block-header">
                <Icon name="sleep" size={20} />
                <span className="se-title">Rest Days</span>
              </div>
              <p className="se-desc">Each rest day your ATL drops by ~14% (the 7-day EMA decay). No TSS added means strain can only fall.</p>
              <div className="se-projections">
                <div className="se-proj-row">
                  <span className="se-proj-label">After 1 rest day</span>
                  <span className="se-proj-val" style={{ color: "#34d399" }}>{hasData ? strainAfter1Rest : "—"}</span>
                </div>
                <div className="se-proj-row">
                  <span className="se-proj-label">After 2 rest days</span>
                  <span className="se-proj-val" style={{ color: "#34d399" }}>{hasData ? strainAfter2Rest : "—"}</span>
                </div>
                <div className="se-proj-row">
                  <span className="se-proj-label">After 3 rest days</span>
                  <span className="se-proj-val" style={{ color: "#34d399" }}>{hasData ? strainAfter3Rest : "—"}</span>
                </div>
              </div>
            </div>

            <div className="se-block se-block--easy">
              <div className="se-block-header">
                <Icon name="walk" size={20} />
                <span className="se-title">Low-Intensity Training</span>
              </div>
              <p className="se-desc">Easy runs (Z1–Z2) add little TSS. If TSS &lt; ATL × 7-day rate, strain still falls even with training.</p>
              <div className="se-projections">
                <div className="se-proj-row">
                  <span className="se-proj-label">Easy run (~{easyRunTSS} TSS)</span>
                  <span className="se-proj-val" style={{ color: hasData ? (strainAfterEasy < strainVal ? "#34d399" : "#fbbf24") : "var(--text3)" }}>{hasData ? strainAfterEasy : "—"}</span>
                </div>
                <div className="se-proj-row se-proj-note">
                  Z1–Z2 effort, 45–60 min at conversational pace
                </div>
              </div>
            </div>

            <div className="se-block se-block--hard">
              <div className="se-block-header">
                <Icon name="power" size={20} />
                <span className="se-title">High-Intensity Sessions</span>
              </div>
              <p className="se-desc">Intervals and threshold work carry high TSS and spike ATL quickly, driving up strain.</p>
              <div className="se-projections">
                <div className="se-proj-row">
                  <span className="se-proj-label">Intervals (~{intervalsTSS} TSS)</span>
                  <span className="se-proj-val" style={{ color: "#ef4444" }}>{hasData ? strainAfterIntervals : "—"}</span>
                </div>
                <div className="se-proj-row se-proj-note">
                  Z4–Z5 effort — raises strain significantly
                </div>
              </div>
            </div>

            <div className="se-block se-block--sleep">
              <div className="se-block-header">
                <Icon name="sleep" size={20} />
                <span className="se-title">Sleep & Nutrition</span>
              </div>
              <p className="se-desc">This model tracks training load, not biological recovery. Sleep and nutrition don't change ATL directly but are the primary levers for actual physiological recovery between sessions.</p>
              <div className="se-projections">
                <div className="se-proj-row se-proj-note">
                  8+ hrs sleep accelerates muscle repair and HRV recovery
                </div>
                <div className="se-proj-row se-proj-note">
                  20–30g protein within 45 min of finishing a hard session
                </div>
              </div>
            </div>

          </div>

          <div className="se-formula">
            <span className="se-formula-title">How ATL is calculated</span>
            <span className="se-formula-eq">ATL<sub>today</sub> = ATL<sub>yesterday</sub> + (TSS − ATL<sub>yesterday</sub>) ÷ 7</span>
            <span className="se-formula-note">A 7-day exponential moving average of your daily Training Stress Score. Form (TSB) = Fitness (CTL, 42-day EMA) − Strain (ATL)</span>
          </div>
        </div>
      </div>

      {/* 42-day ATL / CTL / TSB chart */}
      <div className="card full-width chart-card">
        <h3>42-Day Fitness, Strain & Form</h3>
        <p className="card-sub">CTL = fitness (blue) · ATL = strain (orange) · TSB = form (lime)</p>
        {hasData ? (
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={fitnessHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} interval={6} />
              <YAxis yAxisId="load" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="tsb" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v, n) => n === "TSS" ? `${v} TSS` : v.toFixed(1)} />} />
              <ReferenceLine yAxisId="tsb" y={0} stroke="#64748b40" strokeDasharray="3 3" />
              <Bar yAxisId="load" dataKey="tss" fill="rgba(232,255,71,.09)" stroke="rgba(232,255,71,.25)" strokeWidth={1} name="TSS" radius={[2,2,0,0]} />
              <Area yAxisId="load" type="monotone" dataKey="ctl" stroke="#38bdf8" fill="#38bdf808" strokeWidth={2} name="Fitness (CTL)" dot={false} />
              <Area yAxisId="load" type="monotone" dataKey="atl" stroke="#f97316" fill="#f9731608" strokeWidth={2} name="Strain (ATL)" dot={false} />
              <Line yAxisId="tsb" type="monotone" dataKey="tsb" stroke="#e8ff47" strokeWidth={1.5} name="Form (TSB)" dot={false} strokeDasharray="4 2" />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="dash-chart-empty">
            <div className="dash-chart-empty-bars">
              {[30,50,40,65,45,70,55].map((h, i) => (
                <div key={i} className="dash-chart-empty-bar" style={{ height: h }} />
              ))}
            </div>
            <div className="dash-chart-empty-label">Import workouts to see your fitness trend</div>
          </div>
        )}
      </div>

    </>
  );
};



const RecoveryView = ({ athlete, uploadedWorkouts, units, resolvedAthleteMetrics }) => (
  <div className="view-grid">
    <RecoverySection athlete={athlete} uploadedWorkouts={uploadedWorkouts} />
  </div>
);

const FIELD_GROUPS = [
  {
    title: "Personal Info",
    fields: [
      { key: "name",   label: "Name",    type: "text",   unit: "" },
      { key: "age",    label: "Age",     type: "number", unit: "yrs" },
      { key: "weight", label: "Weight",  type: "number", unit: "lbs" },
      { key: "height", label: "Height",  type: "number", unit: "in (total)" },
      { key: "gender", label: "Gender",  type: "select", options: ["Male", "Female", "Other"], unit: "" },
      { key: "goal",   label: "Goal",    type: "text",   unit: "" },
    ],
  },
  {
    title: "Heart Rate",
    fields: [
      { key: "maxHR",      label: "Max HR",        type: "number", unit: "bpm" },
      { key: "restingHR",  label: "Resting HR",    type: "number", unit: "bpm" },
      { key: "lthr",       label: "Lactate Threshold HR", type: "number", unit: "bpm" },
      { key: "hrv",        label: "HRV Baseline",  type: "number", unit: "ms" },
    ],
  },
  {
    title: "Performance",
    fields: [
      { key: "ftp",    label: "FTP",     type: "number", unit: "W",         step: "1" },
      { key: "vo2max", label: "VO2max",  type: "number", unit: "ml/kg/min", step: "0.1" },
    ],
  },
];

// ─── GEAR VIEW ────────────────────────────────────────────────────────────────
const GearView = ({ shoes, setShoes, uploadedWorkouts, units, defaultShoeId, setDefaultShoeId }) => {
  const [showShoeModal, setShowShoeModal] = useState(false);
  const [editShoe,      setEditShoe]      = useState(null);

  const saveShoe = (form) => {
    if (editShoe) setShoes(prev => prev.map(s => s.id === editShoe.id ? { ...form, id: editShoe.id } : s));
    else          setShoes(prev => [...prev, { ...form, id: Date.now() }]);
    setShowShoeModal(false); setEditShoe(null);
  };
  const deleteShoe = (id) => {
    if (window.confirm("Delete these shoes? Workouts assigned will be unlinked."))
      setShoes(prev => prev.filter(s => s.id !== id));
  };

  // eslint-disable-next-line eqeqeq
  const shoeKm  = (id) => uploadedWorkouts.filter(w => w.shoeId == id).reduce((s, w) => s + (w.distance || 0), 0);
  const distUnit = units.distance === "mi" ? "mi" : "km";
  const distMult = units.distance === "mi" ? 0.621371 : 1;
  const activeShoes  = shoes.filter(s => !s.retired);
  const retiredShoes = shoes.filter(s => s.retired);

  const ShoeCard = ({ shoe, retired }) => {
    const km      = shoeKm(shoe.id);
    const dispKm  = parseFloat((km * distMult).toFixed(1));
    const retKm   = parseFloat((shoe.retireAt * distMult).toFixed(0));
    const pct     = Math.min(1, km / (shoe.retireAt || 800));
    const remain  = parseFloat(((shoe.retireAt - km) * distMult).toFixed(1));
    const warn     = pct >= 0.8;
    const critical = pct >= 1.0;
    const ringColor = retired ? "#334155" : critical ? "#ef4444" : warn ? "#fbbf24" : shoe.color;
    const r = 38, circ = 2 * Math.PI * r;
    // eslint-disable-next-line eqeqeq
    const sessions = uploadedWorkouts.filter(w => w.shoeId == shoe.id).length;
    return (
      <div className={`shoe-card ${!retired && warn ? "shoe-card--warn" : ""} ${!retired && critical ? "shoe-card--critical" : ""} ${retired ? "shoe-card--retired" : ""}`} style={{ "--shoe-color": shoe.color }}>
        <div className="shoe-card-top">
          <div className="shoe-ring-wrap">
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="48" cy="48" r={r} fill="none" stroke={ringColor} strokeWidth="8"
                strokeDasharray={`${(retired ? 1 : pct) * circ} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 48 48)" style={{ transition: "stroke-dasharray 1s ease" }} />
              <text x="48" y="44" textAnchor="middle" fill={retired ? "#64748b" : "#f8fafc"} fontSize="13" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif">{dispKm}</text>
              <text x="48" y="58" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'Inter', sans-serif">{distUnit}</text>
            </svg>
          </div>
          <div className="shoe-card-info">
            <div className="shoe-name" style={retired ? { color: "var(--text3)" } : {}}>{shoe.name}</div>
            <div className="shoe-model">{[shoe.brand, shoe.model].filter(Boolean).join(" · ") || "—"}</div>
            <div className="shoe-stats">
              <span>{sessions} {sessions === 1 ? "run" : "runs"}</span>
              {!retired && <><span>·</span><span>Retire at {retKm} {distUnit}</span></>}
            </div>
            {retired ? (
              <div className="shoe-alert" style={{ color: "var(--text3)" }}>Retired</div>
            ) : critical ? (
              <div className="shoe-alert shoe-alert--critical"><Icon name="retire" size={12} style={{marginRight:5}} />Retire these shoes now</div>
            ) : warn ? (
              <div className="shoe-alert shoe-alert--warn">⚠ {remain} {distUnit} until retirement</div>
            ) : (
              <div className="shoe-remaining">{remain > 0 ? `${remain} ${distUnit} remaining` : "—"}</div>
            )}
            {shoe.notes && <div className="shoe-notes">{shoe.notes}</div>}
          </div>
        </div>
        <div className="shoe-card-actions">
          <button className="wra-btn wra-edit" onClick={() => { setEditShoe(shoe); setShowShoeModal(true); }} title="Edit">✎</button>
          <button className="wra-btn wra-delete" onClick={() => deleteShoe(shoe.id)} title="Delete"><Icon name="trash" size={13} /></button>
        </div>
      </div>
    );
  };

  return (
    <div className="view-grid">
      <div className="card full-width gear-header">
        <div>
          <h3 style={{ marginBottom: 2 }}>Shoe Tracker</h3>
          <p className="card-sub" style={{ marginBottom: 0 }}>Track mileage and retirement per shoe</p>
        </div>
        <button className="upload-btn" onClick={() => { setEditShoe(null); setShowShoeModal(true); }}>+ Add Shoes</button>
      </div>

      {activeShoes.length > 0 && (
        <div className="card full-width">
          <div className="shoe-default-row">
            <span className="shoe-default-label">Auto-assign on import</span>
            <select className="wep-input shoe-default-select" value={defaultShoeId || ""} onChange={e => setDefaultShoeId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">— None —</option>
              {activeShoes.map(s => <option key={s.id} value={s.id}>{s.name}{s.brand ? ` (${s.brand}${s.model ? " " + s.model : ""})` : ""}</option>)}
            </select>
            {defaultShoeId && (() => { const ds = shoes.find(s => s.id == defaultShoeId); return ds ? <span className="shoe-tag" style={{ "--shoe-color": ds.color }}><Icon name="shoe" size={12} style={{marginRight:4}} />{ds.name}</span> : null; })()}
          </div>
        </div>
      )}

      {shoes.length === 0 && (
        <div className="card full-width"><div className="workout-empty">
          <div className="workout-empty-icon"><Icon name="shoe" size={36} color="var(--text3)" /></div>
          <div className="workout-empty-title">No shoes added yet</div>
          <div className="workout-empty-sub">Add your running shoes to track mileage and get retirement reminders</div>
          <button className="upload-btn" style={{ marginTop: 16 }} onClick={() => { setEditShoe(null); setShowShoeModal(true); }}>+ Add Shoes</button>
        </div></div>
      )}

      {activeShoes.length > 0 && (
        <div className="card full-width">
          <h3 style={{ marginBottom: 14 }}>Active Shoes</h3>
          <div className="shoe-grid">{activeShoes.map(s => <ShoeCard key={s.id} shoe={s} retired={false} />)}</div>
        </div>
      )}
      {retiredShoes.length > 0 && (
        <div className="card full-width">
          <h3 style={{ marginBottom: 14 }}>Retired Shoes</h3>
          <div className="shoe-grid">{retiredShoes.map(s => <ShoeCard key={s.id} shoe={s} retired={true} />)}</div>
        </div>
      )}

      {showShoeModal && <ShoeModal shoe={editShoe} onSave={saveShoe} onClose={() => { setShowShoeModal(false); setEditShoe(null); }} />}
    </div>
  );
};





// ─── SHOES VIEW ───────────────────────────────────────────────────────────────
const SHOE_COLORS = ["var(--accent)","#38bdf8","#f97316","#a78bfa","#ef4444","#34d399","#fbbf24","#f472b6"];

const ShoeModal = ({ shoe, onSave, onClose }) => {
  const isNew = !shoe;
  const [form, setForm] = useState(shoe ? { ...shoe } : {
    name: "", brand: "", model: "", addedDate: new Date().toISOString().split("T")[0],
    retireAt: 800, color: SHOE_COLORS[0], notes: "", retired: false,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isNew ? "Add Shoes" : "Edit Shoes"}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="wep-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>

            <div className="wep-field wep-field--wide">
              <label className="wep-label">Nickname</label>
              <input className="wep-input" value={form.name} placeholder="e.g. Race Day Alphas" onChange={e => set("name", e.target.value)} autoFocus />
            </div>

            <div className="wep-field">
              <label className="wep-label">Brand</label>
              <input className="wep-input" value={form.brand} placeholder="Nike, Adidas…" onChange={e => set("brand", e.target.value)} />
            </div>

            <div className="wep-field">
              <label className="wep-label">Model</label>
              <input className="wep-input" value={form.model} placeholder="Vaporfly, Alphafly…" onChange={e => set("model", e.target.value)} />
            </div>

            <div className="wep-field">
              <label className="wep-label">Date Added</label>
              <input className="wep-input" type="date" value={form.addedDate} onChange={e => set("addedDate", e.target.value)} />
            </div>

            <div className="wep-field">
              <label className="wep-label">Retire At (km)</label>
              <input className="wep-input" type="number" min="0" value={form.retireAt} onChange={e => set("retireAt", parseInt(e.target.value) || 0)} />
            </div>

            <div className="wep-field wep-field--wide">
              <label className="wep-label">Colour</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                {SHOE_COLORS.map(c => (
                  <div
                    key={c}
                    onClick={() => set("color", c)}
                    style={{
                      width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                      border: form.color === c ? `3px solid #fff` : "3px solid transparent",
                      boxShadow: form.color === c ? `0 0 0 2px ${c}` : "none",
                      transition: "box-shadow .15s",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="wep-field wep-field--wide">
              <label className="wep-label">Notes</label>
              <textarea className="wep-input wep-textarea" value={form.notes} placeholder="Stack height, drop, use case…" onChange={e => set("notes", e.target.value)} />
            </div>

            {!isNew && (
              <div className="wep-field wep-field--wide" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="shoe-retired" checked={!!form.retired} onChange={e => set("retired", e.target.checked)} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                <label htmlFor="shoe-retired" className="wep-label" style={{ marginBottom: 0, cursor: "pointer" }}>Mark as retired</label>
              </div>
            )}

          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={() => { if (form.name.trim()) onSave(form); }}>
            {isNew ? "Add Shoes" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShoesView = ({ shoes, setShoes, uploadedWorkouts, units, defaultShoeId, setDefaultShoeId }) => {
  const [showModal, setShowModal]   = useState(false);
  const [editShoe,  setEditShoe]    = useState(null);

  const saveShoe = (form) => {
    if (editShoe) {
      setShoes(prev => prev.map(s => s.id === editShoe.id ? { ...form, id: editShoe.id } : s));
    } else {
      setShoes(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
    setEditShoe(null);
  };

  const deleteShoe = (id) => {
    if (window.confirm("Delete these shoes? Workouts assigned to them will be unlinked.")) {
      setShoes(prev => prev.filter(s => s.id !== id));
    }
  };

  const openAdd  = () => { setEditShoe(null); setShowModal(true); };
  const openEdit = (s) => { setEditShoe(s);   setShowModal(true); };

  // Compute distance per shoe from workouts
  const shoeKm = (shoeId) =>
    // eslint-disable-next-line eqeqeq
    uploadedWorkouts.filter(w => w.shoeId == shoeId).reduce((s, w) => s + (w.distance || 0), 0);

  const distUnit  = units.distance === "mi" ? "mi" : "km";
  const distMult  = units.distance === "mi" ? 0.621371 : 1;

  const activeShoes  = shoes.filter(s => !s.retired);
  const retiredShoes = shoes.filter(s => s.retired);

  return (
    <div className="view-grid">
      {/* Header row */}
      <div className="card full-width">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: shoes.length > 0 ? 14 : 0 }}>
          <div>
            <h3 style={{ marginBottom: 2 }}>Shoe Tracker</h3>
            <p className="card-sub" style={{ marginBottom: 0 }}>Track mileage and retirement per shoe</p>
          </div>
          <button className="upload-btn" onClick={openAdd}>+ Add Shoes</button>
        </div>
        {shoes.filter(s => !s.retired).length > 0 && (
          <div className="shoe-default-row">
            <span className="shoe-default-label">Auto-assign on import</span>
            <select
              className="wep-input shoe-default-select"
              value={defaultShoeId || ""}
              onChange={e => setDefaultShoeId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">— None —</option>
              {shoes.filter(s => !s.retired).map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.brand ? ` (${s.brand}${s.model ? " " + s.model : ""})` : ""}
                </option>
              ))}
            </select>
            {defaultShoeId && (() => {
              const ds = shoes.find(s => s.id == defaultShoeId);
              return ds ? <span className="shoe-tag" style={{ "--shoe-color": ds.color }}><Icon name="shoe" size={12} style={{marginRight:4}} />{ds.name}</span> : null;
            })()}
          </div>
        )}
      </div>

      {shoes.length === 0 && (
        <div className="card full-width">
          <div className="workout-empty">
            <div className="workout-empty-icon"><Icon name="shoe" size={36} color="var(--text3)" /></div>
            <div className="workout-empty-title">No shoes added yet</div>
            <div className="workout-empty-sub">Add your running shoes to track mileage and get retirement reminders</div>
            <button className="upload-btn" style={{ marginTop: 16 }} onClick={openAdd}>+ Add Shoes</button>
          </div>
        </div>
      )}

      {/* Active shoes */}
      {activeShoes.length > 0 && (
        <div className="card full-width">
          <h3 style={{ marginBottom: 14 }}>Active Shoes</h3>
          <div className="shoe-grid">
            {activeShoes.map(shoe => {
              const totalKm   = shoeKm(shoe.id);
              const displayKm = parseFloat((totalKm * distMult).toFixed(1));
              const retireKm  = parseFloat((shoe.retireAt * distMult).toFixed(0));
              const pct       = Math.min(1, totalKm / (shoe.retireAt || 800));
              const remaining = parseFloat(((shoe.retireAt - totalKm) * distMult).toFixed(1));
              const warn      = pct >= 0.8;
              const critical  = pct >= 1.0;
              const ringColor = critical ? "#ef4444" : warn ? "#fbbf24" : shoe.color;
              const r = 38, circ = 2 * Math.PI * r;

              // Workouts count
              // eslint-disable-next-line eqeqeq
              const sessions = uploadedWorkouts.filter(w => w.shoeId == shoe.id).length;

              return (
                <div key={shoe.id} className={`shoe-card ${warn ? "shoe-card--warn" : ""} ${critical ? "shoe-card--critical" : ""}`} style={{ "--shoe-color": shoe.color }}>
                  <div className="shoe-card-top">
                    <div className="shoe-ring-wrap">
                      <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
                        <circle cx="48" cy="48" r={r} fill="none"
                          stroke={ringColor} strokeWidth="8"
                          strokeDasharray={`${pct * circ} ${circ}`}
                          strokeLinecap="round"
                          transform="rotate(-90 48 48)"
                          style={{ transition: "stroke-dasharray 1s ease" }}
                        />
                        <text x="48" y="44" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif">{displayKm}</text>
                        <text x="48" y="58" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="'Inter', sans-serif">{distUnit}</text>
                      </svg>
                    </div>
                    <div className="shoe-card-info">
                      <div className="shoe-name">{shoe.name}</div>
                      <div className="shoe-model">{[shoe.brand, shoe.model].filter(Boolean).join(" · ") || "—"}</div>
                      <div className="shoe-stats">
                        <span>{sessions} {sessions === 1 ? "run" : "runs"}</span>
                        <span>·</span>
                        <span>Retire at {retireKm} {distUnit}</span>
                      </div>
                      {critical ? (
                        <div className="shoe-alert shoe-alert--critical"><Icon name="retire" size={12} style={{marginRight:5}} />Retire these shoes now</div>
                      ) : warn ? (
                        <div className="shoe-alert shoe-alert--warn">⚠ {remaining} {distUnit} until retirement</div>
                      ) : (
                        <div className="shoe-remaining">{remaining > 0 ? `${remaining} ${distUnit} remaining` : "—"}</div>
                      )}
                      {shoe.notes && <div className="shoe-notes">{shoe.notes}</div>}
                    </div>
                  </div>
                  <div className="shoe-card-actions">
                    <button className="wra-btn wra-edit" onClick={() => openEdit(shoe)} title="Edit">✎</button>
                    <button className="wra-btn wra-delete" onClick={() => deleteShoe(shoe.id)} title="Delete"><Icon name="trash" size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Retired shoes */}
      {retiredShoes.length > 0 && (
        <div className="card full-width">
          <h3 style={{ marginBottom: 14 }}>Retired Shoes</h3>
          <div className="shoe-grid">
            {retiredShoes.map(shoe => {
              const totalKm   = shoeKm(shoe.id);
              const displayKm = parseFloat((totalKm * distMult).toFixed(1));
              // eslint-disable-next-line eqeqeq
              const sessions  = uploadedWorkouts.filter(w => w.shoeId == shoe.id).length;
              return (
                <div key={shoe.id} className="shoe-card shoe-card--retired" style={{ "--shoe-color": shoe.color }}>
                  <div className="shoe-card-top">
                    <div className="shoe-ring-wrap">
                      <svg width="96" height="96" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="38" fill="none" stroke="#1e293b" strokeWidth="8" />
                        <circle cx="48" cy="48" r="38" fill="none" stroke="#334155" strokeWidth="8" strokeDasharray={`${2*Math.PI*38} 0`} transform="rotate(-90 48 48)" />
                        <text x="48" y="44" textAnchor="middle" fill="#64748b" fontSize="13" fontWeight="700" fontFamily="'Barlow Condensed', sans-serif">{displayKm}</text>
                        <text x="48" y="58" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'Inter', sans-serif">{distUnit}</text>
                      </svg>
                    </div>
                    <div className="shoe-card-info">
                      <div className="shoe-name" style={{ color: "var(--text3)" }}>{shoe.name}</div>
                      <div className="shoe-model">{[shoe.brand, shoe.model].filter(Boolean).join(" · ") || "—"}</div>
                      <div className="shoe-stats"><span>{sessions} runs</span></div>
                      <div className="shoe-alert" style={{ color: "var(--text3)" }}>Retired</div>
                    </div>
                  </div>
                  <div className="shoe-card-actions">
                    <button className="wra-btn wra-edit" onClick={() => openEdit(shoe)} title="Edit / unretire">✎</button>
                    <button className="wra-btn wra-delete" onClick={() => deleteShoe(shoe.id)} title="Delete"><Icon name="trash" size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <ShoeModal
          shoe={editShoe}
          onSave={saveShoe}
          onClose={() => { setShowModal(false); setEditShoe(null); }}
        />
      )}
    </div>
  );
};


const NAV_ITEMS = [
  { id: "dashboard",   label: "Home",      icon: "◈",  svgIcon: "chart"    },
  { id: "workouts",    label: "Workouts",  icon: "▶",  svgIcon: "run"      },
  { id: "trends",      label: "Trends",    icon: "▦",  svgIcon: "trend"    },
  { id: "recovery",    label: "Recovery",  icon: "○",  svgIcon: "recovery" },
];

function App() {
  const [view, setView] = useState("dashboard");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  // ── localStorage-backed state ──────────────────────────────────────────────
  const load = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  const [athlete, setAthleteState] = useState(() => load("apex_athlete", { ...ATHLETE }));
  const [uploadedWorkouts, setUploadedWorkoutsState] = useState(() => load("apex_workouts", []));
  const [units, setUnitsState] = useState(() => load("apex_units", { distance: "km", altitude: "ft" }));
  const [theme, setThemeState] = useState(() => load("apex_theme", "dark"));
  const [shoes, setShoesState] = useState(() => load("apex_shoes", []));
  const [defaultShoeId, setDefaultShoeIdState] = useState(() => load("apex_defaultShoe", null));

  // Persisting wrappers
  const setAthlete        = v => { setAthleteState(v);        save("apex_athlete",      v); };
  const setUploadedWorkouts = v => {
    setUploadedWorkoutsState(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      save("apex_workouts", next);
      return next;
    });
  };
  const setUnits          = v => { setUnitsState(v);          save("apex_units",        v); };
  const setTheme          = v => { setThemeState(v);          save("apex_theme",        v); };
  const setShoes          = v => {
    const next = typeof v === "function" ? v(shoes) : v;
    setShoesState(next); save("apex_shoes", next);
  };
  const setDefaultShoeId  = v => { setDefaultShoeIdState(v);  save("apex_defaultShoe",  v); };

  useEffect(() => {
    document.documentElement.className = theme === "light" ? "light" : "";
  }, [theme]);

  // Karvonen method: zone boundary = restingHR + (maxHR - restingHR) * intensity%
  // Standard 5-zone intensities: 50 / 60 / 70 / 80 / 90% HRR
  // 4 upper-boundary intensities (% HRR): Z1 top / Z2 top / Z3 top / Z4 top
  // Z5 = everything above Z4 (> 90% HRR = approaching Max HR)
  const KARVONEN_PCTS = [0.60, 0.70, 0.80, 0.90];
  const defaultZoneBounds = (maxHR, restingHR) => {
    const hrr = Math.max(maxHR - restingHR, 1);
    return KARVONEN_PCTS.map(p => Math.round(restingHR + hrr * p));
  };
  const [customZones, setCustomZonesState] = useState(() => {
    const saved = load("apex_zones", null);
    if (saved) return saved;
    const a = load("apex_athlete", { ...ATHLETE });
    return defaultZoneBounds(a.maxHR, a.restingHR);
  });
  const setCustomZones = v => {
    const next = typeof v === "function" ? v(customZones) : v;
    setCustomZonesState(next); save("apex_zones", next);
  };

  const handleSetAthlete = (newAthlete) => {
    setAthlete(newAthlete);
    const maxHRChanged     = newAthlete.maxHR     !== athlete.maxHR;
    const restingHRChanged = newAthlete.restingHR !== athlete.restingHR;
    if (maxHRChanged || restingHRChanged) {
      setCustomZones(prev => {
        const oldDefaults = defaultZoneBounds(athlete.maxHR, athlete.restingHR);
        const isDefault = prev.every((v, i) => v === oldDefaults[i]);
        return isDefault ? defaultZoneBounds(newAthlete.maxHR, newAthlete.restingHR) : prev;
      });
    }
  };

  // Resolve estimated metrics for use across views (same logic as AthleteView)
  const resolveAthleteMetrics = (a, workouts = []) => {
    const maxHR     = parseInt(a.maxHR)     || 190;
    const restingHR = parseInt(a.restingHR) || 50;
    const hrr       = Math.max(maxHR - restingHR, 1);
    const weightKg  = (parseInt(a.weight) || 154) * 0.453592;
    const estLTHR   = Math.round(restingHR + hrr * 0.85);
    const estFTP    = Math.round(weightKg * 3.5 * (estLTHR / maxHR));
    const estVO2maxHR = parseFloat((15 * maxHR / restingHR).toFixed(1));
    const perfResult  = calcVO2maxFromWorkouts(workouts);
    return {
      lthr:   (parseInt(a.lthr)    || 0) > 0 ? parseInt(a.lthr)    : estLTHR,
      ftp:    (parseInt(a.ftp)     || 0) > 0 ? parseInt(a.ftp)     : estFTP,
      vo2max: (parseFloat(a.vo2max)|| 0) > 0 ? parseFloat(a.vo2max)
            : perfResult                      ? perfResult.value
            : estVO2maxHR,
    };
  };
  const resolvedAthleteMetrics = resolveAthleteMetrics(athlete, uploadedWorkouts);

  const handleSelectWorkout = (w) => {
    setSelectedWorkout(w);
    setView("workout-detail");
  };

  const handleBackFromWorkout = () => {
    setSelectedWorkout(null);
    setView("workouts");
  };

  const handleImport = (workouts) => {
    const stamped = defaultShoeId
      ? workouts.map(w => ({ ...w, shoeId: w.shoeId ?? defaultShoeId }))
      : workouts;
    setUploadedWorkouts(prev => [...stamped, ...prev]);
  };

  const handleDeleteWorkout = (id) => {
    setUploadedWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateWorkout = (updated) => {
    setUploadedWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        :root {
          /* ── Dark (default) — true black, minimal ── */
          --bg:          #0c0c0e;
          --bg2:         #111114;
          --bg3:         #18181c;
          --card:        #141417;
          --card-border: #222228;

          /* ── Accent palette ── */
          --accent:      #e8ff47;   /* electric yellow-green — readable on black */
          --accent2:     #ff4d00;   /* electric orange — effort/HR */
          --accent3:     #00d4aa;   /* teal — recovery/good */
          --accent4:     #8b5cf6;   /* violet — power/advanced */
          --accent5:     #3b82f6;   /* blue — secondary data */

          /* ── Keep legacy var names so existing code works ── */
          --lime:   var(--accent);
          --orange: var(--accent2);
          --green:  var(--accent3);
          --purple: var(--accent4);
          --blue:   var(--accent5);

          /* ── Text ── */
          --text:  #f5f5f7;
          --text1: #f5f5f7;
          --text2: #b0b0bc;
          --text3: #72727e;
        }

        /* ── Light mode ───────────────────────────────────────────── */
        html.light {
          --bg:          #f7f7f8;
          --bg2:         #ededef;
          --bg3:         #e3e3e6;
          --card:        #ffffff;
          --card-border: #d8d8dc;

          --accent:      #2a7d00;
          --accent2:     #c43300;
          --accent3:     #008a6e;
          --accent4:     #6d28d9;
          --accent5:     #1d4ed8;

          --lime:   var(--accent);
          --orange: var(--accent2);
          --green:  var(--accent3);
          --purple: var(--accent4);
          --blue:   var(--accent5);

          --text:  #111114;
          --text1: #111114;
          --text2: #4a4a55;
          --text3: #9a9aa8;
        }
        html.light body { background: var(--bg); color: var(--text); }
        html.light .custom-tooltip  { background: #fff; border-color: var(--card-border); color: var(--text); }
        html.light .quality-tooltip { background: #fff; }
        html.light .quality-tooltip::after { background: #fff; }
        html.light .coach-block { background: var(--bg2); border-color: var(--card-border); color: var(--text2); }
        html.light .ef-input, html.light .ef-select { background: var(--bg2); border-color: var(--card-border); color: var(--text); }
        html.light .wep-input, html.light .wep-textarea { background: var(--bg2); border-color: var(--card-border); color: var(--text); }
        html.light .back-btn, html.light .edit-btn, html.light .cancel-btn { background: var(--bg2); color: var(--text2); border-color: var(--card-border); }
        html.light .upload-btn { background: var(--bg2); color: var(--accent); border-color: var(--card-border); }
        html.light .modal-box { background: #fff; }
        html.light .dz-area { background: var(--bg2); border-color: var(--card-border); }
        html.light .se-block { background: rgba(0,0,0,.02); }
        html.light .se-formula { background: rgba(0,0,0,.03); }
        html.light .wep { background: var(--bg2); }
        
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.5;
          min-height: 100vh;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .app { display: flex; min-height: 100vh; flex-direction: column; }

        /* ── MOBILE TOP HEADER ──────────────────────────────────────── */
        .mobile-header {
          display: none;
          position: sticky; top: 0; z-index: 100;
          background: var(--bg2);
          border-bottom: 1px solid var(--card-border);
          padding: 0 20px;
          height: 52px;
          align-items: center;
          justify-content: center;
        }
        .mobile-header-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--text2); text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* ── BOTTOM TAB BAR ────────────────────────────────────────── */
        .bottom-nav {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: var(--bg2);
          border-top: 1px solid var(--card-border);
          -webkit-backdrop-filter: blur(24px);
          backdrop-filter: blur(24px);
          padding-bottom: env(safe-area-inset-bottom, 12px);
        }
        .bottom-nav-inner {
          display: flex; align-items: center;
          height: 58px;
          padding: 0 8px;
          gap: 2px;
        }
        .bottom-tab {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 4px; cursor: pointer;
          color: var(--text3); min-width: 0;
          border: none; background: none;
          padding: 6px 4px;
          border-radius: 14px;
          transition: color .15s, background .15s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .bottom-tab:active { opacity: 0.7; }
        .bottom-tab.active {
          color: var(--accent);
          background: rgba(232,255,71,.07);
        }
        .bottom-tab-icon {
          display: flex; align-items: center; justify-content: center;
          width: 24px; height: 24px;
        }
        .bottom-tab-label {
          font-size: 9px; font-weight: 600; letter-spacing: 0.3px;
          white-space: nowrap; text-transform: uppercase;
        }

        /* ── DESKTOP SIDEBAR ───────────────────────────────────────── */
        .sidebar {
          width: 210px;
          min-height: 100vh;
          background: var(--bg2);
          border-right: 1px solid var(--card-border);
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        
        .logo {
          padding: 0 20px 20px;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 12px;
        }
        
        .logo-mark {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 800;
          color: var(--accent); letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .logo-sub {
          font-size: 10px; color: var(--text3);
          letter-spacing: 3px; text-transform: uppercase;
          margin-top: 3px; font-weight: 500;
        }
        
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 20px; cursor: pointer;
          color: var(--text3); font-size: 12.5px; font-weight: 500;
          transition: all 0.12s; border-left: 2px solid transparent;
          letter-spacing: 0.3px;
        }
        .nav-item:hover { color: var(--text2); background: rgba(255,255,255,.04); }
        .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(232,255,71,.05); }
        .nav-icon { font-size: 14px; width: 16px; text-align: center; opacity: 0.7; }

        /* ── Theme pill toggle ─────────────────────────────────────── */
        .sidebar-spacer { flex: 1; }
        .theme-toggle-wrap {
          display: flex; align-items: center; gap: 8px;
          margin: 0 14px 10px; padding: 8px 12px;
          border-radius: 6px; border: 1px solid var(--card-border);
        }
        .theme-toggle-label {
          font-size: 11px; color: var(--text3);
          font-family: 'Inter', sans-serif; user-select: none;
        }
        .theme-pill {
          position: relative; width: 36px; height: 20px;
          border-radius: 10px; border: none; cursor: pointer;
          background: var(--card-border); transition: background .25s;
          flex-shrink: 0; padding: 0;
        }
        .theme-pill--light { background: var(--lime); }
        .theme-pill-thumb {
          position: absolute; top: 3px; left: 3px;
          width: 14px; height: 14px; border-radius: 50%;
          background: #fff; transition: transform .25s; display: block;
          box-shadow: 0 1px 3px rgba(0,0,0,.3);
        }
        .theme-pill--light .theme-pill-thumb { transform: translateX(16px); }

        /* ── Device badge ──────────────────────────────────────────── */
        .device-badge {
          font-size: 10px; color: var(--text3);
          background: var(--bg3); border: 1px solid var(--card-border);
          border-radius: 20px; padding: 2px 10px;
          font-family: 'Inter', sans-serif;
        }

        /* ── Route map ─────────────────────────────────────────────── */
        .route-map-wrap { margin-top: 4px; }
        .route-map-legend {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; color: var(--text3);
          margin-top: 8px; padding: 0 4px;
        }
        .rml-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

        .sidebar-athlete {
          margin-top: auto; padding: 14px 18px;
          border-top: 1px solid var(--card-border);
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; transition: background .15s;
        }
        .sidebar-athlete:hover { background: #ffffff06; }
        .sidebar-athlete--active { background: rgba(232,255,71,.03); border-left: 2px solid var(--lime); }
        .sa-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          background: #1e293b; border: 1px solid var(--card-border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700;
          color: var(--lime); letter-spacing: .04em;
        }
        .sidebar-athlete--active .sa-avatar { border-color: var(--lime); background: rgba(232,255,71,.08); }
        .sa-info { min-width: 0; }
        .sa-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sa-goal { font-size: 11px; color: var(--text3); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        /* ── MAIN CONTENT ──────────────────────────────────────────── */
        .app-body { display: flex; flex: 1; }
        .main {
          flex: 1; padding: 28px 32px; overflow-x: hidden;
        }
        .page-header { margin-bottom: 24px; }
        .page-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 700; color: var(--text); letter-spacing: 0px;
        }
        .page-date { font-size: 12px; color: var(--text2); margin-top: 4px; letter-spacing: 0.3px; }
        
        /* ── GRID ──────────────────────────────────────────────────── */
        .view-grid { display: flex; flex-direction: column; gap: 16px; }
        .row-4, .row-6, .row-3, .row-7 { display: grid; gap: 12px; align-items: stretch; }
        .row-4 { grid-template-columns: repeat(4, 1fr); }
        .row-6 { grid-template-columns: repeat(6, 1fr); }
        .row-7 { grid-template-columns: repeat(7, 1fr); }
        .row-3 { grid-template-columns: repeat(3, 1fr); }
        .row-2-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }

        .row-3-nowrap { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; align-items: stretch; }
        @media (max-width: 640px) { .row-3-nowrap { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; } }

        /* Tablet: collapse some multi-col grids */
        @media (max-width: 1024px) {
          .sidebar { width: 180px; }
          .main { padding: 20px 20px; }
          .row-6 { grid-template-columns: repeat(3, 1fr); }
          .row-7 { grid-template-columns: repeat(4, 1fr); }
          .row-4 { grid-template-columns: repeat(2, 1fr); }
        }

        /* Mobile: bottom nav, single column */
        @media (max-width: 640px) {
          .app { flex-direction: column; }
          .app-body { flex-direction: column; }
          .sidebar { display: none; }
          .mobile-header { display: flex; }
          .bottom-nav { display: block; }
          .main {
            padding: 12px 14px 90px;
          }
          .page-header { display: none; }
          .view-grid { gap: 12px; }
          .row-3, .row-4, .row-6, .row-7 { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .row-2-inline { grid-template-columns: 1fr 1fr; gap: 10px; }
          .card:not(.chart-card) { border-radius: 12px; padding: 16px 14px; }
          .full-width { width: 100%; }

          /* ── Mobile font scale-up ── */
          .card h3                { font-size: 20px; }
          .card-sub               { font-size: 13px; }
          .stat-card              { padding: 12px 8px; }
          .stat-label             { font-size: 12px; }
          .stat-value             { font-size: 28px; }
          .stat-sub               { font-size: 12px; }

          /* Dashboard quote */
          .dash-quote-text        { font-size: 16px; }
          .dash-quote-author      { font-size: 13px; }
          .drc-label              { font-size: 12px; }
          .drc-suggestion         { font-size: 15px; }
          .drc-stat-val           { font-size: 24px; }
          .drc-stat-lbl           { font-size: 11px; }
          .dqc-val                { font-size: 22px; }
          .dqc-lbl                { font-size: 11px; }
          .dlw-name               { font-size: 16px; }
          .dlw-stats              { font-size: 14px; }
          .dlw-label              { font-size: 12px; }
          .dlw-date               { font-size: 13px; }
          .mobile-header-title    { font-size: 17px; }

          /* Workout list */
          .wr-name                { font-size: 15px; }
          .wr-date                { font-size: 13px; }
          .wr-tag                 { font-size: 11px; }
          .wr-metric              { font-size: 15px; }
          .wr-metric-unit         { font-size: 12px; }
          .wr-chevron             { font-size: 20px; }

          /* Workout detail */
          .wdv-name               { font-size: 22px; }
          .wdv-date               { font-size: 14px; }
          .wdv-metric-val         { font-size: 22px; }
          .wdv-metric-lbl         { font-size: 11px; }
          .wdv-metric-unit        { font-size: 12px; }
          .back-btn               { font-size: 13px; }

          /* Recovery */
          .ra-label               { font-size: 13px; }
          .ra-rlabel              { font-size: 12px; }
          .risk-item              { font-size: 13px; }
          .coach-block            { font-size: 14px; }
          .recovery-suggestion    { font-size: 14px; }
          .se-title               { font-size: 13px; }
          .se-desc                { font-size: 13px; }
          .se-proj-label          { font-size: 13px; }
          .se-proj-val            { font-size: 13px; }

          /* Predictions */
          .pc-event               { font-size: 14px; }
          .pc-predicted           { font-size: 28px; }
          .pc-label               { font-size: 13px; }
          .pc-conf                { font-size: 12px; }

          .chart-card h3, .chart-card .card-sub, .chart-card > p { padding-left: 14px; padding-right: 14px; }
          .bottom-tab-icon svg    { width: 26px; height: 26px; }

          /* General text */
          p, li, span, div        { line-height: 1.5; }
          .air-section p          { font-size: 14px; }
          .air-title              { font-size: 14px; }
          .it-body                { font-size: 13px; }
          .it-row                 { font-size: 13px; }
          .wep-label              { font-size: 13px; }
          .wep-input              { font-size: 15px; }
          .wep-type-btn           { font-size: 13px; }
          .save-btn, .cancel-btn  { font-size: 14px; padding: 9px 16px; }
        }

        /* Very small phones */
        @media (max-width: 380px) {
          .row-3, .row-4, .row-6, .row-7 { grid-template-columns: 1fr 1fr; }
          .main { padding: 10px 10px 80px; }
        }
        
        /* CARDS */
        .card {
          background: var(--card);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 20px 22px;
          overflow: visible;
        }

        /* Chart cards — zero horizontal padding so graphs go edge to edge */
        .chart-card {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .chart-card h3,
        .chart-card .card-sub,
        .chart-card > p {
          padding-left: 20px;
          padding-right: 20px;
        }
        .recharts-responsive-container { width: 100% !important; }
        .recharts-surface { overflow: visible; }
        
        .card.full-width { width: 100%; }
        
        .card h3 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        
        .card-sub {
          font-size: 12px;
          color: var(--text2);
          margin-bottom: 16px;
        }
        
        /* ── DASHBOARD MOBILE ──────────────────────────────────────── */
        .dash-mobile { display: flex; flex-direction: column; gap: 14px; padding-top: 48px; }

        .dash-quote {
          padding: 4px 2px 0;
        }
        .dash-quote-text {
          font-size: 15px; color: var(--text2); font-style: italic;
          line-height: 1.5; letter-spacing: 0.1px;
        }
        .dash-quote-author {
          font-size: 12px; color: var(--text3); margin-top: 6px;
          font-weight: 500;
        }

        /* Readiness card */
        .dash-readiness-card {
          padding: 20px 18px !important;
          display: flex; flex-direction: column; align-items: center; gap: 0;
        }
        .drc-label {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
          color: var(--text3); font-weight: 600; margin-bottom: 8px;
        }
        .drc-ring-wrap {
          display: flex; align-items: center; justify-content: center;
          margin: 0 0 12px;
        }
        .drc-suggestion {
          font-size: 13px; color: var(--text2); text-align: center;
          line-height: 1.5; margin-bottom: 18px; max-width: 260px;
        }
        .drc-stats {
          display: flex; align-items: center; width: 100%;
          background: var(--bg3); border-radius: 10px; padding: 12px 8px;
          gap: 0;
        }
        .drc-stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .drc-stat-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px; font-weight: 700; line-height: 1;
        }
        .drc-stat-lbl { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; }
        .drc-stat-divider { width: 1px; height: 28px; background: var(--card-border); flex-shrink: 0; }

        /* Quick stats row */
        .dash-quick-row {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .dash-quick-card {
          background: var(--card); border: 1px solid var(--card-border);
          border-radius: 12px; padding: 12px 10px;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .dqc-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 700; color: var(--text1);
        }
        .dqc-lbl { font-size: 10px; color: var(--text3); text-align: center; letter-spacing: 0.3px; }

        /* Last workout card */
        .dash-last-workout { display: flex; flex-direction: column; gap: 4px; }
        .dlw-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2px; }
        .dlw-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text3); font-weight: 600; }
        .dlw-date { font-size: 11px; color: var(--text3); }
        .dlw-name { font-size: 15px; font-weight: 600; color: var(--text1); }
        .dlw-stats { font-size: 12px; color: var(--text2); display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-top: 2px; }
        .dlw-dot { color: var(--text3); }
        .dlw-empty { font-size: 12px; color: var(--text3); margin-top: 6px; font-style: italic; }

        /* Empty chart placeholder */
        .dash-chart-empty {
          height: 180px; display: flex; flex-direction: column;
          align-items: center; justify-content: flex-end; gap: 12px;
          padding-bottom: 16px;
        }
        .dash-chart-empty-bars {
          display: flex; align-items: flex-end; gap: 8px; height: 100px;
        }
        .dash-chart-empty-bar {
          width: 28px; background: var(--card-border);
          border-radius: 4px 4px 0 0; opacity: 0.5;
        }
        .dash-chart-empty-label {
          font-size: 11px; color: var(--text3); text-align: center;
        }

        /* STAT CARDS */
        .stat-card {
          background: var(--card);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-label {
          font-size: 10px;
          color: var(--text2);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.5px;
          display: flex;
          align-items: baseline;
          justify-content: center;
        }
        
        .stat-sub {
          font-size: 10px;
          color: var(--text2);
          margin-top: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .stat-delta {
          font-size: 11px;
          margin-top: 5px;
          font-weight: 600;
        }
        .stat-delta.pos { color: var(--green); }
        .stat-delta.neg { color: var(--orange); }
        
        /* TOOLTIP */
        .custom-tooltip {
          background: #0a1628;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12px;
          min-width: 120px;
        }
        
        .tt-label { color: var(--text3); font-size: 11px; margin-bottom: 6px; }
        .tt-row { display: flex; justify-content: space-between; gap: 16px; margin: 2px 0; font-weight: 600; }
        
        /* HR ZONES */
        .hr-zone-bar {
          display: flex;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .hz-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #000;
          transition: all 0.3s;
        }
        
        .zone-legend { display: flex; flex-direction: column; gap: 10px; }
        .zl-item { display: flex; align-items: center; gap: 10px; font-size: 15px; }
        .zl-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .zl-name { flex: 1; color: var(--text2); }
        .zl-pct { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; color: var(--text3); }
        
        /* QUALITY BADGE */
        .quality-badge-wrap {
          position: relative; display: inline-flex; align-items: center;
        }
        .quality-badge {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: .04em;
          border: 1px solid;
          border-radius: 20px;
          padding: 3px 10px;
          white-space: nowrap;
          cursor: default;
        }
        .quality-tooltip {
          width: 240px; z-index: 9999;
          background: var(--card);
          border: 1px solid var(--qt-color, #c8f542);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,.6);
          overflow: hidden;
          pointer-events: none;
        }
        .quality-tooltip::after {
          content: ""; position: absolute; bottom: -6px; right: 20px;
          width: 10px; height: 10px;
          background: var(--card);
          border-right: 1px solid var(--qt-color, #c8f542);
          border-bottom: 1px solid var(--qt-color, #c8f542);
          transform: rotate(45deg);
        }
        .qt-header {
          display: flex; align-items: baseline; gap: 6px;
          padding: 10px 14px 8px;
          border-bottom: 1px solid var(--card-border);
          background: rgba(255,255,255,.02);
        }
        .qt-score {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 700; line-height: 1;
        }
        .qt-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em;
        }
        .qt-title {
          margin-left: auto; font-size: 10px; color: var(--text3);
          text-transform: uppercase; letter-spacing: .08em;
        }
        .qt-rows { padding: 8px 14px; display: flex; flex-direction: column; gap: 6px; }
        .qt-row {
          display: grid; grid-template-columns: 72px 64px 1fr;
          align-items: center; gap: 6px; font-size: 11px;
        }
        .qt-key { color: var(--text3); }
        .qt-val { font-weight: 700; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; }
        .qt-note { color: var(--text3); font-size: 11px; }
        .qt-footer {
          font-size: 10px; color: var(--text3); line-height: 1.4;
          padding: 6px 14px 10px; border-top: 1px solid var(--card-border);
          font-style: italic;
        }

        /* INFO STAT CARD */
        .info-stat-card {
          align-items: center;
          text-align: center;
          position: relative;
        }
        .info-stat-card--hoverable {
          cursor: pointer;
          transition: border-color .15s;
        }
        .info-stat-card--hoverable:hover {
          border-color: rgba(255,255,255,.2);
        }
        .info-stat-card .stat-label {
          display: block;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          justify-content: center;
        }
        .info-stat-card .stat-value {
          justify-content: center;
        }
        .info-stat-card .stat-sub {
          justify-content: center; text-align: center;
        }
        .info-icon {
          display: inline-flex; align-items: center;
          color: var(--text3); cursor: default; flex-shrink: 0;
          transition: color .15s;
        }
        .info-icon:hover { color: var(--text1); }
        .info-tooltip-portal {
          position: absolute; width: 240px; z-index: 9999;
          background: var(--card);
          border: 1px solid var(--it-color, #c8f542);
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0,0,0,.75);
          overflow: hidden;
          pointer-events: none;
          text-align: left;
        }
        .it-header {
          padding: 10px 14px 8px;
          border-bottom: 1px solid var(--card-border);
          background: rgba(255,255,255,.02);
        }
        .it-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
        }
        .it-body {
          font-size: 11px; color: var(--text2); line-height: 1.5;
          padding: 8px 14px 6px;
        }
        .it-rows {
          padding: 4px 14px 8px; display: flex; flex-direction: column; gap: 0;
        }
        .it-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 11px; padding: 4px 0; border-top: 1px solid var(--card-border);
        }
        .it-row:first-child { border-top: none; }
        .it-row-key { color: var(--text3); }
        .it-row-val { font-weight: 700; font-family: 'Barlow Condensed', sans-serif; font-size: 12px; }
        .it-footer {
          font-size: 10px; color: var(--text3); line-height: 1.4;
          padding: 6px 14px 10px; border-top: 1px solid var(--card-border);
          font-style: italic;
        }
        
        /* RECOVERY */
        .recovery-layout { display: flex; align-items: center; gap: 24px; }
        .recovery-details { flex: 1; }
        .recovery-score { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .rs-label { font-size: 12px; color: var(--text3); }
        .rs-value { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 700; }
        .recovery-badge {
          display: inline-block;
          background: #34d39920;
          border: 1px solid #34d39940;
          color: var(--green);
          font-size: 10px;
          font-weight: 600;
          border-radius: 20px;
          padding: 4px 12px;
          margin-bottom: 10px;
        }
        .suggestion { font-size: 12px; color: var(--text2); margin-bottom: 8px; }
        .risk-factor { font-size: 11px; color: var(--orange); margin: 3px 0; }
        
        /* PREDICTIONS */
        .predictions-list { display: flex; flex-direction: column; gap: 12px; }
        .pred-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--card-border);
        }
        .pred-event { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; color: var(--text3); width: 50px; }
        .pred-times { display: flex; align-items: center; gap: 8px; flex: 1; }
        .pred-current { font-size: 12px; color: var(--text3); }
        .pred-arrow { color: var(--text3); font-size: 12px; }
        .pred-predicted { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; font-weight: 700; }
        .pred-bar-wrap { display: flex; align-items: center; gap: 8px; width: 120px; }
        .pred-bar { height: 4px; background: var(--lime); border-radius: 2px; }
        .pred-conf { font-size: 12px; color: var(--text3); white-space: nowrap; }
        
        /* WORKOUTS */
        .workout-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .wl-upload-btn {
          display: inline-flex; align-items: center;
          padding: 7px 14px; border-radius: 8px;
          background: rgba(232,255,71,.1); border: 1px solid rgba(232,255,71,.25);
          color: var(--accent); font-size: 12px; font-weight: 600;
          font-family: 'Inter', sans-serif; cursor: pointer;
          transition: background .15s; white-space: nowrap;
          flex-shrink: 0;
        }
        .wl-upload-btn:hover { background: rgba(232,255,71,.18); }
          background: var(--lime);
          color: #0c0c0e;
          border: none;
          border-radius: 8px;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.15s;
        }
        .upload-btn:hover { opacity: 0.85; }
        
        .workout-list { display: flex; flex-direction: column; gap: 0; overflow: visible; }
        
        .workout-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 8px;
          border-bottom: 1px solid var(--card-border);
          cursor: pointer;
          transition: background 0.15s;
          border-radius: 6px;
        }
        .workout-row:hover { background: rgba(255,255,255,.03); }
        
        /* Type icon */
        .wr-type { width: 24px; flex-shrink: 0; color: var(--text3); display: flex; align-items: center; }

        /* Name / date / tag stack */
        .wr-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .wr-name {
          font-size: 13px; font-weight: 600; color: var(--text1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wr-date { font-size: 11px; color: var(--text3); }
        .wr-tag {
          display: inline-flex; align-items: center; gap: 2px;
          margin-top: 3px; padding: 2px 7px;
          border-radius: 20px; border: 1px solid;
          font-size: 9px; font-weight: 600; letter-spacing: .04em;
          width: fit-content;
        }

        /* Fixed metric columns — always same width so they align across rows */
        .wr-metrics {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 2px; flex-shrink: 0;
        }
        .wr-metric {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 500; color: var(--text2);
          white-space: nowrap;
          min-width: 64px; text-align: right;
        }
        .wr-metric-unit { font-size: 10px; color: var(--text3); margin-left: 1px; }

        .wr-chevron { color: var(--text3); font-size: 18px; flex-shrink: 0; }

        /* Workout type badge */
        .workout-type-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 600;
          letter-spacing: .03em; white-space: nowrap;
        }
        .workout-row-wrap { display: flex; flex-direction: column; overflow: visible; }
        .row-open { border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-bottom-color: transparent; }
        .wra-active { background: rgba(232,255,71,.12) !important; color: #c8f542 !important; border-color: rgba(232,255,71,.38) !important; }

        /* Workout edit panel */
        .wep {
          background: var(--bg2);
          border: 1px solid var(--card-border);
          border-top: 1px solid rgba(232,255,71,.19);
          border-radius: 0 0 10px 10px;
          padding: 16px 18px;
        }
        .wep-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }
        .wep-field { display: flex; flex-direction: column; gap: 5px; }
        .wep-field--wide { grid-column: span 2; }
        .wep-field--full { grid-column: span 3; }
        .wep-label { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--text3); }
        .wep-input {
          background: var(--bg3); border: 1px solid var(--card-border); border-radius: 7px;
          color: var(--text1); font-size: 10px; padding: 7px 10px;
          font-family: 'Inter', sans-serif; outline: none; width: 100%;
          transition: border-color .15s;
        }
        .wep-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 2px #38bdf815; }
        .wep-textarea { resize: vertical; min-height: 60px; }
        .wep-type-grid {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .wep-type-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 20px; font-size: 10px; font-weight: 500;
          background: transparent; color: var(--text2);
          border: 1px solid var(--card-border); cursor: pointer;
          transition: background .15s, color .15s, border-color .15s;
        }
        .wep-type-btn:hover { background: rgba(255,255,255,.05); color: var(--text1); }
        .wep-type-btn.active {
          background: color-mix(in srgb, var(--wt-color) 15%, transparent);
          color: var(--wt-color); border-color: var(--wt-color);
        }
        .wep-actions {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 12px; border-top: 1px solid var(--card-border);
        }

        /* Shoe tag in workout row */
        .shoe-tag {
          font-size: 10px; font-weight: 600; padding: 1px 7px; border-radius: 20px;
          color: var(--shoe-color, #c8f542);
          border: 1px solid color-mix(in srgb, var(--shoe-color, #c8f542) 40%, transparent);
          background: color-mix(in srgb, var(--shoe-color, #c8f542) 10%, transparent);
          white-space: nowrap;
        }

        /* Shoe grid */
        .shoe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
        .shoe-card {
          background: var(--bg2); border: 1px solid var(--card-border); border-radius: 12px;
          padding: 16px; display: flex; flex-direction: column; gap: 12px;
          border-left: 3px solid var(--shoe-color, #c8f542);
          transition: border-color .2s;
        }
        .shoe-card--warn     { border-left-color: #fbbf24; }
        .shoe-card--critical { border-left-color: #ef4444; animation: pulse-border 2s infinite; }
        .shoe-card--retired  { opacity: .55; border-left-color: #334155; }
        @keyframes pulse-border {
          0%, 100% { border-left-color: #ef4444; }
          50%       { border-left-color: #ef444460; }
        }
        .shoe-card-top { display: flex; gap: 14px; align-items: flex-start; }
        .shoe-ring-wrap { flex-shrink: 0; }
        .shoe-card-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .shoe-name  { font-size: 10px; font-weight: 700; color: var(--text1); font-family: 'Barlow Condensed', sans-serif; letter-spacing: .03em; }
        .shoe-model { font-size: 12px; color: var(--text3); }
        .shoe-stats { font-size: 12px; color: var(--text3); display: flex; gap: 6px; }
        .shoe-alert { font-size: 12px; font-weight: 600; margin-top: 2px; }
        .shoe-alert--warn     { color: #fbbf24; }
        .shoe-alert--critical { color: #ef4444; }
        .shoe-remaining { font-size: 12px; color: var(--text3); margin-top: 2px; }
        .shoe-notes { font-size: 12px; color: var(--text3); font-style: italic; margin-top: 4px; line-height: 1.4; }
        .shoe-default-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 8px;
          background: rgba(255,255,255,.02); border: 1px solid var(--card-border);
        }
        .shoe-default-label { font-size: 12px; color: var(--text3); white-space: nowrap; text-transform: uppercase; letter-spacing: .07em; }
        .shoe-default-select { width: auto; flex: 1; padding: 5px 10px; font-size: 12px; }

        /* Gear tabs */
        .gear-header { display: flex; align-items: center; justify-content: space-between; }
        .gear-tabs { display: flex; gap: 4px; background: var(--bg3); border-radius: 8px; padding: 3px; }
        .gear-tab {
          padding: 6px 16px; border-radius: 6px; font-size: 10px; font-weight: 600;
          background: transparent; color: var(--text3); border: none; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .gear-tab:hover { color: var(--text1); }
        .gear-tab.active { background: var(--card); color: var(--text1); box-shadow: 0 1px 4px rgba(0,0,0,.3); }
          cursor: pointer;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 1px 5px;
          transition: background .15s, border-color .15s;
        }
        .workout-type-badge-sm--clickable:hover {
          background: rgba(255,255,255,.06);
        }

        /* Tag picker dropdown */
        .tag-picker {
          position: absolute; top: calc(100% + 6px); left: 0;
          z-index: 300;
          background: var(--card);
          border: 1px solid var(--card-border);
          border-radius: 10px;
          box-shadow: 0 10px 36px rgba(0,0,0,.7);
          overflow: hidden;
          min-width: 160px;
        }
        .tag-picker-header {
          font-size: 10px; text-transform: uppercase; letter-spacing: .1em;
          color: var(--text3); padding: 8px 12px 4px;
        }
        .tag-picker-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 12px; cursor: pointer; font-size: 10px;
          color: var(--text2); transition: background .12s;
        }
        .tag-picker-item:hover { background: rgba(255,255,255,.05); color: var(--text1); }
        .tag-picker-item.active { color: var(--tp-color, #c8f542); }
        .tp-icon { font-size: 10px; width: 18px; text-align: center; }
        .tp-label { flex: 1; font-weight: 500; }
        .tp-check { font-size: 10px; color: var(--tp-color, #c8f542); font-weight: 700; }
          display: inline-flex; align-items: center; gap: 3px;
          margin-left: 8px; font-size: 10px; font-weight: 600; opacity: 0.9;
          white-space: nowrap;
        }

        /* Lap table */
        .lap-table { margin-top: 12px; }
        .lap-header, .lap-row {
          display: grid;
          grid-template-columns: 36px 90px 72px 90px 72px;
          gap: 0; align-items: center;
          padding: 10px 8px;
        }
        .lap-header {
          font-size: 12px; text-transform: uppercase; letter-spacing: .07em;
          color: var(--text3); border-bottom: 1px solid var(--card-border);
          padding-bottom: 10px;
        }
        .lap-row {
          font-size: 14px; border-bottom: 1px solid var(--card-border);
          transition: background .1s;
        }
        .lap-row:hover { background: #ffffff05; }
        .lap-even { background: #ffffff02; }
        .lap-num  { color: var(--text3); font-size: 13px; }
        .lap-dist { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; color: var(--text1); font-size: 15px; }
        .lap-time { font-family: 'Barlow Condensed', sans-serif; color: var(--text2); font-size: 15px; }
        .lap-pace { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 4px; }
        .lap-hr   { color: var(--text2); font-size: 14px; }
        .lap-cad  { color: #34d399; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; }
        .lap-delta { font-size: 12px; }
        .lap-slow  { color: #f97316; }

        /* Workout row actions (imported only) */
        .wr-actions { display: flex; gap: 5px; align-items: center; flex-shrink: 0; }
        .wra-btn {
          width: 30px; height: 30px; border-radius: 7px; border: 1px solid var(--card-border);
          background: transparent; cursor: pointer; font-size: 10px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text3); transition: background .15s, color .15s, border-color .15s;
        }
        .wra-btn:hover { background: var(--bg2); color: var(--text1); border-color: var(--text3); }
        .wra-edit:hover   { color: #38bdf8; border-color: #38bdf840; background: #38bdf810; }
        .wra-delete:hover { color: #ef4444; border-color: #ef444440; background: #ef444410; }
        .wra-confirm:hover { color: #34d399; border-color: #34d39940; background: #34d39910; }
        .wra-cancel:hover  { color: #f97316; border-color: #f9731640; background: #f9731610; }

        /* Inline name edit input */
        .wr-name-input {
          background: var(--bg2); border: 1px solid #38bdf850; border-radius: 6px;
          color: var(--text1); font-size: 10px; font-weight: 600;
          padding: 3px 8px; outline: none; width: 220px; max-width: 100%;
          font-family: inherit;
        }
        .wr-name-input:focus { border-color: #38bdf8; box-shadow: 0 0 0 2px #38bdf815; }

        /* Empty state */
        .view-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 60vh; gap: 12px; text-align: center; padding: 40px;
        }
        .ve-icon { font-size: 52px; opacity: 0.4; }
        .ve-title { font-size: 20px; font-weight: 700; color: var(--text1); font-family: 'Barlow Condensed', sans-serif; letter-spacing: .04em; }
        .ve-sub { font-size: 10px; color: var(--text3); max-width: 300px; line-height: 1.6; }
        .workout-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 56px 24px; gap: 8px; text-align: center;
        }
        .workout-empty-icon { font-size: 40px; margin-bottom: 4px; opacity: 0.5; }
        .workout-empty-title { font-size: 10px; font-weight: 600; color: var(--text1); }
        .workout-empty-sub { font-size: 10px; color: var(--text3); max-width: 280px; line-height: 1.5; }
        
        /* WORKOUT DETAIL */
        .workout-detail-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* ── Workout detail view header ─────────────────────────── */
        .wdv-header {
          display: flex; flex-direction: column; gap: 0;
          padding: 14px 16px !important;
        }
        .wdv-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .wdv-identity { display: flex; flex-direction: column; gap: 3px; }
        .wdv-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 700; color: var(--text1);
          line-height: 1.1;
        }
        .wdv-date { font-size: 12px; color: var(--text3); }
        .wdv-edit-btn {
          display: none; /* removed — replaced by dots menu */
        }

        /* Three-dots menu */
        .wdv-menu-wrap { position: relative; }
        .wdv-dots-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid var(--card-border);
          background: transparent; color: var(--text2);
          font-size: 18px; line-height: 1; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color .15s, background .15s;
          letter-spacing: 1px;
        }
        .wdv-dots-btn:hover, .wdv-dots-btn--open {
          border-color: var(--accent); color: var(--accent);
          background: rgba(232,255,71,.06);
        }
        .wdv-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: var(--card); border: 1px solid var(--card-border);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,.4);
          min-width: 160px; z-index: 500;
        }
        .wdv-menu-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 11px 14px;
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-family: 'Inter', sans-serif;
          color: var(--text1); text-align: left;
          transition: background .12s;
        }
        .wdv-menu-item:hover { background: rgba(255,255,255,.05); }
        .wdv-menu-item + .wdv-menu-item { border-top: 1px solid var(--card-border); }
        .wdv-menu-item--danger { color: #ef4444; }
        .wdv-menu-item--danger:hover { background: rgba(239,68,68,.08); }

        /* ── Workout metrics grid ───────────────────────────────── */
        .wdv-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .wdv-metric {
          background: var(--card); border: 1px solid var(--card-border);
          border-radius: 10px; padding: 10px 8px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 4px;
          text-align: center;
        }
        .wdv-metric-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px; font-weight: 700; line-height: 1;
        }
        .wdv-metric-unit {
          font-size: 10px; font-weight: 400;
          color: var(--text3); margin-left: 1px;
        }
        .wdv-metric-lbl {
          font-size: 9px; color: var(--text3);
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .back-btn {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--text2);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 10px;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
          transition: border-color 0.15s;
        }
        .back-btn:hover { border-color: var(--lime); color: var(--lime); }
        .wdh-info { flex: 1; }
        .wdh-info h2 { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; }
        
        /* COACH */
        .coach-list { display: flex; flex-direction: column; gap: 12px; }
        .coach-insight {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #ffffff05;
          border: 1px solid var(--card-border);
          border-radius: 10px;
          padding: 14px 16px;
        }
        .ci-icon-wrap {
          width: 38px; height: 38px; flex-shrink: 0;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .ci-icon { font-size: 18px; line-height: 1; }
        .ci-content { flex: 1; min-width: 0; }
        .ci-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }
        .ci-category { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .ci-title { font-size: 10px; font-weight: 600; color: var(--text1); }
        .ci-body { font-size: 13px; color: var(--text2); line-height: 1.6; margin: 0; }
        
        /* ── ATHLETE PROFILE VIEW ──────────────────────────────────── */
        .apv-header {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px !important;
        }
        .apv-avatar {
          width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
          background: rgba(232,255,71,.1); border: 2px solid rgba(232,255,71,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif; font-size: 18px;
          font-weight: 800; color: var(--accent);
        }
        .apv-info { flex: 1; min-width: 0; }
        .apv-name { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 700; color: var(--text1); }
        .apv-goal { font-size: 12px; color: var(--text3); margin-top: 2px; display: flex; align-items: center; }
        .apv-meta { font-size: 11px; color: var(--text3); margin-top: 2px; }
        .apv-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }

        /* Edit form */
        .apv-edit-form { display: flex; flex-direction: column; gap: 16px; }
        .apv-edit-group { display: flex; flex-direction: column; gap: 8px; }
        .apv-edit-group-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: var(--text3); padding-bottom: 6px;
          border-bottom: 1px solid var(--card-border);
        }
        .apv-edit-fields { display: flex; flex-direction: column; gap: 10px; }
        .apv-edit-row { display: flex; align-items: center; gap: 8px; }
        .apv-edit-label { font-size: 13px; color: var(--text2); flex: 1; }
        .apv-edit-input-wrap { display: flex; align-items: center; gap: 6px; }

        /* HR grid — 2×2 */
        .apv-hr-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 10px;
        }
        .apv-hr-chip {
          background: var(--bg3); border: 1px solid var(--card-border);
          border-radius: 10px; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 3px;
        }
        .apv-hr-val {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 26px; font-weight: 700; color: var(--text1); line-height: 1;
        }
        .apv-hr-unit { font-size: 13px; color: var(--text3); margin-left: 3px; font-weight: 400; }
        .apv-hr-label { font-size: 12px; color: var(--text3); letter-spacing: 0.3px; }

        /* Zone edit actions */
        .apv-zone-actions { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .apv-secondary-btn {
          width: 100%; padding: 10px; border-radius: 8px; margin-top: 4px;
          border: 1px solid var(--card-border); background: transparent;
          color: var(--text3); font-size: 13px; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: border-color .15s, color .15s; text-align: center;
        }
        .apv-secondary-btn:hover { border-color: var(--accent); color: var(--accent); }

        /* Keep old classes for any remaining references */
        .athlete-profile-card { display: flex; align-items: center; gap: 20px; }
        .athlete-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--lime); color: #0c0c0e; font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .athlete-info h2 { font-family: 'Barlow Condensed', sans-serif; font-size: 20px; }
        .athlete-goal { font-size: 12px; color: var(--lime); margin-top: 4px; }
        .athlete-meta { font-size: 11px; color: var(--text3); margin-top: 4px; }
        
        .phys-list { display: flex; flex-direction: column; gap: 0; margin-top: 8px; }
        .phys-row {
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid var(--card-border);
          font-size: 14px;
        }
        .phys-key { color: var(--text3); flex-shrink: 0; }
        .phys-val { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 16px; color: var(--text); flex: 1; text-align: right; }
        
        .zone-table { display: flex; flex-direction: column; gap: 0; margin-top: 8px; }
        .zone-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 0;
          border-bottom: 1px solid var(--card-border);
          font-size: 14px;
        }
        .zone-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .zone-name { flex: 1; color: var(--text2); font-weight: 500; }
        .zone-range { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; color: var(--text); }
        .zone-pct { font-size: 14px; color: var(--text3); width: 80px; text-align: right; }
        
        /* RECOVERY FULL */
        .recovery-full {
          display: flex; align-items: stretch; gap: 0; margin-top: 16px;
        }
        .recovery-left {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px; padding: 8px 32px 8px 8px; min-width: 180px;
        }
        .recovery-readiness-label {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .recovery-readiness-label .ra-label { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--text3); }
        .recovery-readiness-value { font-size: 22px; font-weight: 700; font-family: 'Barlow Condensed', sans-serif; }
        .recovery-suggestion { font-size: 14px; color: var(--text3); text-align: center; max-width: 160px; line-height: 1.4; }
        .recovery-divider { width: 1px; background: var(--card-border); margin: 0 28px; flex-shrink: 0; }
        .recovery-right { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 4px 0; }
        .recovery-analysis { flex: 1; }
        .ra-readiness { font-size: 13px; margin-bottom: 8px; font-weight: 500; }
        .ra-label { color: var(--text3); }
        .ra-suggestion { font-size: 13px; color: var(--text2); margin-bottom: 16px; }
        .ra-risks { margin: 8px 0 0; display: flex; flex-direction: column; gap: 5px; }
        .ra-rlabel { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: var(--text3); margin-bottom: 6px; }
        .risk-item { font-size: 12px; color: var(--orange); margin: 4px 0; }
        .coach-block {
          font-size: 10px;
          color: var(--text2);
          background: #ffffff03;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 12px;
          line-height: 1.6;
        }
        
        /* PRED CARDS */
        .pred-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 20px; }
        .pred-card {
          background: var(--bg3);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .pc-event { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: var(--lime); margin-bottom: 12px; }
        .pc-current { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; color: var(--text3); }
        .pc-arrow { font-size: 18px; color: var(--text3); margin: 8px 0; }
        .pc-predicted { font-family: 'Barlow Condensed', sans-serif; font-size: 24px; font-weight: 700; color: var(--text); }
        .pc-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin: 4px 0 12px; }
        .pc-conf-bar { height: 4px; background: var(--card-border); border-radius: 2px; margin-bottom: 6px; }
        .pc-conf-fill { height: 100%; background: var(--lime); border-radius: 2px; }
        .pc-conf-label { font-size: 10px; color: var(--text3); }
        
        /* AI REPORT */
        .ai-report { display: flex; flex-direction: column; gap: 16px; margin-top: 12px; }
        .air-section {
          background: #ffffff03;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 14px 16px;
        }
        .air-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--lime);
          margin-bottom: 8px;
        }
        .air-section p { font-size: 13px; color: var(--text2); line-height: 1.6; }
        
        /* CALENDAR */
        .cal-card { padding: 20px 22px; }

        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .cal-nav-btn {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--text2);
          border-radius: 6px;
          width: 32px;
          height: 32px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s, color 0.15s;
        }
        .cal-nav-btn:hover { border-color: var(--lime); color: var(--lime); }

        .cal-grid-wrap {
          display: flex;
          gap: 0;
        }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
          flex: 1;
        }

        .cal-dow {
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 6px 0;
        }

        .cal-cell {
          aspect-ratio: 1;
          border-radius: 8px;
          padding: 6px;
          cursor: default;
          border: 1px solid transparent;
          transition: background 0.12s, border-color 0.12s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-height: 72px;
          position: relative;
        }

        .cal-cell.empty { background: transparent; cursor: default; }

        .cal-cell.has-workout {
          background: var(--bg3);
          cursor: pointer;
        }
        .cal-cell.has-workout:hover { border-color: var(--card-border); background: var(--bg2); }

        .cal-cell.today .cal-day-num {
          background: var(--lime);
          color: #0c0c0e;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .cal-cell.selected {
          border-color: var(--lime) !important;
          background: rgba(232,255,71,.06) !important;
        }

        .cal-day-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: var(--text3);
          line-height: 1;
          margin-bottom: 4px;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cal-cell.has-workout .cal-day-num { color: var(--text); }

        .cal-dots {
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }

        .cal-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .cal-day-km {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 600;
          color: var(--lime);
          margin-top: auto;
          letter-spacing: 0.3px;
        }

        /* Weekly totals sidebar */
        .cal-week-totals {
          display: flex;
          flex-direction: column;
          width: 90px;
          flex-shrink: 0;
          padding-left: 12px;
          border-left: 1px solid var(--card-border);
          margin-left: 12px;
        }

        .cwt-header {
          font-size: 10px;
          font-weight: 700;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 6px 0;
          height: 28px;
          display: flex;
          align-items: center;
        }

        .cwt-row {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4px 0;
          border-top: 1px solid var(--card-border);
        }

        .cwt-km {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          line-height: 1;
        }

        .cwt-unit {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .cwt-sessions {
          font-size: 10px;
          color: var(--text3);
          margin-top: 2px;
        }

        /* Selected day workout list */
        .cal-workout-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }

        .cal-workout-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--bg3);
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 12px 14px;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .cal-workout-item:hover { border-color: var(--lime); }

        .cwi-type-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .cwi-info { flex: 1; }
        .cwi-name { font-size: 10px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .cwi-meta { display: flex; gap: 14px; font-size: 12px; color: var(--text3); }
        .cwi-arrow { color: var(--text3); font-size: 18px; }

        
        .edit-form-card { }
        
        .edit-groups { display: flex; flex-direction: column; gap: 24px; margin-top: 8px; }
        
        .edit-group { }
        .eg-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--lime);
          font-weight: 600;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--card-border);
        }
        
        .eg-fields { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        
        .ef-row { display: flex; flex-direction: column; gap: 6px; }
        
        .ef-label {
          font-size: 10px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 500;
        }
        
        .ef-input-wrap { display: flex; align-items: center; gap: 8px; }
        
        .ef-input, .ef-select {
          background: var(--bg);
          border: 1px solid var(--card-border);
          border-radius: 7px;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 500;
          padding: 9px 12px;
          width: 100%;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          -moz-appearance: textfield;
        }
        .ef-input::-webkit-inner-spin-button,
        .ef-input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .ef-input:focus, .ef-select:focus {
          border-color: var(--lime);
          box-shadow: 0 0 0 2px rgba(232,255,71,.09);
        }
        .ef-select { appearance: none; cursor: pointer; }
        
        .ef-unit {
          font-size: 10px;
          color: var(--text3);
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--card-border);
        }
        
        .edit-btn {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--text2);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
        }
        .edit-btn:hover { border-color: var(--lime); color: var(--lime); }
        
        .save-btn {
          background: var(--lime);
          color: #0c0c0e;
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.15s;
        }
        .save-btn:hover { opacity: 0.85; }
        
        .cancel-btn {
          background: transparent;
          border: 1px solid var(--card-border);
          color: var(--text3);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.15s;
        }
        .cancel-btn:hover { border-color: var(--text3); }
        
        .save-confirm {
          font-size: 10px;
          color: var(--green);
          font-weight: 600;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        
        @media (max-width: 900px) {
          .eg-fields { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── PHONE FRAME: force mobile layout at all viewport sizes ── */
        .phone-frame-root .sidebar { display: none !important; }
        .phone-frame-root .mobile-header { display: flex !important; }
        .phone-frame-root .bottom-nav { display: block !important; position: absolute !important; }
        .phone-frame-root .main { padding: 12px 12px 90px !important; }
        .phone-frame-root .page-header { display: none !important; }
        .phone-frame-root .row-3:not(.row-3-nowrap),
        .phone-frame-root .row-4,
        .phone-frame-root .row-6,
        .phone-frame-root .row-7 { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        .phone-frame-root .card { border-radius: 12px; padding: 14px 14px; }
        .phone-frame-root .stat-card { padding: 12px 14px; }
        .phone-frame-root .stat-value { font-size: 26px !important; }
        .phone-frame-root .workout-row { padding: 14px 10px; gap: 10px; }
        .phone-frame-root .wr-stats { gap: 10px; flex-wrap: wrap; font-size: 11px; }
        .phone-frame-root .recovery-full { flex-direction: column; gap: 16px; }
        .phone-frame-root .recovery-divider { display: none; }
        .phone-frame-root .strain-explainer-grid { grid-template-columns: 1fr !important; }
        .phone-frame-root .modal-box { border-radius: 20px 20px 0 0 !important; max-width: 100% !important; }
        .phone-frame-root .pred-cards { grid-template-columns: 1fr 1fr !important; }
        .phone-frame-root .row-2-inline { grid-template-columns: 1fr 1fr; }
        .phone-frame-root .app { overflow: hidden; height: 852px; }
        .phone-frame-root .app-body { height: calc(852px - 56px - 56px); overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
        .phone-frame-root .main { height: 100%; overflow-y: auto; }
        @media (max-width: 640px) {
          /* Workout rows — bigger touch targets */
          .workout-row { padding: 14px 10px; gap: 10px; }
          .wr-stats { gap: 10px; flex-wrap: wrap; font-size: 11px; }
          .wr-name { font-size: 13px; }
          .wr-date { font-size: 10px; }

          /* Workout detail header */
          .workout-detail-header { flex-wrap: wrap; gap: 8px; padding: 14px; }
          .wdh-info h2 { font-size: 16px; }
          .back-btn { font-size: 12px; padding: 6px 10px; }

          /* Stat row — 2-col on mobile */
          .row-6, .row-7 { grid-template-columns: repeat(3, 1fr); }

          /* Calendar */
          .cal-grid-wrap { overflow-x: auto; }
          .cal-grid { min-width: 320px; }
          .cal-cell { min-height: 44px; }

          /* Cards */
          .card h3 { font-size: 15px; }
          .stat-value { font-size: 24px; }
          .stat-label { font-size: 10px; }
          .stat-sub { font-size: 10px; }

          /* Modal goes full-screen on mobile */
          .modal-overlay { align-items: flex-end; }
          .modal-box {
            border-radius: 20px 20px 0 0;
            max-width: 100%;
            max-height: 92vh;
          }

          /* HR zone bar */
          .hr-zone-bar { height: 20px; }

          /* Charts — reduce height */
          .recharts-responsive-container { min-height: 0 !important; }

          /* Lap table — compress */
          .lap-table { font-size: 14px; }
          .lap-header, .lap-row { grid-template-columns: 32px 80px 68px 80px 60px !important; padding: 10px 6px !important; }

          /* Edit panels */
          .wep-grid { grid-template-columns: 1fr !important; }
          .wep-type-grid { flex-wrap: wrap; }

          /* Zone editor */
          .zone-edit-row { flex-wrap: wrap; gap: 6px; }
          .zone-edit-input { width: 64px !important; }

          /* Strain explainer */
          .strain-explainer-grid { grid-template-columns: 1fr; }

          /* Predictions */
          .pred-cards { grid-template-columns: 1fr 1fr; }

          /* Coach insights */
          .ci-body { font-size: 12px; }

          /* Recovery */
          .recovery-full { flex-direction: column; gap: 16px; }
          .recovery-divider { display: none; }
          .recovery-left { align-items: flex-start; flex-direction: row; gap: 16px; }

          /* Trends */
          .row-2-inline { grid-template-columns: 1fr; }

          /* Gear view */
          .shoe-list-tab { gap: 10px; }
          .shoe-list-item { padding: 12px; }
        }

        @media (max-width: 400px) {
          .row-6, .row-7 { grid-template-columns: repeat(2, 1fr); }
          .pred-cards { grid-template-columns: 1fr; }
        }
        

        /* ── UPLOAD MODAL ────────────────────────────────────────── */
        .modal-overlay {
          position: fixed; inset: 0; background: #00000088; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }
        .modal-box {
          background: var(--bg2); border: 1px solid var(--card-border);
          border-radius: 16px; width: 100%; max-width: 500px;
          display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 24px 60px #00000080;
          max-height: 90vh;
        }
        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px; border-bottom: 1px solid var(--card-border);
        }
        .modal-header h3 {
          font-family: 'Barlow Condensed', sans-serif; font-size: 18px;
          font-weight: 700; color: var(--text); letter-spacing: 0.3px;
          text-transform: none; margin: 0;
        }
        .modal-close {
          background: none; border: none; color: var(--text3); font-size: 18px;
          cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.15s;
        }
        .modal-close:hover { color: var(--text); }
        .modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
        .modal-footer {
          padding: 16px 24px; border-top: 1px solid var(--card-border);
          display: flex; justify-content: flex-end; gap: 10px;
        }
        .format-chips { display: flex; align-items: center; gap: 8px; }
        .format-chip {
          font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700;
          padding: 3px 10px; border-radius: 20px; border: 1px solid;
        }
        .format-chip.fit  { color: var(--orange); border-color: var(--orange); background: #f9731610; }
        .format-chip.gpx { color: var(--lime); border-color: var(--lime); background: rgba(232,255,71,.06); }
        .format-chip.csv { color: var(--blue); border-color: var(--blue); background: #38bdf810; }
        .format-note { font-size: 12px; color: var(--text3); }
        .drop-zone {
          border: 2px dashed var(--card-border); border-radius: 12px;
          padding: 40px 24px; text-align: center; cursor: pointer;
          transition: all 0.2s; display: flex; flex-direction: column;
          align-items: center; gap: 8px;
        }
        .drop-zone:hover, .drop-zone.drag-over {
          border-color: var(--lime); background: rgba(232,255,71,.03);
        }
        .drop-zone.success { border-color: var(--green); border-style: solid; background: #34d39908; }
        .drop-zone.error { border-color: #ef4444; border-style: solid; }
        .dz-icon { font-size: 28px; color: var(--text3); margin-bottom: 4px; }
        .dz-text { font-size: 12px; font-weight: 600; color: var(--text2); }
        .dz-link { color: var(--lime); text-decoration: underline; }
        .dz-sub { font-size: 12px; color: var(--text3); }
        .dz-success { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .dz-check { font-size: 28px; color: var(--green); }
        .dz-error { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 0; }
        .dz-error-icon { font-size: 28px; color: #ef4444; line-height: 1; }
        .dz-error-title { font-size: 10px; font-weight: 700; color: #ef4444; }
        .dz-error-msg { font-size: 10px; color: var(--text3); text-align: center; max-width: 280px; line-height: 1.5; }
        .dz-retry-btn {
          margin-top: 4px; padding: 6px 16px; border-radius: 8px; font-size: 10px; font-weight: 600;
          background: transparent; border: 1px solid var(--card-border); color: var(--text2);
          cursor: pointer; transition: background .15s, color .15s;
        }
        .dz-retry-btn:hover { background: var(--card-border); color: var(--text1); }
        .dz-name-input {
          background: var(--bg3); border: 1px solid var(--lime); border-radius: 7px;
          color: var(--text); font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 600; padding: 7px 12px;
          width: 100%; max-width: 320px; outline: none; text-align: center;
          box-shadow: 0 0 0 2px rgba(232,255,71,.09); margin-top: 4px;
        }
        .dz-name-input:focus { box-shadow: 0 0 0 3px rgba(232,255,71,.19); }
        .modal-hint {
          font-size: 10px; color: var(--text3); line-height: 1.7;
          background: var(--bg3); border-radius: 8px; padding: 12px 14px;
          border: 1px solid var(--card-border);
        }
        .modal-hint strong { color: var(--text2); }

        /* Imported badge in workout list */
        .imported-badge {
          display: inline-block; font-size: 10px; font-weight: 700; font-family: 'Barlow Condensed', sans-serif;
          background: rgba(232,255,71,.08); color: var(--lime); border: 1px solid rgba(232,255,71,.19);
          border-radius: 10px; padding: 1px 6px; margin-left: 8px; letter-spacing: 0.5px;
          vertical-align: middle;
        }
        .imported-row { border-left: 2px solid rgba(232,255,71,.25); }

        /* Zone editing */
        .zone-card-header {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 4px;
        }
        .zone-edit-table { display: flex; flex-direction: column; gap: 8px; }
        .zone-edit-row {
          display: flex; align-items: center; gap: 10px;
          padding: 6px 0; border-top: 1px solid var(--card-border);
        }
        .zone-edit-label { flex: 1; font-size: 15px; color: var(--text2); font-weight: 500; }
        .zone-edit-input-wrap { display: flex; align-items: center; gap: 6px; }
        .zone-edit-input { width: 72px !important; text-align: right; }
        .zone-edit-pct { font-size: 13px; color: var(--text3); width: 36px; text-align: right; }
        .zone-edit-auto { font-size: 14px; color: var(--text3); font-style: italic; }
        .zone-edit-z5 { opacity: 0.6; }

        /* Preferences */
        .prefs-list { display: flex; flex-direction: column; gap: 0; margin-top: 12px; }
        .pref-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 0; border-top: 1px solid var(--card-border);
        }
        .pref-label { font-size: 13px; color: var(--text2); font-weight: 500; }
        .pref-toggle { display: flex; gap: 0; border-radius: 8px; overflow: hidden; border: 1px solid var(--card-border); }
        .pref-btn {
          padding: 5px 18px; font-size: 11px; font-weight: 600; letter-spacing: .04em;
          background: transparent; color: var(--text3); border: none; cursor: pointer;
          transition: background .15s, color .15s;
        }
        .pref-btn:hover { background: var(--card-border); color: var(--text1); }
        .pref-btn.active { background: var(--accent); color: #0c0c0e; }

        /* Strain explainer */
        .strain-explainer { margin-top: 16px; }
        .strain-explainer-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 16px;
        }
        .se-block {
          border-radius: 10px; padding: 14px 16px;
          border: 1px solid var(--card-border);
          background: rgba(255,255,255,.02);
        }
        .se-block--rest   { border-color: #34d39930; }
        .se-block--easy   { border-color: #fbbf2430; }
        .se-block--hard   { border-color: #ef444430; }
        .se-block--sleep  { border-color: #38bdf830; }
        .se-block-header  { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .se-icon  { font-size: 18px; }
        .se-title { font-size: 10px; font-weight: 700; color: var(--text1); font-family: 'Barlow Condensed', sans-serif; letter-spacing: .04em; text-transform: uppercase; }
        .se-desc  { font-size: 12px; color: var(--text3); line-height: 1.5; margin-bottom: 10px; }
        .se-projections { display: flex; flex-direction: column; gap: 5px; }
        .se-proj-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
        .se-proj-label { color: var(--text2); }
        .se-proj-val { font-weight: 700; font-size: 10px; font-family: 'Barlow Condensed', sans-serif; }
        .se-proj-note { font-size: 11px; color: var(--text3); font-style: italic; justify-content: flex-start; }
        .se-formula {
          display: flex; flex-direction: column; gap: 4px;
          background: rgba(255,255,255,.03); border-radius: 8px;
          padding: 12px 16px; border: 1px solid var(--card-border);
        }
        .se-formula-title { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--text3); }
        .se-formula-eq { font-size: 10px; font-family: monospace; color: var(--accent); margin: 4px 0; }
        .est-badge--perf { background: #38bdf820; color: #38bdf8; border-color: #38bdf840; }
        .vo2max-source-note {
          font-size: 10px; color: var(--text3); line-height: 1.5;
          padding: 8px 10px; margin-top: 2px; margin-bottom: 4px;
          background: #38bdf808; border-radius: 6px; border: 1px solid #38bdf820;
        }
        .vo2max-source-note strong { color: var(--text2); }

        /* AI estimated metric badges */
        .est-badge {
          display: inline-flex; align-items: center; padding: 1px 6px;
          border-radius: 4px; font-size: 10px; font-weight: 700; letter-spacing: .04em;
          background: #a78bfa22; color: #a78bfa; border: 1px solid #a78bfa44;
        }
        .est-badge-inline {
          display: inline; padding: 1px 5px; border-radius: 4px;
          font-size: 10px; font-weight: 700;
          background: #a78bfa22; color: #a78bfa; border: 1px solid #a78bfa44;
        }
        .est-dot {
          font-size: 7px; color: #a78bfa; margin-left: 3px;
          vertical-align: super; cursor: help;
        }
        .phys-hint {
          font-size: 10px; color: #a78bfa; cursor: help; margin-left: auto;
          opacity: 0.7; white-space: nowrap;
        }
        .phys-hint:hover { opacity: 1; }
        .hr-stats-row {
          display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0 14px;
        }
        .hr-stat-chip {
          display: flex; flex-direction: column; align-items: center;
          background: var(--bg2); border: 1px solid var(--card-border);
          border-radius: 10px; padding: 7px 14px; min-width: 72px;
        }
        .hr-stat-label { font-size: 11px; color: var(--text3); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 2px; }
        .hr-stat-val   { font-size: 10px; font-weight: 700; color: var(--text1); font-family: 'Barlow Condensed', sans-serif; }

      `}</style>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onImport={handleImport}
          athleteMaxHR={athlete.maxHR}
          athleteRestingHR={athlete.restingHR}
          customZones={customZones}
        />
      )}

      <div className="app">

        {/* ── Mobile top header — hidden on dashboard (has its own greeting) ── */}
        {view !== "dashboard" && (
          <header className="mobile-header">
            <div className="mobile-header-title">
              {view === "workout-detail" && selectedWorkout
                ? selectedWorkout.name
                : view === "athlete" ? "Athlete"
                : view === "shoes"   ? "Gear"
                : NAV_ITEMS.find(n => n.id === view)?.label ?? "Home"}
            </div>
          </header>
        )}

        <div className="app-body">
          {/* ── Desktop sidebar ── */}
          <nav className="sidebar">
            <div className="logo">
              <div className="logo-mark">APEX</div>
              <div className="logo-sub">Elite Analytics</div>
            </div>
            {NAV_ITEMS.map(item => (
              <div
                key={item.id}
                className={`nav-item ${view === item.id || (view === "workout-detail" && item.id === "workouts") ? "active" : ""}`}
                onClick={() => { setView(item.id); setSelectedWorkout(null); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
            <div
              className={`nav-item ${view === "athlete" ? "active" : ""}`}
              onClick={() => { setView("athlete"); setSelectedWorkout(null); }}
            >
              <span className="nav-icon">◉</span>
              <span>Athlete</span>
            </div>
            <div className="sidebar-spacer" />
            <div className="theme-toggle-wrap">
              <span className="theme-toggle-label">Dark</span>
              <button
                className={`theme-pill ${theme === "light" ? "theme-pill--light" : ""}`}
                onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
                aria-label="Toggle dark/light mode"
              >
                <span className="theme-pill-thumb" />
              </button>
              <span className="theme-toggle-label">Light</span>
            </div>
            <div
              className={`sidebar-athlete ${view === "athlete" ? "sidebar-athlete--active" : ""}`}
              onClick={() => { setView("athlete"); setSelectedWorkout(null); }}
              title="Athlete Profile"
            >
              <div className="sa-avatar">{athlete.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}</div>
              <div className="sa-info">
                <div className="sa-name">{athlete.name}</div>
                <div className="sa-goal">{athlete.goal}</div>
              </div>
            </div>
          </nav>

          <main className="main">
            <div className="page-header">
              <div className="page-title">
                {view === "workout-detail" && selectedWorkout
                  ? selectedWorkout.name
                  : view === "athlete"
                  ? "Athlete"
                  : NAV_ITEMS.find(n => n.id === view)?.label ?? "Dashboard"}
              </div>
              <div className="page-date">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            {view === "dashboard" && <DashboardView units={units} athlete={athlete} uploadedWorkouts={uploadedWorkouts} />}
            {view === "workouts" && (
              <WorkoutsView
                onSelect={handleSelectWorkout}
                uploadedWorkouts={uploadedWorkouts}
                onOpenUpload={() => setShowUpload(true)}
                onDeleteWorkout={handleDeleteWorkout}
                onUpdateWorkout={handleUpdateWorkout}
                units={units}
                shoes={shoes}
              />
            )}
            {view === "trends" && <TrendsView onSelectWorkout={handleSelectWorkout} uploadedWorkouts={uploadedWorkouts} units={units} athlete={athlete} resolvedAthleteMetrics={resolvedAthleteMetrics} />}
            {view === "recovery" && <RecoveryView athlete={athlete} uploadedWorkouts={uploadedWorkouts} units={units} resolvedAthleteMetrics={resolvedAthleteMetrics} />}
            {view === "workout-detail" && selectedWorkout && (
              <WorkoutDetailView workout={selectedWorkout} onBack={handleBackFromWorkout} customZones={customZones} units={units} athlete={athlete} resolvedMetrics={resolvedAthleteMetrics} theme={theme} onUpdateWorkout={handleUpdateWorkout} onDeleteWorkout={handleDeleteWorkout} shoes={shoes} />
            )}
            {view === "athlete" && <AthleteView athlete={athlete} setAthlete={handleSetAthlete} customZones={customZones} setCustomZones={setCustomZones} units={units} setUnits={setUnits} uploadedWorkouts={uploadedWorkouts} shoes={shoes} setShoes={setShoes} defaultShoeId={defaultShoeId} setDefaultShoeId={setDefaultShoeId} />}

          </main>
        </div>

        {/* ── Mobile bottom tab bar ── */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`bottom-tab ${view === item.id || (view === "workout-detail" && item.id === "workouts") ? "active" : ""}`}
                onClick={() => { setView(item.id); setSelectedWorkout(null); }}
              >
                <span className="bottom-tab-icon">
                  <Icon name={item.svgIcon} size={20} />
                </span>
                <span className="bottom-tab-label">{item.label}</span>
              </button>
            ))}
            <button
              className={`bottom-tab ${view === "athlete" || view === "shoes" ? "active" : ""}`}
              onClick={() => { setView("athlete"); setSelectedWorkout(null); }}
            >
              <span className="bottom-tab-icon">
                <Icon name="gear" size={20} />
              </span>
              <span className="bottom-tab-label">Profile</span>
            </button>
          </div>
        </nav>

      </div>
    </>
  );
}

// ─── PHONE FRAME WRAPPER ───────────────────────────────────────────────────────
export default function PhoneFrame() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 0",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Phone shell */}
      <div style={{
        position: "relative",
        width: 393,
        height: 852,
        background: "#1a1a1a",
        borderRadius: 54,
        boxShadow: `
          0 0 0 1px #333,
          0 0 0 2px #111,
          0 30px 80px rgba(0,0,0,.8),
          inset 0 0 0 2px #2a2a2a
        `,
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 126,
          height: 37,
          background: "#000",
          borderRadius: 20,
          zIndex: 9999,
        }} />

        {/* Screen */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 54,
          overflow: "hidden",
          background: "#0c0c0e",
        }}>
          {/* Force mobile breakpoint by constraining to 393px */}
          <div style={{ width: 393, height: 852, overflow: "hidden", position: "relative" }} className="phone-frame-root">
            <App />
          </div>
        </div>

        {/* Side buttons — left */}
        <div style={{ position: "absolute", left: -3, top: 120, width: 4, height: 36, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 168, width: 4, height: 68, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 248, width: 4, height: 68, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        {/* Power button — right */}
        <div style={{ position: "absolute", right: -3, top: 180, width: 4, height: 90, background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />

        {/* Home indicator */}
        <div style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 134,
          height: 5,
          background: "rgba(255,255,255,.35)",
          borderRadius: 3,
          zIndex: 9999,
        }} />
      </div>
    </div>
  );
}
const AthleteView = ({ athlete, setAthlete, customZones, setCustomZones, units, setUnits, uploadedWorkouts = [], shoes, setShoes, defaultShoeId, setDefaultShoeId }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...athlete });
  const [saved, setSaved] = useState(false);
  const [editingZones, setEditingZones] = useState(false);
  const [zoneDraft, setZoneDraft] = useState([...customZones]);
  const [zonesSaved, setZonesSaved] = useState(false);

  // Keep zoneDraft in sync when customZones change externally (e.g. maxHR update)
  const prevZones = useRef(customZones);
  useEffect(() => {
    if (prevZones.current !== customZones) {
      prevZones.current = customZones;
      setZoneDraft([...customZones]);
    }
  }, [customZones]);

  const initials = draft.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleChange = (key, value) => setDraft(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    const parsed = { ...draft };
    ["age","weight","height","maxHR","restingHR","lthr","hrv","ftp"].forEach(k => {
      parsed[k] = parseInt(parsed[k]) || 0;
    });
    parsed.vo2max = parseFloat(parsed.vo2max) || 0;
    setAthlete(parsed);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => { setDraft({ ...athlete }); setEditing(false); };

  const handleZoneSave = () => {
    // Validate: each bound must be > previous, all must be < maxHR
    const vals = zoneDraft.map(v => parseInt(v) || 0);
    for (let i = 1; i < vals.length; i++) {
      if (vals[i] <= vals[i-1]) {
        alert(`Zone ${i+1} upper limit must be greater than Zone ${i} (${vals[i-1]} bpm).`);
        return;
      }
    }
    if (vals[vals.length-1] >= a.maxHR) {
      alert(`Zone 4 upper limit must be below your Max HR (${a.maxHR} bpm).`);
      return;
    }
    setCustomZones(vals);
    setEditingZones(false);
    setZonesSaved(true);
    setTimeout(() => setZonesSaved(false), 2500);
  };

  const handleZoneCancel = () => { setZoneDraft([...customZones]); setEditingZones(false); };

  const handleResetZones = () => {
    const maxHR     = parseInt(a.maxHR)     || athlete.maxHR;
    const restingHR = parseInt(a.restingHR) || athlete.restingHR;
    const hrr       = Math.max(maxHR - restingHR, 1);
    setZoneDraft([0.60, 0.70, 0.80, 0.90].map(p => Math.round(restingHR + hrr * p)));
  };

  const a = editing ? draft : athlete;

  // ── AI-estimated performance metrics ────────────────────────────────────
  // Run whenever the displayed athlete values change (editing or saved)
  const estimatedMetrics = useMemo(() => {
    const maxHR     = parseInt(a.maxHR)     || 190;
    const restingHR = parseInt(a.restingHR) || 50;
    const age       = parseInt(a.age)       || 30;
    const weightKg  = ((parseInt(a.weight) || 154) * 0.453592);
    const hrr       = Math.max(maxHR - restingHR, 1);

    // LTHR — Friel formula: ~85-90% of max HR for trained runners
    // More precise: LTHR ≈ restingHR + HRR * 0.85 (Karvonen at 85%)
    const estimatedLTHR = Math.round(restingHR + hrr * 0.85);

    // VO2max — multiple formula approaches:
    // 1. Uth-Sørensen-Overgaard-Pedersen: VO2max ≈ 15 × (HRmax / HRrest)
    const vo2maxUth = parseFloat((15 * (maxHR / restingHR)).toFixed(1));
    // 2. Age-based normative (Jackson et al): gender-adjusted
    const genderAdj = a.gender === "Female" ? -7.9 : 0;
    const vo2maxAge = parseFloat((52 - 0.185 * age + genderAdj).toFixed(1));
    // Blend both HR/age methods
    const estimatedVO2max = parseFloat(((vo2maxUth * 0.6 + vo2maxAge * 0.4)).toFixed(1));

    // FTP — estimated from LTHR via empirical relationship for runners with power meters
    // Running FTP (watts) ≈ body weight (kg) × pace-based multiplier
    // Using HR-based proxy: FTP ≈ weight_kg × 3.5 × (LTHR/maxHR)
    const estimatedFTP = Math.round(weightKg * 3.5 * (estimatedLTHR / maxHR));

    return {
      lthr:   { value: estimatedLTHR,  formula: `Karvonen 85% HRR (${restingHR} + ${hrr}×0.85)` },
      vo2max: { value: estimatedVO2max, formula: `Uth-Sørensen (15×${maxHR}/${restingHR}) + age norms blend` },
      ftp:    { value: estimatedFTP,    formula: `HR-weight proxy (${weightKg.toFixed(0)} kg × 3.5 × LTHR ratio)` },
    };
  }, [a.maxHR, a.restingHR, a.age, a.weight, a.gender]);

  // Performance-based VO2max from uploaded workouts (Jack Daniels VDOT)
  const perfVO2max = useMemo(() => calcVO2maxFromWorkouts(uploadedWorkouts), [uploadedWorkouts]);

  // Helper: returns actual value if entered, otherwise performance-based, otherwise estimated
  const resolvedLTHR   = (parseInt(a.lthr)    || 0) > 0 ? { value: parseInt(a.lthr),       estimated: false }
                       : { ...estimatedMetrics.lthr,   estimated: true };
  const resolvedVO2max = (parseFloat(a.vo2max) || 0) > 0 ? { value: parseFloat(a.vo2max),  estimated: false, source: "manual" }
                       : perfVO2max                       ? { value: perfVO2max.value,       estimated: true,  source: "performance", run: perfVO2max.run }
                       : { ...estimatedMetrics.vo2max,     estimated: true,  source: "hr" };
  const resolvedFTP    = (parseInt(a.ftp)      || 0) > 0 ? { value: parseInt(a.ftp),        estimated: false }
                       : { ...estimatedMetrics.ftp,    estimated: true };

  // While editing, preview zone boundaries live from draft values (if zones are still at defaults)
  const previewBounds = (() => {
    if (!editing) return customZones;
    const draftMaxHR     = parseInt(draft.maxHR)     || athlete.maxHR;
    const draftRestingHR = parseInt(draft.restingHR) || athlete.restingHR;
    const karvonenBounds = (mhr, rhr) => {
      const hrr = Math.max(mhr - rhr, 1);
      return [0.60, 0.70, 0.80, 0.90].map(p => Math.round(rhr + hrr * p));
    };
    const oldDefaults = karvonenBounds(athlete.maxHR, athlete.restingHR);
    const isDefault = customZones.every((v, i) => v === oldDefaults[i]);
    if (isDefault) return karvonenBounds(draftMaxHR, draftRestingHR);
    return customZones;
  })();

  // Build live zone display from previewBounds (live during edit, saved otherwise)
  const zoneDisplay = [
    { name: "Z1 Recovery",  range: `< ${previewBounds[0]} bpm`,                                    color: HR_ZONE_COLORS[0] },
    { name: "Z2 Aerobic",   range: `${previewBounds[0]}–${previewBounds[1]} bpm`,                  color: HR_ZONE_COLORS[1] },
    { name: "Z3 Tempo",     range: `${previewBounds[1]}–${previewBounds[2]} bpm`,                  color: HR_ZONE_COLORS[2] },
    { name: "Z4 Threshold", range: `${previewBounds[2]}–${previewBounds[3]} bpm`,                  color: HR_ZONE_COLORS[3] },
    { name: "Z5 VO2max+",   range: `> ${previewBounds[3]} bpm`,                                    color: HR_ZONE_COLORS[4] },
  ];

  const ZONE_LABELS = ["Z1 Recovery", "Z2 Aerobic", "Z3 Tempo", "Z4 Threshold"];

  return (
    <div className="view-grid">

      {/* ── Header: avatar + name + edit button ── */}
      <div className="card apv-header">
        <div className="apv-avatar">{initials}</div>
        <div className="apv-info">
          <div className="apv-name">{athlete.name}</div>
          <div className="apv-goal"><Icon name="target" size={11} style={{marginRight:4}} />{athlete.goal}</div>
          <div className="apv-meta">{athlete.age}y · {athlete.weight} lbs · {fmtHeight(athlete.height)} · {athlete.gender}</div>
        </div>
        <div className="apv-actions">
          {saved && <span className="save-confirm">✓ Saved</span>}
          {!editing
            ? <button className="edit-btn" onClick={() => { setDraft({ ...athlete }); setEditing(true); }}>✎ Edit</button>
            : <>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>Save</button>
              </>
          }
        </div>
      </div>

      {/* ── Edit form — only when editing ── */}
      {editing && (
        <div className="card full-width apv-edit-form">
          {FIELD_GROUPS.map(group => (
            <div key={group.title} className="apv-edit-group">
              <div className="apv-edit-group-title">{group.title}</div>
              <div className="apv-edit-fields">
                {group.fields.map(f => (
                  <div key={f.key} className="apv-edit-row">
                    <label className="apv-edit-label">{f.label}</label>
                    <div className="apv-edit-input-wrap">
                      {f.type === "select"
                        ? <select className="ef-select" value={draft[f.key]} onChange={e => handleChange(f.key, e.target.value)}>
                            {f.options.map(o => <option key={o}>{o}</option>)}
                          </select>
                        : <input className="ef-input" type={f.type} step={f.step || "1"} value={draft[f.key]} onChange={e => handleChange(f.key, e.target.value)} />
                      }
                      {f.unit && <span className="ef-unit">{f.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Heart Rate: 2x2 chips + zones ── */}
      <div className="card full-width">
        <h3>Heart Rate</h3>
        <div className="apv-hr-grid">
          {[
            { label: "Max HR",     value: `${a.maxHR}`,            unit: "bpm", estimated: false },
            { label: "Resting HR", value: `${a.restingHR}`,        unit: "bpm", estimated: false },
            { label: "LTHR",       value: `${resolvedLTHR.value}`, unit: "bpm", estimated: resolvedLTHR.estimated },
            { label: "HRV",        value: `${a.hrv}`,              unit: "ms",  estimated: false },
          ].map(({ label, value, unit, estimated }) => (
            <div key={label} className="apv-hr-chip">
              <div className="apv-hr-val">{value}<span className="apv-hr-unit">{unit}</span></div>
              <div className="apv-hr-label">{label}{estimated && <span className="est-dot" title="AI estimated">●</span>}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <HRZoneBar zones={[20, 20, 20, 20, 20]} />
          <div className="zone-legend">
            {zoneDisplay.map(z => (
              <div key={z.name} className="zl-item">
                <span className="zl-dot" style={{ background: z.color }} />
                <span className="zl-name">{z.name}</span>
                <span className="zl-pct">{z.range}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          {!editingZones
            ? <button className="apv-secondary-btn" onClick={() => { setZoneDraft([...previewBounds]); setEditingZones(true); }}>
                ✎ Edit Zone Boundaries
              </button>
            : <div className="zone-edit-table">
                <p className="card-sub" style={{ marginBottom: 10 }}>Edit upper BPM boundary for each zone.</p>
                {ZONE_LABELS.map((label, i) => (
                  <div key={label} className="zone-edit-row">
                    <span className="zone-dot" style={{ background: HR_ZONE_COLORS[i] }} />
                    <span className="zone-edit-label">{label}</span>
                    <div className="zone-edit-input-wrap">
                      <input className="ef-input zone-edit-input" type="number"
                        min={i === 0 ? 60 : (parseInt(zoneDraft[i-1]) || 0) + 1}
                        max={a.maxHR - 1} value={zoneDraft[i]}
                        onChange={e => { const n = [...zoneDraft]; n[i] = e.target.value; setZoneDraft(n); }}
                      />
                      <span className="ef-unit">bpm</span>
                    </div>
                  </div>
                ))}
                <div className="zone-edit-row zone-edit-z5">
                  <span className="zone-dot" style={{ background: HR_ZONE_COLORS[4] }} />
                  <span className="zone-edit-label">Z5 VO2max+</span>
                  <span className="zone-edit-auto">&gt; {zoneDraft[3] || customZones[3]} bpm (auto)</span>
                </div>
                <div className="apv-zone-actions">
                  <button className="edit-btn" onClick={handleResetZones}>↺ Reset</button>
                  <button className="cancel-btn" onClick={handleZoneCancel}>Cancel</button>
                  <button className="save-btn" onClick={handleZoneSave}>✓ Save</button>
                  {zonesSaved && <span className="save-confirm">✓ Saved</span>}
                </div>
              </div>
          }
        </div>
      </div>

      {/* ── Performance + Units side by side ── */}
      <div className="row-2-inline" style={{ gap: 12, marginBottom: 0 }}>
        <div className="card">
          <h3>Performance</h3>
          <div className="phys-list">
            <div className="phys-row">
              <span className="phys-key">FTP</span>
              <span className="phys-val">{resolvedFTP.value}W{resolvedFTP.estimated && <span className="est-badge" style={{marginLeft:6}}>est.</span>}</span>
            </div>
            <div className="phys-row">
              <span className="phys-key">VO2max</span>
              <span className="phys-val">{resolvedVO2max.value}{resolvedVO2max.estimated && <span className="est-badge" style={{marginLeft:6}}>est.</span>}</span>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Units</h3>
          <div className="prefs-list">
            <div className="pref-row">
              <span className="pref-label">Distance</span>
              <div className="pref-toggle">
                {["km","mi"].map(opt => (
                  <button key={opt} className={`pref-btn ${units.distance === opt ? "active" : ""}`}
                    onClick={() => setUnits(u => ({ ...u, distance: opt }))}>{opt}</button>
                ))}
              </div>
            </div>
            <div className="pref-row">
              <span className="pref-label">Altitude</span>
              <div className="pref-toggle">
                {["ft","m"].map(opt => (
                  <button key={opt} className={`pref-btn ${units.altitude === opt ? "active" : ""}`}
                    onClick={() => setUnits(u => ({ ...u, altitude: opt }))}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Power zones ── */}
      <div className="card full-width">
        <h3>Power Zones
          {resolvedFTP.estimated && <span className="est-badge" style={{ marginLeft: 8, verticalAlign: "middle" }}>AI est.</span>}
          <span style={{ fontSize: 13, fontWeight: 400, color: "var(--text3)", marginLeft: 8 }}>FTP: {resolvedFTP.value}W</span>
        </h3>
        <div className="zone-table" style={{ marginTop: 8 }}>
          {[
            { name: "Z1 Active Rec", pct: "<55%",     watts: `<${Math.round(resolvedFTP.value * 0.55)}W` },
            { name: "Z2 Endurance",  pct: "55–75%",   watts: `${Math.round(resolvedFTP.value * 0.55)}–${Math.round(resolvedFTP.value * 0.75)}W` },
            { name: "Z3 Tempo",      pct: "75–90%",   watts: `${Math.round(resolvedFTP.value * 0.75)}–${Math.round(resolvedFTP.value * 0.90)}W` },
            { name: "Z4 Threshold",  pct: "90–105%",  watts: `${Math.round(resolvedFTP.value * 0.90)}–${Math.round(resolvedFTP.value * 1.05)}W` },
            { name: "Z5 VO2max",     pct: "105–120%", watts: `${Math.round(resolvedFTP.value * 1.05)}–${Math.round(resolvedFTP.value * 1.20)}W` },
            { name: "Z6 Anaerobic",  pct: ">120%",    watts: `>${Math.round(resolvedFTP.value * 1.20)}W` },
          ].map((z, i) => (
            <div key={z.name} className="zone-row">
              <span className="zone-dot" style={{ background: HR_ZONE_COLORS[Math.min(i, 4)] }} />
              <span className="zone-name">{z.name}</span>
              <span className="zone-range">{z.watts}</span>
              <span className="zone-pct">{z.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Gear / Shoes ── */}
      <GearView shoes={shoes} setShoes={setShoes} uploadedWorkouts={uploadedWorkouts}
        units={units} defaultShoeId={defaultShoeId} setDefaultShoeId={setDefaultShoeId} />

    </div>
  );
};
const WORKOUT_TYPE_COLOR = {
  Run: "var(--accent)",
  Ride: "#38bdf8",
  Swim: "#a78bfa",
  Strength: "#f97316",
};

// Build a richer set of mock workouts spread across the past 2 months
const TrendsView = ({ onSelectWorkout, uploadedWorkouts = [], units, athlete, resolvedAthleteMetrics }) => {

  const hasData = uploadedWorkouts.length > 0;

  // Pace trend — one point per workout sorted by date
  const paceTrend = [...uploadedWorkouts]
    .filter(w => w.avgPace)
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .map(w => ({
      date: new Date(w.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pace: units.distance === "mi" ? w.avgPace : Math.round(w.avgPace * 0.621371),
      hr: w.avgHR,
      name: w.name,
    }));

  // HR trend
  const hrTrend = paceTrend.filter(p => p.hr);

  // Weekly volume
  const weeklyMap = {};
  uploadedWorkouts.forEach(w => {
    const d = new Date(w.date + "T12:00:00");
    const ws = new Date(d); ws.setDate(d.getDate() - d.getDay());
    const key = ws.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!weeklyMap[key]) weeklyMap[key] = { week: key, dist: 0, tss: 0 };
    const dist = units.distance === "mi" ? (w.distance || 0) * 0.621371 : (w.distance || 0);
    weeklyMap[key].dist = parseFloat((weeklyMap[key].dist + dist).toFixed(1));
    weeklyMap[key].tss += (w.tss || 0);
  });
  const weeklyLoad = Object.values(weeklyMap).sort((a,b) => new Date(a.week) - new Date(b.week)).slice(-12);
  const distUnit = units.distance === "mi" ? "mi" : "km";

  const today = new Date(); // real current date
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Map workouts to date strings
  const workoutsByDate = {};
  uploadedWorkouts.forEach(w => {
    if (!workoutsByDate[w.date]) workoutsByDate[w.date] = [];
    workoutsByDate[w.date].push(w);
  });

  const dateKey = (d) => {
    const mm = String(currentMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${currentYear}-${mm}-${dd}`;
  };

  // Weekly totals — group by ISO week within the current month view
  const getWeeklyStats = () => {
    const weeks = [];
    let weekStart = 1 - firstDay; // day index of first cell
    for (let w = 0; w < 6; w++) {
      let kmTotal = 0, count = 0;
      for (let d = 0; d < 7; d++) {
        const day = weekStart + d;
        if (day >= 1 && day <= daysInMonth) {
          const ws = workoutsByDate[dateKey(day)] || [];
          ws.forEach(wo => { kmTotal += wo.distance || 0; count += 1; });
        }
      }
      if (weekStart <= daysInMonth && weekStart + 6 >= 1) {
        weeks.push({ kmTotal: parseFloat(kmTotal.toFixed(1)), count });
      }
      weekStart += 7;
    }
    return weeks;
  };
  const weeklyStats = getWeeklyStats();

  const selectedWorkouts = selectedDay ? (workoutsByDate[selectedDay] || []) : [];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => {
    return d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const monthTotalKm = Object.entries(workoutsByDate)
    .filter(([date]) => date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`))
    .reduce((sum, [, ws]) => sum + ws.reduce((s, w) => s + (w.distance || 0), 0), 0)
    .toFixed(1);

  const monthWorkoutCount = Object.entries(workoutsByDate)
    .filter(([date]) => date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`))
    .reduce((sum, [, ws]) => sum + ws.length, 0);

  const monthTSS = Object.entries(workoutsByDate)
    .filter(([date]) => date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`))
    .reduce((sum, [, ws]) => sum + ws.reduce((s, w) => s + (w.tss || 0), 0), 0);

  return (
    <div className="view-grid">
      {/* Month summary stats */}
      <div className="row-3-nowrap">
        <InfoStatCard label="Month Distance" value={fmtDist(parseFloat(monthTotalKm), units)} accent="var(--accent)"
          info={{ title: "Month Distance", body: `Total distance logged across all sessions in ${monthName}.`, footer: "Tap any day on the calendar to see individual workouts." }} />
        <InfoStatCard label="Sessions" value={monthWorkoutCount} sub="this month" accent="#38bdf8"
          info={{ title: "Sessions This Month", body: `Number of logged workouts in ${monthName}. Includes all activity types.` }} />
        <InfoStatCard label="Month TSS" value={monthTSS} sub="training stress" accent="#a78bfa"
          info={{ title: "Month TSS", body: "Total Training Stress Score for the month. Reflects combined volume and intensity of all sessions.", rows: [{ key: "Low month", val: "< 500 TSS" }, { key: "Moderate", val: "500–1000 TSS" }, { key: "High", val: "> 1000 TSS" }], footer: "Compare month-to-month to track loading trends." }} />
      </div>

      {/* Calendar card */}
      <div className="card full-width cal-card">
        {/* Header */}
        <div className="cal-header">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <h3 style={{ marginBottom: 0 }}>{monthName}</h3>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        {/* Day-of-week labels + week totals column */}
        <div className="cal-grid-wrap">
          <div className="cal-grid">
            {/* Day headers */}
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="cal-dow">{d}</div>
            ))}

            {/* Day cells */}
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="cal-cell empty" />;
              const dk = dateKey(day);
              const dayWorkouts = workoutsByDate[dk] || [];
              const isSelected = selectedDay === dk;
              const isTod = isToday(day);
              const dayKm = dayWorkouts.reduce((s, w) => s + (w.distance || 0), 0);

              return (
                <div
                  key={dk}
                  className={`cal-cell ${dayWorkouts.length ? "has-workout" : ""} ${isSelected ? "selected" : ""} ${isTod ? "today" : ""}`}
                  onClick={() => setSelectedDay(isSelected ? null : dk)}
                >
                  <div className="cal-day-num">{day}</div>
                  {dayWorkouts.length > 0 && (
                    <div className="cal-dots">
                      {dayWorkouts.map((w, wi) => (
                        <span key={wi} className="cal-dot" style={{ background: WORKOUT_TYPE_COLOR[w.type] || "#64748b" }} />
                      ))}
                    </div>
                  )}
                  {dayKm > 0 && (
                    <div className="cal-day-km">{units.distance === "mi" ? (dayKm * 0.621371).toFixed(1) : dayKm.toFixed(1)}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Weekly totals sidebar */}
          <div className="cal-week-totals">
            <div className="cwt-header">Week</div>
            {weeklyStats.map((w, i) => {
              const dispKm = units.distance === "mi" ? (w.kmTotal * 0.621371).toFixed(1) : w.kmTotal;
              const dispUnit = units.distance === "mi" ? "mi" : "km";
              return (
                <div key={i} className="cwt-row">
                  <div className="cwt-km">{w.kmTotal > 0 ? dispKm : "—"}</div>
                  <div className="cwt-unit">{w.kmTotal > 0 ? dispUnit : ""}</div>
                  {w.count > 0 && <div className="cwt-sessions">{w.count} {w.count === 1 ? "session" : "sessions"}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected day workout detail */}
      {selectedDay && (
        <div className="card full-width">
          <h3>{new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
          {selectedWorkouts.length === 0 ? (
            <p className="card-sub" style={{ marginTop: 12 }}>Rest day — no workouts logged.</p>
          ) : (
            <div className="cal-workout-list">
              {selectedWorkouts.map(w => (
                <div key={w.id} className="cal-workout-item" onClick={() => w.stream && onSelectWorkout(w)}>
                  <div className="cwi-type-dot" style={{ background: WORKOUT_TYPE_COLOR[w.type] || "#64748b" }} />
                  <div className="cwi-info">
                    <div className="cwi-name">{w.name}</div>
                    <div className="cwi-meta">
                      {w.distance > 0 && <span>{fmtDist(w.distance, units)}</span>}
                      <span>{fmtDuration(w.duration)}</span>
                      {w.avgHR && <span>{w.avgHR} bpm avg</span>}
                      <span>TSS {w.tss}</span>
                    </div>
                  </div>
                  {w.stream && <div className="cwi-arrow">›</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="row-2-inline" style={{ gap: 16 }}>
        <InfoStatCard label="Current HRV" value={athlete.hrv} sub="ms" accent="#38bdf8"
          info={{ title: "Heart Rate Variability", body: "Millisecond variation between heartbeats. Higher HRV = better autonomic recovery and readiness.", rows: [{ key: "< 50 ms", val: "Low" }, { key: "50–80 ms", val: "Average" }, { key: "> 80 ms", val: "High" }], footer: "HRV naturally varies — track your personal trend, not a fixed target." }} />
        <InfoStatCard label="Resting HR" value={athlete.restingHR} sub="bpm" accent="var(--accent)"
          info={{ title: "Resting Heart Rate", body: "Heart rate measured at complete rest. Lower RHR generally indicates better cardiovascular fitness.", rows: [{ key: "Elite", val: "< 40 bpm" }, { key: "Trained", val: "40–55 bpm" }, { key: "Average", val: "55–70 bpm" }], footer: "A sudden rise in RHR (3–5 bpm above baseline) can signal fatigue or illness." }} />
      </div>

      {paceTrend.length > 1 && (
        <div className="card full-width chart-card">
          <h3>Pace Trend</h3>
          <p className="card-sub">Average pace per session ({units.distance === "mi" ? "min/mi" : "min/km"})</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={paceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => fmtPace(v)} domain={['auto','auto']} />
              <Tooltip content={<CustomTooltip formatter={v => fmtPace(v)} />} />
              <Line type="monotone" dataKey="pace" stroke="#e8ff47" strokeWidth={2} name="Avg Pace" dot={{ fill: "#e8ff47", r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {hrTrend.length > 1 && (
        <div className="card full-width chart-card">
          <h3>Heart Rate Trend</h3>
          <p className="card-sub">Average HR per session</p>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={hrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto','auto']} />
              <Tooltip content={<CustomTooltip formatter={v => `${v} bpm`} />} />
              <Line type="monotone" dataKey="hr" stroke="#f97316" strokeWidth={2} name="Avg HR" dot={{ fill: "#f97316", r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {weeklyLoad.length > 0 && (
        <div className="card full-width chart-card">
          <h3>Weekly Volume</h3>
          <p className="card-sub">Distance & training stress by week</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart margin={{ left: -16, right: 8, top: 4, bottom: 0 }} data={weeklyLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v,n) => n === "dist" ? `${v} ${distUnit}` : v} />} />
              <Bar yAxisId="left" dataKey="dist" fill="rgba(232,255,71,.25)" stroke="#e8ff47" strokeWidth={1} name="dist" radius={[4,4,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="tss" stroke="#f97316" strokeWidth={2} name="TSS" dot={{ fill: "#f97316", r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Race Predictions ── */}
      <PredictionsSection athlete={athlete} uploadedWorkouts={uploadedWorkouts} units={units} resolvedAthleteMetrics={resolvedAthleteMetrics} />

    </div>
  );
};

