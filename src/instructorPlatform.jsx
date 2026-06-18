import React, { useState, useEffect, useRef } from "react"
import {
  ArrowLeft, Play, Pause, SkipForward, RotateCcw, Search, Star, Music, Heart,
  Gauge, Zap, Activity, Radio, Bell, Award, Trophy, Flame, TrendingUp,
  TrendingDown, ThumbsUp, MessageSquare, Sparkles, Wand2, Pencil, Save,
  Check, Plus, ChevronRight, Users, Clock, Calendar, Sun, Moon, SlidersHorizontal as SlidersIcon,
} from "lucide-react"

/* ─────────────────────────────────────────────────────────────────────────────
   INSTRUCTOR PLATFORM — the operating system for modern spin studios.
   Self-contained module: design tokens, an SVG chart kit, realistic mock data,
   and eight polished pages. Wired into App.jsx via onNavigate(pageKey).
   ──────────────────────────────────────────────────────────────────────────── */

const GREEN = "#00aa13"
const GREEN_DK = "#008a0f"
const ZONE_COLORS = ["#36aee2", "#82ed3c", "#fde53d", "#fb7512", "#e91236", "#741a10", "#6c3d84"]

// ── design tokens ────────────────────────────────────────────────────────────
function tk(d) {
  return {
    heading: d ? "text-white" : "text-gray-900",
    muted:   d ? "text-gray-400" : "text-gray-500",
    faint:   d ? "text-gray-500" : "text-gray-400",
    card:    `rounded-2xl border transition-colors ${d ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`,
    subtle:  d ? "bg-gray-800" : "bg-gray-50",
    chip:    d ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600",
    border:  d ? "border-gray-800" : "border-gray-100",
    inset:   d ? "bg-gray-800/60" : "bg-gray-50",
  }
}

// ── shared atoms ─────────────────────────────────────────────────────────────
const AV_COLORS = ["#00aa13", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#6366f1"]
const seedNum = s => [...s].reduce((a, c) => a + c.charCodeAt(0), 0)
function Avatar({ name, size = 40, ring }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <div style={{ width: size, height: size, background: AV_COLORS[seedNum(name) % AV_COLORS.length], fontSize: size * 0.38, boxShadow: ring ? `0 0 0 2px ${ring}` : undefined }}
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 select-none">
      {initials}
    </div>
  )
}

function DarkToggle({ darkMode, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme"
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "bg-gray-800 text-amber-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

function PageHead({ darkMode, onToggleDarkMode, onBack, title, sub, Icon, gradient }) {
  const t = tk(darkMode)
  return (
    <div className="mb-6">
      <button onClick={onBack} className={`flex items-center gap-1.5 mb-4 text-sm font-medium ${t.muted} hover:${t.heading} transition-colors`}>
        <ArrowLeft size={15} /> Instructor Platform
      </button>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
            style={{ background: gradient || `linear-gradient(135deg, ${GREEN}, ${GREEN_DK})` }}>
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <h1 className={`text-xl md:text-2xl font-semibold tracking-tight ${t.heading}`}>{title}</h1>
            {sub && <p className={`text-sm mt-0.5 ${t.muted}`}>{sub}</p>}
          </div>
        </div>
        <DarkToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
      </div>
    </div>
  )
}

function Shell({ children, max = "max-w-6xl" }) {
  return <div className={`p-4 md:p-8 ${max} mx-auto pb-28 md:pb-16`}>{children}</div>
}
// Renders standalone (own page padding + header) or bare when embedded inside another page (e.g. Insights tabs)
function MaybeShell({ embedded, children, max }) {
  return embedded ? <>{children}</> : <Shell max={max}>{children}</Shell>
}

function StatCard({ darkMode, label, value, sub, Icon, trend, accent = GREEN }) {
  const t = tk(darkMode)
  const up = trend != null && trend >= 0
  return (
    <div className={`${t.card} p-4 md:p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium ${t.muted}`}>{label}</span>
        {Icon && <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: accent + "1a", color: accent }}><Icon size={14} /></span>}
      </div>
      <div className="flex items-end gap-2">
        <p className={`text-2xl md:text-[26px] font-bold tracking-tight tabular-nums ${t.heading}`}>{value}</p>
        {trend != null && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold mb-1 ${up ? "text-[#00aa13]" : "text-red-500"}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <p className={`text-xs mt-1 ${t.faint}`}>{sub}</p>}
    </div>
  )
}

// ── chart kit (hand-rolled SVG, responsive, no deps) ─────────────────────────
function AreaTrend({ points, color = GREEN, height = 170, darkMode, yMax }) {
  const W = 600, H = height, pad = { l: 6, r: 6, t: 14, b: 8 }
  const max = yMax || Math.max(...points) * 1.15 || 1
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b
  const xs = points.map((_, i) => pad.l + (i / (points.length - 1)) * iw)
  const ys = points.map(v => pad.t + ih - (v / max) * ih)
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${pad.t + ih} L${xs[0].toFixed(1)},${pad.t + ih} Z`
  const grid = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
  const id = "g" + Math.round(seedNum(String(points[0]) + points.length + color))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.28" /><stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient></defs>
      {[0.25, 0.5, 0.75].map(g => <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke={grid} strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      {xs.map((x, i) => i === xs.length - 1 && <circle key={i} cx={x} cy={ys[i]} r="3.5" fill={color} vectorEffect="non-scaling-stroke" />)}
    </svg>
  )
}

function Bars({ data, color = GREEN, height = 150, darkMode, fmt = v => v }) {
  const t = tk(darkMode)
  const max = Math.max(...data.map(d => d.v)) || 1
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full group">
          <span className={`text-[10px] font-semibold tabular-nums ${t.muted} opacity-0 group-hover:opacity-100 transition`}>{fmt(d.v)}</span>
          <div className="w-full rounded-lg transition-all" style={{ height: `${(d.v / max) * 100}%`, minHeight: 4, background: d.color || color }} title={`${d.label}: ${fmt(d.v)}`} />
          <span className={`text-[10px] font-medium ${t.faint}`}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function HBars({ data, color = GREEN, darkMode, fmt = v => v }) {
  const t = tk(darkMode)
  const max = Math.max(...data.map(d => d.v)) || 1
  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className={`text-xs font-medium w-28 flex-shrink-0 truncate ${t.heading}`}>{d.label}</span>
          <div className={`flex-1 h-2.5 rounded-full ${t.subtle} overflow-hidden`}>
            <div className="h-full rounded-full" style={{ width: `${(d.v / max) * 100}%`, background: d.color || color }} />
          </div>
          <span className={`text-xs font-semibold tabular-nums w-9 text-right ${t.muted}`}>{fmt(d.v)}</span>
        </div>
      ))}
    </div>
  )
}

function StackedBar({ dist, height = 14, rounded = true }) {
  return (
    <div className={`flex w-full overflow-hidden ${rounded ? "rounded-full" : "rounded"}`} style={{ height }}>
      {dist.map((d, i) => d.pct > 0 && (
        <div key={i} style={{ width: `${d.pct}%`, background: d.color }} title={`${d.label}: ${d.pct}%`} />
      ))}
    </div>
  )
}

function Ring({ pct, size = 76, stroke = 8, color = GREEN, darkMode, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  const track = darkMode ? "#374151" : "#eef1f4"
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

function Tag({ children, color, darkMode, active }) {
  const t = tk(darkMode)
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${active ? "text-white border-transparent" : t.muted + " " + t.border}`}
      style={active ? { background: color || GREEN } : color ? { borderColor: color + "55", color } : undefined}>
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const PLATFORM_FEATURES = [
  { key: "Cue Sheet",  title: "Cue Sheet",        sub: "Teleprompter coaching view for live class", Icon: Radio,         tint: "#00aa13", desc: "Mount-on-the-bike countdown, cues & segment timeline." },
  { key: "Live Mode",  title: "Live Instructor Mode", sub: "DJ + coach operations dashboard",        Icon: Activity,      tint: "#e91236", desc: "Real-time segment, target metrics & live rider feed." },
  { key: "Riders",     title: "Riders CRM",       sub: "Relationship management for your riders",    Icon: Users,         tint: "#8b5cf6", desc: "Profiles, attendance, milestones & private notes." },
  { key: "Feedback",   title: "Feedback & Ratings", sub: "Class performance analytics",              Icon: MessageSquare, tint: "#0ea5e9", desc: "NPS, sentiment trends, tags & recent reviews." },
  { key: "Subs",       title: "Sub Marketplace",  sub: "Instructor coverage management",             Icon: Calendar,      tint: "#f59e0b", desc: "Open coverage, apply to cover & approvals." },
  { key: "Growth",     title: "Growth Dashboard", sub: "Measure your instructor performance",        Icon: TrendingUp,    tint: "#14b8a6", desc: "KPIs, retention, personal bests & badges." },
  { key: "AI Builder", title: "AI Ride Builder",  sub: "Generate a full ride from one prompt",       Icon: Wand2,         tint: "#6366f1", desc: "Timeline, cues, playlist & intensity — instantly." },
]

const RIDERS = [
  { name: "Sarah Mitchell",  rides: 142, last: "2 days ago",  joined: "Mar 2024", eng: 94, streak: 6, fav: ["Power Zone", "HIIT", "Climb"], att: [3,4,3,4,4,3,4,4,4,3,4,4], notes: ["Recovering from knee injury — avoid heavy standing climbs", "Loves a competitive leaderboard"], miles: [{ t: "Birthday next week", kind: "bday" }, { t: "Reached a personal best", kind: "pb" }] },
  { name: "Tom Becker",      rides: 100, last: "Today",       joined: "Jan 2024", eng: 98, streak: 11, fav: ["HIIT", "Sprint", "EDM Ride"], att: [4,4,4,3,4,4,4,4,3,4,4,5], notes: ["Just hit ride #100 🎉", "Prefers front-row bike"], miles: [{ t: "100th ride completed", kind: "ride" }, { t: "11-week streak", kind: "streak" }] },
  { name: "Priya Anand",     rides: 67,  last: "Yesterday",   joined: "Jun 2024", eng: 81, streak: 4, fav: ["Endurance", "Power Zone"], att: [2,3,3,2,3,3,2,3,3,3,2,3], notes: ["Interested in power-zone training", "Training for a charity century ride"], miles: [{ t: "50 classes completed", kind: "class" }] },
  { name: "Marcus Webb",     rides: 38,  last: "4 days ago",  joined: "Sep 2024", eng: 64, streak: 0, fav: ["Rhythm", "EDM Ride"], att: [2,1,2,2,1,2,2,1,2,2,1,2], notes: ["Books late — nudge with reminders", "Music-first rider"], miles: [{ t: "25 rides milestone", kind: "ride" }] },
  { name: "Elena Rossi",     rides: 211, last: "Today",       joined: "Aug 2023", eng: 99, streak: 9, fav: ["Climb", "Power Zone", "Endurance"], att: [4,5,4,5,4,4,5,4,5,4,5,5], notes: ["Top of the leaderboard most weeks", "Mentors newer riders"], miles: [{ t: "200th ride", kind: "ride" }, { t: "Top 1% all-time", kind: "pb" }] },
  { name: "Jordan Lee",      rides: 54,  last: "3 days ago",  joined: "May 2024", eng: 73, streak: 3, fav: ["HIIT", "Sprint"], att: [3,2,3,3,2,3,3,2,3,3,3,2], notes: ["Wants to improve FTP", "Responds well to push cues"], miles: [{ t: "50 classes completed", kind: "class" }] },
  { name: "Aisha Khan",      rides: 89,  last: "Yesterday",   joined: "Feb 2024", eng: 88, streak: 7, fav: ["Endurance", "Rhythm"], att: [3,4,3,4,3,4,3,4,4,3,4,4], notes: ["Prefers endurance rides", "New mum — early classes only"], miles: [{ t: "Birthday next week", kind: "bday" }] },
  { name: "David Okafor",    rides: 126, last: "Today",       joined: "Nov 2023", eng: 92, streak: 8, fav: ["Power Zone", "Climb"], att: [4,4,3,4,4,4,3,4,4,4,4,4], notes: ["Powerful sprinter", "Interested in instructor training"], miles: [{ t: "Personal best power", kind: "pb" }, { t: "100th ride completed", kind: "ride" }] },
  { name: "Chloe Bennett",   rides: 31,  last: "6 days ago",  joined: "Oct 2024", eng: 58, streak: 0, fav: ["Rhythm", "Pop Ride"], att: [2,2,1,2,2,1,2,1,2,2,1,1], notes: ["At-risk of churn — re-engage", "Came via a friend referral"], miles: [{ t: "Joined 8 months ago", kind: "class" }] },
  { name: "Ravi Patel",      rides: 73,  last: "2 days ago",  joined: "Apr 2024", eng: 79, streak: 5, fav: ["HIIT", "EDM Ride", "Sprint"], att: [3,3,4,3,3,3,4,3,3,3,4,3], notes: ["Loves interval days", "Hydrate reminder helps"], miles: [{ t: "50 classes completed", kind: "class" }] },
  { name: "Sophie Turner",   rides: 158, last: "Yesterday",   joined: "Jul 2023", eng: 96, streak: 10, fav: ["Climb", "Endurance", "Power Zone"], att: [4,4,5,4,4,4,5,4,4,5,4,5], notes: ["Consistency queen", "Booked the whole month ahead"], miles: [{ t: "150th ride", kind: "ride" }, { t: "10-week streak", kind: "streak" }] },
  { name: "Liam Foster",     rides: 45,  last: "5 days ago",  joined: "Aug 2024", eng: 67, streak: 2, fav: ["Sprint", "HIIT"], att: [2,3,2,3,2,3,2,3,2,3,2,3], notes: ["Building a habit — celebrate small wins", "Prefers shorter 30-min rides"], miles: [{ t: "25 rides milestone", kind: "ride" }] },
]

const REVIEWS = [
  { name: "Elena Rossi",   stars: 5, text: "Best playlist this month — the climb drop was unreal.", tags: ["Great Music", "Great Energy"], when: "2h ago", cls: "EDM Power Ride" },
  { name: "Tom Becker",    stars: 5, text: "Hit a personal best on the sprints. Coaching cues were spot on.", tags: ["Good Coaching", "Loved Intervals"], when: "5h ago", cls: "Saturday HIIT" },
  { name: "Priya Anand",   stars: 4, text: "Intervals were challenging but fun. Could use one more recovery.", tags: ["Tough Workout", "Loved Intervals"], when: "Yesterday", cls: "Power Zone Endurance" },
  { name: "Marcus Webb",   stars: 5, text: "Loved the energy in the room. Felt like a proper night out.", tags: ["Great Energy", "Great Music"], when: "Yesterday", cls: "EDM Power Ride" },
  { name: "Aisha Khan",    stars: 4, text: "Great endurance block. The final climb nearly broke me!", tags: ["Tough Workout", "Good Coaching"], when: "2 days ago", cls: "Power Zone Endurance" },
  { name: "Jordan Lee",    stars: 3, text: "Solid ride but a touch too hard for a Monday morning.", tags: ["Too Hard"], when: "3 days ago", cls: "Saturday HIIT" },
  { name: "Sophie Turner", stars: 5, text: "Perfectly paced progression. I always leave buzzing.", tags: ["Good Coaching", "Great Energy"], when: "4 days ago", cls: "Power Zone Endurance" },
  { name: "David Okafor",  stars: 5, text: "Track selection is elite. The breakdown into Zone 5 = chefs kiss.", tags: ["Great Music", "Loved Intervals"], when: "5 days ago", cls: "EDM Power Ride" },
]

const FEEDBACK_TAGS = [
  { label: "Great Music",     v: 84, color: "#00aa13" },
  { label: "Great Energy",    v: 71, color: "#0ea5e9" },
  { label: "Good Coaching",   v: 63, color: "#8b5cf6" },
  { label: "Loved Intervals", v: 52, color: "#f59e0b" },
  { label: "Tough Workout",   v: 41, color: "#ec4899" },
  { label: "Too Hard",        v: 12, color: "#ef4444" },
]

const SUB_SEED = [
  { id: 1, day: "Fri 20 Jun", time: "6:30 PM", cls: "Power Zone Ride",   mins: 45, studio: "Studio 1 · Hampstead",  pay: "£75", state: "open", by: "Alex Papaya", reason: "Out of town" },
  { id: 2, day: "Sat 21 Jun", time: "9:00 AM", cls: "Saturday HIIT",     mins: 45, studio: "Studio 2 · Shoreditch", pay: "£75", state: "open", by: "Zen Kiwi", reason: "Double-booked" },
  { id: 3, day: "Mon 23 Jun", time: "7:00 AM", cls: "Sunrise Endurance", mins: 60, studio: "Studio 1 · Hampstead",  pay: "£90", state: "open", by: "Rio Banana", reason: "Holiday" },
  { id: 4, day: "Wed 18 Jun", time: "6:00 PM", cls: "EDM Power Ride",     mins: 45, studio: "Studio 1 · Hampstead",  pay: "£75", state: "applied", by: "Max Lime", reason: "Sick" },
  { id: 5, day: "Thu 12 Jun", time: "12:00 PM",cls: "Lunch Sprint",       mins: 30, studio: "Studio 2 · Shoreditch", pay: "£55", state: "approved", by: "Anna Banana", reason: "Conference" },
  { id: 6, day: "Sat 7 Jun",  time: "10:30 AM",cls: "Climb Club",         mins: 45, studio: "Studio 1 · Hampstead",  pay: "£75", state: "completed", by: "Liam G", reason: "Covered ✓" },
]

const FEED_TEMPLATES = [
  { Icon: Trophy, c: "#f59e0b", t: n => `${n} reached a personal best` },
  { Icon: Flame,  c: "#ef4444", t: n => `${n} hit a new power record` },
  { Icon: Award,  c: GREEN,     t: n => `${n} completed ride #100` },
  { Icon: Zap,    c: "#8b5cf6", t: n => `${n} entered Zone 5` },
  { Icon: Heart,  c: "#ec4899", t: n => `${n} just joined the room` },
  { Icon: TrendingUp, c: "#0ea5e9", t: n => `${n} climbed the leaderboard` },
]
const FEED_NAMES = ["Sarah", "Tom", "Elena", "David", "Sophie", "Ravi", "Aisha", "Jordan", "Priya"]

// ═════════════════════════════════════════════════════════════════════════════
//  OVERVIEW  ·  /instructor
// ═════════════════════════════════════════════════════════════════════════════
const FLOW_STEPS = [
  { label: "Generate Ride", Icon: Wand2, c: "#6366f1", go: "AI Builder" },
  { label: "Edit Class", Icon: SlidersIcon, c: "#0ea5e9", go: "Class Builder" },
  { label: "Teach Live", Icon: Radio, c: "#e91236", go: "Live Mode" },
  { label: "Review Feedback", Icon: MessageSquare, c: "#f59e0b", go: "Feedback" },
  { label: "Improve Performance", Icon: TrendingUp, c: "#14b8a6", go: "Growth" },
]
const DIFF_COLOR = { Beginner: "#14b8a6", Moderate: "#0ea5e9", Intermediate: "#f59e0b", Advanced: "#ef4444" }

export function InstructorPlatformPage({ darkMode, onToggleDarkMode, onNavigate, templates = [], onOpenBuilder }) {
  const t = tk(darkMode)
  const stats = [
    { label: "Classes this week", value: "9", Icon: Calendar, trend: 12 },
    { label: "Average attendance", value: "31", Icon: Users, trend: 8 },
    { label: "Rider retention", value: "88%", Icon: Heart, accent: "#ec4899", trend: 4 },
    { label: "Average rating", value: "4.9", Icon: Star, accent: "#f59e0b", trend: 3 },
  ]
  const heroFeatures = ["Generate workout structure", "Coaching cues per segment", "BPM-matched playlist", "Smart recovery intervals", "Editable, savable templates"]

  return (
    <Shell>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${GREEN}, #14b8a6)` }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className={`text-2xl font-semibold tracking-tight ${t.heading}`}>Instructor Platform</h1>
            <p className={`text-sm mt-0.5 ${t.muted}`}>Generate, teach and grow — your studio operating system.</p>
          </div>
        </div>
        <DarkToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
      </div>

      {/* A · HERO — AI Ride Builder */}
      <div className="rounded-3xl p-[1.5px] mb-5 shadow-xl" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6 55%,#ec4899)" }}>
        <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#5b5bd6,#7c4ddb 55%,#c0398f)" }}>
          <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10" />
          <div className="absolute right-16 bottom-0 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full mb-3"><Sparkles size={12} /> Flagship</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI Ride Builder</h2>
              <p className="text-white/85 mt-2 text-base md:text-lg">Build complete spin classes in seconds.</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
                {heroFeatures.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm text-white/90"><Check size={14} className="text-white" /> {f}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => onNavigate("AI Builder")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#5b5bd6] font-semibold text-sm shadow-lg hover:bg-white/90 transition-colors">
                  <Wand2 size={16} /> Create Ride
                </button>
                <button onClick={() => onNavigate("AI Builder")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors">
                  View Example
                </button>
              </div>
            </div>
            <div className="hidden md:block rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-sm">
              <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-3">
                {[["#82ed3c", 18], ["#fde53d", 14], ["#e91236", 12], ["#82ed3c", 10], ["#e91236", 12], ["#82ed3c", 10], ["#741a10", 8], ["#36aee2", 16]].map(([c, w], i) => <div key={i} style={{ width: `${w}%`, background: c }} />)}
              </div>
              {["Warm Up · 5 min", "Interval 1 · Z4–5 · 3 min", "Recovery · Z2 · 2 min", "Long Climb · Z3–4 · 8 min"].map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-white/85 py-1.5 border-b border-white/10 last:border-0">
                  <span>{s}</span><span className="text-white/50">✎</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* B · FLOW VISUAL */}
      <div className={`${t.card} p-5 mb-5`}>
        <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${t.faint}`}>The instructor loop</p>
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-1">
          {FLOW_STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <button onClick={() => onNavigate(s.go)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl flex-shrink-0 ${t.subtle} hover:shadow-md transition-all`}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ background: s.c }}><s.Icon size={15} /></span>
                <span className={`text-sm font-semibold whitespace-nowrap ${t.heading}`}>{s.label}</span>
              </button>
              {i < FLOW_STEPS.length - 1 && <ChevronRight size={16} className={`${t.faint} flex-shrink-0`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5 mb-5">
        {/* C · RECENT TEMPLATES */}
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${t.heading}`}>Recent templates</p>
            <button onClick={() => onNavigate("AI Builder")} className="text-xs font-semibold text-[#00aa13] flex items-center gap-1">Go to AI Builder <ChevronRight size={13} /></button>
          </div>
          <div className="flex flex-col gap-2">
            {templates.slice(0, 6).map((tp, i) => (
              <button key={tp.id || i} onClick={() => onOpenBuilder?.(tp)} className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-left ${t.subtle} hover:shadow-md transition-all group`}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg,${DIFF_COLOR[tp.difficulty] || GREEN},${(DIFF_COLOR[tp.difficulty] || GREEN)}bb)` }}><Music size={17} /></span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${t.heading}`}>{tp.name}</p>
                  <p className={`text-xs ${t.muted}`}>{tp.mins} min · <span style={{ color: DIFF_COLOR[tp.difficulty] || GREEN }}>{tp.difficulty}</span> · edited {tp.edited}</p>
                </div>
                <span className={`text-xs font-semibold flex items-center gap-1 ${t.faint} group-hover:text-[#00aa13]`}>Open <ChevronRight size={13} /></span>
              </button>
            ))}
          </div>
        </div>

        {/* D · QUICK STATS */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {stats.map((s, i) => <StatCard key={i} darkMode={darkMode} {...s} />)}
        </div>
      </div>

      {/* Explore the rest of the platform */}
      <p className={`text-xs font-bold uppercase tracking-wider mb-3 px-1 ${t.faint}`}>Explore the platform</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORM_FEATURES.map(f => (
          <button key={f.key} onClick={() => onNavigate(f.key)}
            className={`${t.card} p-5 text-left group hover:shadow-lg transition-all hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${f.tint}, ${f.tint}cc)` }}>
                <f.Icon size={20} />
              </div>
              <ChevronRight size={18} className={`${t.faint} group-hover:translate-x-0.5 transition-transform`} />
            </div>
            <p className={`text-base font-semibold ${t.heading}`}>{f.title}</p>
            <p className={`text-xs mt-1 ${t.muted}`}>{f.desc}</p>
          </button>
        ))}
      </div>
    </Shell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 1 · CUE SHEET  ·  /instructor/cue-sheet
// ═════════════════════════════════════════════════════════════════════════════
const CUE_SEGMENTS = [
  { name: "Warm Up",   secs: 300, rpm: "80–90", zone: "Z1–2", z: 2, cues: ["Roll the legs out", "Find your breath", "Light resistance", "Settle the shoulders"] },
  { name: "Hill Climb",secs: 240, rpm: "70–80", zone: "Z3–4", z: 4, cues: ["Add resistance", "Stay seated", "Maintain 70–80 RPM", "Keep shoulders relaxed", "Drive from the heels"] },
  { name: "Sprint",    secs: 30,  rpm: "100+",  zone: "Z5",   z: 5, cues: ["Out of the saddle", "All-out effort", "Light, fast legs", "Leave it on the bike"] },
  { name: "Recovery",  secs: 120, rpm: "85",    zone: "Z2",   z: 2, cues: ["Drop resistance", "Slow the breath", "Shake out the arms", "Hydrate"] },
  { name: "Cool Down", secs: 180, rpm: "70",    zone: "Z1",   z: 1, cues: ["Ease the pace", "Long exhales", "Roll the neck", "Well done today"] },
]
// Riders in the room — live performance % drives the leaderboard / seating heat-map
const LIVE_RIDERS = ["Sarah M","Tom B","Elena R","David O","Sophie T","Ravi P","Aisha K","Jordan L","Priya A","Marcus W","Chloe B","Liam F","Noah P","Mia F","Leo B","Olivia H","Zoe K","Ben C","Ivy R","Sam D","Nina G","Kofi A","Lena V","Theo M"]
  .map((name, i) => ({ name, bike: i + 1, out: 40 + ((i * 37) % 55) }))
function perfColor(v) { return v >= 80 ? "#00aa13" : v >= 62 ? "#82ed3c" : v >= 44 ? "#fde53d" : v >= 26 ? "#fb7512" : "#e91236" }
const fmtMSS = s => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`

// ═════════════════════════════════════════════════════════════════════════════
//  LIVE TEACHING COCKPIT  ·  cue sheet + live metrics + rider leaderboard, merged
// ═════════════════════════════════════════════════════════════════════════════
const ZONE_DIST_LIVE = [5, 15, 35, 30, 15].map((pct, i) => ({ label: `Zone ${i + 1}`, pct, color: ZONE_COLORS[i] }))

export function LiveModePage({ onNavigate }) {
  const [idx, setIdx] = useState(1)
  const [left, setLeft] = useState(133)
  const [running, setRunning] = useState(false)
  const [cueIdx, setCueIdx] = useState(0)
  const [riders, setRiders] = useState(LIVE_RIDERS)
  const [feed, setFeed] = useState(() => [
    { id: 1, Icon: Trophy, c: "#f59e0b", txt: "Sarah reached a personal best", ago: "just now" },
    { id: 2, Icon: Award, c: GREEN, txt: "Tom completed ride #100", ago: "1m ago" },
    { id: 3, Icon: Zap, c: "#8b5cf6", txt: "Elena entered Zone 5", ago: "2m ago" },
  ])
  const fid = useRef(4)
  const seg = CUE_SEGMENTS[idx], next = CUE_SEGMENTS[idx + 1]
  const total = CUE_SEGMENTS.reduce((a, s) => a + s.secs, 0)
  const done = CUE_SEGMENTS.slice(0, idx).reduce((a, s) => a + s.secs, 0) + (seg.secs - left)
  const progress = Math.round(done / total * 100)

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => {
      if (left > 1) { setLeft(left - 1); return }
      const n = idx + 1
      if (n >= CUE_SEGMENTS.length) { setRunning(false); setLeft(0); return }
      setIdx(n); setLeft(CUE_SEGMENTS[n].secs); setCueIdx(0)
    }, 1000)
    return () => clearTimeout(id)
  }, [running, left, idx])
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setCueIdx(c => (c + 1) % seg.cues.length), 3200)
    return () => clearInterval(id)
  }, [running, seg])
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const target = seg.z
      setRiders(rs => rs.map(r => {
        const drift = (Math.random() - 0.45) * 8 + (target * 4 - r.out) * 0.06
        return { ...r, out: Math.max(12, Math.min(100, Math.round(r.out + drift))) }
      }))
      if (Math.random() > 0.4) {
        const tpl = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)]
        const nm = FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)]
        setFeed(f => [{ id: fid.current++, Icon: tpl.Icon, c: tpl.c, txt: tpl.t(nm), ago: "just now" }, ...f.slice(0, 6)])
      }
    }, 2200)
    return () => clearInterval(id)
  }, [running, seg])

  function skip() { const n = Math.min(idx + 1, CUE_SEGMENTS.length - 1); setIdx(n); setLeft(CUE_SEGMENTS[n].secs); setCueIdx(0) }
  function reset() { setIdx(1); setLeft(133); setRunning(false); setCueIdx(0) }

  const ranked = [...riders].sort((a, b) => b.out - a.out)
  const rankOf = {}; ranked.forEach((r, i) => { rankOf[r.bike] = i + 1 })
  const avgOut = Math.round(riders.reduce((a, r) => a + r.out, 0) / riders.length)
  const rows = [riders.slice(0, 8), riders.slice(8, 16), riders.slice(16, 24)]
  const initials = n => n.split(" ").map(w => w[0]).join("")

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(120% 90% at 50% 0%, #14223a 0%, #0a0f1c 60%, #060912 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 pb-32 md:pb-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-red-500/15 text-red-400">
              <span className={`w-2 h-2 rounded-full ${running ? "bg-red-500 animate-pulse" : "bg-white/30"}`} /> {running ? "On Air" : "Standby"}
            </span>
            <span className="text-sm text-white/60 hidden sm:inline">EDM Power Ride · Studio 1 · {riders.length} riders</span>
          </div>
          <button onClick={() => onNavigate("Studio Home")} className="text-sm font-medium text-white/50 hover:text-white transition-colors">Exit</button>
        </div>

        {/* class plan with playhead — the overview running alongside */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Class plan</p>
            <span className="text-xs text-white/50 tabular-nums">{fmtMSS(done)} / {fmtMSS(total)} · {progress}%</span>
          </div>
          <div className="relative h-7 rounded-lg overflow-hidden flex">
            {CUE_SEGMENTS.map((s, i) => (
              <div key={i} className="relative flex items-center justify-center border-r border-black/20 last:border-0" style={{ width: `${s.secs / total * 100}%`, background: ZONE_COLORS[s.z - 1], opacity: i === idx ? 1 : 0.45 }}>
                <span className="text-[9px] font-bold text-black/70 truncate px-1">{s.name}</span>
              </div>
            ))}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white z-10" style={{ left: `${done / total * 100}%`, boxShadow: "0 0 8px #fff" }} />
          </div>
          {next && <p className="text-[11px] text-white/45 mt-2">Up next · <span className="text-white/85 font-semibold">{next.name}</span> · {fmtMSS(next.secs)} · {next.rpm} RPM</p>}
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
          {/* cue teleprompter */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[#36ff5e] text-xs font-bold uppercase tracking-[0.2em] mb-1">Now · {seg.zone} · {seg.rpm} RPM</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{seg.name}</h1>
            <div className="flex items-end gap-3 mt-3 mb-4">
              <span className="text-[64px] md:text-[88px] leading-none font-bold tabular-nums" style={{ textShadow: "0 0 30px rgba(0,170,19,.35)" }}>{fmtMSS(left)}</span>
              <span className="text-white/45 mb-2 md:mb-4">remaining</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
              <div className="h-full rounded-full" style={{ width: `${(seg.secs - left) / seg.secs * 100}%`, background: "linear-gradient(90deg,#00aa13,#36ff5e)" }} />
            </div>
            <div className="flex flex-col gap-2">
              {seg.cues.map((cue, i) => (
                <div key={i} className={`px-4 py-2.5 rounded-xl border transition-all duration-500 ${i === cueIdx ? "border-[#00aa13] bg-[#00aa13]/15" : "border-white/10 bg-white/[0.03]"}`}>
                  <p className={`text-base font-semibold ${i === cueIdx ? "text-white" : "text-white/55"}`}>{cue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* leaderboard seating heat-map */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold">Live leaderboard</p>
              <span className="text-xs text-white/45">avg {avgOut}% effort</span>
            </div>
            <p className="text-[11px] text-white/40 mb-3">Seat colour = real-time output</p>
            <div className="flex flex-col gap-1.5 mb-4">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-1.5 justify-center">
                  {row.map(r => (
                    <div key={r.bike} title={`${r.name} · ${r.out}% · #${rankOf[r.bike]}`}
                      className="w-9 h-10 rounded-lg flex items-center justify-center text-[9px] font-bold text-black/80 transition-colors"
                      style={{ background: perfColor(r.out) }}>
                      {rankOf[r.bike] <= 3 ? ["🥇", "🥈", "🥉"][rankOf[r.bike] - 1] : initials(r.name)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">Top 5</p>
            <div className="flex flex-col gap-1">
              {ranked.slice(0, 5).map((r, i) => (
                <div key={r.bike} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 bg-white/[0.04]">
                  <span className="text-xs font-bold w-4 text-white/50">{i + 1}</span>
                  <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-black/80" style={{ background: perfColor(r.out) }}>{initials(r.name)}</span>
                  <span className="flex-1 text-sm font-medium truncate">{r.name}</span>
                  <span className="text-sm font-bold tabular-nums">{r.out}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Target metrics</p>
            <div className="flex flex-col gap-3">
              {[["Cadence", `${seg.rpm} RPM`, Gauge, GREEN], ["Heart rate", "Zone 4 · 162–172", Heart, "#e91236"], ["Power", "Zone 3 · 210–250 W", Zap, "#f59e0b"]].map(([l, v, Ic, c], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c + "22", color: c }}><Ic size={16} /></span>
                  <div><p className="text-[11px] text-white/45">{l}</p><p className="text-sm font-bold">{v}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Zone distribution</p>
            <StackedBar dist={ZONE_DIST_LIVE} height={18} />
            <div className="grid grid-cols-5 gap-1.5 mt-3">
              {ZONE_DIST_LIVE.map((z, i) => (
                <div key={i} className="text-center"><div className="w-full h-1.5 rounded-full mb-1" style={{ background: z.color }} /><p className="text-xs font-bold">{z.pct}%</p></div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-3"><p className="text-sm font-semibold">Live feed</p><Radio size={15} className="text-red-400" /></div>
            <div className="flex flex-col gap-2">
              {feed.slice(0, 5).map((f, i) => (
                <div key={f.id} className="flex items-center gap-2.5" style={{ opacity: 1 - i * 0.13 }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: f.c + "22", color: f.c }}><f.Icon size={13} /></span>
                  <p className="text-sm truncate">{f.txt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* control bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0f1c]/90 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <button onClick={reset} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center" title="Reset"><RotateCcw size={18} /></button>
          <button onClick={() => setRunning(r => !r)} className="h-14 px-8 rounded-full font-semibold text-base flex items-center gap-2.5 shadow-lg transition-transform active:scale-95"
            style={{ background: running ? "#fff" : "linear-gradient(135deg,#00aa13,#008a0f)", color: running ? "#0a0f1c" : "#fff" }}>
            {running ? <><Pause size={20} /> Pause</> : <><Play size={20} /> {left === CUE_SEGMENTS[idx].secs ? "Start Class" : "Resume"}</>}
          </button>
          <button onClick={skip} className="h-12 px-5 rounded-full bg-white/10 hover:bg-white/15 flex items-center gap-2 text-sm font-semibold" title="Skip"><SkipForward size={18} /> Skip</button>
        </div>
      </div>
    </div>
  )
}

// ── small helpers used below ─────────────────────────────────────────────────
function Stars({ n, size = 13 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={size} className={i <= n ? "text-amber-400 fill-amber-400" : "text-gray-300"} />)}
    </span>
  )
}
const engColor = e => e >= 85 ? GREEN : e >= 65 ? "#f59e0b" : "#ef4444"
const MILE_ICON = {
  ride: { Icon: Award, c: GREEN }, class: { Icon: Trophy, c: "#0ea5e9" },
  bday: { Icon: Heart, c: "#ec4899" }, pb: { Icon: Flame, c: "#f59e0b" }, streak: { Icon: Zap, c: "#8b5cf6" },
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 3 · RIDERS CRM  ·  /instructor/riders
// ═════════════════════════════════════════════════════════════════════════════
export function RidersCRMPage({ darkMode, onToggleDarkMode, onNavigate }) {
  const t = tk(darkMode)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(null)
  const list = RIDERS.filter(r => r.name.toLowerCase().includes(q.trim().toLowerCase()))
  const atRisk = RIDERS.filter(r => r.eng < 65).length

  return (
    <Shell>
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Platform")}
        title="Riders CRM" sub={`${RIDERS.length} riders · relationship management`} Icon={Users}
        gradient="linear-gradient(135deg,#8b5cf6,#6366f1)" />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard darkMode={darkMode} label="Total riders" value={RIDERS.length} Icon={Users} accent="#8b5cf6" />
        <StatCard darkMode={darkMode} label="Avg engagement" value={`${Math.round(RIDERS.reduce((a, r) => a + r.eng, 0) / RIDERS.length)}`} Icon={Activity} />
        <StatCard darkMode={darkMode} label="At-risk of churn" value={atRisk} Icon={TrendingDown} accent="#ef4444" />
      </div>

      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border mb-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <Search size={16} className={t.faint} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search riders by name…"
          className={`flex-1 bg-transparent text-sm focus:outline-none ${darkMode ? "text-white" : "text-gray-900"}`} />
        {q && <button onClick={() => setQ("")} className={`text-xs ${t.muted}`}>Clear</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((r, i) => (
          <button key={i} onClick={() => setOpen(r)} className={`${t.card} p-4 text-left hover:shadow-md transition-all`}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={r.name} size={44} ring={engColor(r.eng)} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${t.heading}`}>{r.name}</p>
                <p className={`text-xs ${t.muted}`}>Joined {r.joined}</p>
              </div>
              <span className="text-xs font-bold tabular-nums" style={{ color: engColor(r.eng) }}>{r.eng}</span>
            </div>
            <div className="flex items-center justify-between">
              <div><p className={`text-lg font-bold tabular-nums ${t.heading}`}>{r.rides}</p><p className={`text-[10px] ${t.faint}`}>total rides</p></div>
              <div className="text-right"><p className={`text-sm font-semibold ${t.heading}`}>{r.last}</p><p className={`text-[10px] ${t.faint}`}>last ride</p></div>
            </div>
            {r.miles.some(m => m.kind === "bday") && <p className="mt-2.5 text-[11px] font-medium text-pink-500">🎂 Birthday next week</p>}
          </button>
        ))}
      </div>

      {/* expanded profile modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6" onClick={() => setOpen(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div onClick={e => e.stopPropagation()}
            className={`relative w-full md:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border shadow-2xl ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <div className={`sticky top-0 flex items-center gap-3.5 p-5 border-b ${t.border} ${darkMode ? "bg-gray-900" : "bg-white"}`}>
              <Avatar name={open.name} size={52} ring={engColor(open.eng)} />
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-semibold ${t.heading}`}>{open.name}</p>
                <p className={`text-xs ${t.muted}`}>{open.rides} rides · {open.streak}-week streak · joined {open.joined}</p>
              </div>
              <button onClick={() => setOpen(null)} className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.chip}`}>✕</button>
            </div>

            <div className="p-5 space-y-5">
              {/* engagement + attendance */}
              <div className="flex items-center gap-5">
                <Ring pct={open.eng} size={84} stroke={9} color={engColor(open.eng)} darkMode={darkMode}>
                  <div className="text-center"><p className={`text-xl font-bold ${t.heading}`}>{open.eng}</p><p className={`text-[9px] ${t.faint}`}>score</p></div>
                </Ring>
                <div className="flex-1">
                  <p className={`text-xs font-semibold mb-2 ${t.muted}`}>Attendance · last 12 weeks</p>
                  <div className="flex items-end gap-1 h-12">
                    {open.att.map((v, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${(v / 5) * 100}%`, minHeight: 3, background: i >= open.att.length - 2 ? GREEN : (darkMode ? "#374151" : "#d1d5db") }} title={`${v} rides`} />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className={`text-xs font-semibold mb-2 ${t.muted}`}>Favourite class types</p>
                <div className="flex flex-wrap gap-1.5">{open.fav.map((f, i) => <Tag key={i} darkMode={darkMode} color="#8b5cf6">{f}</Tag>)}</div>
              </div>

              <div>
                <p className={`text-xs font-semibold mb-2 ${t.muted}`}>Milestones</p>
                <div className="flex flex-col gap-2">
                  {open.miles.map((m, i) => {
                    const mi = MILE_ICON[m.kind] || MILE_ICON.ride
                    return (
                      <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${t.subtle}`}>
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: mi.c + "1a", color: mi.c }}><mi.Icon size={15} /></span>
                        <p className={`text-sm font-medium ${t.heading}`}>{m.t}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className={`text-xs font-semibold mb-2 ${t.muted}`}>Instructor notes</p>
                <div className="flex flex-col gap-2">
                  {open.notes.map((n, i) => (
                    <div key={i} className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 border ${t.border}`}>
                      <Pencil size={13} className={`${t.faint} mt-0.5 flex-shrink-0`} />
                      <p className={`text-sm ${t.heading}`}>{n}</p>
                    </div>
                  ))}
                  <button className={`text-xs font-semibold ${t.muted} hover:text-[#00aa13] flex items-center gap-1.5 px-1 py-1`}><Plus size={13} /> Add a note</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 4 · CLASS FEEDBACK & RATINGS  ·  /instructor/feedback
// ═════════════════════════════════════════════════════════════════════════════
export function FeedbackPage({ darkMode, onToggleDarkMode, onNavigate, embedded }) {
  const t = tk(darkMode)
  const trend = [4.5, 4.6, 4.6, 4.7, 4.8, 4.7, 4.9, 4.8, 4.9, 5.0]
  const sentiment = [ // monthly positive / neutral / negative
    { m: "Jan", pos: 72, neu: 20, neg: 8 }, { m: "Feb", pos: 75, neu: 18, neg: 7 },
    { m: "Mar", pos: 78, neu: 16, neg: 6 }, { m: "Apr", pos: 81, neu: 14, neg: 5 },
    { m: "May", pos: 84, neu: 12, neg: 4 }, { m: "Jun", pos: 88, neu: 9, neg: 3 },
  ]
  const cards = [
    { label: "Average rating", value: "4.9", sub: "from 1,284 reviews", Icon: Star, accent: "#f59e0b", trend: 4 },
    { label: "NPS", value: "72", sub: "World-class (>70)", Icon: ThumbsUp, accent: GREEN, trend: 6 },
    { label: "Response rate", value: "64%", sub: "of riders leave feedback", Icon: MessageSquare, accent: "#0ea5e9", trend: 9 },
    { label: "Repeat attendance", value: "88%", sub: "rebook within 2 weeks", Icon: Heart, accent: "#ec4899", trend: 3 },
  ]

  return (
    <MaybeShell embedded={embedded}>
      {!embedded && <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Studio Home")}
        title="Feedback & Ratings" sub="Class performance analytics" Icon={MessageSquare}
        gradient="linear-gradient(135deg,#0ea5e9,#6366f1)" />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {cards.map((c, i) => <StatCard key={i} darkMode={darkMode} {...c} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className={`${t.card} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${t.heading}`}>Rating trend</p>
            <span className="text-xs font-semibold text-[#00aa13]">+0.4 over 10 weeks</span>
          </div>
          <p className={`text-3xl font-bold ${t.heading} mb-2`}>4.9 <span className="text-base font-medium text-amber-400">★</span></p>
          <AreaTrend points={trend} darkMode={darkMode} color="#f59e0b" yMax={5.2} height={150} />
          <div className={`flex justify-between text-[10px] ${t.faint} mt-1`}><span>10 wks ago</span><span>Now</span></div>
        </div>
        <div className={`${t.card} p-5`}>
          <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Popular tags</p>
          <HBars data={FEEDBACK_TAGS} darkMode={darkMode} fmt={v => `${v}%`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* sentiment trend */}
        <div className={`${t.card} p-5`}>
          <p className={`text-sm font-semibold mb-1 ${t.heading}`}>Sentiment over time</p>
          <p className={`text-xs mb-4 ${t.muted}`}>Positive sentiment up 16pts since January</p>
          <div className="flex items-end justify-between gap-2 h-36">
            {sentiment.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col-reverse rounded-md overflow-hidden h-28" title={`${s.pos}% positive`}>
                  <div style={{ height: `${s.pos}%`, background: GREEN }} />
                  <div style={{ height: `${s.neu}%`, background: "#fbbf24" }} />
                  <div style={{ height: `${s.neg}%`, background: "#ef4444" }} />
                </div>
                <span className={`text-[10px] ${t.faint}`}>{s.m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            {[["Positive", GREEN], ["Neutral", "#fbbf24"], ["Negative", "#ef4444"]].map(([l, c]) => (
              <span key={l} className={`flex items-center gap-1.5 text-[10px] ${t.muted}`}><span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}</span>
            ))}
          </div>
        </div>

        {/* recent reviews */}
        <div className={`${t.card} p-5 lg:col-span-2`}>
          <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Recent reviews</p>
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {REVIEWS.map((r, i) => (
              <div key={i} className={`rounded-xl p-4 ${t.subtle}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={r.name} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${t.heading}`}>{r.name}</p>
                    <p className={`text-[11px] ${t.faint}`}>{r.cls} · {r.when}</p>
                  </div>
                  <Stars n={r.stars} />
                </div>
                <p className={`text-sm ${t.heading} mb-2.5`}>“{r.text}”</p>
                <div className="flex flex-wrap gap-1.5">{r.tags.map((tag, j) => <Tag key={j} darkMode={darkMode}>{tag}</Tag>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaybeShell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 5 · SUBSTITUTION MARKETPLACE  ·  /instructor/subs
// ═════════════════════════════════════════════════════════════════════════════
const SUB_STATES = [
  { key: "open", label: "Open", c: "#0ea5e9" }, { key: "applied", label: "Applied", c: "#f59e0b" },
  { key: "approved", label: "Approved", c: GREEN }, { key: "completed", label: "Completed", c: "#8b5cf6" },
]
export function SubsMarketplacePage({ darkMode, onToggleDarkMode, onNavigate }) {
  const t = tk(darkMode)
  const [subs, setSubs] = useState(SUB_SEED)
  const [activity, setActivity] = useState([
    { id: 1, txt: "Lunch Sprint cover was approved", c: GREEN, ago: "2h ago" },
    { id: 2, txt: "You applied to cover EDM Power Ride", c: "#f59e0b", ago: "1d ago" },
    { id: 3, txt: "Climb Club marked completed", c: "#8b5cf6", ago: "3d ago" },
  ])
  const aid = useRef(4)
  function apply(id) {
    setSubs(s => s.map(x => x.id === id ? { ...x, state: "applied" } : x))
    const sub = subs.find(x => x.id === id)
    setActivity(a => [{ id: aid.current++, txt: `You applied to cover ${sub.cls}`, c: "#f59e0b", ago: "just now" }, ...a])
  }
  const groups = SUB_STATES.map(st => ({ ...st, items: subs.filter(s => s.state === st.key) }))

  return (
    <Shell>
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Platform")}
        title="Sub Marketplace" sub="Instructor coverage management" Icon={Calendar}
        gradient="linear-gradient(135deg,#f59e0b,#fb7512)" />

      {/* workflow legend */}
      <div className={`${t.card} p-4 mb-5 flex items-center gap-2 overflow-x-auto`}>
        {SUB_STATES.map((s, i) => (
          <React.Fragment key={s.key}>
            <span className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap" style={{ color: s.c }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />{s.label}
              <span className={`${t.muted} font-normal`}>· {groups[i].items.length}</span>
            </span>
            {i < SUB_STATES.length - 1 && <ChevronRight size={14} className={t.faint} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-5">
          {groups.map(g => g.items.length > 0 && (
            <div key={g.key}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-1" style={{ color: g.c }}>{g.label} · {g.items.length}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {g.items.map(s => (
                  <div key={s.id} className={`${t.card} p-4`}>
                    <div className="flex items-start justify-between mb-2.5">
                      <div>
                        <p className={`text-xs font-semibold ${t.muted}`}>{s.day} · {s.time}</p>
                        <p className={`text-base font-semibold mt-0.5 ${t.heading}`}>{s.cls}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: g.c + "1a", color: g.c }}>{g.label}</span>
                    </div>
                    <div className={`flex items-center gap-3 text-xs mb-3 ${t.muted}`}>
                      <span className="flex items-center gap-1"><Clock size={12} /> {s.mins} min</span>
                      <span className="truncate">{s.studio}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.by} size={24} />
                        <span className={`text-xs ${t.faint}`}>{s.by} · {s.reason}</span>
                      </div>
                      <span className={`text-sm font-bold ${t.heading}`}>{s.pay}</span>
                    </div>
                    {s.state === "open" && (
                      <button onClick={() => apply(s.id)}
                        className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                        style={{ background: GREEN }} onMouseDown={e => e.currentTarget.style.background = GREEN_DK} onMouseUp={e => e.currentTarget.style.background = GREEN}>
                        Apply to Cover
                      </button>
                    )}
                    {s.state === "applied" && <p className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-center bg-amber-500/10 text-amber-500">Application pending</p>}
                    {s.state === "approved" && <p className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-center flex items-center justify-center gap-1.5" style={{ background: GREEN + "1a", color: GREEN }}><Check size={15} /> You're covering this</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* activity feed */}
        <div className={`${t.card} p-5 h-fit`}>
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${t.heading}`}>Activity</p>
            <Bell size={15} className={t.faint} />
          </div>
          <div className="flex flex-col gap-1">
            {activity.map((a, i) => (
              <div key={a.id} className={`flex items-start gap-3 py-2.5 ${i < activity.length - 1 ? "border-b " + t.border : ""}`}>
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.c }} />
                <div className="min-w-0"><p className={`text-sm ${t.heading}`}>{a.txt}</p><p className={`text-[10px] ${t.faint}`}>{a.ago}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 6 · GROWTH DASHBOARD  ·  /instructor/growth
// ═════════════════════════════════════════════════════════════════════════════
export function GrowthDashboardPage({ darkMode, onToggleDarkMode, onNavigate, embedded }) {
  const t = tk(darkMode)
  const kpis = [
    { label: "Classes taught", value: "412", Icon: Calendar, trend: 12 },
    { label: "Avg attendance", value: "31", Icon: Users, trend: 8 },
    { label: "Rider retention", value: "88%", Icon: Heart, accent: "#ec4899", trend: 4 },
    { label: "NPS", value: "72", Icon: ThumbsUp, accent: "#0ea5e9", trend: 6 },
    { label: "Repeat riders", value: "64%", Icon: RotateCcw, accent: "#8b5cf6", trend: 5 },
  ]
  const attendance = [22, 24, 23, 26, 28, 27, 30, 29, 31, 33, 32, 35]
  const classesPerMonth = [{ label: "Jan", v: 28 }, { label: "Feb", v: 31 }, { label: "Mar", v: 30 }, { label: "Apr", v: 34 }, { label: "May", v: 36 }, { label: "Jun", v: 38 }]
  const bests = [
    { label: "Highest attendance", value: "42 riders", sub: "EDM Power Ride · 14 Jun", Icon: Users, c: GREEN },
    { label: "Most popular class", value: "EDM Power Ride", sub: "avg 38 riders / class", Icon: Music, c: "#8b5cf6" },
    { label: "Highest rated ride", value: "Power Zone Endurance", sub: "4.97 ★ avg", Icon: Star, c: "#f59e0b" },
    { label: "Fastest growing class", value: "Saturday HIIT", sub: "+46% riders in 8 weeks", Icon: TrendingUp, c: "#0ea5e9" },
  ]
  const badges = [
    { t: "1,000 riders coached", Icon: Users, on: true, c: GREEN },
    { t: "100-class streak", Icon: Flame, on: true, c: "#f59e0b" },
    { t: "NPS 70+ club", Icon: ThumbsUp, on: true, c: "#0ea5e9" },
    { t: "Sold-out 10×", Icon: Trophy, on: true, c: "#8b5cf6" },
    { t: "5.0 class", Icon: Star, on: true, c: "#ec4899" },
    { t: "500 classes", Icon: Award, on: false, c: "#14b8a6" },
  ]

  return (
    <MaybeShell embedded={embedded}>
      {!embedded && <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Studio Home")}
        title="Growth Dashboard" sub="Measure your instructor performance" Icon={TrendingUp}
        gradient="linear-gradient(135deg,#14b8a6,#00aa13)" />}

      <div className="flex justify-end mb-4">
        <button onClick={() => onNavigate("Riders")} className={`flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-xl ${t.chip} hover:shadow-md transition-all`}>
          <Users size={15} /> View Rider Insights <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {kpis.map((k, i) => <StatCard key={i} darkMode={darkMode} {...k} />)}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${t.heading}`}>Avg attendance trend</p>
            <span className="text-xs font-semibold text-[#00aa13]">+59% YoY</span>
          </div>
          <p className={`text-3xl font-bold ${t.heading} mb-2`}>35 <span className={`text-sm font-medium ${t.muted}`}>riders / class</span></p>
          <AreaTrend points={attendance} darkMode={darkMode} color="#14b8a6" height={150} />
        </div>
        <div className={`${t.card} p-5`}>
          <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Classes taught / month</p>
          <Bars data={classesPerMonth} darkMode={darkMode} color={GREEN} height={170} />
        </div>
      </div>

      <div className={`${t.card} p-5 mb-4`}>
        <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Personal bests</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {bests.map((b, i) => (
            <div key={i} className={`rounded-xl p-4 ${t.subtle}`}>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: b.c + "1a", color: b.c }}><b.Icon size={17} /></span>
              <p className={`text-[11px] ${t.muted}`}>{b.label}</p>
              <p className={`text-base font-bold leading-tight mt-0.5 ${t.heading}`}>{b.value}</p>
              <p className={`text-[11px] mt-1 ${t.faint}`}>{b.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${t.card} p-5`}>
        <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Achievement badges</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {badges.map((b, i) => (
            <div key={i} className={`flex flex-col items-center text-center gap-2 rounded-xl p-3 ${t.subtle} ${b.on ? "" : "opacity-40"}`}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: b.on ? `linear-gradient(135deg,${b.c},${b.c}bb)` : (darkMode ? "#374151" : "#d1d5db") }}>
                <b.Icon size={20} />
              </div>
              <p className={`text-[10px] font-medium leading-tight ${t.heading}`}>{b.t}</p>
            </div>
          ))}
        </div>
      </div>
    </MaybeShell>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
//  FEATURE 7 · AI RIDE BUILDER  ·  /instructor/ai-builder  (flagship)
// ═════════════════════════════════════════════════════════════════════════════
const TYPE_COLOR = { warmup: ZONE_COLORS[1], climb: ZONE_COLORS[3], interval: ZONE_COLORS[4], recovery: ZONE_COLORS[1], cooldown: ZONE_COLORS[0] }
const PLAYLISTS_BY_GENRE = {
  EDM: [["Titanium", "David Guetta", 126], ["Levels", "Avicii", 126], ["Animals", "Martin Garrix", 128], ["Clarity", "Zedd", 128], ["Strobe", "deadmau5", 128], ["Opus", "Eric Prydz", 126]],
  "Hip-Hop": [["POWER", "Kanye West", 154], ["HUMBLE.", "Kendrick Lamar", 150], ["Stronger", "Kanye West", 104], ["Can't Hold Us", "Macklemore", 146], ["Sicko Mode", "Travis Scott", 155]],
  Rock: [["Eye of the Tiger", "Survivor", 109], ["Seven Nation Army", "White Stripes", 124], ["Believer", "Imagine Dragons", 125], ["Uprising", "Muse", 128]],
  Pop: [["Don't Start Now", "Dua Lipa", 124], ["Uptown Funk", "Bruno Mars", 115], ["Run the World", "Beyoncé", 127], ["As It Was", "Harry Styles", 174]],
}
const AI_PROMPTS = [
  "Build me a 45-minute intermediate HIIT ride using EDM music with 5 intervals and one long climb.",
  "30-minute beginner endurance ride with pop music and gentle hills.",
  "60-minute advanced power-zone ride, hip-hop, 6 hard intervals.",
]
function buildAIPlan(prompt) {
  const p = (prompt || "").toLowerCase()
  const dur = Math.min(90, Math.max(20, parseInt((p.match(/(\d+)\s*(?:-|to)?\s*min/) || [])[1]) || 45))
  const intervals = Math.min(10, Math.max(2, parseInt((p.match(/(\d+)\s*interval/) || [])[1]) || 5))
  const climb = /climb|hill/.test(p)
  const genre = /edm|electronic|house|techno/.test(p) ? "EDM" : /hip.?hop|rap/.test(p) ? "Hip-Hop" : /rock/.test(p) ? "Rock" : /pop/.test(p) ? "Pop" : "EDM"
  const level = /begin/.test(p) ? "Beginner" : /advanc|expert|hard/.test(p) ? "Advanced" : "Intermediate"
  const warm = Math.max(4, Math.round(dur * 0.12)), cool = Math.max(3, Math.round(dur * 0.1))
  const work = level === "Advanced" ? 3 : 2, rec = level === "Beginner" ? 3 : 2
  const tl = [{ name: "Warm Up", min: warm, zone: "Z1–2", type: "warmup" }]
  if (climb) tl.push({ name: "Long Climb", min: Math.max(5, Math.round(dur * 0.18)), zone: "Z3–4", type: "climb" })
  for (let i = 0; i < intervals; i++) {
    tl.push({ name: `Interval ${i + 1}`, min: work, zone: "Z4–5", type: "interval" })
    if (i < intervals - 1) tl.push({ name: "Recovery", min: rec, zone: "Z2", type: "recovery" })
  }
  tl.push({ name: "Cool Down", min: cool, zone: "Z1", type: "cooldown" })
  let sum = tl.reduce((a, s) => a + s.min, 0)
  tl[tl.length - 1].min = Math.max(3, tl[tl.length - 1].min + (dur - sum))
  sum = tl.reduce((a, s) => a + s.min, 0)
  // intensity buckets
  const b = [0, 0, 0, 0, 0]
  tl.forEach(s => {
    if (s.type === "warmup") { b[0] += s.min * 0.4; b[1] += s.min * 0.6 }
    else if (s.type === "climb") { b[2] += s.min * 0.5; b[3] += s.min * 0.5 }
    else if (s.type === "interval") { b[3] += s.min * 0.5; b[4] += s.min * 0.5 }
    else if (s.type === "recovery") b[1] += s.min
    else b[0] += s.min
  })
  const tot = b.reduce((a, c) => a + c, 0) || 1
  const intensity = b.map((m, i) => ({ zone: i + 1, label: `Zone ${i + 1}`, pct: Math.round(m / tot * 100), color: ZONE_COLORS[i] }))
  return { dur: sum, intervals, climb, genre, level, tl, intensity, playlist: PLAYLISTS_BY_GENRE[genre] }
}

// Embedded inside the Class Builder — generate a structured ride and drop it straight onto the canvas.
export function AIBuilderPanel({ darkMode, onApply, onSaveTemplate }) {
  const t = tk(darkMode)
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState(AI_PROMPTS[0])
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState(null)
  const [rideName, setRideName] = useState("")
  const [note, setNote] = useState("")

  function generate() {
    if (!prompt.trim()) return
    setLoading(true); setPlan(null)
    setTimeout(() => {
      const pl = buildAIPlan(prompt)
      setPlan(pl); setRideName(`${pl.genre} ${pl.level} ${pl.climb ? "Climb & Intervals" : "Intervals"}`); setLoading(false)
    }, 1300)
  }
  function ride() {
    return { name: rideName || "AI Ride", mins: plan.dur, difficulty: plan.level, genre: plan.genre,
      segments: plan.tl.map(s => ({ name: s.name, min: s.min, zone: s.zone, type: s.type })) }
  }
  function flash(m) { setNote(m); setTimeout(() => setNote(""), 2200) }

  return (
    <div className={`rounded-2xl border mb-5 transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <div>
        <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-4 text-left">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: GREEN }}><Wand2 size={17} /></span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold flex items-center gap-2 ${t.heading}`}>AI Ride Builder <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white" style={{ background: GREEN }}>AI</span></p>
            <p className={`text-xs ${t.muted}`}>Describe a ride — drop a full plan onto the canvas</p>
          </div>
          <ChevronRight size={18} className={`${t.faint} transition-transform ${open ? "rotate-90" : ""}`} />
        </button>

        {open && (
          <div className="px-4 pb-4">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2}
              placeholder="e.g. 45-min HIIT with EDM music, 5 intervals and 1 long climb"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00aa13] ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              {AI_PROMPTS.map((p, i) => <button key={i} onClick={() => setPrompt(p)} className={`text-[11px] px-2.5 py-1 rounded-full border ${t.border} ${t.muted} hover:border-[#00aa13]`}>{p.length > 28 ? p.slice(0, 28) + "…" : p}</button>)}
              <div className="flex-1" />
              <button onClick={generate} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold text-sm disabled:opacity-60" style={{ background: GREEN }}>
                {loading ? <><Sparkles size={15} className="animate-spin" /> Generating…</> : <><Wand2 size={15} /> Generate</>}
              </button>
            </div>

            {loading && <div className={`mt-4 rounded-xl ${t.subtle} animate-pulse`} style={{ height: 96 }} />}

            {plan && !loading && (
              <div className="mt-4 animate-[fadeIn_.3s_ease]">
                <input value={rideName} onChange={e => setRideName(e.target.value)} className={`w-full text-base font-bold bg-transparent border-b ${t.border} focus:outline-none focus:border-[#00aa13] pb-1 mb-3 ${t.heading}`} />
                <div className="flex w-full h-3 rounded-full overflow-hidden mb-2">
                  {plan.tl.map((s, i) => <div key={i} style={{ width: `${s.min / plan.dur * 100}%`, background: TYPE_COLOR[s.type] }} title={`${s.name} · ${s.min}m`} />)}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-3">
                  {[["Duration", `${plan.dur} min`], ["Level", plan.level], ["Intervals", plan.intervals], ["Music", plan.genre], ["Playlist", `${plan.playlist.length} tracks`]].map(([k, v], i) => (
                    <span key={i} className={t.muted}>{k}: <span className={`font-semibold ${t.heading}`}>{v}</span></span>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-1.5 mb-4 max-h-44 overflow-y-auto pr-1">
                  {plan.tl.map((s, i) => (
                    <div key={i} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${t.subtle}`}>
                      <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: TYPE_COLOR[s.type] }} />
                      <span className={`flex-1 text-xs font-medium truncate ${t.heading}`}>{s.name}</span>
                      <span className={`text-[11px] ${t.muted}`}>{s.zone}</span>
                      <span className={`text-xs font-bold tabular-nums ${t.heading}`}>{s.min}m</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => { onApply?.(ride()); setOpen(false) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: GREEN }}><Check size={15} /> Apply to canvas</button>
                  <button onClick={() => { onSaveTemplate?.(ride()); flash("Saved as template ✓") }} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold ${t.chip}`}><Save size={14} /> Save template</button>
                  {note && <span className="text-xs font-semibold text-[#00aa13]">{note}</span>}
                </div>
                <p className={`text-[11px] mt-2 ${t.faint}`}>Generates a BPM-matched playlist & coaching cues too — “Apply” drops the zones onto the canvas to fine-tune below.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

