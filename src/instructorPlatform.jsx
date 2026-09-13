import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import {
  ArrowLeft, Play, Pause, SkipForward, RotateCcw, Search, Star, Music, Heart,
  Gauge, Zap, Activity, Radio, Bell, Award, Trophy, Target, Flame, TrendingUp,
  TrendingDown, ThumbsUp, MessageSquare, Sparkles, Wand2, Pencil, Save,
  Check, Plus, ChevronRight, Users, Clock, Calendar, Sun, Moon, SlidersHorizontal as SlidersIcon,
  AlertTriangle, Wallet, Wrench, ArrowUpRight, Building2,
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

// Page headers stay pinned while scrolling; negative margins match Shell's padding
const stickyHead = d => `app-sticky sticky top-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 -mt-4 md:-mt-8 pt-4 md:pt-8 pb-3 backdrop-blur-md ${d ? "bg-gray-950/85" : "bg-gray-50/85"}`

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

function PageHead({ darkMode, onToggleDarkMode, onBack, title, sub, Icon, gradient, backLabel = "Back" }) {
  const t = tk(darkMode)
  return (
    <div className={`${stickyHead(darkMode)} mb-6`}>
      <button onClick={onBack} className={`flex items-center gap-1.5 mb-4 text-sm font-medium ${t.muted} hover:${t.heading} transition-colors`}>
        <ArrowLeft size={15} /> {backLabel}
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <DarkToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          <AccountButton />
        </div>
      </div>
    </div>
  )
}

// Every page uses the same full content width at each screen size (matches the rider and instructor pages)
function Shell({ children }) {
  return <div className="p-4 md:p-8 pb-28 md:pb-16">{children}</div>
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
export function AreaTrend({ points, color = GREEN, height = 170, darkMode, yMax, labels, valueFmt = v => v }) {
  const W = 600, H = height, pad = { l: 6, r: 6, t: 14, b: 8 }
  const max = yMax || Math.max(...points) * 1.15 || 1
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b
  const xs = points.map((_, i) => pad.l + (i / (points.length - 1)) * iw)
  const ys = points.map(v => pad.t + ih - (v / max) * ih)
  const line = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const area = `${line} L${xs[xs.length - 1].toFixed(1)},${pad.t + ih} L${xs[0].toFixed(1)},${pad.t + ih} Z`
  const grid = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"
  const id = "g" + Math.round(seedNum(String(points[0]) + points.length + color))
  const [hi, setHi] = useState(null)
  const xf = i => (pad.l + (i / (points.length - 1)) * iw) / W * 100
  const yf = i => ys[i] / H * 100
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const fx = (e.clientX - r.left) / r.width
    setHi(Math.max(0, Math.min(points.length - 1, Math.round(((fx * W) - pad.l) / iw * (points.length - 1)))))
  }
  return (
    <div className="relative w-full select-none" style={{ height: H }} onMouseMove={move} onMouseLeave={() => setHi(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" /><stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={id + "c"}><rect key={id + points.length} x="0" y="0" width={W} height={H} className="trend-reveal" /></clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map(g => <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke={grid} strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
        <g clipPath={`url(#${id}c)`}>
          <path d={area} fill={`url(#${id})`} />
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </g>
        {hi != null && <line x1={xs[hi]} x2={xs[hi]} y1={pad.t} y2={pad.t + ih} stroke={color} strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
      </svg>
      {/* HTML overlay so dots/tooltip aren't stretched by the SVG */}
      <span key={id + points.length} className="dot-in absolute w-2.5 h-2.5 rounded-full pointer-events-none" style={{ left: `${xf(points.length - 1)}%`, top: `${yf(points.length - 1)}%`, transform: "translate(-50%,-50%)", background: color }} />
      {hi != null && (
        <>
          <span className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow pointer-events-none transition-all" style={{ left: `${xf(hi)}%`, top: `${yf(hi)}%`, transform: "translate(-50%,-50%)", background: color }} />
          <div className={`absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shadow-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-900 text-white"}`}
            style={{ left: `${Math.min(90, Math.max(10, xf(hi)))}%`, top: `${yf(hi)}%`, marginTop: -10 }}>
            {labels?.[hi] ? `${labels[hi]} · ` : ""}{valueFmt(points[hi])}
          </div>
        </>
      )}
    </div>
  )
}

function Bars({ data, color = GREEN, height = 150, darkMode, fmt = v => v, showDelta = false }) {
  const t = tk(darkMode)
  const max = Math.max(...data.map(d => d.v)) || 1
  const [hi, setHi] = useState(null)
  return (
    <div className="flex items-end gap-2.5" style={{ height }} onMouseLeave={() => setHi(null)}>
      {data.map((d, i) => {
        const delta = i > 0 ? d.v - data[i - 1].v : null
        const on = hi === i
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full cursor-default" onMouseEnter={() => setHi(i)}>
            <span className="text-xs font-bold tabular-nums transition-colors" style={{ color: on ? (d.color || color) : undefined }}>{fmt(d.v)}</span>
            <div className="w-full rounded-lg rise-bar" style={{ height: `${(d.v / max) * 100}%`, minHeight: 6, background: d.color || color, animationDelay: `${i * 55}ms`, opacity: hi != null && !on ? 0.45 : 1, transition: "opacity .2s, filter .2s", filter: on ? "brightness(1.08)" : "none" }} />
            <div className="flex flex-col items-center leading-tight">
              <span className={`text-[10px] font-medium ${t.faint}`}>{d.label}</span>
              {showDelta && delta != null && (
                <span className={`text-[9px] font-bold ${delta >= 0 ? "text-[#00aa13]" : "text-red-500"}`}>{delta >= 0 ? "▲" : "▼"}{Math.abs(delta)}</span>
              )}
            </div>
          </div>
        )
      })}
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
      <div className={`${stickyHead(darkMode)} flex items-start justify-between gap-3 mb-6`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${GREEN}, #14b8a6)` }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className={`text-2xl font-semibold tracking-tight ${t.heading}`}>Instructor Platform</h1>
            <p className={`text-sm mt-0.5 ${t.muted}`}>Generate, teach and grow — your studio operating system.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <DarkToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          <AccountButton />
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5 mb-5">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
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
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Overview")} backLabel="Overview"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Studio Home")} backLabel="Studio Home"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
    { label: "Repeat riders", value: "64%", Icon: RotateCcw, accent: "#8b5cf6", trend: 5 },
  ]
  const attLabels = ["12w","11w","10w","9w","8w","7w","6w","5w","4w","3w","2w","Now"]
  const attendance = [22, 24, 23, 26, 28, 27, 30, 29, 31, 33, 32, 35]
  const classesPerMonth = [{ label: "Jan", v: 28 }, { label: "Feb", v: 31 }, { label: "Mar", v: 30 }, { label: "Apr", v: 34 }, { label: "May", v: 36 }, { label: "Jun", v: 38 }]
  const bests = [
    { label: "Highest attendance", value: "42 riders", sub: "EDM Power Ride · 14 Jun", Icon: Users, c: GREEN },
    { label: "Most popular class", value: "EDM Power Ride", sub: "avg 38 riders / class", Icon: Music, c: "#8b5cf6" },
    { label: "Highest rated ride", value: "Power Zone Endurance", sub: "4.97 ★ avg", Icon: Star, c: "#f59e0b" },
    { label: "Fastest growing class", value: "Saturday HIIT", sub: "+46% riders in 8 weeks", Icon: TrendingUp, c: "#0ea5e9" },
  ]
  const badges = [
    { t: "1,000 riders coached", sub: "Elite", Icon: Users, on: true, c: GREEN },
    { t: "100-class streak", sub: "On fire", Icon: Flame, on: true, c: "#f59e0b" },
    { t: "Top rated · 4.9★", sub: "Gold", Icon: Star, on: true, c: "#0ea5e9" },
    { t: "Sold-out 10×", sub: "Headliner", Icon: Trophy, on: true, c: "#8b5cf6" },
    { t: "5.0 class", sub: "Perfect", Icon: Award, on: true, c: "#ec4899" },
    { t: "500 classes", sub: "62% there", Icon: Target, on: false, c: "#14b8a6", progress: 62 },
  ]

  return (
    <MaybeShell embedded={embedded}>
      {!embedded && <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Studio Home")}
        title="Growth Dashboard" sub="Measure your instructor performance" Icon={TrendingUp}
        gradient="linear-gradient(135deg,#14b8a6,#00aa13)" />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {kpis.map((k, i) => <div key={i} className="pop-in" style={{ animationDelay: `${i * 60}ms` }}><StatCard darkMode={darkMode} {...k} /></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${t.heading}`}>Avg attendance trend</p>
            <span className="text-xs font-semibold text-[#00aa13]">+59% YoY</span>
          </div>
          <p className={`text-3xl font-bold ${t.heading} mb-2`}>35 <span className={`text-sm font-medium ${t.muted}`}>riders / class</span></p>
          <AreaTrend points={attendance} labels={attLabels} valueFmt={v => `${v} riders`} darkMode={darkMode} color="#14b8a6" height={150} />
        </div>
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${t.heading}`}>Classes taught / month</p>
            <span className="text-xs font-semibold text-[#00aa13]">+10 since Jan</span>
          </div>
          <p className={`text-3xl font-bold ${t.heading} mb-3`}>38 <span className={`text-sm font-medium ${t.muted}`}>this month</span></p>
          <Bars data={classesPerMonth} darkMode={darkMode} color={GREEN} height={150} showDelta />
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
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-semibold ${t.heading}`}>Achievement badges</p>
          <span className={`text-xs ${t.muted}`}>{badges.filter(b => b.on).length} of {badges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((b, i) => {
            const ring = b.on ? b.c : (darkMode ? "#374151" : "#e5e7eb")
            const pct = b.on ? 100 : (b.progress || 0)
            return (
              <div key={i} className={`pop-in flex flex-col items-center text-center gap-2 rounded-2xl p-3.5 border transition-all ${b.on ? "hover:-translate-y-0.5 hover:shadow-md" : ""} ${darkMode ? "border-gray-800" : "border-gray-100"}`} style={{ animationDelay: `${i * 50}ms` }}>
                <div className="relative" style={{ width: 56, height: 56 }}>
                  <Ring pct={pct} size={56} stroke={4} color={ring} darkMode={darkMode}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: b.on ? `linear-gradient(135deg,${b.c},${b.c}cc)` : (darkMode ? "#374151" : "#e5e7eb"), boxShadow: b.on ? `0 4px 12px ${b.c}55` : "none" }}>
                      <b.Icon size={18} className={b.on ? "" : (darkMode ? "text-gray-500" : "text-gray-400")} />
                    </div>
                  </Ring>
                  {b.on && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00aa13] flex items-center justify-center"><Check size={10} className="text-white" /></span>}
                </div>
                <div>
                  <p className={`text-[11px] font-bold leading-tight ${b.on ? t.heading : t.muted}`}>{b.t}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: b.on ? b.c : (darkMode ? "#6b7280" : "#9ca3af") }}>{b.sub}</p>
                </div>
              </div>
            )
          })}
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



// ═════════════════════════════════════════════════════════════════════════════
//  STUDIO OWNER — the operating dashboard for the cycling business
// ═════════════════════════════════════════════════════════════════════════════
function OwnerHead({ darkMode, onToggleDarkMode, title, sub }) {
  const t = tk(darkMode)
  return (
    <div className={`${stickyHead(darkMode)} flex items-start justify-between gap-3 mb-6`}>
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${GREEN}, #14b8a6)` }}>
          <Building2 size={22} />
        </div>
        <div>
          <h1 className={`text-2xl font-semibold tracking-tight ${t.heading}`}>{title}</h1>
          <p className={`text-sm mt-0.5 ${t.muted}`}>{sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DarkToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        <AccountButton />
      </div>
    </div>
  )
}

// Your profile picture — opens the account menu (Profile, Settings, Log out) on phones
function AccountButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("cyclehq:account"))} aria-label="Account menu"
      className="rounded-full flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00aa13] active:scale-95 transition-transform">
      <Avatar name="eenie JIM" size={36} />
    </button>
  )
}

function Donut({ segments, size = 150 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = size / 2, ir = r * 0.62, cx = r, cy = r
  const arc = (start, sweep) => {
    const rad = d => d * Math.PI / 180, sw = Math.min(sweep, 359.99)
    const x1 = cx + r * Math.cos(rad(start)), y1 = cy + r * Math.sin(rad(start))
    const x2 = cx + r * Math.cos(rad(start + sw)), y2 = cy + r * Math.sin(rad(start + sw))
    const x3 = cx + ir * Math.cos(rad(start + sw)), y3 = cy + ir * Math.sin(rad(start + sw))
    const x4 = cx + ir * Math.cos(rad(start)), y4 = cy + ir * Math.sin(rad(start))
    const lg = sw > 180 ? 1 : 0
    return `M${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${ir},${ir} 0 ${lg} 0 ${x4},${y4} Z`
  }
  const paths = []
  segments.reduce((acc, s) => { paths.push({ d: arc(acc / total * 360 - 90, s.value / total * 360), color: s.color }); return acc + s.value }, 0)
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
    </svg>
  )
}

const OWNER_KPIS = [
  { label: "Revenue this month", value: "£25,300", Icon: Wallet, trend: 9, accent: GREEN },
  { label: "Attendance rate", value: "87%", Icon: Activity, trend: 3, accent: "#14b8a6" },
  { label: "Active members", value: "642", Icon: Users, trend: 5, accent: "#8b5cf6" },
  { label: "Classes this week", value: "84", Icon: Calendar, trend: 2, accent: "#0ea5e9" },
  { label: "Rider retention", value: "91%", Icon: Heart, trend: 4, accent: "#ec4899" },
]
// Studio tasks. category drives the tabs, priority "urgent" (or overdue) lands in Urgent, due = days from today
const OWNER_TASKS_SEED = [
  { id: "a1",  Icon: AlertTriangle, c: "#ef4444", category: "operations",  priority: "urgent", due: 0,  title: "Friday 6:30pm class has no instructor", sub: "Power Zone Ride · Hampstead · 18 booked", actions: [{ label: "Find cover", doneLabel: "Cover requested", c: "#ef4444" }] },
  { id: "a10", Icon: Wrench,        c: "#ef4444", category: "maintenance", priority: "urgent", due: 1,  title: "Bikes 4 & 10 reported broken", sub: "Studio 1 · marked out of service for riders", actions: [{ label: "Book repair", doneLabel: "Repair booked", c: "#ef4444" }] },
  { id: "a5",  Icon: Calendar,      c: "#8b5cf6", category: "approvals",   priority: "normal", due: 1,  title: "Confirm Saturday 10am Rhythm Ride", sub: "Requested by Zen Kiwi · Shoreditch · Studio 2", actions: [{ label: "Confirm", doneLabel: "Confirmed", c: GREEN }, { label: "Decline", doneLabel: "Declined", c: "#6b7280" }] },
  { id: "a4",  Icon: Wrench,        c: "#0ea5e9", category: "maintenance", priority: "normal", due: -3, title: "Bike 12 maintenance overdue", sub: "Studio 1 · last serviced 92 days ago", actions: [{ label: "Log service", doneLabel: "Service logged", c: "#0ea5e9" }] },
  { id: "a2",  Icon: Users,         c: "#f59e0b", category: "operations",  priority: "normal", due: 2,  title: "18 members haven't attended in 14 days", sub: "At risk of churn — worth a re-engagement nudge", actions: [{ label: "Re-engage", doneLabel: "Re-engaged", c: "#f59e0b" }] },
  { id: "a3",  Icon: TrendingDown,  c: "#f59e0b", category: "operations",  priority: "normal", due: 5,  title: "Wednesday lunchtime ride only 42% full", sub: "Cadence Control · 12:30 · Shoreditch", actions: [{ label: "Promote", doneLabel: "Promoting", c: "#f59e0b" }] },
  { id: "a7",  Icon: Wrench,        c: "#0ea5e9", category: "maintenance", priority: "normal", due: 10, title: "Quarterly service: Studio 2 bikes 1–10", sub: "Shoreditch · book the technician", actions: [{ label: "Schedule", doneLabel: "Scheduled", c: "#0ea5e9" }] },
  { id: "a9",  Icon: Clock,         c: "#f59e0b", category: "operations",  priority: "normal", due: 12, title: "Renew music licence", sub: "Covers class playlists at both studios", actions: [{ label: "Renew", doneLabel: "Renewed", c: "#f59e0b" }] },
  { id: "a8",  Icon: Wrench,        c: "#0ea5e9", category: "maintenance", priority: "normal", due: 24, title: "Replace worn pedal straps", sub: "Studio 1 · 6 bikes flagged by instructors", actions: [{ label: "Order", doneLabel: "Ordered", c: "#0ea5e9" }] },
  { id: "a11", Icon: Sparkles,      c: "#8b5cf6", category: "operations",  priority: "normal", due: 45, title: "Plan the summer timetable", sub: "Review demand before instructors pick slots", actions: [{ label: "Start", doneLabel: "Started", c: "#8b5cf6" }] },
]
const TASK_TABS   = [["all", "All"], ["urgent", "Urgent"], ["approvals", "Approvals"], ["operations", "Operations"], ["maintenance", "Maintenance"]]
const TASK_RANGES = [[7, "Next 7 days"], [14, "Next 14 days"], [30, "Next month"], [90, "Next 3 months"]]
const REVENUE = {
  total: "£25,300", trend: 9,
  monthLabels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  monthly: [18.2, 19.1, 20.4, 21.0, 22.3, 21.6, 23.1, 22.8, 24.0, 24.6, 25.0, 25.3],
  sources: [
    { label: "Membership", value: 16200, color: GREEN },
    { label: "Class packs", value: 6100, color: "#0ea5e9" },
    { label: "Retail", value: 3000, color: "#f59e0b" },
  ],
}
const CLASS_TOP = [
  { name: "EDM Power Ride", occ: 97, when: "Fri · 7:00pm", riders: "39 / 40" },
  { name: "Saturday HIIT", occ: 94, when: "Sat · 9:00am", riders: "38 / 40" },
  { name: "Beginner Ride", occ: 91, when: "Tue · 6:00pm", riders: "22 / 24" },
]
const CLASS_LOW = [
  { name: "Monday 1pm Express", occ: 38, when: "Mon · 1:00pm", riders: "9 / 24" },
  { name: "Thursday 11am Flow", occ: 44, when: "Thu · 11:00am", riders: "11 / 24" },
]
const CLASS_RECS = [
  { id: "rec-move", Icon: Clock, title: "Move Monday 1pm → 5:30pm", detail: "Lunchtime demand is low; evening slots run 88% full.", uplift: "+22 riders / month",
    action: "Move the class", doneLabel: "Moved to 5:30pm",
    steps: ["Monday 1pm Express moves to 17:30 in Studio 1, from Mon 2 Mar", "The 9 booked riders are told and keep their bikes", "Alex Papaya has confirmed 17:30 works"],
    event: { date: "2026-03-02", start: 17 * 60 + 30, end: 18 * 60 + 15, title: "Monday Express (moved)", studio: "Studio 1", type: "class" } },
  { id: "rec-hiit", Icon: Calendar, title: "Add a second Saturday HIIT", detail: "94% full with a waitlist most weeks — capture the overflow.", uplift: "+£640 / month",
    action: "Add the class", doneLabel: "Added Sat 12:00",
    steps: ["New Saturday HIIT at 12:00 in Studio 1, weekly from Sat 28 Feb", "Riders on the 10:30 waitlist get first pick of bikes", "Max Lime is free to teach it"],
    event: { date: "2026-02-28", start: 12 * 60, end: 12 * 60 + 45, title: "Saturday HIIT (2nd class)", studio: "Studio 1", type: "class" } },
  { id: "rec-promo", Icon: Sparkles, title: "Promote the Wednesday lunch ride", detail: "Email lapsed members a free class pass to refill it.", uplift: "+15 riders / month",
    action: "Launch promotion", doneLabel: "Promotion live",
    steps: ["Email 212 lapsed lunchtime riders a free class pass", "Send a push reminder to nearby riders the day before", "Stops automatically once the ride is 80% full"],
    event: { date: "2026-03-03", start: 9 * 60, end: 9 * 60 + 30, title: "Promo email · Wednesday lunch ride", studio: "Studio 2", type: "operations" } },
]
const INSTRUCTOR_PERF = [
  { name: "JIM",          att: 92, ret: 90, rating: 4.9, repeat: 68, classes: 28, growth: 12 },
  { name: "Anna Banana",  att: 88, ret: 86, rating: 4.8, repeat: 62, classes: 24, growth: 8 },
  { name: "Rio Banana",   att: 84, ret: 80, rating: 4.6, repeat: 58, classes: 20, growth: 9 },
  { name: "Max Lime",     att: 81, ret: 79, rating: 4.7, repeat: 55, classes: 21, growth: 18 },
  { name: "Zen Kiwi",     att: 76, ret: 82, rating: 4.9, repeat: 60, classes: 18, growth: 5 },
  { name: "Alex Papaya",  att: 79, ret: 74, rating: 4.7, repeat: 50, classes: 16, growth: 22 },
]

// ─── STUDIO OPS: timetable, task overlays, slot scheduling & the studio calendar ───
const OWNER_TODAY = "2026-02-26"
const EMPTY_OPS = { done: {}, events: [], logDraft: {} }
const opPad = n => String(n).padStart(2, "0")
const opIso = d => `${d.getFullYear()}-${opPad(d.getMonth() + 1)}-${opPad(d.getDate())}`
const opAddDays = (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return opIso(d) }
const opDow = iso => (new Date(iso + "T00:00:00").getDay() + 6) % 7
const OP_DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const OP_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const opFmtDay = iso => { const d = new Date(iso + "T00:00:00"); return `${OP_DOW[opDow(iso)]} ${d.getDate()} ${OP_MONTHS[d.getMonth()].slice(0, 3)}` }
const opFmtMin = m => `${opPad(Math.floor(m / 60))}:${opPad(m % 60)}`

// Weekly class timetable per studio (demo), Monday first
const STUDIO_TIMETABLE = {
  "Studio 1": [
    ["06:30 Sunrise Power", "12:30 Midday Burn", "18:00 Evening Flow", "19:30 HIIT Blast"],
    ["07:00 Cadence Control", "12:30 Lunch Sprint", "18:30 Threshold Push"],
    ["06:30 Sunrise Power", "18:00 Power Tempo", "19:30 Climb Intervals"],
    ["06:15 Sunrise Power", "10:00 Recovery Ride", "16:30 Power Tempo", "18:00 Evening Flow"],
    ["07:00 Threshold Push", "12:30 Midday Burn", "18:30 Power Zone Ride"],
    ["09:00 Rhythm Ride", "10:30 Saturday HIIT"],
    ["10:00 Easy Endurance"],
  ],
  "Studio 2": [
    ["07:00 Cadence Control", "12:00 Lunch Sprint", "19:00 Rhythm Ride"],
    ["06:30 Endurance Builder", "18:30 Climb Intervals", "20:00 Night Ride"],
    ["07:00 Cadence Control", "12:30 Cadence Control", "19:00 HIIT Blast"],
    ["12:00 Lunch Sprint", "18:00 Evening Flow"],
    ["07:30 Tempo Foundation", "17:30 Rhythm Ride"],
    ["08:30 Easy Endurance", "11:30 Endurance Builder"],
    ["11:00 Recovery Ride"],
  ],
}
const OP_STUDIOS = Object.keys(STUDIO_TIMETABLE)
function classesOn(iso, studio) {
  return (STUDIO_TIMETABLE[studio]?.[opDow(iso)] || []).map(entry => {
    const [time, ...name] = entry.split(" ")
    const [h, m] = time.split(":").map(Number)
    return { type: "class", date: iso, start: h * 60 + m, end: h * 60 + m + 45, title: name.join(" "), studio }
  })
}

// Which overlay each seeded task opens
const TASK_KINDS = { a1: "cover", a10: "repair", a5: "class-request", a4: "log", a2: "reengage", a3: "promote", a7: "service", a9: "licence", a8: "order", a11: "plan" }

const opsBtn = (kind, d) => `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
  kind === "primary" ? "bg-[#00aa13] hover:bg-[#008a0f] text-white"
  : kind === "danger" ? "bg-red-500 hover:bg-red-600 text-white"
  : d ? "border border-gray-700 text-gray-300 hover:bg-gray-800" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`

function OpsModal({ darkMode, title, sub, Icon, color = GREEN, done, wide, onClose, footer, children }) {
  const t = tk(darkMode)
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}
      onKeyDown={e => { if (e.key === "Escape") onClose() }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${wide ? "sm:max-w-5xl" : "sm:max-w-xl"} max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden ${darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"}`}>
        <div className={`flex items-start gap-3 px-5 pt-5 pb-4 border-b ${t.border}`}>
          {Icon && <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "1a", color }}><Icon size={18} /></span>}
          <div className="flex-1 min-w-0">
            <h2 className={`text-lg font-bold leading-tight ${t.heading}`}>{title}</h2>
            {sub && <p className={`text-xs mt-0.5 ${t.muted}`}>{sub}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>✕</button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {done && <div className="mb-4 rounded-xl px-3 py-2.5 text-xs font-semibold" style={{ background: "#00aa131a", color: GREEN }}>✓ {done}</div>}
          {children}
        </div>
        {footer && <div className={`px-5 py-4 border-t ${t.border} flex flex-wrap items-center justify-end gap-2`}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

// ── Scheduling a technician visit: rank the manufacturer's slots by disruption ──
const TECH_WINDOWS = [[7 * 60, "Early morning"], [10 * 60, "Late morning"], [13 * 60, "Early afternoon"], [15 * 60 + 30, "Late afternoon"], [20 * 60, "Evening"]]
function scheduleOptions({ studio, hours, bikes, broken }) {
  const opts = []
  for (let i = 1; i <= 7; i++) {
    const iso = opAddDays(OWNER_TODAY, i), weekend = opDow(iso) >= 5
    TECH_WINDOWS.forEach(([start, label], wi) => {
      const end = start + hours * 60
      const taken = (i * 3 + wi * 2) % 5 === 0 || (weekend && (wi === 0 || wi === 4))   // manufacturer already booked
      const day = classesOn(iso, studio)
      const disrupted = day.filter(c => c.start < end && c.end > start)
      const backFor = day.filter(c => c.start >= end).length
      // Broken bikes can't be ridden in any class until the repair is finished
      let waiting = 0
      if (broken) for (let j = 1; j <= i; j++) waiting += classesOn(opAddDays(OWNER_TODAY, j), studio).filter(c => j < i || c.start < end).length
      const ridesLost = Math.round(waiting * bikes.length * 0.8)   // bikes are usually ~80% booked
      const impact = disrupted.length * 90 + ridesLost * 12        // £ per disrupted class + £ per lost ride
      opts.push({ id: `${iso}-${start}`, iso, start, end, label, taken, disrupted, backFor, ridesLost, impact })
    })
  }
  const ranked = opts.filter(o => !o.taken).sort((a, b) => a.impact - b.impact || a.iso.localeCompare(b.iso) || a.start - b.start)
  ranked.forEach((o, rank) => { o.tier = rank < ranked.length / 3 ? "good" : rank < ranked.length * 2 / 3 ? "ok" : "poor" })
  return { opts, best: ranked[0] }
}
const TIER_COLOR = { good: GREEN, ok: "#f59e0b", poor: "#ef4444" }

function SlotScheduler({ task, darkMode, onFinish, onClose, studio, hours, bikes, broken, title, what }) {
  const t = tk(darkMode)
  const { opts, best } = scheduleOptions({ studio, hours, bikes, broken })
  const [pick, setPick] = useState(best?.id)
  const sel = opts.find(o => o.id === pick) || best
  const days = [...new Set(opts.map(o => o.iso))]
  const reasons = o => [
    o.disrupted.length ? `Disrupts ${o.disrupted.length} class${o.disrupted.length > 1 ? "es" : ""}` : "No classes during the visit",
    broken && `${o.ridesLost} rides lost while broken`,
    o.backFor > 0 && `Bikes back for ${o.backFor} later class${o.backFor > 1 ? "es" : ""} that day`,
    `Est. impact £${o.impact}`,
  ].filter(Boolean)
  const compareRows = [
    ["Classes disrupted", o => o.disrupted.length],
    ...(broken ? [["Rides lost while broken", o => o.ridesLost]] : []),
    ["Later classes with bikes back", o => o.backFor],
    ["Estimated impact", o => `£${o.impact}`],
  ]
  const slotLabel = o => `${opFmtDay(o.iso)} · ${opFmtMin(o.start)}–${opFmtMin(o.end)}`

  return (
    <OpsModal wide darkMode={darkMode} Icon={Wrench} color="#0ea5e9" title={title} sub={`${what} · ${studio} · ${hours}h technician visit`} done={task.doneLabel} onClose={onClose}
      footer={<>
        <span className={`text-xs mr-auto ${t.muted}`}>{sel ? slotLabel(sel) : "Pick a slot"}</span>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Cancel</button>
        <button disabled={!sel} onClick={() => onFinish(`Booked · ${opFmtDay(sel.iso)} ${opFmtMin(sel.start)}`, { event: { id: `ev-${task.id}`, date: sel.iso, start: sel.start, end: sel.end, title: what, studio, type: "maintenance" } })}
          className={opsBtn("primary", darkMode)}>Book {sel ? `${opFmtDay(sel.iso)} ${opFmtMin(sel.start)}` : "slot"}</button>
      </>}>
      <p className={`text-sm mb-4 ${t.muted}`}>
        Available slots from the manufacturer's service team for the next 7 days. Each slot is scored against your {studio} timetable:
        disrupting fewer classes is better{broken ? ", and fixing broken bikes sooner (e.g. early morning) means they earn for the rest of the day" : ""}.
      </p>

      {best && (
        <div className="rounded-xl p-4 mb-4 border" style={{ borderColor: GREEN + "55", background: GREEN + "10" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>★ Suggested slot</p>
          <p className={`text-base font-bold mt-0.5 ${t.heading}`}>{slotLabel(best)}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {reasons(best).map(r => <span key={r} className={`text-[11px] font-semibold px-2 py-1 rounded-full ${t.chip}`}>{r}</span>)}
          </div>
          {sel && sel.id !== best.id && <button onClick={() => setPick(best.id)} className="text-xs font-semibold mt-2" style={{ color: GREEN }}>Use suggested slot</button>}
        </div>
      )}

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full min-w-[640px] border-separate" style={{ borderSpacing: 4 }}>
          <thead>
            <tr>
              <th />
              {days.map(iso => <th key={iso} className={`text-[11px] font-semibold ${t.muted}`}>{opFmtDay(iso)}</th>)}
            </tr>
          </thead>
          <tbody>
            {TECH_WINDOWS.map(([start, label]) => (
              <tr key={start}>
                <td className={`text-[11px] pr-1 whitespace-nowrap ${t.muted}`}><span className={`font-semibold ${t.heading}`}>{opFmtMin(start)}</span><br />{label}</td>
                {days.map(iso => {
                  const o = opts.find(x => x.iso === iso && x.start === start)
                  const on = sel && o.id === sel.id
                  return (
                    <td key={iso}>
                      <button disabled={o.taken} onClick={() => setPick(o.id)} aria-pressed={on}
                        aria-label={o.taken ? `${slotLabel(o)} taken` : `${slotLabel(o)}, ${reasons(o).join(", ")}`}
                        className={`w-full rounded-lg px-2 py-2 text-left border-2 transition-all ${o.taken ? "cursor-not-allowed" : "hover:-translate-y-0.5"} ${on ? "ring-2 ring-offset-1 ring-[#0ea5e9]" : ""}`}
                        style={o.taken ? { borderColor: "transparent", background: darkMode ? "#1f2937" : "#f3f4f6" } : { borderColor: TIER_COLOR[o.tier] + "66", background: TIER_COLOR[o.tier] + "14" }}>
                        {o.taken ? <span className={`text-[11px] ${t.faint}`}>Taken</span> : <>
                          <p className="text-xs font-bold" style={{ color: TIER_COLOR[o.tier] }}>£{o.impact}{best && o.id === best.id ? " ★" : ""}</p>
                          <p className={`text-[10px] ${t.muted}`}>{o.disrupted.length ? `${o.disrupted.length} class${o.disrupted.length > 1 ? "es" : ""}` : "No classes"}</p>
                        </>}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`flex flex-wrap gap-3 text-[11px] mt-2 ${t.muted}`}>
        {[["good", "Lowest disruption"], ["ok", "Some disruption"], ["poor", "Most disruption"]].map(([k, l]) => <span key={k} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: TIER_COLOR[k] }} />{l}</span>)}
      </div>

      {sel && best && (
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div className={`rounded-xl p-4 ${t.subtle}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Compare</p>
            <div className={`grid grid-cols-3 gap-y-1.5 text-xs ${t.muted}`}>
              <span />
              <span className="font-semibold text-right" style={{ color: "#0ea5e9" }}>Selected</span>
              <span className="font-semibold text-right" style={{ color: GREEN }}>Suggested</span>
              {compareRows.map(([label, fn]) => (
                <React.Fragment key={label}>
                  <span>{label}</span>
                  <span className={`text-right font-bold tabular-nums ${t.heading}`}>{fn(sel)}</span>
                  <span className={`text-right font-bold tabular-nums ${t.heading}`}>{fn(best)}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={`rounded-xl p-4 ${t.subtle}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Classes affected · {slotLabel(sel)}</p>
            {sel.disrupted.length === 0
              ? <p className="text-sm font-semibold" style={{ color: GREEN }}>No classes during this visit ✓</p>
              : sel.disrupted.map(c => <p key={c.start} className={`text-sm ${t.heading}`}>{opFmtMin(c.start)} · {c.title}</p>)}
          </div>
        </div>
      )}
    </OpsModal>
  )
}

// ── Service log: spreadsheet-style sheet per studio, saved as a draft until submitted ──
const LOG_STUDIOS = [["Studio 1", 24], ["Studio 2", 20]]
const LOG_CONDITIONS = ["Good", "Needs attention", "Out of service"]
function logRows(studio, count) {
  return Array.from({ length: count }, (_, i) => {
    const bike = i + 1, s1 = studio === "Studio 1"
    const days = s1 && bike === 12 ? 92 : ((bike * 37 + (s1 ? 3 : 11)) % 70) + 12
    return { bike, days, flag: s1 && (bike === 4 || bike === 10) ? "Reported broken" : days > 85 ? "Overdue" : null }
  })
}
const logRowComplete = r => !!(r && r.condition && r.brakes && r.drive)
function logProgress(draft, only) {
  let done = 0, total = 0
  LOG_STUDIOS.filter(([s]) => !only || s === only).forEach(([s, n]) => { total += n; for (let b = 1; b <= n; b++) if (logRowComplete(draft?.[s]?.[b])) done++ })
  return { done, total }
}
function logActionLabel(draft) {
  const { done, total } = logProgress(draft)
  return done === total ? "Submit log" : draft && Object.keys(draft).length ? "Continue log" : "Start log"
}

function ServiceLogSheet({ task, darkMode, onFinish, onClose, draft, setDraft }) {
  const t = tk(darkMode)
  const [studio, setStudio] = useState("Studio 1")
  const rows = logRows(studio, LOG_STUDIOS.find(([s]) => s === studio)[1])
  const { done, total } = logProgress(draft)
  const set = (bike, patch) => setDraft(d => ({ ...d, [studio]: { ...(d[studio] || {}), [bike]: { ...(d[studio]?.[bike] || {}), ...patch } } }))
  const fillGood = () => setDraft(d => {
    const next = { ...(d[studio] || {}) }
    rows.forEach(r => {
      const cur = next[r.bike] || {}
      if (!logRowComplete(cur)) next[r.bike] = { ...cur, condition: cur.condition || (r.flag === "Reported broken" ? "Out of service" : "Good"), brakes: true, drive: true }
    })
    return { ...d, [studio]: next }
  })
  const line = darkMode ? "border-gray-800" : "border-gray-200"
  const cell = `px-2 py-1.5 border-r border-b ${line}`

  return (
    <OpsModal wide darkMode={darkMode} Icon={Wrench} color="#0ea5e9" title="Service log" done={task.doneLabel} onClose={onClose}
      sub="Check each bike and fill in its row. Close any time — progress is kept as a draft until you submit."
      footer={<>
        <div className="mr-auto flex items-center gap-2 min-w-[11rem]">
          <div className={`h-2 w-28 rounded-full overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}><div className="h-full rounded-full" style={{ width: `${done / total * 100}%`, background: GREEN }} /></div>
          <span className={`text-xs font-semibold tabular-nums ${t.muted}`}>{done}/{total} bikes</span>
        </div>
        <button onClick={fillGood} className={opsBtn("secondary", darkMode)}>Fill rest of {studio} as Good</button>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close · keep draft</button>
        <button disabled={done < total} onClick={() => onFinish("Service log submitted", { clearLog: true })} className={opsBtn("primary", darkMode)}>Submit log</button>
      </>}>
      <div className={`rounded-xl border overflow-hidden ${line}`}>
        <div className="overflow-auto max-h-[52vh]">
          <table className="w-full min-w-[760px] text-xs border-separate" style={{ borderSpacing: 0 }}>
            <thead className="sticky top-0 z-10">
              <tr className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                {["", "A · Bike", "B · Last serviced", "C · Condition", "D · Brakes checked", "E · Belt & drive", "F · Notes", "G · Status"].map(h => (
                  <th key={h} className={`${cell} text-left font-semibold whitespace-nowrap ${t.muted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const v = draft?.[studio]?.[r.bike] || {}
                const complete = logRowComplete(v)
                return (
                  <tr key={r.bike} className={i % 2 ? (darkMode ? "bg-gray-900" : "bg-gray-50/70") : ""}>
                    <td className={`${cell} w-8 text-center tabular-nums ${t.faint}`}>{i + 2}</td>
                    <td className={`${cell} font-semibold whitespace-nowrap ${t.heading}`}>Bike {r.bike}{r.flag && <span className="ml-1.5 text-[10px] font-bold text-red-500">{r.flag}</span>}</td>
                    <td className={`${cell} whitespace-nowrap ${r.days > 85 ? "text-red-500 font-semibold" : t.muted}`}>{r.days} days ago</td>
                    <td className={cell}>
                      <select value={v.condition || ""} onChange={e => set(r.bike, { condition: e.target.value })} aria-label={`Bike ${r.bike} condition`}
                        className={`w-full bg-transparent focus:outline-none ${v.condition === "Out of service" ? "text-red-500 font-semibold" : v.condition === "Needs attention" ? "text-amber-500 font-semibold" : t.heading}`}>
                        <option value="">—</option>
                        {LOG_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className={`${cell} text-center`}><input type="checkbox" checked={!!v.brakes} onChange={e => set(r.bike, { brakes: e.target.checked })} aria-label={`Bike ${r.bike} brakes checked`} className="w-4 h-4 accent-[#00aa13]" /></td>
                    <td className={`${cell} text-center`}><input type="checkbox" checked={!!v.drive} onChange={e => set(r.bike, { drive: e.target.checked })} aria-label={`Bike ${r.bike} belt and drive checked`} className="w-4 h-4 accent-[#00aa13]" /></td>
                    <td className={cell}><input value={v.notes || ""} onChange={e => set(r.bike, { notes: e.target.value })} placeholder="Add a note" aria-label={`Bike ${r.bike} notes`} className={`w-full min-w-[9rem] bg-transparent focus:outline-none ${t.heading}`} /></td>
                    <td className={`${cell} whitespace-nowrap`}>{complete ? <span className="font-semibold" style={{ color: GREEN }}>✓ Done</span> : <span className={t.faint}>To do</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Sheet tabs, spreadsheet style */}
        <div role="tablist" aria-label="Studio sheets" className={`flex gap-0.5 px-2 pt-1 border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"}`}>
          {LOG_STUDIOS.map(([s]) => {
            const p = logProgress(draft, s)
            return (
              <button key={s} role="tab" aria-selected={studio === s} onClick={() => setStudio(s)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-t-md ${studio === s ? (darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900 shadow-sm") : t.muted}`}>
                {s} <span className={t.faint}>{p.done}/{p.total}</span>
              </button>
            )
          })}
        </div>
      </div>
    </OpsModal>
  )
}

// ── Other task overlays ──
const COVER_INSTRUCTORS = [
  { name: "Max Lime",    rating: 4.7, note: "Free Friday evening · has taught Power Zone Ride 12×", fee: "£75" },
  { name: "Zen Kiwi",    rating: 4.9, note: "Free after 6pm · 2 miles from Hampstead", fee: "£75" },
  { name: "Rio Banana",  rating: 4.6, note: "Teaching 17:30 in Shoreditch — tight turnaround", fee: "£80" },
  { name: "Alex Papaya", rating: 4.7, note: "Usual instructor · marked unavailable", fee: "—", unavailable: true },
]
function CoverOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [asked, setAsked] = useState([])
  return (
    <OpsModal darkMode={darkMode} Icon={AlertTriangle} color="#ef4444" title="Find cover" sub="Power Zone Ride · Fri 27 Feb · 18:30 · Hampstead · 18 booked" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button disabled={!asked.length} onClick={() => onFinish(`Cover requested (${asked.length})`)} className={opsBtn("primary", darkMode)}>
          Send {asked.length || ""} request{asked.length === 1 ? "" : "s"}
        </button>
      </>}>
      <p className={`text-sm mb-3 ${t.muted}`}>Instructors who can teach this class, best match first. Requests go out together — the first to accept gets the class.</p>
      <div className="flex flex-col gap-2">
        {COVER_INSTRUCTORS.map(p => {
          const on = asked.includes(p.name)
          return (
            <div key={p.name} className={`flex items-center gap-3 rounded-xl p-3 ${t.subtle} ${p.unavailable ? "opacity-50" : ""}`}>
              <Avatar name={p.name} size={36} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${t.heading}`}>{p.name} <span className="text-xs text-amber-500">★ {p.rating}</span></p>
                <p className={`text-xs ${t.muted}`}>{p.note}</p>
              </div>
              <span className={`text-xs font-semibold ${t.muted}`}>{p.fee}</span>
              <button disabled={p.unavailable} onClick={() => setAsked(a => on ? a.filter(n => n !== p.name) : [...a, p.name])}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg disabled:cursor-not-allowed ${on ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-700 text-gray-200" : "bg-white border border-gray-200 text-gray-700"}`}>
                {on ? "✓ Selected" : "Select"}
              </button>
            </div>
          )
        })}
      </div>
    </OpsModal>
  )
}

const LAPSED_MEMBERS = ["Priya S.", "Tom W.", "Grace L.", "Omar H.", "Ella M.", "Sam K.", "Nina R.", "Leo B.", "Maya T.", "Jack D.", "Zara P.", "Ben C.", "Isla F.", "Noah G.", "Ava J.", "Luca V.", "Chloe N.", "Finn O."]
  .map((name, i) => ({ name, days: 14 + (i * 5) % 30, rides: 3 + (i * 7) % 20 }))
function ReengageOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [picked, setPicked] = useState(LAPSED_MEMBERS.map(m => m.name))
  const [offer, setOffer] = useState("A free class on us")
  const [message, setMessage] = useState("Hey {first name} 👋 We've missed you at CycleHQ! Book any ride this week and it's on us — come keep your streak alive.")
  const toggle = n => setPicked(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n])
  return (
    <OpsModal darkMode={darkMode} Icon={Users} color="#f59e0b" title="Re-engage lapsed members" sub="18 members haven't ridden in 14+ days" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button disabled={!picked.length} onClick={() => onFinish(`Re-engaged ${picked.length}`)} className={opsBtn("primary", darkMode)}>Send to {picked.length} member{picked.length === 1 ? "" : "s"}</button>
      </>}>
      <div className="flex items-center justify-between mb-2">
        <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>Members · {picked.length} selected</p>
        <button onClick={() => setPicked(picked.length === LAPSED_MEMBERS.length ? [] : LAPSED_MEMBERS.map(m => m.name))} className="text-xs font-semibold" style={{ color: GREEN }}>
          {picked.length === LAPSED_MEMBERS.length ? "Select none" : "Select all"}
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-1.5 mb-4">
        {LAPSED_MEMBERS.map(m => (
          <label key={m.name} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer ${t.subtle}`}>
            <input type="checkbox" checked={picked.includes(m.name)} onChange={() => toggle(m.name)} className="w-4 h-4 accent-[#00aa13]" />
            <span className={`text-sm flex-1 ${t.heading}`}>{m.name}</span>
            <span className={`text-[11px] ${t.muted}`}>{m.days}d away · {m.rides} rides</span>
          </label>
        ))}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Offer</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["A free class on us", "20% off a class pack", "Bring a friend free"].map(o => (
          <button key={o} onClick={() => setOffer(o)} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${offer === o ? "bg-[#00aa13] text-white" : t.chip}`}>{o}</button>
        ))}
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Message</p>
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00aa13] ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`} />
      <p className={`text-[11px] mt-1 ${t.faint}`}>Offer included: {offer}</p>
    </OpsModal>
  )
}

const PROMO_CHANNELS = [["email", "Email 212 lapsed lunchtime riders", 18], ["push", "Push notification to 96 riders within a mile", 12], ["guest", "2-for-1 guest pass for members", 15], ["social", "Instagram story from the studio account", 6]]
function PromoteOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [on, setOn] = useState(["email", "push"])
  const base = 42
  const projected = Math.min(100, base + PROMO_CHANNELS.filter(([k]) => on.includes(k)).reduce((s, [, , up]) => s + up, 0))
  return (
    <OpsModal darkMode={darkMode} Icon={TrendingDown} color="#f59e0b" title="Promote an under-filled class" sub="Cadence Control · Wed 4 Mar · 12:30 · Shoreditch · 10/24 booked" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button disabled={!on.length} onClick={() => onFinish(`Promoting · ${on.length} channel${on.length === 1 ? "" : "s"}`)} className={opsBtn("primary", darkMode)}>Launch promotion</button>
      </>}>
      <div className={`rounded-xl p-4 mb-4 ${t.subtle}`}>
        <div className={`flex justify-between text-xs mb-1.5 ${t.muted}`}><span>Current fill</span><span className="font-bold">{base}%</span></div>
        <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}><div className="h-full rounded-full bg-amber-500" style={{ width: `${base}%` }} /></div>
        <div className={`flex justify-between text-xs mt-3 mb-1.5 ${t.muted}`}><span>Projected with promotion</span><span className="font-bold" style={{ color: GREEN }}>{projected}%</span></div>
        <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}><div className="h-full rounded-full transition-all" style={{ width: `${projected}%`, background: GREEN }} /></div>
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Channels</p>
      <div className="flex flex-col gap-1.5">
        {PROMO_CHANNELS.map(([k, label, up]) => (
          <label key={k} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer ${t.subtle}`}>
            <input type="checkbox" checked={on.includes(k)} onChange={() => setOn(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k])} className="w-4 h-4 accent-[#00aa13]" />
            <span className={`text-sm flex-1 ${t.heading}`}>{label}</span>
            <span className="text-xs font-semibold" style={{ color: GREEN }}>+{up}%</span>
          </label>
        ))}
      </div>
    </OpsModal>
  )
}

function ClassRequestOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [message, setMessage] = useState("")
  const [tab, setTab] = useState("request")
  const date = "2026-02-28", start = 10 * 60, studio = "Studio 2"
  const day = classesOn(date, studio)
  const clash = day.find(c => c.start < start + 45 && c.end > start)
  const before = [...day].reverse().find(c => c.end <= start), after = day.find(c => c.start >= start + 45)
  const facts = [
    ["Class", "Rhythm Ride · social ride (random seating)"],
    ["When", `${opFmtDay(date)} · ${opFmtMin(start)}–${opFmtMin(start + 45)} · weekly`],
    ["Where", "Shoreditch · Studio 2 · 20 bikes"],
    ["Requested by", "Zen Kiwi · ★ 4.9 · 18 classes this month"],
    ["Demand", "Similar Saturday rides run 91% full with a waitlist most weeks"],
  ]
  return (
    <OpsModal darkMode={darkMode} Icon={Calendar} color="#8b5cf6" title="Confirm class request" sub="New weekly class requested by an instructor" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={() => onFinish("Declined")} className={`${opsBtn("secondary", darkMode)} mr-auto text-red-500`}>Decline</button>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button onClick={() => onFinish("Confirmed", { event: { id: `ev-${task.id}`, date, start, end: start + 45, title: "Rhythm Ride (new)", studio, type: "class" } })} className={opsBtn("primary", darkMode)}>Confirm class</button>
      </>}>
      <OpsTabs darkMode={darkMode} tab={tab} setTab={setTab} tabs={[["request", "Request"], ["class", "Class details"], ["instructor", "Zen Kiwi's profile"]]} />
      {tab === "class" && <ClassDetailsPanel darkMode={darkMode} {...REQUESTED_CLASS} />}
      {tab === "instructor" && <InstructorProfilePanel darkMode={darkMode} name="Zen Kiwi" />}
      {tab === "request" && <>
      <div className={`rounded-xl divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} ${t.subtle}`}>
        {facts.map(([k, v]) => (
          <div key={k} className="flex gap-3 px-4 py-2.5">
            <span className={`w-28 flex-shrink-0 text-xs ${t.muted}`}>{k}</span>
            <span className={`text-sm ${t.heading}`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 mt-3 text-sm font-semibold" style={clash ? { background: "#ef44441a", color: "#ef4444" } : { background: "#00aa131a", color: GREEN }}>
        {clash ? `Clashes with ${clash.title} at ${opFmtMin(clash.start)}` : "No clash with the Studio 2 timetable ✓"}
        <p className={`text-xs font-normal mt-0.5 ${t.muted}`}>
          {before ? `Before: ${opFmtMin(before.start)} ${before.title} (ends ${opFmtMin(before.end)})` : "Nothing before"} · {after ? `After: ${opFmtMin(after.start)} ${after.title}` : "Nothing after"}
        </p>
      </div>
      <p className={`text-xs font-bold uppercase tracking-wider mt-4 mb-2 ${t.muted}`}>Message to Zen Kiwi (optional)</p>
      <textarea value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="e.g. Love it — let's launch it with a guest-pass weekend."
        className={`w-full rounded-xl border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00aa13] ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"}`} />
      <button onClick={() => setTab("instructor")} className="text-xs font-semibold mt-3" style={{ color: "#8b5cf6" }}>Vet this instructor before confirming →</button>
      </>}
    </OpsModal>
  )
}

// ── Vetting: full class details and instructor profile, for approvals and complaints ──
function OpsTabs({ tabs, tab, setTab, darkMode }) {
  return (
    <div role="tablist" className={`flex gap-1 p-0.5 rounded-xl mb-4 overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      {tabs.map(([k, label]) => (
        <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
          className={`flex-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === k ? (darkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </button>
      ))}
    </div>
  )
}

const REQUESTED_CLASS = {
  blocks: [{ name: "Warm Up", mins: 6, zone: 1 }, { name: "Rhythm Block 1", mins: 10, zone: 3 }, { name: "Cadence Challenge", mins: 10, zone: 3 }, { name: "Rhythm Block 2", mins: 10, zone: 4 }, { name: "Cool Down", mins: 9, zone: 1 }],
  songs: [["Dancing Queen", "ABBA", 101], ["Levitating", "Dua Lipa", 103], ["Uptown Funk", "Bruno Mars", 115], ["Shut Up and Dance", "Walk the Moon", 128], ["Mr. Brightside", "The Killers", 148], ["Don't Stop Me Now", "Queen", 156]],
  level: "All levels", capacity: 20, format: "Social ride · random seating · Studio 2",
}

function ClassDetailsPanel({ darkMode, blocks = [], songs = [], level = "All levels", capacity, format }) {
  const t = tk(darkMode)
  const total = blocks.reduce((s, b) => s + b.mins, 0)
  const peak = Math.max(0, ...blocks.map(b => b.zone))
  const hardMins = blocks.filter(b => b.zone >= 4).reduce((s, b) => s + b.mins, 0)
  const first = blocks[0], last = blocks[blocks.length - 1]
  const checks = [
    [`Warm-up · ${first?.mins || 0} min`, !!first && first.zone <= 2 && first.mins >= 5, "At least 5 easy minutes before any efforts"],
    [`Cool-down · ${last?.mins || 0} min`, !!last && last.zone <= 2 && last.mins >= 4, "At least 4 easy minutes to finish"],
    [`Peak intensity · Z${peak}`, level === "All levels" ? peak <= 5 : true, level === "All levels" ? "All-levels classes should stay at Z5 or below" : `Suits a ${level.toLowerCase()} class`],
    [`Hard minutes (Z4+) · ${hardMins} min`, hardMins <= 20, "20 minutes or fewer keeps it safe for mixed groups"],
    [`Length · ${total} min`, total >= 30 && total <= 60, "Classes should run 30–60 minutes"],
  ]
  const label = text => <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>{text}</p>
  return (
    <div className="flex flex-col gap-3">
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        <div className="flex justify-between gap-2">{label("Structure")}<p className={`text-xs font-semibold ${t.heading}`}>{level} · {total} min</p></div>
        <OpsBlocksChart blocks={blocks} />
        <div className="flex flex-col gap-1 mt-3">
          {blocks.map((b, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs ${t.muted}`}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: ZONE_COLORS[b.zone - 1] }} />
              <span className={`flex-1 ${t.heading}`}>{b.name}</span>
              <span className="tabular-nums">{b.mins} min</span>
              <span className="w-8 text-right tabular-nums">Z{b.zone}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        {label("Safety & quality checks")}
        {checks.map(([text, ok, hint]) => (
          <div key={text} className="flex items-start gap-2.5 py-1">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5" style={{ background: (ok ? GREEN : "#f59e0b") + "22", color: ok ? GREEN : "#f59e0b" }}>{ok ? "✓" : "!"}</span>
            <div><p className={`text-sm ${t.heading}`}>{text}</p><p className={`text-[11px] ${t.muted}`}>{hint}</p></div>
          </div>
        ))}
      </div>
      {songs.length > 0 && (
        <div className={`rounded-xl p-4 ${t.subtle}`}>
          {label(`Playlist · ${songs.length} tracks`)}
          {songs.map(([title, artist, bpm]) => (
            <div key={title} className={`flex items-center gap-2 py-1.5 border-t first:border-t-0 ${t.border}`}>
              <div className="flex-1 min-w-0"><p className={`text-sm truncate ${t.heading}`}>{title}</p>{artist && <p className={`text-[11px] ${t.muted}`}>{artist}</p>}</div>
              {bpm && <span className={`text-xs tabular-nums ${t.muted}`}>{bpm} BPM</span>}
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: GREEN + "1a", color: GREEN }}>Licensed</span>
            </div>
          ))}
        </div>
      )}
      {(format || capacity) && <p className={`text-xs ${t.muted}`}>{format}{capacity ? ` · ${capacity} bikes` : ""}</p>}
    </div>
  )
}

// Demo instructor records: vetting checks, ratings and rider feedback (including complaints)
const INSTRUCTOR_PROFILES = {
  "Zen Kiwi": {
    joined: "Nov 2025", stage: "New instructor · probation until May 2026", classes: 18, rating: 4.9, attendance: 91, retention: 84,
    checks: [["Indoor cycling certification", "Verified", true], ["First aid & CPR", "Valid to Aug 2026", true], ["Background check", "Clear", true], ["Shadowed classes", "3 with Anna Banana · signed off", true], ["Right to work", "Verified", true]],
    stars: [52, 9, 2, 1, 0],
    feedback: [
      ["Priya S.", 5, "Best Saturday energy — the playlist was spot on."],
      ["Tom W.", 5, "Great cues for beginners, I never felt lost."],
      ["Anonymous", 2, "Music was very loud near the front row.", "Complaint · resolved 12 Feb — volume capped at 85 dB"],
    ],
  },
  JIM: {
    joined: "Mar 2023", stage: "Senior instructor", classes: 412, rating: 4.9, attendance: 92, retention: 90,
    checks: [["Indoor cycling certification", "Verified", true], ["First aid & CPR", "Expires in 3 weeks — renewal due", false], ["Background check", "Clear", true], ["Right to work", "Verified", true]],
    stars: [1020, 130, 22, 6, 2],
    feedback: [
      ["Grace L.", 5, "Tough but brilliant — two PRs this month."],
      ["Omar H.", 3, "Intervals felt too hard for a lunchtime class.", "Feedback · shared with instructor"],
      ["Ella M.", 2, "Class started five minutes late.", "Complaint · open"],
    ],
  },
  _default: {
    joined: "—", stage: "Instructor", classes: 0, rating: "—", attendance: "—", retention: "—",
    checks: [["Indoor cycling certification", "Not on file", false], ["First aid & CPR", "Not on file", false], ["Background check", "Not on file", false]],
    stars: [0, 0, 0, 0, 0], feedback: [],
  },
}

function InstructorProfilePanel({ name, darkMode }) {
  const t = tk(darkMode)
  const p = INSTRUCTOR_PROFILES[name] || INSTRUCTOR_PROFILES._default
  const reviews = p.stars.reduce((s, n) => s + n, 0)
  const complaints = p.feedback.filter(f => f[3]?.startsWith("Complaint"))
  const openComplaints = complaints.filter(f => f[3].includes("open"))
  const label = text => <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>{text}</p>
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar name={name} size={48} />
        <div className="min-w-0">
          <p className={`text-base font-bold ${t.heading}`}>{name}</p>
          <p className={`text-xs ${t.muted}`}>{p.stage} · joined {p.joined}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[["Classes taught", p.classes], ["Rating", `★ ${p.rating}`], ["Attendance", `${p.attendance}%`], ["Rider retention", `${p.retention}%`]].map(([l, v]) => (
          <div key={l} className={`rounded-xl p-3 ${t.subtle}`}><p className={`text-[11px] ${t.muted}`}>{l}</p><p className={`text-lg font-bold ${t.heading}`}>{v}</p></div>
        ))}
      </div>
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        {label("Vetting & compliance")}
        <div className="mt-2">
          {p.checks.map(([text, status, ok]) => (
            <div key={text} className="flex items-center gap-2.5 py-1.5">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ background: (ok ? GREEN : "#f59e0b") + "22", color: ok ? GREEN : "#f59e0b" }}>{ok ? "✓" : "!"}</span>
              <span className={`text-sm flex-1 ${t.heading}`}>{text}</span>
              <span className="text-xs font-semibold text-right" style={{ color: ok ? GREEN : "#f59e0b" }}>{status}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        {label(`Ratings · ${reviews} reviews`)}
        <div className="flex flex-col gap-1.5 mt-2">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div key={star} className={`flex items-center gap-2 text-xs ${t.muted}`}>
              <span className="w-7 tabular-nums">{star} ★</span>
              <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <div className="h-full rounded-full" style={{ width: `${reviews ? p.stars[i] / reviews * 100 : 0}%`, background: star >= 4 ? GREEN : star === 3 ? "#f59e0b" : "#ef4444" }} />
              </div>
              <span className="w-10 text-right tabular-nums">{p.stars[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        <div className="flex items-center justify-between gap-2">
          {label("Recent feedback & complaints")}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={openComplaints.length ? { background: "#ef44441a", color: "#ef4444" } : { background: GREEN + "1a", color: GREEN }}>
            {openComplaints.length ? `${openComplaints.length} open complaint${openComplaints.length > 1 ? "s" : ""}` : complaints.length ? "Complaints resolved" : "No complaints"}
          </span>
        </div>
        {p.feedback.length === 0 && <p className={`text-sm mt-2 ${t.muted}`}>No feedback yet.</p>}
        {p.feedback.map(([who, stars, text, status]) => (
          <div key={who + text} className={`py-2.5 border-t first:border-t-0 mt-1 ${t.border}`}>
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm font-semibold ${t.heading}`}>{who}</p>
              <span className="text-xs text-amber-500">{"★".repeat(stars)}<span className={t.faint}>{"★".repeat(5 - stars)}</span></span>
            </div>
            <p className={`text-sm ${t.muted}`}>{text}</p>
            {status && (
              <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={status.includes("open") ? { background: "#ef44441a", color: "#ef4444" } : { background: "#f59e0b1a", color: "#b45309" }}>{status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function OpsBlocksChart({ blocks = [], compare }) {
  return (
    <div className="flex items-end gap-0.5 h-20">
      {blocks.map((b, i) => (
        <div key={i} className="relative h-full" style={{ flexGrow: b.mins, flexBasis: 0 }} title={`${b.name} · ${b.mins} min · Z${b.zone}`}>
          <div className="absolute bottom-0 inset-x-0 rounded-t" style={{ height: `${b.zone / 6 * 100}%`, background: ZONE_COLORS[b.zone - 1], boxShadow: compare?.[i] && compare[i].zone !== b.zone ? "inset 0 0 0 2px #8b5cf6" : undefined }} />
        </div>
      ))}
    </div>
  )
}

function ChangeRequestOverlay({ task, darkMode, onClose, onResolveChange }) {
  const t = tk(darkMode)
  const r = task.request, ch = r.changes || {}
  const orig = ch.originalBlocks || [], next = ch.blocks || []
  const decide = status => { onResolveChange?.(r.id, status); onClose() }
  const [tab, setTab] = useState("changes")
  return (
    <OpsModal wide darkMode={darkMode} Icon={Sparkles} color="#8b5cf6" title={`${r.instructor} wants to change ${r.className}`} sub={`${r.when} · ${r.studio} · ${ch.scope === "future" ? "All future classes" : "This class only"}`} done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={() => decide("declined")} className={`${opsBtn("secondary", darkMode)} mr-auto text-red-500`}>Decline</button>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button onClick={() => decide("approved")} className={opsBtn("primary", darkMode)}>Approve changes</button>
      </>}>
      <OpsTabs darkMode={darkMode} tab={tab} setTab={setTab} tabs={[["changes", "Changes"], ["class", "Class details"], ["instructor", `${r.instructor}'s profile`]]} />
      {tab === "class" && (
        <ClassDetailsPanel darkMode={darkMode} blocks={next.length ? next : orig} songs={(ch.songs || []).map(title => [title])}
          level={ch.difficulty || "All levels"} capacity={r.studio === "Studio 2" ? 20 : 24} format={`${r.studio} · ${ch.scope === "future" ? "All future classes" : "This class only"}`} />
      )}
      {tab === "instructor" && <InstructorProfilePanel darkMode={darkMode} name={r.instructor} />}
      {tab === "changes" && <>
      {r.note && <div className={`rounded-xl p-3 mb-4 text-sm italic ${t.subtle} ${t.heading}`}>“{r.note}”</div>}
      {next.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {[["Before", orig, ch.originalDifficulty, null], ["After", next, ch.difficulty, orig]].map(([label, blocks, diff, compare]) => (
            <div key={label} className={`rounded-xl p-4 ${t.subtle}`}>
              <div className="flex justify-between mb-2">
                <p className={`text-xs font-bold uppercase tracking-wider ${t.muted}`}>{label}</p>
                <p className={`text-xs font-semibold ${t.heading}`}>{diff} · {blocks.reduce((s, b) => s + b.mins, 0)} min</p>
              </div>
              <OpsBlocksChart blocks={blocks} compare={compare} />
            </div>
          ))}
        </div>
      )}
      {next.length > 0 && (
        <div className={`rounded-xl overflow-hidden border mb-4 ${t.border}`}>
          <table className="w-full text-sm">
            <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
              <tr className={`text-xs ${t.muted}`}><th className="text-left px-3 py-2 font-semibold">Block</th><th className="text-right px-3 py-2 font-semibold">Minutes</th><th className="text-right px-3 py-2 font-semibold">Zone</th></tr>
            </thead>
            <tbody>
              {next.map((b, i) => {
                const o = orig[i]
                const minsChanged = !o || o.mins !== b.mins, zoneChanged = !o || o.zone !== b.zone
                return (
                  <tr key={i} className={`border-t ${t.border}`}>
                    <td className={`px-3 py-2 ${t.heading}`}>{b.name}{!o && <span className="ml-1.5 text-[10px] font-bold" style={{ color: GREEN }}>NEW</span>}</td>
                    <td className={`px-3 py-2 text-right tabular-nums ${minsChanged ? "font-bold text-[#8b5cf6]" : t.muted}`}>{o && minsChanged ? `${o.mins} → ` : ""}{b.mins}</td>
                    <td className={`px-3 py-2 text-right tabular-nums ${zoneChanged ? "font-bold text-[#8b5cf6]" : t.muted}`}>{o && zoneChanged ? `Z${o.zone} → ` : ""}Z{b.zone}</td>
                  </tr>
                )
              })}
              {orig.slice(next.length).map((b, i) => (
                <tr key={`gone-${i}`} className={`border-t ${t.border} line-through text-red-500`}><td className="px-3 py-2">{b.name}</td><td className="px-3 py-2 text-right">{b.mins}</td><td className="px-3 py-2 text-right">Z{b.zone}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(ch.removed?.length > 0 || ch.added?.length > 0) && (
        <div className={`rounded-xl p-4 ${t.subtle}`}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>Playlist</p>
          {ch.removed?.map(s => <p key={s} className="text-sm text-red-500 line-through">− {s}</p>)}
          {ch.added?.map(s => <p key={s} className="text-sm font-semibold" style={{ color: GREEN }}>+ {s}</p>)}
        </div>
      )}
      {!next.length && <p className={`text-sm ${t.muted}`}>{r.summary}</p>}
      </>}
    </OpsModal>
  )
}

function LicenceOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [auto, setAuto] = useState(true)
  const rows = [["Licence", "Music licence for group exercise classes"], ["Covers", "Hampstead & Shoreditch · all class playlists"], ["Expires", "Tue 10 Mar 2026"], ["Annual fee", "£1,284 (+2.4% on last year)"]]
  return (
    <OpsModal darkMode={darkMode} Icon={Clock} color="#f59e0b" title="Renew music licence" sub="Classes can't play music without it" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button onClick={() => onFinish(auto ? "Renewed · auto-renew on" : "Renewed to Mar 2027")} className={opsBtn("primary", darkMode)}>Renew for 12 months</button>
      </>}>
      <div className={`rounded-xl divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"} ${t.subtle}`}>
        {rows.map(([k, v]) => <div key={k} className="flex gap-3 px-4 py-2.5"><span className={`w-24 flex-shrink-0 text-xs ${t.muted}`}>{k}</span><span className={`text-sm ${t.heading}`}>{v}</span></div>)}
      </div>
      <label className={`flex items-center gap-3 rounded-xl px-4 py-3 mt-3 cursor-pointer ${t.subtle}`}>
        <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} className="w-4 h-4 accent-[#00aa13]" />
        <span className={`text-sm ${t.heading}`}>Turn on auto-renew so this doesn't lapse next year</span>
      </label>
    </OpsModal>
  )
}

function OrderOverlay({ task, darkMode, onFinish, onClose }) {
  const t = tk(darkMode)
  const [qty, setQty] = useState(6)
  const unit = 14.5
  return (
    <OpsModal darkMode={darkMode} Icon={Wrench} color="#0ea5e9" title="Order pedal straps" sub="Studio 1 · flagged worn on bikes 3, 7, 9, 15, 18 and 22" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button onClick={() => onFinish(`Ordered ${qty} pairs`, { event: { id: `ev-${task.id}`, date: "2026-03-03", start: 9 * 60, end: 10 * 60, title: `Delivery · ${qty} pairs of pedal straps`, studio: "Studio 1", type: "operations" } })} className={opsBtn("primary", darkMode)}>Place order · £{(qty * unit).toFixed(2)}</button>
      </>}>
      <div className={`rounded-xl p-4 ${t.subtle}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={`text-sm font-semibold ${t.heading}`}>Pedal straps (pair)</p>
            <p className={`text-xs ${t.muted}`}>Studio cycle parts supplier · £{unit.toFixed(2)} each · arrives Tue 3 Mar</p>
          </div>
          <div className={`flex items-center rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Fewer" className={`w-8 h-9 ${t.muted}`}>−</button>
            <span className={`w-8 text-center text-sm font-bold tabular-nums ${t.heading}`}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} aria-label="More" className={`w-8 h-9 ${t.muted}`}>+</button>
          </div>
        </div>
      </div>
      <p className={`text-xs mt-3 ${t.muted}`}>The delivery is added to the studio calendar so someone's in to receive it.</p>
    </OpsModal>
  )
}

const PLAN_STEPS = ["Review summer demand in Class performance", "Collect instructor availability (Jun–Aug)", "Draft the timetable for both studios", "Share the draft with instructors for slot picks"]
function PlanOverlay({ task, darkMode, onFinish, onClose, onNavigate }) {
  const t = tk(darkMode)
  const [ticked, setTicked] = useState([])
  return (
    <OpsModal darkMode={darkMode} Icon={Sparkles} color="#8b5cf6" title="Plan the summer timetable" sub="Due in 45 days" done={task.doneLabel} onClose={onClose}
      footer={<>
        <button onClick={() => { onClose(); onNavigate?.("Classes") }} className={`${opsBtn("secondary", darkMode)} mr-auto`}>Open class performance</button>
        <button onClick={onClose} className={opsBtn("secondary", darkMode)}>Close</button>
        <button disabled={!ticked.length} onClick={() => onFinish(ticked.length === PLAN_STEPS.length ? "Plan ready" : `Started · ${ticked.length}/${PLAN_STEPS.length} steps`)} className={opsBtn("primary", darkMode)}>Save progress</button>
      </>}>
      <div className="flex flex-col gap-1.5">
        {PLAN_STEPS.map((s, i) => (
          <label key={s} className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer ${t.subtle}`}>
            <input type="checkbox" checked={ticked.includes(i)} onChange={() => setTicked(x => x.includes(i) ? x.filter(n => n !== i) : [...x, i])} className="w-4 h-4 accent-[#00aa13]" />
            <span className={`text-sm ${t.heading} ${ticked.includes(i) ? "line-through opacity-60" : ""}`}>{s}</span>
          </label>
        ))}
      </div>
    </OpsModal>
  )
}

function TaskOverlay({ task, darkMode, ops, setOps, onFinish, onResolveChange, onNavigate, onClose }) {
  const common = { task, darkMode, onFinish, onClose }
  switch (task.kind) {
    case "repair":  return <SlotScheduler {...common} studio="Studio 1" hours={2} bikes={[4, 10]} broken title="Book repair" what="Repair · Bikes 4 & 10" />
    case "service": return <SlotScheduler {...common} studio="Studio 2" hours={3} bikes={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} title="Schedule quarterly service" what="Service · Studio 2 bikes 1–10" />
    case "log":     return <ServiceLogSheet {...common} draft={ops.logDraft} setDraft={fn => setOps?.(o => ({ ...o, logDraft: fn(o.logDraft || {}) }))} />
    case "cover":   return <CoverOverlay {...common} />
    case "reengage": return <ReengageOverlay {...common} />
    case "promote": return <PromoteOverlay {...common} />
    case "class-request": return <ClassRequestOverlay {...common} />
    case "change-request": return <ChangeRequestOverlay {...common} onResolveChange={onResolveChange} />
    case "licence": return <LicenceOverlay {...common} />
    case "order":   return <OrderOverlay {...common} />
    default:        return <PlanOverlay {...common} onNavigate={onNavigate} />
  }
}

// ── Studio calendar: classes, booked maintenance/operations and deadlines, colour-coded ──
const CAL_TYPES = [
  ["class", "Classes", GREEN],
  ["maintenance", "Maintenance booked", "#0ea5e9"],
  ["operations", "Operations", "#f59e0b"],
  ["deadline", "Deadlines & logs due", "#fb7512"],
  ["approval", "Approvals", "#8b5cf6"],
  ["urgent", "Urgent", "#ef4444"],
]
const CAL_COLOR = Object.fromEntries(CAL_TYPES.map(([k, , c]) => [k, c]))
const CAL_LABEL = Object.fromEntries(CAL_TYPES.map(([k, l]) => [k, l]))
const SEED_EVENTS = [
  { id: "se1", date: "2026-03-02", start: 14 * 60, end: 15 * 60, title: "Instructor team meeting", studio: "Studio 1", type: "operations" },
  { id: "se2", date: "2026-03-01", start: 16 * 60, end: 18 * 60, title: "Deep clean", studio: "Studio 2", type: "operations" },
  { id: "se3", date: "2026-03-05", start: 21 * 60, end: 22 * 60, title: "Fire safety check", studio: "Studio 1", type: "maintenance" },
  { id: "se4", date: "2026-02-27", start: 14 * 60, end: 15 * 60, title: "Sound system tune-up", studio: "Studio 2", type: "maintenance" },
]
function calendarItems(days, ops, changeRequests) {
  const inView = new Set(days)
  const items = []
  days.forEach(iso => OP_STUDIOS.forEach(s => items.push(...classesOn(iso, s))))
  for (const e of [...SEED_EVENTS, ...(ops.events || [])]) if (inView.has(e.date)) items.push(e)
  for (const task of OWNER_TASKS_SEED) {
    if (ops.done?.[task.id]) continue
    const date = task.due < 0 ? OWNER_TODAY : opAddDays(OWNER_TODAY, task.due)
    if (!inView.has(date)) continue
    const type = task.priority === "urgent" || task.due < 0 ? "urgent" : task.category === "approvals" ? "approval" : "deadline"
    items.push({ id: "task-" + task.id, date, allDay: true, type, title: task.title, sub: task.sub, studio: (task.sub.match(/Studio \d/) || [])[0] })
  }
  for (const r of changeRequests) {
    const date = opAddDays(OWNER_TODAY, 2)
    if (r.status === "pending" && inView.has(date)) items.push({ id: "req-" + r.id, date, allDay: true, type: "approval", title: `Review ${r.instructor}'s changes to ${r.className}`, sub: r.summary, studio: r.studio })
  }
  return items.map((it, i) => ({ id: it.id || `${it.type}-${it.date}-${it.start}-${it.studio}-${i}`, ...it }))
}
function layoutDay(list) {
  const laneEnds = []
  const placed = list.filter(i => !i.allDay).sort((a, b) => a.start - b.start || b.end - a.end).map(it => {
    let lane = laneEnds.findIndex(end => end <= it.start)
    if (lane < 0) { lane = laneEnds.length; laneEnds.push(it.end) } else laneEnds[lane] = it.end
    return { ...it, lane }
  })
  return { placed, lanes: Math.max(1, laneEnds.length) }
}

export function OwnerCalendarPage({ darkMode, onToggleDarkMode, onNavigate, ops = EMPTY_OPS, changeRequests = [] }) {
  const t = tk(darkMode)
  const [view, setView]     = useState("week")
  const [anchor, setAnchor] = useState(OWNER_TODAY)
  const [studio, setStudio] = useState("all")
  const [hidden, setHidden] = useState([])
  const [picked, setPicked] = useState(null)   // { item } or { day }

  const a = new Date(anchor + "T00:00:00")
  const weekStart  = opAddDays(anchor, -opDow(anchor))
  const monthFirst = opIso(new Date(a.getFullYear(), a.getMonth(), 1))
  const gridStart  = opAddDays(monthFirst, -opDow(monthFirst))
  const days = view === "week" ? Array.from({ length: 7 }, (_, i) => opAddDays(weekStart, i)) : Array.from({ length: 42 }, (_, i) => opAddDays(gridStart, i))
  const allItems = calendarItems(days, ops, changeRequests).filter(it => studio === "all" || !it.studio || it.studio === studio)
  const items = allItems.filter(it => !hidden.includes(it.type))
  const byDay = {}
  items.forEach(it => { (byDay[it.date] ||= []).push(it) })
  const shift = dir => { setPicked(null); setAnchor(view === "week" ? opAddDays(anchor, dir * 7) : opIso(new Date(a.getFullYear(), a.getMonth() + dir, 1))) }
  const heading = view === "week" ? `${opFmtDay(weekStart)} – ${opFmtDay(opAddDays(weekStart, 6))}` : `${OP_MONTHS[a.getMonth()]} ${a.getFullYear()}`
  const HOUR_H = 44, DAY_START = 6 * 60, DAY_END = 22 * 60
  const hours = Array.from({ length: 16 }, (_, i) => 6 + i)
  const gridH = (DAY_END - DAY_START) / 60 * HOUR_H
  const timeOf = it => it.allDay ? "Due" : `${opFmtMin(it.start)}–${opFmtMin(it.end)}`
  const sortItems = list => [...list].sort((x, y) => (x.allDay ? -1 : 1) - (y.allDay ? -1 : 1) || (x.start || 0) - (y.start || 0))

  const renderPill = it => (
    <button key={it.id} onClick={e => { e.stopPropagation(); setPicked({ item: it }) }} title={it.title}
      className="w-full text-left text-[10px] font-semibold px-1.5 py-0.5 rounded text-white truncate hover:brightness-110" style={{ background: CAL_COLOR[it.type] }}>
      {it.title}
    </button>
  )

  return (
    <Shell max="max-w-7xl">
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Overview")} backLabel="Overview"
        title="Studio calendar" sub="Classes, maintenance, operations and deadlines at a glance" Icon={Calendar} gradient="linear-gradient(135deg,#00aa13,#0ea5e9)" />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className={`inline-flex rounded-xl p-0.5 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          {[["week", "Week"], ["month", "Month"]].map(([k, l]) => (
            <button key={k} onClick={() => { setView(k); setPicked(null) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${view === k ? (darkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm") : t.muted}`}>{l}</button>
          ))}
        </div>
        <button onClick={() => shift(-1)} aria-label="Previous" className={`w-8 h-8 rounded-lg ${t.chip}`}>‹</button>
        <button onClick={() => { setAnchor(OWNER_TODAY); setPicked(null) }} className={`px-3 h-8 rounded-lg text-xs font-semibold ${t.chip}`}>Today</button>
        <button onClick={() => shift(1)} aria-label="Next" className={`w-8 h-8 rounded-lg ${t.chip}`}>›</button>
        <p className={`text-sm font-semibold ml-1 ${t.heading}`}>{heading}</p>
        <select value={studio} onChange={e => setStudio(e.target.value)} aria-label="Studio"
          className={`ml-auto text-xs font-semibold rounded-lg px-2.5 py-1.5 border ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}>
          <option value="all">All studios</option>
          {OP_STUDIOS.map(s => <option key={s} value={s}>{s} · {s === "Studio 1" ? "Hampstead" : "Shoreditch"}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Show on calendar">
        {CAL_TYPES.map(([k, label, c]) => {
          const off = hidden.includes(k), n = allItems.filter(it => it.type === k).length
          return (
            <button key={k} aria-pressed={!off} onClick={() => setHidden(h => off ? h.filter(x => x !== k) : [...h, k])}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-opacity ${off ? "opacity-45" : ""} ${darkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-700"}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{label}<span className={t.faint}>{n}</span>
            </button>
          )
        })}
      </div>

      {view === "week" ? (
        <div className={`${t.card} overflow-x-auto`}>
          <div className="min-w-[780px] grid" style={{ gridTemplateColumns: "3.25rem repeat(7, minmax(0, 1fr))" }}>
            <div />
            {days.map(iso => (
              <button key={iso} onClick={() => setPicked({ day: iso })} className={`px-2 py-2.5 text-center border-l ${t.border} ${iso === OWNER_TODAY ? "text-[#00aa13]" : t.heading}`}>
                <p className="text-[11px] font-semibold uppercase">{OP_DOW[opDow(iso)]}</p>
                <p className="text-lg font-bold leading-tight">{Number(iso.slice(8))}</p>
              </button>
            ))}
            <div className={`text-[10px] px-1 py-2 border-t ${t.border} ${t.faint}`}>Due</div>
            {days.map(iso => (
              <div key={iso} className={`border-l border-t ${t.border} p-1 flex flex-col gap-1 min-h-[2.5rem]`}>
                {(byDay[iso] || []).filter(i => i.allDay).map(renderPill)}
              </div>
            ))}
            <div className={`relative border-t ${t.border}`} style={{ height: gridH }}>
              {hours.map(h => <span key={h} className={`absolute right-1.5 text-[10px] tabular-nums ${t.faint}`} style={{ top: (h * 60 - DAY_START) / 60 * HOUR_H + 2 }}>{opPad(h)}:00</span>)}
            </div>
            {days.map(iso => {
              const { placed, lanes } = layoutDay(byDay[iso] || [])
              return (
                <div key={iso} className={`relative border-l border-t ${t.border}`} style={{ height: gridH, background: iso === OWNER_TODAY ? (darkMode ? "rgba(0,170,19,0.06)" : "rgba(0,170,19,0.03)") : undefined }}>
                  {hours.map(h => <div key={h} className={`absolute inset-x-0 border-t ${darkMode ? "border-gray-800/70" : "border-gray-100"}`} style={{ top: (h * 60 - DAY_START) / 60 * HOUR_H }} />)}
                  {placed.map(it => (
                    <button key={it.id} onClick={() => setPicked({ item: it })} title={`${opFmtMin(it.start)} ${it.title}${it.studio ? ` · ${it.studio}` : ""}`}
                      className={`absolute rounded-md px-1 py-0.5 text-left overflow-hidden text-white shadow-sm hover:brightness-110 ${picked?.item?.id === it.id ? "ring-2 ring-offset-1 ring-gray-900" : ""}`}
                      style={{
                        top: (Math.max(it.start, DAY_START) - DAY_START) / 60 * HOUR_H + 1,
                        height: Math.max(18, (Math.min(it.end, DAY_END) - Math.max(it.start, DAY_START)) / 60 * HOUR_H - 2),
                        left: `calc(${it.lane / lanes * 100}% + 1px)`, width: `calc(${100 / lanes}% - 2px)`, background: CAL_COLOR[it.type],
                      }}>
                      <p className="text-[9px] font-bold leading-tight truncate">{opFmtMin(it.start)} {it.title}</p>
                      {lanes === 1 && it.studio && <p className="text-[9px] leading-tight truncate opacity-85">{it.studio}</p>}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className={`${t.card} p-2 sm:p-3`}>
          <div className="grid grid-cols-7 mb-1">
            {OP_DOW.map(d => <p key={d} className={`text-[11px] font-semibold text-center py-1 ${t.muted}`}>{d}</p>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map(iso => {
              const list = byDay[iso] || []
              const classes = list.filter(i => i.type === "class"), others = sortItems(list.filter(i => i.type !== "class"))
              const inMonth = iso.slice(0, 7) === monthFirst.slice(0, 7)
              return (
                <div key={iso} role="button" tabIndex={0} onClick={() => setPicked({ day: iso })} onKeyDown={e => { if (e.key === "Enter") setPicked({ day: iso }) }}
                  className={`min-h-[96px] rounded-lg p-1.5 text-left border cursor-pointer transition-colors ${picked?.day === iso ? "border-[#00aa13]" : iso === OWNER_TODAY ? "border-[#00aa13]/60" : t.border} ${inMonth ? "" : "opacity-45"} ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                  <p className={`text-xs font-semibold mb-1 ${iso === OWNER_TODAY ? "text-[#00aa13]" : t.heading}`}>{Number(iso.slice(8))}</p>
                  <div className="flex flex-col gap-0.5">
                    {classes.length > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white truncate" style={{ background: CAL_COLOR.class }}>{classes.length} classes</span>}
                    {others.slice(0, 2).map(renderPill)}
                    {others.length > 2 && <span className={`text-[10px] ${t.muted}`}>+{others.length - 2} more</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {picked && (
        <div className={`${t.card} p-4 mt-4`}>
          {picked.item ? (
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ background: CAL_COLOR[picked.item.type] }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: CAL_COLOR[picked.item.type] }}>{CAL_LABEL[picked.item.type]}</p>
                <p className={`text-base font-bold ${t.heading}`}>{picked.item.title}</p>
                <p className={`text-sm ${t.muted}`}>{opFmtDay(picked.item.date)} · {timeOf(picked.item)}{picked.item.studio ? ` · ${picked.item.studio}` : ""}</p>
                {picked.item.sub && <p className={`text-xs mt-1 ${t.muted}`}>{picked.item.sub}</p>}
              </div>
              {(picked.item.id.startsWith("task-") || picked.item.id.startsWith("req-")) && (
                <button onClick={() => onNavigate("Overview")} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: CAL_COLOR[picked.item.type] }}>Open in tasks</button>
              )}
              <button onClick={() => setPicked(null)} aria-label="Close" className={`w-7 h-7 rounded-lg ${t.muted}`}>✕</button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${t.heading}`}>{opFmtDay(picked.day)}</p>
                <button onClick={() => setPicked(null)} aria-label="Close" className={`w-7 h-7 rounded-lg ${t.muted}`}>✕</button>
              </div>
              {(byDay[picked.day] || []).length === 0 ? <p className={`text-sm ${t.muted}`}>Nothing on this day.</p> : (
                <div className="flex flex-col gap-1">
                  {sortItems(byDay[picked.day]).map(it => (
                    <button key={it.id} onClick={() => setPicked({ item: it })} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CAL_COLOR[it.type] }} />
                      <span className={`text-xs w-20 flex-shrink-0 tabular-nums ${t.muted}`}>{timeOf(it)}</span>
                      <span className={`text-sm flex-1 truncate ${t.heading}`}>{it.title}</span>
                      {it.studio && <span className={`text-xs ${t.faint}`}>{it.studio}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}

// ── OVERVIEW ──
export function OwnerOverviewPage({ darkMode, onToggleDarkMode, onNavigate, changeRequests = [], onResolveChange, ops = EMPTY_OPS, setOps }) {
  const t = tk(darkMode)
  const [tab, setTab]           = useState("all")
  const [range, setRange]       = useState(7)
  const [openTask, setOpenTask] = useState(null)   // task whose detail overlay is open
  // Task progress lives in App (ops), so it survives page changes and feeds the studio calendar
  const tasks = OWNER_TASKS_SEED.map(a => ({ ...a, kind: TASK_KINDS[a.id], doneLabel: ops.done[a.id] || null }))
  const finish = (id, label, extra = {}) => setOps?.(o => ({
    ...o,
    done: { ...o.done, [id]: label },
    events: extra.event ? [...o.events.filter(e => e.id !== extra.event.id), extra.event] : o.events,
    logDraft: extra.clearLog ? {} : o.logDraft,
  }))

  // Instructor class edits arrive as approvals
  const requestTasks = changeRequests.map(r => ({
    id: r.id, Icon: Sparkles, c: "#8b5cf6", category: "approvals", priority: "normal", due: 2, kind: "change-request", request: r,
    title: `${r.instructor} wants to change ${r.className}`, sub: `${r.when} · ${r.studio} · ${r.summary}`, note: r.note,
    actions: [{ label: "Review", c: "#8b5cf6" }],
    doneLabel: r.status === "approved" ? "Approved" : r.status === "declined" ? "Declined" : null,
  }))
  const isUrgent = a => a.priority === "urgent" || a.due < 0
  const inRange  = [...requestTasks, ...tasks].filter(a => a.due <= range)
  const matches  = (a, key) => key === "all" || (key === "urgent" ? isUrgent(a) : a.category === key)
  const openIn   = key => inRange.filter(a => !a.doneLabel && matches(a, key)).length
  const openCount = openIn("all")
  // Open before done, urgent first, then soonest due
  const shown = inRange.filter(a => matches(a, tab))
    .sort((a, b) => (a.doneLabel ? 1 : 0) - (b.doneLabel ? 1 : 0) || Number(isUrgent(b)) - Number(isUrgent(a)) || a.due - b.due)
  const dueLabel = d => d < 0 ? `Overdue by ${-d} day${d === -1 ? "" : "s"}` : d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : `Due in ${d} days`
  const buttonLabel = a => a.kind === "log" ? logActionLabel(ops.logDraft) : a.kind === "class-request" ? "Review" : a.actions[0].label
  const activeTask = [...requestTasks, ...tasks].find(a => a.id === openTask)
  const rangeLabel = TASK_RANGES.find(([v]) => v === range)[1].toLowerCase()
  const links = [
    { key: "Revenue", label: "Revenue", sub: "Trends & breakdown", Icon: Wallet, c: GREEN },
    { key: "Classes", label: "Class performance", sub: "Occupancy & fixes", Icon: Activity, c: "#0ea5e9" },
    { key: "Instructors", label: "Instructors", sub: "Leaderboard & ratings", Icon: Award, c: "#8b5cf6" },
    { key: "Riders", label: "Rider CRM", sub: "642 members", Icon: Users, c: "#ec4899" },
  ]
  return (
    <Shell>
      <OwnerHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} title="Studio Overview" sub="CycleHQ · Hampstead & Shoreditch" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {OWNER_KPIS.map((k, i) => <div key={i} className="pop-in" style={{ animationDelay: `${i * 60}ms` }}><StatCard darkMode={darkMode} {...k} /></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        {/* Studio tasks — tabs by type, filtered to a time window */}
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#ef44441a", color: "#ef4444" }}><AlertTriangle size={15} /></span>
              <p className={`text-sm font-semibold ${t.heading}`}>Studio tasks</p>
              {openCount > 0
                ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-500">{openCount}</span>
                : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#00aa131a", color: GREEN }}>All clear ✓</span>}
            </div>
            <label className="flex items-center gap-2">
              <span className={`text-xs ${t.muted}`}>Show</span>
              <select value={range} onChange={e => setRange(Number(e.target.value))}
                className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-[#00aa13] ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-700"}`}>
                {TASK_RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>

          <div role="tablist" aria-label="Task type" className="flex gap-1.5 overflow-x-auto pb-1 mb-3">
            {TASK_TABS.map(([key, label]) => {
              const on = tab === key, n = openIn(key)
              return (
                <button key={key} role="tab" aria-selected={on} onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors
                    ${on ? "text-white" : darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  style={on ? { background: key === "urgent" ? "#ef4444" : GREEN } : undefined}>
                  {label}
                  {n > 0 && <span className={`text-[10px] font-bold px-1.5 rounded-full ${on ? "bg-white/25" : key === "urgent" ? "bg-red-500/15 text-red-500" : darkMode ? "bg-gray-700" : "bg-white"}`}>{n}</span>}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2.5">
            {shown.length === 0 && <p className={`text-sm text-center py-8 ${t.muted}`}>Nothing to do here in the {rangeLabel} ✓</p>}
            {shown.map(a => (
              <div key={a.id} className={`flex items-center gap-3 rounded-xl p-3.5 transition-all ${t.subtle} ${a.doneLabel ? "opacity-55" : ""}`}>
                <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: (a.doneLabel ? "#00aa13" : a.c) + "1a", color: a.doneLabel ? GREEN : a.c }}>
                  {a.doneLabel ? <Check size={16} /> : <a.Icon size={16} />}
                </span>
                <button onClick={() => setOpenTask(a.id)} className="flex-1 min-w-0 text-left">
                  <p className={`text-sm font-semibold ${t.heading} ${a.doneLabel ? "line-through" : ""}`}>{a.title}</p>
                  <p className={`text-xs ${t.muted} ${a.doneLabel ? "line-through" : ""}`}>{a.sub}</p>
                  {a.note && <p className={`text-xs italic mt-1 ${t.muted}`}>“{a.note}”</p>}
                  {!a.doneLabel && (
                    <p className={`text-[11px] font-semibold mt-1 ${a.due <= 0 ? "text-red-500" : a.due <= 2 ? "text-amber-500" : t.faint}`}>
                      {dueLabel(a.due)}{a.priority === "urgent" ? " · Urgent" : ""}
                    </p>
                  )}
                </button>
                {a.doneLabel
                  ? <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: "#00aa131a", color: GREEN }}><Check size={13} /> {a.doneLabel}</span>
                  : (
                    <button onClick={() => setOpenTask(a.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0 transition-colors hover:opacity-90" style={{ background: a.actions[0].c }}>
                      {buttonLabel(a)}
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue snapshot + quick links */}
        <div className="flex flex-col gap-4">
          <button onClick={() => onNavigate("Revenue")} className={`${t.card} p-5 text-left hover:shadow-lg transition-all`}>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-sm font-semibold ${t.heading}`}>Revenue this month</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-[#00aa13]"><TrendingUp size={12} />9%</span>
            </div>
            <p className={`text-3xl font-bold tracking-tight ${t.heading} mb-2`}>£25,300</p>
            <AreaTrend points={REVENUE.monthly} labels={REVENUE.monthLabels} valueFmt={v => `£${v}k`} darkMode={darkMode} color={GREEN} height={90} />
            <p className="text-xs font-semibold text-[#00aa13] mt-2">View revenue →</p>
          </button>
          <div className={`${t.card} p-3`}>
            {links.slice(1).map(l => (
              <button key={l.key} onClick={() => onNavigate(l.key)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg,${l.c},${l.c}cc)` }}><l.Icon size={16} /></span>
                <div className="flex-1 min-w-0"><p className={`text-sm font-semibold ${t.heading}`}>{l.label}</p><p className={`text-xs ${t.muted}`}>{l.sub}</p></div>
                <ChevronRight size={16} className={t.faint} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {activeTask && (
        <TaskOverlay task={activeTask} darkMode={darkMode} ops={ops} setOps={setOps} onNavigate={onNavigate}
          onFinish={(label, extra) => { finish(activeTask.id, label, extra); setOpenTask(null) }}
          onResolveChange={onResolveChange} onClose={() => setOpenTask(null)} />
      )}
    </Shell>
  )
}

// ── REVENUE ──
export function OwnerRevenuePage({ darkMode, onToggleDarkMode, onNavigate }) {
  const t = tk(darkMode)
  const srcTotal = REVENUE.sources.reduce((s, x) => s + x.value, 0)
  const cards = [
    { label: "Monthly revenue", value: "£25,300", Icon: Wallet, accent: GREEN, trend: 9 },
    { label: "Membership", value: "£16,200", Icon: Users, accent: GREEN, trend: 6 },
    { label: "Class packs", value: "£6,100", Icon: Calendar, accent: "#0ea5e9", trend: 14 },
    { label: "Retail", value: "£3,000", Icon: ArrowUpRight, accent: "#f59e0b", trend: 4 },
  ]
  return (
    <Shell>
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Overview")} backLabel="Overview"
        title="Revenue" sub="Where the money comes from" Icon={Wallet} gradient="linear-gradient(135deg,#00aa13,#14b8a6)" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {cards.map((c, i) => <div key={i} className="pop-in" style={{ animationDelay: `${i * 60}ms` }}><StatCard darkMode={darkMode} {...c} /></div>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className={`${t.card} p-5`}>
          <div className="flex items-center justify-between mb-1">
            <p className={`text-sm font-semibold ${t.heading}`}>Monthly revenue trend</p>
            <span className="text-xs font-semibold text-[#00aa13]">+39% YoY</span>
          </div>
          <p className={`text-3xl font-bold tracking-tight ${t.heading} mb-2`}>£25.3k <span className={`text-sm font-medium ${t.muted}`}>this month</span></p>
          <AreaTrend points={REVENUE.monthly} labels={REVENUE.monthLabels} valueFmt={v => `£${v}k`} darkMode={darkMode} color={GREEN} height={180} />
          <div className={`flex justify-between text-[10px] mt-1 ${t.muted}`}><span>Jul</span><span>Jun</span></div>
        </div>

        <div className={`${t.card} p-5`}>
          <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Revenue breakdown</p>
          <div className="flex items-center justify-center mb-4 relative">
            <Donut segments={REVENUE.sources} size={150} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-xl font-bold ${t.heading}`}>£25.3k</p>
              <p className={`text-[10px] ${t.faint}`}>total</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {REVENUE.sources.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                <span className={`text-sm flex-1 ${t.heading}`}>{s.label}</span>
                <span className={`text-xs ${t.muted}`}>{Math.round(s.value / srcTotal * 100)}%</span>
                <span className={`text-sm font-bold tabular-nums w-16 text-right ${t.heading}`}>£{(s.value / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ── CLASS PERFORMANCE ──
function OccRow({ c, darkMode }) {
  const t = tk(darkMode)
  const col = c.occ >= 85 ? GREEN : c.occ >= 60 ? "#f59e0b" : "#ef4444"
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3.5 ${t.subtle}`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${t.heading}`}>{c.name}</p>
        <p className={`text-xs ${t.muted}`}>{c.when} · {c.riders}</p>
        <div className={`h-2 rounded-full mt-2 ${darkMode ? "bg-gray-900" : "bg-white"} overflow-hidden`}>
          <div className="h-full rounded-full" style={{ width: `${c.occ}%`, background: col }} />
        </div>
      </div>
      <span className="text-lg font-bold tabular-nums w-12 text-right" style={{ color: col }}>{c.occ}%</span>
    </div>
  )
}
export function OwnerClassesPage({ darkMode, onToggleDarkMode, onNavigate, ops = EMPTY_OPS, setOps }) {
  const t = tk(darkMode)
  const [applying, setApplying] = useState(null)   // recommendation whose confirm dialog is open
  const appliedLabel = id => ops.done?.[id]
  function applyRec(r) {
    setOps?.(o => ({ ...o, done: { ...o.done, [r.id]: r.doneLabel }, events: [...o.events.filter(e => e.id !== r.id), { id: r.id, ...r.event }] }))
    setApplying(null)
  }
  return (
    <Shell>
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Overview")} backLabel="Overview"
        title="Class performance" sub="Occupancy, demand & quick wins" Icon={Activity} gradient="linear-gradient(135deg,#0ea5e9,#6366f1)" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <StatCard darkMode={darkMode} label="Avg occupancy" value="78%" Icon={Activity} accent="#0ea5e9" trend={4} />
        <StatCard darkMode={darkMode} label="Sold-out classes" value="23" Icon={Trophy} accent={GREEN} trend={6} />
        <StatCard darkMode={darkMode} label="Under 50% full" value="5" Icon={TrendingDown} accent="#ef4444" trend={-2} />
        <StatCard darkMode={darkMode} label="Waitlisted riders" value="61" Icon={Users} accent="#8b5cf6" trend={11} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className={`${t.card} p-5`}>
          <div className="flex items-center gap-2 mb-3"><span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: GREEN + "1a", color: GREEN }}><Trophy size={14} /></span><p className={`text-sm font-semibold ${t.heading}`}>Top performing</p></div>
          <div className="flex flex-col gap-2.5">{CLASS_TOP.map((c, i) => <OccRow key={i} c={c} darkMode={darkMode} />)}</div>
        </div>
        <div className={`${t.card} p-5`}>
          <div className="flex items-center gap-2 mb-3"><span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#ef44441a", color: "#ef4444" }}><TrendingDown size={14} /></span><p className={`text-sm font-semibold ${t.heading}`}>Needs attention</p></div>
          <div className="flex flex-col gap-2.5">{CLASS_LOW.map((c, i) => <OccRow key={i} c={c} darkMode={darkMode} />)}</div>
        </div>
      </div>

      <div className={`${t.card} p-5`}>
        <div className="flex items-center gap-2 mb-4"><span className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{ background: "#8b5cf6" }}><Sparkles size={13} /></span><p className={`text-sm font-semibold ${t.heading}`}>Recommendations</p></div>
        <div className="grid md:grid-cols-3 gap-3">
          {CLASS_RECS.map((r, i) => (
            <div key={i} className={`rounded-xl p-4 ${t.subtle} flex flex-col`}>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "#8b5cf61a", color: "#8b5cf6" }}><r.Icon size={16} /></span>
              <p className={`text-sm font-semibold ${t.heading}`}>{r.title}</p>
              <p className={`text-xs mt-1 flex-1 ${t.muted}`}>{r.detail}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-bold text-[#00aa13]">{r.uplift}</span>
                {appliedLabel(r.id)
                  ? <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: GREEN + "1a", color: GREEN }}><Check size={13} /> {appliedLabel(r.id)}</span>
                  : <button onClick={() => setApplying(r)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-90" style={{ background: GREEN }}>Apply</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {applying && (
        <OpsModal darkMode={darkMode} Icon={applying.Icon} color="#8b5cf6" title={applying.title} sub={`${applying.uplift} · ${applying.detail}`} onClose={() => setApplying(null)}
          footer={<>
            <button onClick={() => setApplying(null)} className={opsBtn("secondary", darkMode)}>Cancel</button>
            <button onClick={() => applyRec(applying)} className={opsBtn("primary", darkMode)}>{applying.action}</button>
          </>}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${t.muted}`}>What happens when you apply</p>
          <div className="flex flex-col gap-1.5">
            {applying.steps.map((s, i) => (
              <div key={s} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 ${t.subtle}`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: "#8b5cf6" }}>{i + 1}</span>
                <span className={`text-sm ${t.heading}`}>{s}</span>
              </div>
            ))}
          </div>
          <p className={`text-xs mt-3 ${t.muted}`}>It'll show on the Studio calendar on {opFmtDay(applying.event.date)} at {opFmtMin(applying.event.start)}.</p>
        </OpsModal>
      )}
    </Shell>
  )
}

// ── INSTRUCTOR PERFORMANCE ──
export function OwnerInstructorsPage({ darkMode, onToggleDarkMode, onNavigate }) {
  const t = tk(darkMode)
  const ranked = [...INSTRUCTOR_PERF].sort((a, b) => b.att - a.att)
  const popular = [...INSTRUCTOR_PERF].sort((a, b) => b.classes - a.classes)[0]
  const growing = [...INSTRUCTOR_PERF].sort((a, b) => b.growth - a.growth)[0]
  const rated = [...INSTRUCTOR_PERF].sort((a, b) => b.rating - a.rating)[0]
  const highlights = [
    { label: "Most popular", name: popular.name, meta: `${popular.classes} classes this month`, Icon: Trophy, c: "#f59e0b" },
    { label: "Fastest growing", name: growing.name, meta: `+${growing.growth}% riders`, Icon: TrendingUp, c: GREEN },
    { label: "Highest rated", name: rated.name, meta: `${rated.rating} ★ average`, Icon: Star, c: "#8b5cf6" },
  ]
  const metric = (label, val, col) => (
    <div className="flex-1 min-w-0">
      <p className={`text-[10px] ${t.muted}`}>{label}</p>
      <p className={`text-sm font-bold ${t.heading}`}>{val}</p>
      <div className={`h-1.5 rounded-full mt-1 ${darkMode ? "bg-gray-800" : "bg-gray-100"} overflow-hidden`}><div className="h-full rounded-full" style={{ width: `${typeof val === "string" && val.includes("%") ? parseInt(val) : 0}%`, background: col }} /></div>
    </div>
  )
  return (
    <Shell>
      <PageHead darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onBack={() => onNavigate("Overview")} backLabel="Overview"
        title="Instructor performance" sub="Who's driving attendance & loyalty" Icon={Award} gradient="linear-gradient(135deg,#8b5cf6,#6366f1)" />

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {highlights.map((h, i) => (
          <div key={i} className={`${t.card} p-4 flex items-center gap-3 pop-in`} style={{ animationDelay: `${i * 70}ms` }}>
            <span className="w-11 h-11 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: `linear-gradient(135deg,${h.c},${h.c}cc)` }}><h.Icon size={19} /></span>
            <div className="min-w-0">
              <p className={`text-[11px] font-semibold uppercase tracking-wider`} style={{ color: h.c }}>{h.label}</p>
              <p className={`text-base font-bold truncate ${t.heading}`}>{h.name}</p>
              <p className={`text-xs ${t.muted}`}>{h.meta}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${t.card} p-5`}>
        <p className={`text-sm font-semibold mb-4 ${t.heading}`}>Leaderboard</p>
        <div className="flex flex-col gap-2.5">
          {ranked.map((ins, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl p-3 ${t.subtle}`}>
              <span className={`text-sm font-bold w-5 text-center ${i < 3 ? "text-[#00aa13]" : t.muted}`}>{i + 1}</span>
              <Avatar name={ins.name} size={38} />
              <div className="w-28 flex-shrink-0 min-w-0">
                <p className={`text-sm font-semibold truncate ${t.heading}`}>{ins.name}</p>
                <p className={`text-xs ${t.muted}`}>{ins.classes} classes · <span className="text-[#00aa13] font-semibold">+{ins.growth}%</span></p>
              </div>
              <div className="hidden sm:flex items-center gap-4 flex-1">
                {metric("Attendance", `${ins.att}%`, GREEN)}
                {metric("Retention", `${ins.ret}%`, "#0ea5e9")}
                {metric("Repeat", `${ins.repeat}%`, "#8b5cf6")}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 w-14 justify-end">
                <Star size={13} className="text-amber-400 fill-amber-400" />
                <span className={`text-sm font-bold ${t.heading}`}>{ins.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
