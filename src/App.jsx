import React, { useState, useRef } from "react"
import { Home, Calendar, BookOpen, Bike, Trophy, User, Settings, LogOut,
  ChevronDown, LayoutDashboard, Users, ListMusic, SlidersHorizontal, BarChart3 } from "lucide-react"

// ─── DATA ───────────────────────────────────────────────────────────────────

const INSTRUCTOR_QUOTES = {
  "Anna Banana": [
    "Exciting session ahead — you are going to surprise yourself today.",
    "Every pedal stroke is a choice. Choose to be great.",
    "The only bad ride is the one you didn't show up for.",
    "You didn't come this far to only come this far.",
    "When your legs say stop, let your mind say more.",
  ],
  "Lemon Banana": [
    "Smooth is fast. Find your rhythm and let it carry you.",
    "Cadence is everything. Trust the tempo.",
    "Efficiency wins races. Spin easy, go faster.",
    "Keep it smooth. Power comes from technique, not force.",
  ],
  "Anya Banana": [
    "This is where you earn it. Don't you dare hold back.",
    "Comfortable is the enemy of progress.",
    "Pain is temporary. Your output is permanent.",
    "You've done harder things than this. Now prove it.",
  ],
  "Rob Banana": [
    "Feel the beat. Let the music do half the work.",
    "Rhythm isn't just in the music — it's in how you ride.",
    "Every beat is a cue. Every cue is your edge.",
    "Lock in. Sync up. Own the room.",
  ],
  "Liam Gallager": [
    "Light resistance, high cadence — that's where the magic lives.",
    "Spin faster than feels comfortable. That's the point.",
    "Your legs know how to do this. Stop interfering.",
    "Cadence is the one metric that never lies.",
  ],
  "Rio Banana": [
    "Steady wins. Consistent effort compounds over time.",
    "This is a tempo session — don't be a hero, be a metronome.",
    "Sustainable effort today means a stronger effort tomorrow.",
    "Hold the line. Every second you maintain this pace is a deposit.",
  ],
  "Max Lime": [
    "Threshold is uncomfortable by design. Stay with it.",
    "You're not tired. You're adapting. There's a difference.",
    "This is where fitness is made — not in the easy parts.",
    "Hold that power. You've built this. Now use it.",
  ],
  "Alex Papaya": [
    "Midday energy is real. Channel what's left of your morning.",
    "The lunchtime crowd always works harder. Prove it today.",
    "You swapped your lunch break for this. Make it worth it.",
  ],
  "Zen Kiwi": [
    "Breathe. This is recovery — not defeat.",
    "Zone 2 is where aerobic fitness is built. Respect the easy day.",
    "Let go of the leaderboard. Today is for the engine, not the ego.",
    "Soft effort, deep benefit. Trust the process.",
  ],
  "Inability Banana": [
    "I know the name doesn't inspire confidence. The session will.",
    "Doubt is just excitement with bad posture.",
    "Whatever you're thinking, pedal anyway.",
  ],
  "Clueless Banana": [
    "Not sure what the plan is — but we're going fast.",
    "Improvise. Adapt. Sprint.",
    "Confused? Good. That means something new is happening.",
  ],
  "Loopy Banana": [
    "Recovery is not optional. Recovery is the work.",
    "Low intensity today means high intensity tomorrow.",
    "Zone 2 is a superpower. Most people skip it. Don't.",
  ],
  "Alien Banana": [
    "Endurance is just suffering you've made peace with.",
    "The long game is the only game. Stay steady.",
    "Block by block. Minute by minute. That's how fitness is built.",
  ],
  "The Banana": [
    "Hills are where excuses go to die.",
    "Climb like you mean it. Rest when you're done.",
    "Every interval is negotiable. Your effort is not.",
  ],
  "Mariah Carey": [
    "We belong together — you, me, and this power output.",
    "All I want for Christmas is your personal best.",
    "Fantasy? No. This is your actual fitness. Embrace it.",
  ],
  _default: [
    "Show up. Push hard. Go again.",
    "The only rep that doesn't count is the one you don't do.",
    "Champions are built in sessions like this one.",
    "Leave it all on the bike.",
    "You came here for a reason. Honour it.",
  ],
}

function getInstructorQuote(instructor, seed = "") {
  const pool = INSTRUCTOR_QUOTES[instructor] || INSTRUCTOR_QUOTES._default
  const hash = [...(instructor + seed)].reduce((a, c) => a + c.charCodeAt(0), 0)
  return pool[hash % pool.length]
}

const upcomingsessions = [
  { day: "Today",    time: "19:00", name: "HIIT Ride",   instructor: "Lemon Banana", status: "cancelled" },
  { day: "Tomorrow", time: "09:00", name: "Easy Ride",   instructor: "Lemon Banana", status: "booked" },
  { day: "Sun",      time: "09:00", name: "Power Ride",  instructor: "Anya Banana",  status: "booked" },
  { day: "Sun",      time: "15:00", name: "Rhythm Ride", instructor: "Anya Banana",  status: "booked" },
]

const thisWeek = [
  { label: "Streak",      value: "3 weeks" },
  { label: "Energy",      value: "820 Wh"  },
  { label: "Ride time",   value: "2h 40m"  },
  { label: "Consistency", value: "83%"     },
]

const lastWeek = [
  { label: "Streak",      value: "3 weeks" },
  { label: "Energy",      value: "760 Wh"  },
  { label: "Ride time",   value: "2h 20m"  },
  { label: "Consistency", value: "75%"     },
]

const WEEK_DATA = {
  this: { ridesCompleted: 3, ridesPlanned: 4, energyWh: 820, rideTimeLabel: "2h 40m", consistencyPct: 83 },
  last: { ridesCompleted: 4, ridesPlanned: 4, energyWh: 760, rideTimeLabel: "2h 20m", consistencyPct: 75 },
}

const HEATMAP_DATA = {
  matrix: [[0,1,0,1,0,2,3],[0,0,1,0,0,1,1],[1,2,0,2,1,0,0]],
  attendancePct: 92,
  attendancePercentile: 8,
  avgBookingLeadDays: 2.4,
}

const HEATMAP_COLORS = ["#f1f4f7","rgba(21,193,95,.28)","rgba(21,193,95,.58)","#15c15f"]
const HEATMAP_DAYS   = ["M","T","W","T","F","S","S"]
const HEATMAP_ROWS   = ["AM","PM","Eve"]

const RIDER_PROFILE = {
  archetypeName: "Weekend Warrior",
  archetypeDescriptor: "Consistent, social, Sunday-loyal",
  traits: ["Rhythm Ride regular","Books 2.4d ahead","Peak · Sun 9am"],
}

const BOOKING_TODAY = "2026-02-26"

const sessionsByDate = {
  "2026-02-16": {
    morning:   [
      { time: "06:30", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 1", spaces: 0, state: "full"              },
      { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",     studio: "Studio 2", spaces: 3, state: "book"              },
    ],
    afternoon: [
      { time: "12:30", name: "Midday Burn",       instructor: "Alex Papaya",      studio: "Studio 1", spaces: 0, state: "waitlist", count: 2 },
    ],
    evening:   [
      { time: "19:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 2", spaces: 5, state: "book"              },
    ],
  },
  "2026-02-17": {
    morning:   [
      { time: "07:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "08:30", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 2", spaces: 0, state: "booked"            },
    ],
    afternoon: [],
    evening:   [
      { time: "18:30", name: "Threshold Push",    instructor: "Max Lime",         studio: "Studio 1", spaces: 2, state: "book"              },
      { time: "20:00", name: "Night Ride",        instructor: "Max Lime",         studio: "Studio 2", spaces: 0, state: "full"              },
    ],
  },
  "2026-02-18": {
    morning:   [],
    afternoon: [
      { time: "13:00", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 2", spaces: 0, state: "waitlist", count: 4 },
      { time: "16:30", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 1", spaces: 5, state: "book"              },
    ],
    evening:   [
      { time: "19:30", name: "HIIT Blast",        instructor: "Anya Banana",      studio: "Studio 2", spaces: 0, state: "waiting", position: 2 },
    ],
  },
  "2026-02-19": {
    morning:   [
      { time: "06:15", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "07:45", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 2", spaces: 0, state: "full"              },
      { time: "10:00", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 1", spaces: 6, state: "book"              },
    ],
    afternoon: [
      { time: "12:00", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 2", spaces: 3, state: "book"              },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 1", spaces: 4, state: "book"              },
    ],
  },
  "2026-02-20": {
    morning:   [
      { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 1", spaces: 0, state: "booked"            },
    ],
    afternoon: [],
    evening:   [
      { time: "17:30", name: "Power Ride",        instructor: "Anya Banana",      studio: "Studio 2", spaces: 2, state: "book"              },
      { time: "19:00", name: "HIIT Blast",        instructor: "Anna Banana",      studio: "Studio 1", spaces: 0, state: "full"              },
    ],
  },
  "2026-02-21": {
    morning:   [
      { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",       studio: "Studio 1", spaces: 0, state: "booked"            },
      { time: "10:30", name: "Endurance Builder", instructor: "Alien Banana",     studio: "Studio 2", spaces: 3, state: "book"              },
    ],
    afternoon: [
      { time: "14:00", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 1", spaces: 0, state: "full"              },
      { time: "15:30", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 2", spaces: 1, state: "book"              },
    ],
    evening:   [],
  },
  "2026-02-22": {
    morning:   [
      { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",     studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "11:00", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 2", spaces: 0, state: "full"              },
    ],
    afternoon: [
      { time: "15:00", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 1", spaces: 7, state: "book"              },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 2", spaces: 0, state: "waitlist", count: 3 },
    ],
  },
  "2026-02-23": {
    morning:   [
      { time: "06:15", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "06:30", name: "Rhythm Stat",       instructor: "Mariah Carey",     studio: "Studio 2", spaces: 5, state: "book"              },
      { time: "07:15", name: "Endurance Builder", instructor: "Alien Banana",     studio: "Studio 1", spaces: 0, state: "booked"            },
      { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 2", spaces: 5, state: "book"              },
      { time: "09:15", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 1", spaces: 0, state: "full"              },
      { time: "10:30", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 2", spaces: 5, state: "book"              },
    ],
    afternoon: [
      { time: "12:00", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 1", spaces: 0, state: "waiting", position: 3 },
      { time: "13:15", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 2", spaces: 0, state: "waitlist", count: 4   },
      { time: "16:00", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 2", spaces: 5, state: "book"              },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "19:30", name: "Night Ride",        instructor: "Max Lime",         studio: "Studio 2", spaces: 2, state: "book"              },
    ],
  },
  "2026-02-24": {
    morning:   [
      { time: "07:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",     studio: "Studio 2", spaces: 2, state: "book"              },
    ],
    afternoon: [
      { time: "12:30", name: "Midday Burn",       instructor: "Alex Papaya",      studio: "Studio 1", spaces: 3, state: "book"              },
      { time: "13:00", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 2", spaces: 0, state: "waitlist", count: 2 },
      { time: "15:30", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 1", spaces: 4, state: "book"              },
    ],
    evening:   [
      { time: "18:30", name: "Threshold Push",    instructor: "Max Lime",         studio: "Studio 1", spaces: 3, state: "book"              },
      { time: "20:00", name: "Night Ride",        instructor: "Max Lime",         studio: "Studio 2", spaces: 0, state: "full"              },
    ],
  },
  "2026-02-25": {
    morning:   [
      { time: "07:00", name: "Easy Endurance",    instructor: "Lemon Banana",     studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "08:30", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 2", spaces: 3, state: "book"              },
      { time: "10:00", name: "Endurance Builder", instructor: "Alien Banana",     studio: "Studio 1", spaces: 0, state: "full"              },
    ],
    afternoon: [
      { time: "12:30", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 2", spaces: 2, state: "book"              },
      { time: "14:00", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "16:00", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 2", spaces: 0, state: "waitlist", count: 2 },
    ],
    evening:   [
      { time: "17:30", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 1", spaces: 3, state: "book"              },
      { time: "18:45", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 2", spaces: 5, state: "book"              },
      { time: "20:00", name: "Threshold Push",    instructor: "Max Lime",         studio: "Studio 1", spaces: 0, state: "full"              },
    ],
  },
  "2026-02-26": {
    morning:   [
      { time: "06:15", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "07:45", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 2", spaces: 0, state: "full"              },
      { time: "10:00", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 1", spaces: 6, state: "book"              },
    ],
    afternoon: [
      { time: "12:00", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 2", spaces: 3, state: "book"              },
      { time: "16:30", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 1", spaces: 0, state: "booked"            },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "19:30", name: "HIIT Blast",        instructor: "Anya Banana",      studio: "Studio 2", spaces: 0, state: "waiting", position: 1 },
    ],
  },
  "2026-02-27": {
    morning:   [
      { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 1", spaces: 2, state: "book"              },
      { time: "09:30", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 2", spaces: 0, state: "booked"            },
    ],
    afternoon: [
      { time: "12:30", name: "Midday Burn",       instructor: "Alex Papaya",      studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "14:00", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 2", spaces: 0, state: "waitlist", count: 3 },
      { time: "16:00", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 1", spaces: 5, state: "book"              },
    ],
    evening:   [
      { time: "17:30", name: "Power Ride",        instructor: "Anya Banana",      studio: "Studio 2", spaces: 0, state: "full"              },
      { time: "19:00", name: "HIIT Blast",        instructor: "Anna Banana",      studio: "Studio 1", spaces: 3, state: "book"              },
    ],
  },
  "2026-02-28": {
    morning:   [
      { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",       studio: "Studio 1", spaces: 0, state: "booked"            },
      { time: "10:30", name: "Endurance Builder", instructor: "Alien Banana",     studio: "Studio 2", spaces: 2, state: "book"              },
    ],
    afternoon: [
      { time: "14:00", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 1", spaces: 0, state: "waitlist", count: 1 },
      { time: "15:30", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 2", spaces: 5, state: "book"              },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 1", spaces: 1, state: "book"              },
      { time: "19:30", name: "Threshold Push",    instructor: "Max Lime",         studio: "Studio 2", spaces: 3, state: "book"              },
      { time: "20:45", name: "Night Ride",        instructor: "Max Lime",         studio: "Studio 1", spaces: 0, state: "full"              },
    ],
  },
  "2026-03-01": {
    morning:   [
      { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",     studio: "Studio 1", spaces: 4, state: "book"              },
      { time: "11:00", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 2", spaces: 0, state: "full"              },
    ],
    afternoon: [
      { time: "12:30", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 2", spaces: 4, state: "book"              },
      { time: "14:00", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 1", spaces: 0, state: "full"              },
      { time: "15:00", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 1", spaces: 3, state: "book"              },
    ],
    evening:   [
      { time: "17:30", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 2", spaces: 2, state: "book"              },
      { time: "19:00", name: "Rhythm Ride",       instructor: "Rob Banana",       studio: "Studio 1", spaces: 0, state: "waitlist", count: 2 },
      { time: "20:15", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 2", spaces: 4, state: "book"              },
    ],
  },
  "2026-03-02": {
    morning:   [
      { time: "06:30", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 1", spaces: 5, state: "book"              },
      { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 2", spaces: 0, state: "full"              },
    ],
    afternoon: [
      { time: "12:00", name: "Lunch Sprint",      instructor: "Clueless Banana",  studio: "Studio 1", spaces: 2, state: "book"              },
      { time: "16:00", name: "Power Tempo",       instructor: "Anna Banana",      studio: "Studio 2", spaces: 0, state: "waitlist", count: 3 },
    ],
    evening:   [
      { time: "18:30", name: "HIIT Blast",        instructor: "Anya Banana",      studio: "Studio 1", spaces: 4, state: "book"              },
    ],
  },
  "2026-03-03": {
    morning:   [
      { time: "07:00", name: "Endurance Builder", instructor: "Alien Banana",     studio: "Studio 2", spaces: 3, state: "book"              },
    ],
    afternoon: [],
    evening:   [
      { time: "19:00", name: "Night Ride",        instructor: "Max Lime",         studio: "Studio 1", spaces: 0, state: "booked"            },
      { time: "20:15", name: "Recovery Ride",     instructor: "Loopy Banana",     studio: "Studio 2", spaces: 5, state: "book"              },
    ],
  },
  "2026-03-04": { morning: [], afternoon: [], evening: [] },
  "2026-03-05": {
    morning:   [
      { time: "06:15", name: "Climb Intervals",   instructor: "The Banana",       studio: "Studio 1", spaces: 0, state: "full"              },
      { time: "09:00", name: "Tempo Foundation",  instructor: "Rio Banana",       studio: "Studio 2", spaces: 4, state: "book"              },
    ],
    afternoon: [
      { time: "13:30", name: "Core + Ride",       instructor: "Inability Banana", studio: "Studio 1", spaces: 0, state: "waiting", position: 4 },
    ],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 2", spaces: 2, state: "book"              },
      { time: "19:30", name: "Threshold Push",    instructor: "Max Lime",         studio: "Studio 1", spaces: 0, state: "full"              },
    ],
  },
  "2026-03-06": {
    morning:   [
      { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",    studio: "Studio 1", spaces: 3, state: "book"              },
    ],
    afternoon: [
      { time: "12:00", name: "Midday Burn",       instructor: "Alex Papaya",      studio: "Studio 2", spaces: 5, state: "book"              },
    ],
    evening:   [
      { time: "17:30", name: "Power Ride",        instructor: "Anya Banana",      studio: "Studio 1", spaces: 0, state: "waitlist", count: 2 },
      { time: "19:00", name: "HIIT Blast",        instructor: "Anna Banana",      studio: "Studio 2", spaces: 1, state: "book"              },
    ],
  },
  "2026-03-07": {
    morning:   [
      { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",       studio: "Studio 1", spaces: 0, state: "booked"            },
      { time: "10:30", name: "Sunrise Power",     instructor: "Anna Banana",      studio: "Studio 2", spaces: 2, state: "book"              },
    ],
    afternoon: [],
    evening:   [
      { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",         studio: "Studio 1", spaces: 4, state: "book"              },
    ],
  },
}

function getWeekDates(weekOffset) {
  const base = new Date(2026, 1, 23) // Mon Feb 23 = week 0
  const start = new Date(base)
  start.setDate(start.getDate() + weekOffset * 7)
  const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
    return { dateStr: ds, dayLabel: DAYS[i], dayNum: d.getDate(), monthShort: MONTHS[d.getMonth()] }
  })
}

function weekRangeLabel(dates) {
  const a = dates[0], b = dates[6]
  return a.monthShort === b.monthShort
    ? `${a.monthShort} ${a.dayNum} – ${b.dayNum}`
    : `${a.monthShort} ${a.dayNum} – ${b.monthShort} ${b.dayNum}`
}

function getMonthGrid(year, month) {
  const firstDay    = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startCol    = (firstDay.getDay() + 6) % 7 // Mon=0
  const cells = []
  for (let i = 0; i < startCol; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function weekOffsetForDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const base   = new Date(2026, 1, 23)
  const target = new Date(y, m - 1, d)
  return Math.floor((target - base) / (7 * 86400000))
}

function sessionCount(dateStr) {
  const d = sessionsByDate[dateStr]
  if (!d) return 0
  return (d.morning?.length || 0) + (d.afternoon?.length || 0) + (d.evening?.length || 0)
}

const intensityData = [2, 4, 3, 7, 9, 8, 6, 5, 8, 7, 4, 3]

const BOOKING_INSIGHTS = {
  "Sunrise Power":     { pos: "2 / 18", trend: "+5% → 1st place",   cadence: "88 rpm", energy: "1.5 kWh" },
  "Rhythm Ride":       { pos: "4 / 18", trend: "+3% → 3rd place",   cadence: "85 rpm", energy: "1.4 kWh" },
  "Cadence Control":   { pos: "4 / 22", trend: "+2% → 3rd place",   cadence: "96 rpm", energy: "1.3 kWh" },
  "Climb Intervals":   { pos: "5 / 16", trend: "+6% → 3rd place",   cadence: "72 rpm", energy: "1.6 kWh" },
  "Tempo Foundation":  { pos: "6 / 18", trend: "+3% → 5th place",   cadence: "90 rpm", energy: "1.3 kWh" },
  "HIIT Blast":        { pos: "3 / 16", trend: "+8% → 2nd place",   cadence: "104 rpm", energy: "1.8 kWh" },
  "Threshold Push":    { pos: "3 / 18", trend: "+2% → 2nd place",   cadence: "87 rpm", energy: "1.5 kWh" },
  "Power Tempo":       { pos: "7 / 20", trend: "+4% → top half",    cadence: "82 rpm", energy: "1.2 kWh" },
  "Evening Flow":      { pos: "9 / 20", trend: "Recovery intent",   cadence: "76 rpm", energy: "1.0 kWh" },
  "Easy Endurance":    { pos: "12 / 20", trend: "Zone 2 maintained", cadence: "82 rpm", energy: "0.9 kWh" },
  "Recovery Ride":     { pos: "15 / 20", trend: "Recovery intent",  cadence: "68 rpm", energy: "0.8 kWh" },
  "Midday Burn":       { pos: "5 / 18", trend: "+4% → 4th place",   cadence: "88 rpm", energy: "1.4 kWh" },
  "Night Ride":        { pos: "8 / 16", trend: "+2% → 6th place",   cadence: "86 rpm", energy: "1.2 kWh" },
  "Endurance Builder": { pos: "6 / 24", trend: "+3% → 5th place",   cadence: "80 rpm", energy: "1.2 kWh" },
  "Lunch Sprint":      { pos: "4 / 14", trend: "+7% → 3rd place",   cadence: "102 rpm", energy: "1.7 kWh" },
  "Power Ride":        { pos: "5 / 20", trend: "+4% → 4th place",   cadence: "84 rpm", energy: "1.3 kWh" },
}
function getBookingInsight(name) { return BOOKING_INSIGHTS[name] || { pos: "4 / 18", trend: "+3% → 3rd place", cadence: "82 rpm", energy: "1.2 kWh" } }

const bikes = [
  [1,  2,  3,  4,  5,  6,  7,  8],
  [9,  10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23, 24],
]

const STUDIO_LAYOUTS = {
  "Studio 1": {
    rows: [[1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16],[17,18,19,20,21,22,23,24]],
    label: "3 rows · 24 bikes",
  },
  "Studio 2": {
    rows: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20]],
    label: "4 rows · 20 bikes",
  },
}

const calendarSessions = {
  2:  [{ time: "09:00", name: "Power Ride",      instructor: "Anna Banana",     status: "booked"    }],
  3:  [{ time: "09:00", name: "Rhythm Ride",     instructor: "Rob Banana",      status: "booked"    }, { time: "18:00", name: "Evening Flow", instructor: "Zen Kiwi", status: "booked" }],
  5:  [{ time: "12:00", name: "Lunch Sprint",    instructor: "Clueless Banana", status: "booked"    }],
  6:  [{ time: "08:00", name: "Cadence Control", instructor: "Liam Gallager",   status: "booked"    }, { time: "19:00", name: "Night Ride",  instructor: "Max Lime", status: "booked" }],
  8:  [{ time: "09:00", name: "Easy Ride",       instructor: "Lemon Banana",    status: "booked"    }, { time: "15:00", name: "Tempo Burn",  instructor: "Anna Banana", status: "booked" }],
  10: [{ time: "07:00", name: "Morning Burn",    instructor: "Alex Papaya",     status: "booked"    }],
  12: [{ time: "09:00", name: "Sunrise Power",   instructor: "Anna Banana",     status: "booked"    }],
  14: [{ time: "18:00", name: "Evening Flow",    instructor: "Zen Kiwi",        status: "booked"    }],
  15: [{ time: "09:00", name: "Power Ride",      instructor: "Anna Banana",     status: "booked"    }, { time: "11:00", name: "Rhythm Ride", instructor: "Anya Banana", status: "booked" }, { time: "15:00", name: "Tempo Burn", instructor: "Anna Banana", status: "booked" }],
  17: [{ time: "09:00", name: "Rhythm Ride",     instructor: "Anya Banana",     status: "booked"    }, { time: "17:00", name: "Power Tempo", instructor: "Anna Banana", status: "booked" }],
  19: [{ time: "12:00", name: "Lunch Sprint",    instructor: "Clueless Banana", status: "booked"    }],
  22: [{ time: "09:00", name: "Easy Ride",       instructor: "Lemon Banana",    status: "booked"    }],
  23: [{ time: "09:00", name: "Morning Burn",    instructor: "Alex Papaya",     status: "booked"    }],
  24: [{ time: "09:00", name: "Tempo Burn",      instructor: "Anna Banana",     status: "booked"    }],
  26: [{ time: "17:00", name: "Power Ride",      instructor: "Anna Banana",     status: "cancelled" }, { time: "18:00", name: "Rhythm Ride", instructor: "Rob Banana", status: "booked" }, { time: "20:00", name: "Recovery Ride", instructor: "Loopy Banana", status: "booked" }],
  27: [{ time: "09:00", name: "Sunrise Power",   instructor: "Anna Banana",     status: "booked"    }],
  28: [{ time: "15:00", name: "Tempo Burn",      instructor: "Anna Banana",     status: "booked"    }, { time: "19:00", name: "Night Ride", instructor: "Max Lime", status: "booked" }, { time: "20:00", name: "Recovery Ride", instructor: "Loopy Banana", status: "booked" }],
}

const ridesData = [
  // ─── Feb 2026 ───────────────────────────────────────────────────────────
  {
    name: "Threshold Push",   date: "Mon 24 Feb", dateIso: "2026-02-24", time: "18:30 – 19:15", duration: 45, intensityLevel: 3,
    instructor: "Max Lime",        studio: "Studio 1", bike: 7,
    position: 2,  total: 18, cadence: 87, peakCadence: 102, energy: 1.6, avgPower: 94,  maxPower: 147,
    badges: ["Personal best", "Top 10%"],
    insight: "Your strongest ride to date. You held threshold power across both sustained blocks and posted a new personal best output. The 2nd place finish in a field of 18 puts you firmly in the top 10% — a result that reflects weeks of consistent training.",
    vsLastRide: "+0.3 kWh vs previous",
    vsPB: "New personal best output",
    classAvg: { cadence: 81, energy: 1.2 },
  },
  {
    name: "Cadence Control",  date: "Mon 24 Feb", time: "07:00 – 07:45", instructor: "Liam Gallager",   studio: "Studio 1", bike: 11,
    position: 4,  total: 22, cadence: 84, peakCadence: 118, energy: 1.3, avgPower: 82,  maxPower: 131,
    badges: ["Top 10%"],
    insight: "Excellent cadence work. You sustained above 100 rpm through all pyramid sets without bouncing — a sign of genuine improvement in pedalling efficiency. 4th in a class of 22 puts you in the top 18%, your best cadence session finish.",
    vsLastRide: "+0.1 kWh vs previous",
    vsPB: "Best cadence session finish",
    classAvg: { cadence: 77, energy: 1.0 },
  },
  {
    name: "Evening Flow",     date: "Sun 23 Feb", time: "18:00 – 18:45", instructor: "Zen Kiwi",        studio: "Studio 1", bike: 14,
    position: 9,  total: 20, cadence: 76, peakCadence: 94,  energy: 1.0, avgPower: 68,  maxPower: 98,
    badges: [],
    insight: "A solid recovery ride after the morning session. Heart rate stayed in zone 2 for the full duration, which is exactly the target for a flow class. Your 9th place finish is appropriate — this isn't a competition day, it's an investment in tomorrow.",
    vsLastRide: "–0.3 kWh (recovery intent)",
    vsPB: "Consistent with flow ride average",
    classAvg: { cadence: 74, energy: 0.9 },
  },
  {
    name: "Endurance Builder", date: "Sun 23 Feb", time: "07:15 – 08:00", instructor: "Alien Banana",   studio: "Studio 1", bike: 3,
    position: 6,  total: 24, cadence: 80, peakCadence: 96,  energy: 1.2, avgPower: 76,  maxPower: 118,
    badges: ["Top 25%"],
    insight: "Steady progressive effort across all three blocks. Your cadence remained consistent throughout — no fade in the final 14-minute block, which is the true test of this session. 6th in 24 is a solid top-25% result.",
    vsLastRide: "+0.2 kWh vs previous",
    vsPB: "2nd best endurance output",
    classAvg: { cadence: 79, energy: 1.1 },
  },
  {
    name: "Recovery Ride",    date: "Sat 22 Feb", time: "15:00 – 15:45", instructor: "Loopy Banana",    studio: "Studio 1", bike: 19,
    position: 15, total: 20, cadence: 68, peakCadence: 82,  energy: 0.8, avgPower: 52,  maxPower: 78,
    badges: [],
    insight: "Recovery done right. Position 15 is perfectly appropriate here — intensity was kept low throughout, which is the goal. Your heart rate recovered 22 bpm in the final 10 minutes. The body needs this as much as the hard sessions.",
    vsLastRide: "–0.4 kWh (recovery intent)",
    vsPB: "Consistent recovery ride output",
    classAvg: { cadence: 70, energy: 0.8 },
  },
  {
    name: "Easy Endurance",   date: "Sat 22 Feb", time: "09:00 – 09:45", instructor: "Lemon Banana",    studio: "Studio 1", bike: 6,
    position: 12, total: 20, cadence: 72, peakCadence: 88,  energy: 0.9, avgPower: 64,  maxPower: 96,
    badges: [],
    insight: "Good aerobic base work. You stayed in zone 2 for the full 30-minute endurance block, which is exactly the target. Cadence was slightly below your usual — worth focusing on next time to unlock more efficiency at low intensity.",
    vsLastRide: "–0.1 kWh vs previous",
    vsPB: "Consistent with aerobic average",
    classAvg: { cadence: 76, energy: 0.9 },
  },
  {
    name: "Rhythm Ride",      date: "Fri 21 Feb", time: "09:00 – 09:45", instructor: "Rob Banana",      studio: "Studio 1", bike: 9,
    position: 4,  total: 18, cadence: 85, peakCadence: 108, energy: 1.4, avgPower: 86,  maxPower: 128,
    badges: ["Top 10%", "Top cadence"],
    insight: "One of your best rhythm performances. You matched the beat consistently across both cadence blocks and posted your highest cadence for this session type — 108 rpm peak. 4th in 18 is top 22%, and you were the highest average cadence in the class.",
    vsLastRide: "+0.5 kWh vs previous",
    vsPB: "Best rhythm ride output",
    classAvg: { cadence: 79, energy: 1.1 },
  },
  {
    name: "Cadence Control",  date: "Thu 20 Feb", time: "08:00 – 08:45", instructor: "Liam Gallager",   studio: "Studio 1", bike: 16,
    position: 11, total: 22, cadence: 77, peakCadence: 103, energy: 1.0, avgPower: 72,  maxPower: 119,
    badges: [],
    insight: "A solid baseline session. Peak cadence of 103 shows you have the fast-twitch capability — the ongoing work is building sustained efficiency at those speeds. Middle of the pack today, but the trajectory is clearly upward.",
    vsLastRide: "–0.4 kWh vs previous",
    vsPB: "Building towards personal best",
    classAvg: { cadence: 75, energy: 0.9 },
  },
  {
    name: "Sunrise Power",    date: "Wed 19 Feb", time: "06:15 – 07:00", instructor: "Anna Banana",     studio: "Studio 1", bike: 5,
    position: 2,  total: 18, cadence: 88, peakCadence: 114, energy: 1.5, avgPower: 91,  maxPower: 143,
    badges: ["Top 10%", "First class"],
    insight: "Exceptional early morning output. 2nd in a field of 18 on a power-focused session at 6am is a standout result. Sprint peak power was 43% above your average output — the strength work is paying off. First time attending this class, first time in the top 10%.",
    vsLastRide: "+0.5 kWh vs previous",
    vsPB: "Joint personal best sprint output",
    classAvg: { cadence: 82, energy: 1.2 },
  },
  {
    name: "Power Tempo",      date: "Tue 18 Feb", time: "16:30 – 17:15", instructor: "Anna Banana",     studio: "Studio 1", bike: 12,
    position: 7,  total: 20, cadence: 81, peakCadence: 101, energy: 1.2, avgPower: 79,  maxPower: 122,
    badges: [],
    insight: "Consistent tempo work throughout. The power surges were well-timed with the instructor's cues, and — crucially — you maintained your tempo baseline between efforts rather than dropping off. That last point is the real sign of improving fitness.",
    vsLastRide: "–0.3 kWh vs previous",
    vsPB: "3rd best power tempo output",
    classAvg: { cadence: 80, energy: 1.1 },
  },
  {
    name: "Threshold Push",   date: "Mon 17 Feb", time: "18:30 – 19:15", instructor: "Max Lime",        studio: "Studio 1", bike: 7,
    position: 3,  total: 18, cadence: 86, peakCadence: 104, energy: 1.5, avgPower: 92,  maxPower: 139,
    badges: ["Top 10%"],
    insight: "Strong threshold blocks on both efforts. You held 95–100% FTP across 23 minutes of total threshold time, with barely any cadence drop in the second block. 3rd place validates the fitness development you've been building through February.",
    vsLastRide: "+0.3 kWh vs previous",
    vsPB: "Second best energy output",
    classAvg: { cadence: 81, energy: 1.2 },
  },
  {
    name: "Evening Flow",     date: "Sun 16 Feb", time: "19:00 – 19:45", instructor: "Zen Kiwi",        studio: "Studio 2", bike: 20,
    position: 8,  total: 20, cadence: 79, peakCadence: 96,  energy: 1.1, avgPower: 70,  maxPower: 104,
    badges: [],
    insight: "Good first session of the February training block. Smooth cadence throughout, stayed in zone 2 as targeted. 8th in the class is a solid starting point — this ride is the baseline against which all your February progress will be measured.",
    vsLastRide: "First ride of the block",
    vsPB: "Baseline established",
    classAvg: { cadence: 75, energy: 0.9 },
  },
]

const RIDE_BADGES = {
  "Personal best": { colors: ["#F0C040", "#7A4800"], icon: "🏆", label: "Personal Best" },
  "Top 5%":        { colors: ["#B050F8", "#280860"], icon: "⚡", label: "Top 5%"        },
  "Top 10%":       { colors: ["#28D870", "#083A20"], icon: "⭐", label: "Top 10%"       },
  "Top 25%":       { colors: ["#A8B0C0", "#485060"], icon: "✓",  label: "Top 25%"       },
  "First class":   { colors: ["#2888F8", "#081840"], icon: "🌟", label: "First Class"   },
  "Top cadence":   { colors: ["#28D8E8", "#081E52"], icon: "💨", label: "Top Cadence"   },
}

function positionTier(pos, total) {
  const pct = pos / total
  if (pct <= 0.10) return { color: "#00aa13", tier: "Top 10%"  }
  if (pct <= 0.25) return { color: "#F59E0B", tier: "Top 25%"  }
  if (pct <= 0.50) return { color: "#3B82F6", tier: "Top half" }
  return { color: null, tier: null }
}

const achievements = [
  // Earned
  { name: "Top 10%",          icon: "⭐", progress: 1,  total: 1,  unit: "",              earned: true,  description: "Finished in the top 10% on a ride" },
  { name: "Perfect Week",     icon: "📅", progress: 1,  total: 1,  unit: "",              earned: true,  description: "Rode every day for a full week" },
  // In progress
  { name: "8 Week Streak",    icon: "🔥", progress: 4,  total: 8,  unit: "weeks",         earned: false, description: "Ride consistently for 8 weeks in a row" },
  { name: "25 Rides",         icon: "🚴", progress: 14, total: 25, unit: "rides",         earned: false, description: "Complete 25 total rides" },
  { name: "Early Bird",       icon: "🌅", progress: 3,  total: 5,  unit: "6am rides",     earned: false, description: "Complete 5 rides before 6am" },
  { name: "Energy Master",    icon: "⚡", progress: 8,  total: 10, unit: "kWh",           earned: false, description: "Burn 10 kWh across all rides" },
  // Locked — not yet started
  { name: "Streak Collector", icon: "📈", progress: 0,  total: 5,  unit: "streaks",       earned: false, description: "Revisit 5 past rides and review your stats to collect streaks. Open any ride in your history to start." },
  { name: "50 Rides",         icon: "🏅", progress: 0,  total: 50, unit: "rides",         earned: false, description: "Complete 50 total rides" },
  { name: "Top 5%",           icon: "💎", progress: 0,  total: 1,  unit: "",              earned: false, description: "Finish in the top 5% on any ride" },
  { name: "Century Club",     icon: "💯", progress: 0,  total: 100, unit: "hours",        earned: false, description: "Accumulate 100 total ride hours" },
  { name: "Night Rider",      icon: "🌙", progress: 0,  total: 5,  unit: "late rides",    earned: false, description: "Complete 5 rides starting after 8pm" },
  { name: "Power House",      icon: "💪", progress: 0,  total: 3,  unit: "personal bests",earned: false, description: "Set a new personal best output 3 times" },
  { name: "Weekend Warrior",  icon: "🎯", progress: 0,  total: 10, unit: "weekend rides", earned: false, description: "Complete 10 rides on a weekend" },
  { name: "Data Explorer",    icon: "🔍", progress: 0,  total: 10, unit: "ride reviews",  earned: false, description: "Open and review your stats on 10 past rides" },
]

// ─── FTP ZONES ──────────────────────────────────────────────────────────────

const FTP_ZONES = [
  { color: "#36aee2", height: 18  }, // 0-55% FTP
  { color: "#82ed3c", height: 44  }, // 56-75% FTP
  { color: "#fde53d", height: 55  }, // 76-90% FTP
  { color: "#fb7512", height: 65  }, // 91-105% FTP
  { color: "#e91236", height: 75  }, // 106-120% FTP
  { color: "#741a10", height: 90  }, // 121-149% FTP
  { color: "#6c3d84", height: 100 }, // 150+% FTP
]

function getFTPZone(v) {
  if (v <= 1) return FTP_ZONES[0]
  if (v <= 3) return FTP_ZONES[1]
  if (v <= 4) return FTP_ZONES[2]
  if (v <= 5) return FTP_ZONES[3]
  if (v <= 7) return FTP_ZONES[4]
  if (v <= 8) return FTP_ZONES[5]
  return FTP_ZONES[6]
}

// ─── SMALL COMPONENTS ───────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (status === "cancelled")
    return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />Cancelled</span>
  if (status === "booked")
    return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aa13]"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13] flex-shrink-0" />Booked</span>
  return null
}

function NavItem({ label, icon: Icon, active, onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-3 justify-center lg:justify-start px-2 lg:px-3 py-2 rounded-lg text-sm w-full text-left transition-colors border-l-2
        ${active
          ? "font-medium border-[#00aa13] bg-[#e6f9e8] text-[#00aa13]"
          : darkMode
            ? "text-gray-400 hover:bg-gray-800 border-transparent"
            : "text-gray-400 hover:bg-gray-50 border-transparent"
        }`}
    >
      <Icon size={15} />
      <span className="hidden lg:block">{label}</span>
    </button>
  )
}

function NavSection({ title, icon: Icon, items, activePage, onSelect, darkMode, open, onToggle }) {
  const hasActive = items.some(it => it.label === activePage)
  return (
    <div>
      <button onClick={onToggle} title={title}
        className={`flex items-center gap-2 justify-center lg:justify-start px-2 lg:px-3 py-2 rounded-lg w-full text-left transition-colors
          ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
        <Icon size={15} className={hasActive ? "text-[#00aa13]" : darkMode ? "text-gray-300" : "text-gray-600"} />
        <span className={`hidden lg:block flex-1 text-xs font-semibold uppercase tracking-wider ${hasActive ? "text-[#00aa13]" : darkMode ? "text-gray-300" : "text-gray-600"}`}>{title}</span>
        <ChevronDown size={13} className={`hidden lg:block transition-transform ${open ? "rotate-180" : ""} ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5 mt-0.5 lg:pl-2">
          {items.map(item => (
            <NavItem key={item.label} label={item.label} icon={item.icon}
              active={activePage === item.label} onClick={() => onSelect(item.label)} darkMode={darkMode} />
          ))}
        </div>
      )}
    </div>
  )
}

function badgeStyle(badge) {
  if (badge === "Personal best") return "bg-green-50 text-[#00aa13] border border-[#00aa13]"
  if (badge === "First class")   return "bg-blue-50 text-blue-600 border border-blue-200"
  if (badge === "Top 10%")       return "bg-yellow-50 text-yellow-600 border border-yellow-200"
  return ""
}

function achGradient(name) {
  const g = {
    "8 Week Streak":    ["#FF5A6A", "#7A0A18"],
    "25 Rides":         ["#5888FF", "#0A1A6A"],
    "Top 10%":          ["#F0C040", "#7A4800"],
    "Early Bird":       ["#FF5090", "#7A0A3A"],
    "Energy Master":    ["#28B8F0", "#083060"],
    "Perfect Week":     ["#28D870", "#083A20"],
    "Streak Collector": ["#28D8E8", "#081E52"],
    "50 Rides":         ["#F09030", "#6A2008"],
    "Top 5%":           ["#B050F8", "#280860"],
    "Century Club":     ["#F03030", "#580808"],
    "Night Rider":      ["#5068F8", "#080E40"],
    "Power House":      ["#F04030", "#580808"],
    "Weekend Warrior":  ["#2888F8", "#081840"],
    "Data Explorer":    ["#28D898", "#083028"],
  }
  return g[name] || ["#28D870", "#083A20"]
}

function PremiumBadge({ icon, colors, size = 56, earned = true, darkMode = false }) {
  const [c1, c2] = colors
  const ring = Math.max(2, Math.round(size * 0.045))

  if (!earned) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        padding: ring,
        background: darkMode
          ? "linear-gradient(145deg, #3A3F4B 0%, #1E2330 60%, #161A24 100%)"
          : "linear-gradient(145deg, #D8DCE2 0%, #BCC1CA 50%, #A8ADB6 100%)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}>
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: darkMode ? "#1A1F2B" : "#E8EAED",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: size * 0.40, opacity: 0.20, filter: "grayscale(1)", lineHeight: 1 }}>{icon}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      padding: ring,
      background: "linear-gradient(145deg, #F8E878 0%, #D4A018 35%, #8B6000 65%, #C8980C 100%)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10)",
    }}>
      <div style={{
        width: "100%", height: "100%", borderRadius: "50%",
        background: c1,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "linear-gradient(170deg, rgba(255,255,255,0.28) 0%, transparent 48%)",
          pointerEvents: "none",
        }} />
        <span style={{ fontSize: size * 0.42, lineHeight: 1 }}>{icon}</span>
      </div>
    </div>
  )
}

// ─── AUTH PAGE ──────────────────────────────────────────────────────────────

function AuthPage({ onAuth }) {
  const [mode, setMode]         = useState("login")   // "login" | "signup"
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [name, setName]         = useState("")
  const [confirm, setConfirm]   = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  function submit(e) {
    e.preventDefault()
    setError("")
    if (mode === "signup" && password !== confirm) { setError("Passwords don't match."); return }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onAuth() }, 800)
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00aa13] focus:border-transparent transition"

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 bg-gray-900 p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-xl bg-[#00aa13] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">SpinOut</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Every ride<br />counts.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Track your performance, book classes and push your limits — all in one place.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {[
            { icon: "⭐", title: "Performance tracking",    sub: "Position, cadence, energy and zone accuracy per ride" },
            { icon: "📅", title: "Smart booking",           sub: "Book, waitlist and manage classes from your schedule" },
            { icon: "🏆", title: "Goals & achievements",    sub: "Earn badges and track fitness scores over time" },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
              <div>
                <p className="text-white text-sm font-semibold">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-snug">{f.sub}</p>
              </div>
            </div>
          ))}
          <p className="text-gray-600 text-xs mt-4">SpinOut · Hampstead, London</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">

        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-10 lg:hidden">
          <div className="w-8 h-8 rounded-xl bg-[#00aa13] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">SpinOut</span>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {mode === "login" ? "Sign in to your SpinOut account" : "Join SpinOut in Hampstead, London"}
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
                <input value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Jamie Smith" className={inputCls} />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com" className={inputCls} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-[#00aa13] font-medium hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" className={inputCls} />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm password</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  placeholder="••••••••" className={inputCls} />
              </div>
            )}

            {mode === "login" && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#00aa13] accent-[#00aa13]" />
                <span className="text-sm text-gray-600">Keep me signed in</span>
              </label>
            )}

            {mode === "signup" && (
              <p className="text-xs text-gray-500 leading-relaxed">
                By creating an account you agree to our{" "}
                <button type="button" className="text-[#00aa13] font-medium hover:underline">Terms of Service</button>
                {" "}and{" "}
                <button type="button" className="text-[#00aa13] font-medium hover:underline">Privacy Policy</button>.
                Your data is handled in accordance with GDPR.
              </p>
            )}

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00aa13] hover:bg-[#008a0f] text-white font-semibold text-sm transition-colors mt-1 disabled:opacity-60">
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social login */}
          <button className="w-full py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          {/* Toggle mode */}
          <p className="text-sm text-gray-500 text-center mt-7">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}
              className="text-[#00aa13] font-semibold hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

const RIDER_NAV = [
  { label: "Home",         icon: Home      },
  { label: "Calendar",     icon: Calendar  },
  { label: "Bookings",     icon: BookOpen  },
  { label: "Rides",        icon: Bike      },
  { label: "Achievements", icon: Trophy    },
]

const INSTRUCTOR_NAV = [
  { label: "Studio Home",   icon: LayoutDashboard   },
  { label: "My Classes",    icon: Users             },
  { label: "Class Builder", icon: SlidersHorizontal },
  { label: "Insights",      icon: BarChart3         },
]

export default function App() {
  const [activePage, setActivePage] = useState("Home")
  const [darkMode, setDarkMode]     = useState(false)
  const [authed, setAuthed]         = useState(false)
  const [openSections, setOpenSections] = useState({ rider: true, instructor: false })
  const [rosterClass, setRosterClass]   = useState(null)

  if (!authed) return <AuthPage onAuth={() => setAuthed(true)} />

  const bottomItems = [
    { label: "Profile",  icon: User     },
    { label: "Settings", icon: Settings },
    { label: "Log out",  icon: LogOut   },
  ]

  const isInstructorPage = INSTRUCTOR_NAV.some(n => n.label === activePage)
  const mobileNav = isInstructorPage ? INSTRUCTOR_NAV : RIDER_NAV

  function openRoster(cls) { setRosterClass(cls); setActivePage("My Classes") }
  function navTo(page) { setRosterClass(null); setActivePage(page) }

  const toggle = key => setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const dm = () => setDarkMode(!darkMode)

  return (
    <div className={`flex h-screen font-sans transition-colors ${darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* ── Sidebar (hidden on mobile, icon-only on md, full on lg) ── */}
      <aside className={`hidden md:flex md:w-16 lg:w-48 border-r flex-col py-6 px-3 flex-shrink-0 transition-all
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>

        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start lg:px-3 mb-6 gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00aa13] flex items-center justify-center flex-shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </div>
          <p className={`hidden lg:block font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>SpinOut</p>
        </div>

        {/* Workspaces */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          <NavSection title="Rider" icon={Bike} items={RIDER_NAV}
            activePage={activePage} onSelect={navTo} darkMode={darkMode}
            open={openSections.rider} onToggle={() => toggle("rider")} />
          <NavSection title="Instructor" icon={LayoutDashboard} items={INSTRUCTOR_NAV}
            activePage={activePage} onSelect={navTo} darkMode={darkMode}
            open={openSections.instructor} onToggle={() => toggle("instructor")} />
        </div>

        {/* Bottom nav */}
        <div className={`flex flex-col gap-1 border-t pt-4 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          {bottomItems.map(item => (
            <NavItem key={item.label} label={item.label} icon={item.icon}
              active={activePage === item.label} onClick={() => navTo(item.label)} darkMode={darkMode} />
          ))}
        </div>

      </aside>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {/* Rider */}
        {activePage === "Home"         && <HomePage         darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Bookings"     && <BookingsPage     darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Calendar"     && <CalendarPage     darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Rides"        && <RidesPage        darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Achievements" && <AchievementsPage darkMode={darkMode} onToggleDarkMode={dm} onNavigate={setActivePage} />}
        {/* Instructor */}
        {activePage === "Studio Home"   && <InstructorHomePage    darkMode={darkMode} onToggleDarkMode={dm} onOpenRoster={openRoster} />}
        {activePage === "My Classes"    && <InstructorClassesPage key={rosterClass ? rosterClass.name + rosterClass.time : "all"} darkMode={darkMode} onToggleDarkMode={dm} initialClass={rosterClass} />}
        {activePage === "Class Builder" && <ClassBuilderPage      darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Insights"      && <InstructorStatsPage   darkMode={darkMode} onToggleDarkMode={dm} />}
        {/* Shared */}
        {activePage === "Profile"      && <ProfilePage  darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Settings"     && <SettingsPage darkMode={darkMode} onToggleDarkMode={dm} />}
        {activePage === "Log out"      && <LogOutPage   darkMode={darkMode} />}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <nav className={`fixed bottom-0 left-0 right-0 md:hidden border-t z-40 flex items-center justify-around py-2 px-1
        ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        {mobileNav.map(item => (
          <button
            key={item.label}
            onClick={() => navTo(item.label)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors
              ${activePage === item.label
                ? "text-[#00aa13]"
                : darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  )
}

// ─── RIGHT-RAIL MODULES ──────────────────────────────────────────────────────

function WeeklyProgress({ darkMode }) {
  const cardBg     = darkMode ? "#111827" : "#fff"
  const cardBd     = darkMode ? "#1f2937" : "#edf0f3"
  const navy       = darkMode ? "#f9fafb" : "#1b2333"
  const ink        = darkMode ? "#e5e7eb" : "#2c3442"
  const gray       = darkMode ? "#9ca3af" : "#6b7280"
  const muted      = darkMode ? "#6b7280" : "#9aa3b0"
  const track      = darkMode ? "#374151" : "#e9edf1"

  const tw = WEEK_DATA.this
  const lw = WEEK_DATA.last

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, boxShadow: "0 1px 3px rgba(20,30,50,.05)", padding: "24px 26px", fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <p style={{ fontSize: 19, fontWeight: 600, color: navy, letterSpacing: "-0.012em", margin: 0, whiteSpace: "nowrap" }}>Weekly progress</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
        {[{ label: "This week", rides: `${tw.ridesCompleted} / ${tw.ridesPlanned} rides`, pct: tw.ridesCompleted / tw.ridesPlanned, fill: "#15c15f" },
          { label: "Last week", rides: `${lw.ridesCompleted} / ${lw.ridesPlanned} rides`, pct: lw.ridesCompleted / lw.ridesPlanned, fill: "#bfe8cf" }].map(row => (
          <div key={row.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 7 }}>
              <span style={{ color: gray, fontWeight: 500 }}>{row.label}</span>
              <span style={{ color: ink, fontWeight: 600 }}>{row.rides}</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: track, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: row.fill, width: `${row.pct * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", columnGap: 22, alignItems: "center", marginTop: 20 }}>
        <div />
        <div style={{ fontSize: 11, fontWeight: 600, color: muted, textAlign: "right" }}>This</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: muted, textAlign: "right" }}>Last</div>
        {[["Energy", `${tw.energyWh} Wh`, `${lw.energyWh} Wh`],
          ["Ride time", tw.rideTimeLabel, lw.rideTimeLabel],
          ["Consistency", `${tw.consistencyPct}%`, `${lw.consistencyPct}%`]].map((r, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: "7px 0" }}><span style={{ fontSize: 14, color: gray, fontWeight: 400 }}>{r[0]}</span></div>
            <div style={{ fontSize: 14, color: ink, fontWeight: 600, textAlign: "right" }}>{r[1]}</div>
            <div style={{ fontSize: 14, color: muted, fontWeight: 500, textAlign: "right" }}>{r[2]}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

function WhenYouRide({ darkMode }) {
  const cardBg = darkMode ? "#111827" : "#fff"
  const cardBd = darkMode ? "#1f2937" : "#edf0f3"
  const navy   = darkMode ? "#f9fafb" : "#1b2333"
  const muted  = darkMode ? "#6b7280" : "#9aa3b0"
  const tileBg = darkMode ? "#1f2937" : "#f7f9fb"

  const { matrix, attendancePct, attendancePercentile, avgBookingLeadDays } = HEATMAP_DATA

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, boxShadow: "0 1px 3px rgba(20,30,50,.05)", padding: "24px 26px", fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <p style={{ fontSize: 19, fontWeight: 600, color: navy, letterSpacing: "-0.012em", margin: 0, whiteSpace: "nowrap" }}>When you ride</p>
      <p style={{ fontSize: 13.5, color: muted, fontWeight: 400, margin: "5px 0 0" }}>Sunday mornings are your zone</p>

      <div style={{ display: "grid", gridTemplateColumns: "26px repeat(7, 1fr)", gap: 6, marginTop: 20, alignItems: "center" }}>
        <span />
        {HEATMAP_DAYS.map((d, i) => <span key={i} style={{ fontSize: 11, color: muted, fontWeight: 600, textAlign: "center" }}>{d}</span>)}
        {HEATMAP_ROWS.map((r, ri) => (
          <React.Fragment key={ri}>
            <span style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{r}</span>
            {matrix[ri].map((v, ci) => (
              <span key={ci} style={{ aspectRatio: "1", borderRadius: 6, background: HEATMAP_COLORS[v], display: "block", maxHeight: 30 }} />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
        <div style={{ background: tileBg, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: navy, letterSpacing: "-0.02em" }}>
            {avgBookingLeadDays}<span style={{ fontSize: 11, fontWeight: 600, color: muted }}> days</span>
          </div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2, fontWeight: 500 }}>Books ahead on avg</div>
        </div>
        <div style={{ background: tileBg, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: navy, letterSpacing: "-0.02em" }}>
            Sun<span style={{ fontSize: 11, fontWeight: 600, color: muted }}> 9am</span>
          </div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2, fontWeight: 500 }}>Peak riding time</div>
        </div>
      </div>
    </div>
  )
}

function RiderProfile({ darkMode }) {
  const cardBg  = darkMode ? "#111827" : "#fff"
  const cardBd  = darkMode ? "#1f2937" : "#edf0f3"
  const navy    = darkMode ? "#f9fafb" : "#1b2333"
  const ink     = darkMode ? "#e5e7eb" : "#2c3442"
  const gray    = darkMode ? "#9ca3af" : "#6b7280"
  const muted   = darkMode ? "#6b7280" : "#9aa3b0"
  const chipBg  = darkMode ? "#1f2937" : "#f3f5f8"

  const { archetypeName, archetypeDescriptor, traits } = RIDER_PROFILE

  return (
    <div style={{ background: cardBg, border: `1px solid ${cardBd}`, borderRadius: 16, boxShadow: "0 1px 3px rgba(20,30,50,.05)", padding: "24px 26px", fontFamily: "'Poppins', system-ui, sans-serif", height: "100%", boxSizing: "border-box" }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: muted, margin: 0 }}>Your rider profile</p>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 18, flexShrink: 0,
          padding: 3,
          background: "linear-gradient(145deg, #F8E878 0%, #D4A018 35%, #8B6000 65%, #C8980C 100%)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18), 0 1px 2px rgba(0,0,0,0.10)",
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: 14,
            background: "#1A58C8",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(170deg, rgba(255,255,255,0.28) 0%, transparent 48%)",
              pointerEvents: "none",
            }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ position: "relative" }}>
              <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.2l1.4-6.8L2.2 9.7l6.9-.7z" />
            </svg>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: navy, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{archetypeName}</div>
          <div style={{ fontSize: 13, color: gray, marginTop: 2 }}>{archetypeDescriptor}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
        {traits.map((t, i) => (
          <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: ink, background: chipBg, padding: "6px 12px", borderRadius: 99 }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── HOME PAGE ──────────────────────────────────────────────────────────────

function DarkModeToggle({ darkMode, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors
        ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-500"}`}
    >
      {darkMode ? "☀" : "☾"}
    </button>
  )
}

// ─── SESSION PLAN MODAL ──────────────────────────────────────────────────────

function Avatar({ name, size = 32, square = false }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const radius   = square ? Math.round(size * 0.28) : "50%"
  return (
    <div style={{ width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: "#e6f9e8", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color: "#00aa13" }}>
      {initials}
    </div>
  )
}

function useDragToDismiss(onDismiss) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef(null)
  return {
    dragY,
    sheetStyle: {
      transform: `translateY(${dragY}px)`,
      transition: dragY === 0 ? "transform 0.3s cubic-bezier(0.32,0.72,0,1)" : "none",
      maxHeight: "88vh",
    },
    handlers: {
      onTouchStart: e => { startY.current = e.touches[0].clientY },
      onTouchMove:  e => { setDragY(Math.max(0, e.touches[0].clientY - startY.current)) },
      onTouchEnd:   ()  => { if (dragY > 72) { setDragY(0); onDismiss() } else setDragY(0) },
    },
  }
}

function SessionPlanModal({ session, darkMode, onClose }) {
  if (!session) return null

  const plan    = SESSION_PLANS[session.name] || SESSION_PLANS["_default"]
  const bg      = darkMode ? "bg-gray-900"      : "bg-white"
  const surface = darkMode ? "bg-gray-800"      : "bg-gray-50"
  const inset   = darkMode ? "bg-gray-950"      : "bg-white"
  const border  = darkMode ? "border-gray-700"  : "border-gray-100"
  const heading = darkMode ? "text-white"       : "text-gray-900"
  const muted   = darkMode ? "text-gray-400"    : "text-gray-500"
  const divider = darkMode ? "divide-gray-800"  : "divide-gray-100"

  const totalMins = plan.phases.reduce((s, p) => s + p.mins, 0)

  function zoneInfo(zoneStr) {
    const nums = (zoneStr.match(/\d+/g) || ["2"]).map(Number)
    const n    = Math.max(...nums)
    const map  = [
      null,
      { bar: "#36aee2", bg: darkMode ? "bg-blue-900/40 text-blue-300"   : "bg-blue-50 text-blue-700"   }, // Z1 recovery
      { bar: "#82ed3c", bg: darkMode ? "bg-green-900/40 text-green-300" : "bg-green-50 text-green-700" }, // Z2 endurance
      { bar: "#fde53d", bg: darkMode ? "bg-yellow-900/40 text-yellow-300":"bg-yellow-50 text-yellow-700"}, // Z3 tempo
      { bar: "#fb7512", bg: darkMode ? "bg-orange-900/40 text-orange-300":"bg-orange-50 text-orange-700"}, // Z4 threshold
      { bar: "#e91236", bg: darkMode ? "bg-red-900/40 text-red-300"     : "bg-red-50 text-red-700"     }, // Z5 VO₂ max
      { bar: "#741a10", bg: darkMode ? "bg-red-950/60 text-red-200"     : "bg-red-100 text-red-900"    }, // Z6 anaerobic
    ]
    return map[Math.min(n, 6)] || map[2]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className={`relative ${bg} rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-4xl max-h-[92vh] flex flex-col overflow-hidden z-10`}
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
      >

        {/* Header */}
        <div className="px-7 pt-7 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 pr-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00aa13] mb-1.5">Session Plan</p>
              <h2 className={`text-2xl font-bold leading-tight ${heading}`}>{session.name}</h2>
              <p className={`text-sm mt-1 ${muted}`}>{session.time} · {session.studio} · 45 min · {session.instructor}</p>
            </div>
            <button onClick={onClose}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
              ✕
            </button>
          </div>

          <p className={`text-sm leading-relaxed ${muted} mb-5`}>{plan.overview}</p>

          {/* Workout bar chart */}
          <div className="mb-5 overflow-x-auto">
            <div style={{ minWidth: 360 }}>
              <WorkoutChart sessionName={session.name} darkMode={darkMode} />
            </div>
          </div>
          {/* Zone analysis */}
          <div className="mb-5">
            <SessionDonut sessionName={session.name} darkMode={darkMode} />
          </div>
        </div>

        {/* Phase cards — scrollable */}
        <div className="overflow-y-auto flex-1 px-7 pb-7 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
          {plan.phases.map((ph, i) => {
            const info = zoneInfo(ph.zone)
            return (
              <div key={i}>
                <div className={`rounded-2xl border ${border} ${surface} overflow-hidden`}
                  style={{ borderLeftWidth: "3px", borderLeftColor: info.bar }}
                >
                  {/* Phase header */}
                  <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-base font-bold ${heading}`}>{ph.name}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${info.bg}`}>{ph.zone}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                      <span className={`text-xs font-mono tracking-tight ${muted}`}>{ph.timing}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700 border border-gray-200"}`}>{ph.mins} min</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className={`mx-4 mb-3 grid grid-cols-2 gap-px rounded-xl overflow-hidden border ${border}`}>
                    <div className={`${inset} px-4 py-2.5`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${muted}`}>Cadence</p>
                      <p className={`text-sm font-bold ${heading}`}>{ph.cadence}</p>
                    </div>
                    <div className={`${inset} px-4 py-2.5 border-l ${border}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${muted}`}>Power</p>
                      <p className={`text-sm font-bold ${heading}`}>{ph.power}</p>
                    </div>
                    <div className={`${inset} px-4 py-2.5 border-t ${border}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${muted}`}>RPE</p>
                      <p className={`text-sm font-bold ${heading}`}>{ph.rpe ?? '—'}</p>
                    </div>
                    <div className={`${inset} px-4 py-2.5 border-t border-l ${border}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${muted}`}>Heart Rate</p>
                      <p className={`text-sm font-bold ${heading}`}>{ph.hr ?? '—'}</p>
                    </div>
                  </div>
                  <div className="pb-1" />

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function HomePage({ darkMode, onToggleDarkMode }) {
  const card    = `rounded-2xl border p-6 transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const value   = darkMode ? "text-white"    : "text-gray-800"
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-end gap-3 mb-6 md:mb-8">
        <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        <span className={`hidden sm:inline text-sm ${muted}`}>eenieJIM</span>
        <Avatar name="eenieJIM" size={32} user />
      </div>

      {/* Next ride hero */}
      <div className={`${card} mb-6 p-4 md:p-6`}>
        <div className="flex items-start gap-4">
          {/* Left: text */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs mb-1 ${muted}`}>Next ride</p>
            <h2 className={`text-xl font-bold mb-1.5 ${heading}`}>Power Ride</h2>
            <p className={`text-sm mb-2 ${muted}`}>Today · 17:00 · 45 mins · Anna Banana</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${muted}`}>Studio 3</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aa13]"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13] flex-shrink-0" />Booked</span>
            </div>
          </div>

          {/* Right: intensity ring */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <svg viewBox="0 0 80 80" className="w-16 h-16 md:w-20 md:h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeWidth="6" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#00aa13" strokeWidth="6"
                  strokeDasharray="201" strokeDashoffset="160" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xs font-bold ${heading}`}>Low</span>
                <span className={`text-[10px] ${muted}`}>intensity</span>
              </div>
            </div>
            <p className={`text-[10px] mt-1 text-center ${muted} hidden sm:block`}>Easy · great for recovery</p>
          </div>
        </div>

        {/* Instructor quote — visible sm+ */}
        <div className={`hidden sm:flex items-start gap-3 rounded-xl p-3 mt-4 ${subtle}`}>
          <div className="w-8 h-8 rounded-full bg-[#e6f9e8] flex-shrink-0 flex items-center justify-center text-xs font-medium text-[#00aa13]">AB</div>
          <div>
            <p className={`text-xs font-medium ${heading}`}>Anna says</p>
            <p className={`text-xs italic mt-0.5 ${muted}`}>"{getInstructorQuote("Anna Banana", "Power Ride")}"</p>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left col */}
        <div className="flex flex-col gap-6">

          {/* Upcoming sessions */}
          <div className={card}>
            <h3 className={`font-semibold mb-4 ${heading}`}>Upcoming Sessions</h3>
            <div className="flex flex-col gap-3">
              {upcomingsessions.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs w-24 ${muted}`}>{s.day} {s.time}</span>
                    <div>
                      <p className={`text-sm font-medium ${heading}`}>{s.name}</p>
                      <p className={`text-xs ${muted}`}>{s.instructor}</p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Performance insight */}
          <div className={`${card} flex-1`}>
            <h3 className={`font-semibold mb-2 ${heading}`}>Performance</h3>
            <p className={`text-2xl font-bold ${heading}`}>Top 22% <span className={`text-sm font-normal ${muted}`}>last ride</span></p>
            <p className={`text-sm mt-2 ${muted}`}>
              Increasing output by 3%, you'd move up to{" "}
              <span className="text-[#00aa13] font-medium">Top 18%</span>
              <span className={`text-xs ml-2 ${muted}`}>Gap to next tier: +12 Wh</span>
            </p>

            {/* In progress achievements */}
            <p className={`text-xs font-semibold mt-4 mb-3 ${muted}`}>In progress</p>
            <div className="flex gap-3">
              {achievements.filter(a => !a.earned).slice(0,2).map((a, i) => {
                const [c1, c2] = achGradient(a.name)
                const pct = a.progress / a.total
                const r = 15, circ = 2 * Math.PI * r
                const gid = `ipg${i}`
                return (
                  <div key={i} className={`flex-1 rounded-2xl p-3.5 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}
                    style={{ boxShadow: darkMode ? "none" : "0 2px 12px rgba(0,0,0,0.07)" }}>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0 w-10 h-10">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" r={r} fill="none" stroke={darkMode ? "#374151" : "#EBEBEB"} strokeWidth="5" strokeLinecap="round" />
                          <circle cx="20" cy="20" r={r} fill="none" stroke={c1} strokeWidth="5"
                            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                            strokeLinecap="round" transform="rotate(-90 20 20)" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm leading-none">{a.icon}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold leading-tight truncate ${heading}`}>{a.name}</p>
                        <p className={`text-xs mt-0.5 ${muted}`}>{a.progress}<span className="opacity-50">/{a.total}</span> {a.unit}</p>
                      </div>
                    </div>
                    <div className={`w-full rounded-full mt-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} style={{ height: "3px" }}>
                      <div className="rounded-full transition-all" style={{ width: `${pct*100}%`, height: "3px", background: c1 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent achievements */}
            <p className={`text-xs font-semibold mt-4 mb-3 ${muted}`}>Recent achievements</p>
            <div className="flex gap-3">
              {achievements.filter(a => a.earned).concat(achievements.slice(0,2)).slice(0,4).map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <PremiumBadge icon={a.icon} colors={achGradient(a.name)} size={52} earned={a.earned} darkMode={darkMode} />
                  <p className={`text-[10px] font-semibold text-center leading-tight ${a.earned ? heading : muted}`} style={{ maxWidth: 52 }}>{a.name}</p>
                </div>
              ))}
            </div>

            {/* Locked achievements */}
            <p className={`text-xs font-semibold mt-4 mb-3 ${muted}`}>Locked</p>
            <div className="flex gap-3">
              {achievements.filter(a => !a.earned && a.progress === 0).slice(0, 4).map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <PremiumBadge icon={a.icon} colors={achGradient(a.name)} size={52} earned={false} darkMode={darkMode} />
                  <p className={`text-[10px] font-semibold text-center leading-tight ${muted}`} style={{ maxWidth: 52 }}>{a.name}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right col */}
        <div className="flex flex-col gap-5">
          <WeeklyProgress darkMode={darkMode} />
          <WhenYouRide darkMode={darkMode} />
          <div className="flex-1 min-h-0">
            <RiderProfile darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── BOOKINGS PAGE ──────────────────────────────────────────────────────────

const MONTH_NAMES_FULL  = ["January","February","March","April","May","June","July","August","September","October","November","December"]

// ─── SESSION PLANS ───────────────────────────────────────────────────────────

const SESSION_PLANS = {
  "_default": {
    overview: "A balanced studio cycling session combining endurance, cadence work and power efforts.",
    phases: [
      { name: "Warm Up",     timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–65% FTP", rpe: "2–3", hr: "<125 bpm", adaptation: "Metabolic priming", notes: "Target 80–90 rpm with 50–65% FTP and HR below 125 bpm — if HR is already elevated before this threshold, reduce resistance by one full turn. Focus on a circular pedal stroke: engage the hamstring through the backstroke and avoid a pure down-stroke bias. Establish your breathing cadence now — 3 counts in through the nose, 3 counts out — because this pattern will serve you through the main effort. Check for any saddle discomfort, cleat hotspots, or mechanical noise; these become significant irritants once intensity rises and should be resolved before minute 5." },
      { name: "Main Effort", timing: "8:00 – 38:00", mins: 30, zone: "Zone 3",   cadence: "85–95 rpm", power: "75–85% FTP", rpe: "6–7", hr: "Z3 · 152–163 bpm", adaptation: "Aerobic base development", notes: "Sustain 75–85% FTP with cadence locked in the 85–95 rpm band — if cadence drops below 80 rpm under target power, your aerobic system is failing to support the output and you must reduce resistance slightly rather than grinding. Monitor HR drift: in a steady aerobic effort, HR should stabilise within the first 5 minutes; progressive HR rise beyond 5 bpm over the block signals early cardiovascular fatigue and warrants a 3–5% power reduction. Keep elbows soft, shoulders away from ears, and weight distributed evenly across the saddle — excessive anterior tilt puts unnecessary load on the lumbar spine over a 30-minute block. Adjust resistance every 8–10 minutes based on perceived effort rather than a fixed number, because temperature and fatigue will shift your power-to-RPE relationship across the block." },
      { name: "Cool Down",   timing: "38:00 – 45:00",mins: 7,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<120 bpm", adaptation: "Lactate clearance", notes: "Drop resistance to 40–50% FTP and allow HR to descend below 120 bpm before you dismount — stopping abruptly while HR remains elevated causes venous pooling and orthostatic hypotension, particularly in a warm studio environment. Maintain 70–80 rpm cadence; a very slow spin at this stage does not promote blood flow effectively through the working muscles. Use this window to perform active thoracic rotation and shoulder rolls on the bike to counteract the anterior-loaded posture accumulated during the main effort. Note your finishing HR and compare it to the same point in previous sessions — faster HR recovery at equivalent cool-down power is a direct physiological marker of improving aerobic fitness." },
    ],
  },
  "Sunrise Power": {
    overview: "A progressive power ride designed to build your functional threshold. Expect sustained efforts that challenge your aerobic engine from the very first pedal stroke.",
    phases: [
      { name: "Warm Up",            timing: "0:00 – 7:00",  mins: 7,  zone: "Zone 1–2", cadence: "80–90 rpm",  power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",         adaptation: "Metabolic priming",         notes: "Target 80–90 rpm at 50–65% FTP with HR remaining below 125 bpm — any reading above this at this intensity is a sign of residual fatigue or dehydration and you should scale back today's targets by 5–8%. Prioritise a smooth, circular stroke from the first pedal revolution: think of scraping mud off the sole at the bottom of the stroke and pulling upward through the 6–12 o'clock transition. Keep jaw, neck, and forearms deliberately relaxed; tension in these areas propagates inefficiency through the entire kinetic chain. If your glutes are firing cold, add 2 × 10-second single-leg focus drills at 3:00 and 5:30 — this is especially valuable for early-morning sessions where neuromuscular recruitment is slower." },
      { name: "Cadence Activation", timing: "7:00 – 14:00", mins: 7,  zone: "Zone 2",   cadence: "95–105 rpm", power: "60–70% FTP",  rpe: "3–4", hr: "Z2 · 125–142 bpm",  adaptation: "Neuromuscular efficiency",  notes: "Elevate cadence to 95–105 rpm while keeping resistance light enough that HR stays in the 125–142 bpm band — the goal here is neuromuscular priming, not cardiovascular loading. Watch for hip rock: if your pelvis is visibly shifting side to side, cadence is above your current neuromuscular threshold and you should drop 5 rpm. Engage your core actively rather than passively gripping the handlebar — a braced midline at high cadence prevents energy leakage into the upper body. This phase specifically recruits fast-twitch motor units at sub-threshold intensity, allowing them to fire without accumulating the lactate that would blunt the subsequent Power Build." },
      { name: "Power Build",        timing: "14:00 – 28:00",mins: 14, zone: "Zone 3–4", cadence: "85–95 rpm",  power: "78–95% FTP",  rpe: "6–8", hr: "Z3–4 · 152–174 bpm", adaptation: "Lactate threshold elevation", notes: "Increase resistance every 2 minutes, targeting a smooth ramp from 78% to 95% FTP across the block — abrupt jumps cause HR to spike disproportionately and compromise the quality of the final minutes. Stay seated throughout: standing reduces the metabolic stress on the aerobic system and defeats the adaptation target. Drive each pedal stroke from the hip flexor at the top and push through a flat foot, not a toe-pointed position, to maximise glute and quad recruitment. Failure signal: if your cadence drops below 82 rpm involuntarily and you cannot recover it within 15 seconds without reducing power, you have exceeded your sustainable output and must step back one resistance level." },
      { name: "Sprint Efforts",     timing: "28:00 – 37:00",mins: 9,  zone: "Zone 5–6", cadence: "100+ rpm",   power: "120%+ FTP",   rpe: "9–10 / max", hr: "Z5–6 · >174 bpm", adaptation: "Anaerobic capacity",        notes: "Execute 3 × 60-second sprints with 2-minute active recovery between each — the recovery must be genuinely easy (Zone 1, sub-115 bpm) to allow sufficient PCr resynthesis for each sprint to be maximal. In the sprint, drive cadence above 100 rpm with resistance sufficient to produce 120%+ FTP: the combination of high force and high velocity is what recruits the full fast-twitch motor unit pool. Grip the handlebar firmly but keep elbows bent at roughly 90°; a straight-arm lock transfers road shock directly to the lower back and limits torso stability. After each sprint, note whether your HR recovery rate changes across the three repetitions — a significantly slower recovery on sprint 3 indicates accumulated fatigue is compromising neuromuscular output quality." },
      { name: "Recovery Spin",      timing: "37:00 – 40:00",mins: 3,  zone: "Zone 1",   cadence: "80–85 rpm",  power: "45–55% FTP",  rpe: "1–2", hr: "<120 bpm",         adaptation: "Lactate clearance",         notes: "This 3-minute window is physiologically critical for PCr and phosphagen resynthesis before the final cool-down — do not extend the effort by keeping resistance higher than 55% FTP. Maintain 80–85 rpm to keep blood flow through the quadriceps high without adding glycolytic demand. If HR has not dropped below 130 bpm by 2:30 into this phase, add a fourth easy minute before proceeding to cool-down. Use this interval to consciously check posture reset: roll the shoulders back, tilt the pelvis to neutral, and re-establish a soft elbow position." },
      { name: "Cool Down",          timing: "40:00 – 45:00",mins: 5,  zone: "Zone 1",   cadence: "70–80 rpm",  power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",         adaptation: "Lactate clearance",         notes: "Reduce resistance to 40–50% FTP and allow HR to descend below 115 bpm across these 5 minutes — a finishing HR above 120 bpm suggests the sprint block was more taxing than planned and tomorrow's session should be adjusted accordingly. Spin at 70–80 rpm; going slower than 70 rpm at this load actually increases the muscular recruitment needed per revolution and is counterproductive for metabolic clearance. Note your rate-of-perceived-exertion for the sprint block versus last session: improvement in RER for the same power output is your primary performance indicator for this session type." },
    ],
  },
  "Rhythm Ride": {
    overview: "Music-driven, beat-synced session focused on cadence precision and riding to the rhythm. Great for developing pedal efficiency and finding your flow state.",
    phases: [
      { name: "Warm Up",           timing: "0:00 – 6:00",  mins: 6,  zone: "Zone 1",   cadence: "75–85 rpm",  power: "50–60% FTP",  rpe: "2–3", hr: "<125 bpm",         adaptation: "Metabolic priming",        notes: "Target 75–85 rpm with 50–60% FTP and HR below 125 bpm — if it is not, reduce resistance. Focus on a relaxed ankle and circular pedal stroke rather than a down-stroke bias. Establish the breathing cadence you will carry into the main effort: 3 counts in through the nose, controlled exhale through the mouth. This is the last chance to identify any mechanical discomfort before intensity climbs, so pay deliberate attention to cleat pressure and saddle contact." },
      { name: "Rhythm Block 1",    timing: "6:00 – 16:00", mins: 10, zone: "Zone 2–3", cadence: "90–100 rpm", power: "65–78% FTP",  rpe: "4–5", hr: "Z2–3 · 135–163 bpm", adaptation: "Aerobic base development",  notes: "Synchronise your pedal stroke to the beat of the music — at 90–100 rpm, the down-stroke of each leg should land on the beat or offbeat depending on the track tempo. Resistance should be set to place you at 65–78% FTP: at this cadence that means relatively light load, so the emphasis is on precision of movement rather than force production. Monitor for any lateral hip movement as cadence increases; the hip should remain stable on the saddle with movement driven entirely by the legs below. HR in the 135–163 bpm band confirms you are in the aerobic training zone — above this, ease resistance; below 135, consider a slight increase." },
      { name: "Cadence Challenge", timing: "16:00 – 26:00",mins: 10, zone: "Zone 3",   cadence: "100–110 rpm",power: "70–80% FTP",  rpe: "5–6", hr: "Z3 · 152–163 bpm",  adaptation: "Neuromuscular efficiency",  notes: "Push cadence to 100–110 rpm while holding 70–80% FTP — this combination is aerobically and neurologically demanding because the muscular system must sustain power output while the nervous system manages high-frequency motor unit cycling. The primary technical failure here is hip bounce: if your pelvis rocks, drop 5 rpm and rebuild. Keep elbows soft and hands light on the bars so upper-body tension does not mask proprioceptive feedback from the pelvis. Physiologically this phase recruits a high proportion of type-I slow-twitch fibres at near-maximal firing frequency, which trains mitochondrial density without glycolytic cost — a key adaptation for endurance economy." },
      { name: "Rhythm Block 2",    timing: "26:00 – 36:00",mins: 10, zone: "Zone 3–4", cadence: "85–95 rpm",  power: "78–90% FTP",  rpe: "6–7", hr: "Z3–4 · 152–174 bpm", adaptation: "Lactate threshold elevation", notes: "Increase resistance to enter the 78–90% FTP range while dropping cadence slightly to 85–95 rpm — you are now shifting from neuromuscular precision work to threshold stimulus. HR should be in the 152–174 bpm zone; if it climbs above 174 bpm, you are working above threshold and must reduce resistance by one turn. Monitor for cadence decay: if you drop below 83 rpm involuntarily under this load, the glycolytic system is being overly taxed and you risk compromising the cool-down quality. Each pedal stroke should feel purposeful and loaded but not grinding — the rhythm of the music should still be audible in your cadence pattern." },
      { name: "Cool Down",         timing: "36:00 – 45:00",mins: 9,  zone: "Zone 1",   cadence: "70–80 rpm",  power: "45–55% FTP",  rpe: "1–2", hr: "<120 bpm",         adaptation: "Lactate clearance",         notes: "Nine minutes of genuine low-intensity spinning at 45–55% FTP — this extended window is deliberate for a session that combined high-cadence and threshold work, both of which generate significant metabolic by-products. HR should be below 120 bpm within the first 3 minutes; if recovery is slower, note this for training load management. Use the final 3 minutes to perform slow, deliberate ankle circles at reduced cadence to flush the tibialis anterior and peroneals, which are heavily recruited during high-rpm cadence work. Check perceived exertion retrospectively: this session should have felt like a 6.5–7/10 overall — if it was an 8+, today's fatigue state was higher than anticipated." },
    ],
  },
  "Cadence Control": {
    overview: "A precision-focused session designed to improve neuromuscular efficiency. High cadence work trains your legs to spin faster with significantly less fatigue over time.",
    phases: [
      { name: "Warm Up",             timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "75–90 rpm",  power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",         adaptation: "Metabolic priming",        notes: "Begin at 75 rpm and increase cadence by 5 rpm every 2 minutes, reaching 90 rpm by the end of the block — this progressive ramp allows the neuromuscular system to adapt its firing frequency without the shock of an immediate jump to high-cadence work. Keep resistance light enough that HR stays below 125 bpm; any heavier load at this stage will drive glycolytic recruitment before the aerobic system is properly primed. Focus specifically on the upstroke: at 75–90 rpm, the natural tendency is to let the recovering leg be passive — actively pulling through the 6 o'clock to 12 o'clock arc will train the hip flexors and make the subsequent pyramid work significantly more sustainable." },
      { name: "Cadence Pyramids",    timing: "8:00 – 22:00", mins: 14, zone: "Zone 2–3", cadence: "90–115 rpm", power: "60–75% FTP",  rpe: "3–5", hr: "Z2–3 · 125–163 bpm", adaptation: "Neuromuscular efficiency",  notes: "Execute 4-minute pyramid cycles: 90→100→110→115→110→100→90 rpm, spending approximately 30 seconds at each step. Resistance should remain constant and light — 60–75% FTP — because the entire purpose of this block is cadence training at sub-threshold load, not power development. The diagnostic benchmark: if your HR rises more than 15 bpm from 90 to 115 rpm at the same power, your cycling economy at high cadence is poor and this session addresses exactly that deficit. Hip stability is the primary technical KPI: place a finger gently on your hip crest; any perceptible lateral movement means you have exceeded your current neuromuscular control ceiling and should cap the pyramid at 108 rpm until stability improves." },
      { name: "Threshold Cadence",   timing: "22:00 – 32:00",mins: 10, zone: "Zone 3–4", cadence: "95–100 rpm", power: "80–90% FTP",  rpe: "6–7", hr: "Z3–4 · 152–174 bpm", adaptation: "Lactate threshold elevation", notes: "Add resistance to bring power to 80–90% FTP while holding cadence in the 95–100 rpm range — this combination is the most specific stimulus for improving FTP at race-realistic cadences. The physiological challenge is that the cardiovascular system must now deliver oxygen for both the high-stroke-frequency neuromuscular demand and the elevated power output simultaneously. HR in the 152–174 bpm band indicates correct loading; exceeding 174 bpm means you have breached threshold and should reduce resistance by one level. Failure signal: cadence dropping below 92 rpm involuntarily while maintaining power is a sign of glycolytic fatigue, not just muscular — reduce resistance by 5% FTP rather than trying to force the cadence back up." },
      { name: "Recovery",            timing: "32:00 – 36:00",mins: 4,  zone: "Zone 1",   cadence: "80–85 rpm",  power: "50–55% FTP",  rpe: "2", hr: "<130 bpm",          adaptation: "Lactate clearance",         notes: "Drop resistance to 50–55% FTP and maintain 80–85 rpm for exactly 4 minutes — the specific cadence target here is important because it keeps blood flow through the quadriceps elevated without adding glycolytic demand, optimising lactate clearance before the sprint block. HR must come below 130 bpm within the first 90 seconds; if it does not, extend this recovery phase by 60 seconds and adjust the sprint block timing accordingly. Use this window to actively think about the technical cue you will carry into the max-cadence sprints: the sensation of 'spinning on top of the pedals' rather than 'pushing through them' — a light, rapid, frictionless circular motion." },
      { name: "Max Cadence Sprints", timing: "36:00 – 41:00",mins: 5,  zone: "Zone 5",   cadence: "120+ rpm",   power: "110–130% FTP",rpe: "9–10 / max", hr: "Z5 · >174 bpm", adaptation: "Neuromuscular efficiency",  notes: "Execute 3 × 30-second maximum cadence sprints with 45-second easy-spin recovery between each — the goal is the highest sustainable cadence you can achieve with technical integrity, not just the highest number you can thrash out. Start each sprint by driving cadence up rapidly in the first 5 seconds, then hold — do not try to accelerate further mid-sprint. Resistance should be set lightly enough that 120+ rpm is achievable without grinding; if you cannot reach 115 rpm, the resistance is too heavy for this phase. The 45-second recovery is deliberately short: PCr will not fully resynthesize, which means each subsequent sprint trains your ability to produce high-cadence output under residual fatigue — a critical adaptation for race-end sprinting." },
      { name: "Cool Down",           timing: "41:00 – 45:00",mins: 4,  zone: "Zone 1",   cadence: "70–80 rpm",  power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",         adaptation: "Lactate clearance",         notes: "Four minutes at 40–50% FTP to begin clearing the metabolic residue from the sprint block — this is insufficient for full recovery but initiates the process and should be supplemented with 10 minutes of off-bike movement post-session. HR should descend below 115 bpm by the end of this phase; if it does not, a cold shower or extended off-bike walking will accelerate parasympathetic restoration. Note the highest cadence achieved with technical stability across the sprint block — this number is your neuromuscular benchmark and should improve by 3–5 rpm per 4–6 weeks of regular cadence-control work." },
    ],
  },
  "Climb Intervals": {
    overview: "Simulated hill climbing. Heavy resistance, seated power work targeting your lactate threshold. Expect sustained discomfort — and the satisfaction that comes after.",
    phases: [
      { name: "Warm Up",          timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "75–85 rpm", power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",         notes: "Warm up at 75–85 rpm with resistance at 50–65% FTP, keeping HR below 125 bpm — climbing intervals demand pre-warmed type-II fibres and a primed cardiovascular system, so any shortcut here will result in a disproportionately high HR in the first climb. Establish the breathing pattern you will use on the climbs: nasal inhalation through the nose for as long as possible, transitioning to mouth breathing only when nasal breathing becomes insufficient — this delays the psychological sense of breathlessness. Focus on glute activation: execute 3 × 5-second single-leg emphasis drills at 3:00 and 6:00 into the warm-up to ensure the gluteus maximus is neurologically primed for the hip extension demand of heavy-resistance seated climbing." },
      { name: "Climb 1",          timing: "8:00 – 16:00", mins: 8,  zone: "Zone 3–4", cadence: "65–75 rpm", power: "80–92% FTP",  rpe: "6–7", hr: "Z3–4 · 152–174 bpm", adaptation: "Lactate threshold elevation", notes: "Add resistance to 80–92% FTP and drop cadence to 65–75 rpm to simulate a 6–8% gradient climb — at this cadence and power combination, you are training both peak muscular force and aerobic capacity simultaneously. Stay seated throughout: standing reduces the specific muscular stress on the quadriceps and hamstrings that drives the lactate threshold adaptation. Drive each stroke through a flat foot with heel slightly below the toes at the bottom of the stroke, engaging the glute maximally — this is the primary biomechanical difference between effective and ineffective climbing technique. Monitor for forward trunk lean exceeding 45° from vertical; excessive lean shifts load off the glutes and onto the lower back, increasing injury risk across a repeated-climb session." },
      { name: "Recovery Descent", timing: "16:00 – 19:00",mins: 3,  zone: "Zone 1",   cadence: "80–90 rpm", power: "45–55% FTP",  rpe: "2", hr: "<130 bpm",           adaptation: "Lactate clearance",         notes: "Reduce resistance sharply to 45–55% FTP and elevate cadence to 80–90 rpm — the cadence increase on the descent is physiologically important because it maximises blood flow through the fatigued quadriceps and accelerates lactate oxidation by the slow-twitch fibres. HR should drop below 130 bpm within 90 seconds; if it does not, your recovery between climbs will be incomplete and the second climb will be compromised. Actively shake tension out of the shoulders and forearms — the gripping pattern during heavy-resistance climbing accumulates upper-body fatigue that is not always consciously noticed. This 3-minute window is not spare time; it is a structured physiological intervention, so maintain the prescribed cadence rather than letting it drift below 78 rpm." },
      { name: "Climb 2",          timing: "19:00 – 28:00",mins: 9,  zone: "Zone 4",   cadence: "60–72 rpm", power: "88–100% FTP", rpe: "7–8", hr: "Z4 · 163–174 bpm",  adaptation: "Lactate threshold elevation", notes: "This is the session's primary threshold stimulus: 9 minutes at 88–100% FTP and 60–72 rpm with HR in the 163–174 bpm band. The slightly lower cadence versus Climb 1 increases peak torque per stroke, which trains the neuromuscular force-production capacity that underpins climbing power. Expect significant discomfort from minutes 5–7; this is the lactate accumulation phase and it is exactly what drives mitochondrial density and lactate transporter upregulation over repeated sessions. Maintain a tall torso and neutral lumbar spine — when fatigue causes the rider to round the lower back, load transfers from the glutes to the lumbar erectors, which is both inefficient and injurious. Failure signal: if HR climbs above 178 bpm, you have exceeded your threshold and are in VO2max territory — reduce resistance by two turns immediately." },
      { name: "Recovery Descent", timing: "28:00 – 31:00",mins: 3,  zone: "Zone 1",   cadence: "80–90 rpm", power: "45–55% FTP",  rpe: "2", hr: "<130 bpm",           adaptation: "Lactate clearance",         notes: "Identical prescription to the first descent: 45–55% FTP, 80–90 rpm, HR below 130 bpm within 90 seconds. The key difference is that your legs are now more fatigued and the metabolic demand of lactate clearance is higher — keep cadence deliberately at 80–90 rpm rather than letting it drift, because the rotational movement is the mechanism of clearance. If your HR is not below 130 bpm by 2:30, add 60 extra seconds here and treat the Summit Push as an 8-minute rather than 9-minute effort. Use 10 seconds of deliberate core bracing (draw the navel lightly toward the spine) to re-establish lumbar neutral before the final climb." },
      { name: "Summit Push",      timing: "31:00 – 40:00",mins: 9,  zone: "Zone 4–5", cadence: "70–80 rpm", power: "95–110% FTP", rpe: "8–9", hr: "Z4–5 · 163–180 bpm", adaptation: "VO₂ max stimulus",          notes: "The final climb targets the anaerobic threshold-to-VO2max continuum at 95–110% FTP — the slight cadence increase versus Climb 2 (70–80 rpm) partially offloads peak torque and allows total power to exceed threshold by leveraging increased stroke frequency. HR will reach its session peak here, likely 163–180 bpm; this is expected and intentional. Standing is permissible for 20–30-second efforts to recruit additional motor units, but return to seated position immediately after — repeated standing removes the specific neuromuscular stress that makes this session effective. Monitor power consistency: in the final 2 minutes you will feel strong urges to reduce resistance; resist these if HR is within the 163–180 bpm range, as the final minutes are where the VO2max stimulus is most potent." },
      { name: "Cool Down",        timing: "40:00 – 45:00",mins: 5,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Five minutes at 40–50% FTP to initiate lactate clearance after a high-intensity climbing block — this is insufficient for full recovery but critical for avoiding post-session soreness and starting the repair process. HR should descend below 115 bpm by minute 4; if still above 120 bpm at the end of this phase, reduce resistance further. Note the delta between your Climb 2 average HR and your Climb 1 average HR — if Climb 2 HR was more than 8 bpm higher for the same power output, today's session load was at the upper edge of your current capacity. Off-bike, prioritise 20+ grams of protein and 500 ml of fluid within 30 minutes to support the glycogen resynthesis and muscle protein synthesis triggered by this session." },
    ],
  },
  "Tempo Foundation": {
    overview: "A controlled aerobic session targeting the sweet spot between endurance and threshold. The foundation all race fitness is built on — unsexy, essential, effective.",
    phases: [
      { name: "Warm Up",       timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–65% FTP", rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",         notes: "Build gradually from 50% to 65% FTP across the 8 minutes, incrementing resistance every 2 minutes — a progressive rather than abrupt warm-up primes the oxidative enzyme cascade that makes the subsequent tempo blocks achievable. HR should remain below 125 bpm throughout; exceeding this before the main effort indicates residual fatigue from prior sessions and warrants a 5% FTP reduction in the tempo blocks. Establish your tempo breathing pattern now: a controlled, rhythmic breathe that you can sustain for 12–14 consecutive minutes — if you cannot find it at 65% FTP, you will struggle to maintain it at 80% FTP. Perform 2 × 5-second seated accelerations (to ~90% effort) at minutes 5 and 7 to prime the fast-twitch fibres that will help you hold tempo cadence under fatigue." },
      { name: "Tempo Block 1", timing: "8:00 – 20:00", mins: 12, zone: "Zone 3",   cadence: "85–95 rpm", power: "76–84% FTP", rpe: "6–7", hr: "Z3 · 152–163 bpm",  adaptation: "Lactate threshold elevation", notes: "Sweet spot effort at 76–84% FTP: this range sits just below the first lactate threshold but stimulates significant mitochondrial density adaptations without the recovery cost of true threshold work. HR should stabilise in the 152–163 bpm band within the first 3 minutes; if it continues to rise beyond that point, you are above sweet spot and must reduce by 3–4% FTP. Cadence should not fall below 83 rpm — at this power, any lower cadence means you are generating too much force per stroke, which preferentially recruits type-II fibres and increases lactate production. Monitor your power output across the 12 minutes: good metabolic fitness shows as stable power at stable HR; deteriorating fitness shows as either power fade or HR drift — both are informative diagnostic data." },
      { name: "Recovery",      timing: "20:00 – 24:00",mins: 4,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "55–65% FTP", rpe: "2–3", hr: "<135 bpm",          adaptation: "Aerobic base development",  notes: "Four minutes at 55–65% FTP — maintain cadence at 80–90 rpm because the rotational movement actively promotes lactate clearance via continued aerobic metabolism in the slow-twitch fibre pool. HR should come below 135 bpm within 2 minutes; if you are still above 140 bpm at 3:30, extend this recovery by 60 seconds before starting Tempo Block 2. Resist the temptation to use this time to 'save up' by going excessively easy — 55–65% FTP is the correct prescription and going lower will actually slow lactate clearance by reducing muscle blood flow. Use the final 30 seconds to mentally reset your focus cues for Block 2: stable cadence, flat foot at the bottom of the stroke, relaxed shoulders." },
      { name: "Tempo Block 2", timing: "24:00 – 38:00",mins: 14, zone: "Zone 3",   cadence: "85–95 rpm", power: "76–84% FTP", rpe: "6–7", hr: "Z3 · 152–163 bpm",  adaptation: "Lactate threshold elevation", notes: "Fourteen minutes at the same sweet-spot target — 2 minutes longer than Block 1, which is the deliberate progressive overload mechanism of this session. Because you are starting this block in a partially-fatigued state, HR may initially be 3–5 bpm higher than at the equivalent point in Block 1; this is normal and expected. The critical execution requirement is consistency: power should not vary by more than ±3% FTP and cadence should not drift below 83 rpm. In minutes 10–12 you will experience the strongest urge to reduce resistance — this is the phase that delivers the most adaptation stimulus, so hold position unless HR has exceeded 168 bpm. The physiological adaptation target is increased mitochondrial density and improved fat oxidation at threshold intensities, which compounds over 4–6 weeks of this session type." },
      { name: "Cool Down",     timing: "38:00 – 45:00",mins: 7,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<120 bpm",          adaptation: "Lactate clearance",         notes: "Seven minutes at 40–50% FTP — the extended cool-down is proportional to the total sweet-spot volume accumulated in this session (26 minutes), which is sufficient to elevate blood lactate meaningfully above resting levels. HR should be below 120 bpm within the first 3 minutes; slower recovery is a signal to reduce tomorrow's training load. Use minutes 4–7 to perform passive hip flexor stretching on the bike: extend one leg slightly behind centre while maintaining pedalling with the other, alternating every 30 seconds — this counteracts the hip flexor shortening that accumulates during prolonged seated cycling. Record your average HR for both tempo blocks and compare across sessions: a decreasing HR trend at equivalent power is the primary biomarker of improving aerobic efficiency." },
    ],
  },
  "HIIT Blast": {
    overview: "Maximum-intensity interval training. Short explosive efforts with brief recovery periods. This session will push you to your absolute limit — and then ask for more.",
    phases: [
      { name: "Warm Up",         timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",        notes: "An inadequate warm-up before maximal HIIT efforts is one of the leading causes of muscle strain in studio cycling — do not abbreviate this phase regardless of time pressure. Build from 50% to 65% FTP across 8 minutes, adding resistance every 2 minutes, while keeping HR below 125 bpm. At minute 6, perform 2 × 8-second accelerations to approximately 85% effort to pre-activate the fast-twitch motor unit pool and pre-stretch the connective tissues that will be under extreme demand during the work intervals. Your target by minute 8 is a HR in the 118–125 bpm range with a strong, circular, co-ordinated pedal stroke — if you arrive at the activation phase without those conditions, add 2 minutes here." },
      { name: "Activation",      timing: "8:00 – 12:00", mins: 4,  zone: "Zone 2–3", cadence: "90–100 rpm",power: "70–80% FTP",  rpe: "4–5", hr: "Z2–3 · 135–163 bpm", adaptation: "Neuromuscular efficiency",  notes: "Execute 2 × 30-second building efforts within these 4 minutes, increasing power from 70% to 80% FTP during each effort. Between efforts, return to 65% FTP at 90 rpm. The purpose is neuromuscular priming rather than cardiovascular loading — you are teaching the motor units that fire at 100% effort to activate rapidly from a standing start. HR in the 135–163 bpm band confirms correct loading; above 165 bpm at 80% FTP indicates today's fatigue state is elevated and HIIT block targets should be reduced to 120–140% FTP. Monitor breathing: you should be working hard enough to require mouth breathing, but not so hard that you feel breathless between the build efforts." },
      { name: "HIIT Block 1",    timing: "12:00 – 24:00",mins: 12, zone: "Zone 5–6", cadence: "100+ rpm",  power: "130–150% FTP",rpe: "9–10 / max", hr: "Z5–6 · >174 bpm", adaptation: "Anaerobic capacity",        notes: "Four repetitions of 20-second maximum effort followed by 40-second easy recovery — the 1:2 work-to-rest ratio is insufficient for full PCr resynthesis, which is intentional: it creates progressive metabolic fatigue across the four reps that specifically targets anaerobic glycolytic capacity. Each 20-second effort must be genuinely maximal from the first second — a build-up approach results in only 10–12 seconds of true maximal output, which is insufficient for the adaptation stimulus. Cadence should exceed 100 rpm on every effort; if you cannot reach 100 rpm at the prescribed power, reduce resistance by one turn — speed is the primary variable here. During the 40-second recovery, maintain 75–80 rpm at Zone 1 power: stopping the legs entirely slows lactate clearance and makes the next effort significantly harder." },
      { name: "Active Recovery", timing: "24:00 – 28:00",mins: 4,  zone: "Zone 1",   cadence: "80–85 rpm", power: "45–55% FTP",  rpe: "2", hr: "<130 bpm",           adaptation: "Lactate clearance",         notes: "This 4-minute window between blocks is the single most important recovery period in the session — do not compromise it by maintaining too high a resistance. Target 45–55% FTP at 80–85 rpm; the combination of light load and elevated cadence maximises metabolic clearance while keeping the cardiovascular system engaged. HR should drop below 130 bpm by 2:30; if it is still above 135 bpm at 3:30, add 60 seconds to this recovery and adjust the Block 2 start time. Mentally, use this time to reset: review the execution quality of Block 1 — was each effort truly maximal, was cadence above 100 rpm, was recovery genuinely easy? Apply any corrections to Block 2." },
      { name: "HIIT Block 2",    timing: "28:00 – 40:00",mins: 12, zone: "Zone 5–6", cadence: "100+ rpm",  power: "130–150% FTP",rpe: "9–10 / max", hr: "Z5–6 · >174 bpm", adaptation: "Anaerobic capacity",        notes: "Identical prescription to Block 1 — 4 × 20 seconds all-out, 40 seconds recovery — but executed under greater accumulated fatigue. Research consistently shows that the adaptation stimulus of Block 2 is equal to or greater than Block 1 because the glycolytic system is being stressed at a higher percentage of its depleted capacity. Expect HR to peak higher and recover slower compared to Block 1; this is not a failure signal — it is the intended physiological state. The primary execution failure to avoid is premature termination: riders frequently reduce effort in seconds 12–18 of each interval because the discomfort is maximal; hold position and maintain cadence above 100 rpm until the 20-second mark. If cadence drops below 95 rpm before the 20-second mark, note this as a benchmark — it represents your current anaerobic glycolytic fatigue ceiling." },
      { name: "Cool Down",       timing: "40:00 – 45:00",mins: 5,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP",  rpe: "1–2", hr: "<120 bpm",          adaptation: "Lactate clearance",         notes: "Five minutes is the absolute minimum cool-down after 8 maximal HIIT intervals — if studio scheduling allows, extend to 8–10 minutes. Maintain 70–80 rpm at 40–50% FTP to promote active lactate clearance; HR should descend below 120 bpm within the first 3 minutes. Avoid the common error of immediately stopping and stretching: the transition from maximal exercise to complete inactivity causes venous pooling and can trigger post-exercise hypotension in a warm environment. Note your lactate clearance rate (HR drop per minute) and compare to previous HIIT sessions — a faster clearance rate at equivalent work output is one of the clearest markers of improving metabolic fitness." },
    ],
  },
  "Threshold Push": {
    overview: "A dedicated FTP session. Sustained efforts at your functional threshold power will raise your ceiling and make you a stronger rider across every discipline.",
    phases: [
      { name: "Warm Up",      timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",         notes: "Build methodically from 50% to 65% FTP across 8 minutes — threshold training is the highest-quality work in endurance cycling and demands a thorough warm-up. HR must remain below 125 bpm through this phase; if it exceeds this at 65% FTP, your fatigue state suggests today's threshold targets should be reduced by 5–8%. Focus on establishing your threshold breathing pattern: a controlled, non-gasping rhythm that allows you to speak 3–4 words at a time — this is the breathing economy you must sustain for 13 consecutive minutes during Threshold 1. At minutes 5 and 7, perform 10-second accelerations to 85–90% effort to pre-recruit the fast-twitch fibre pool that will be needed to maintain threshold output in the final minutes of each block." },
      { name: "Cadence Build",timing: "8:00 – 13:00", mins: 5,  zone: "Zone 2",   cadence: "90–100 rpm",power: "65–75% FTP",  rpe: "4–5", hr: "Z2 · 135–152 bpm",  adaptation: "Neuromuscular efficiency",  notes: "Elevate cadence to 90–100 rpm at 65–75% FTP for 5 minutes — this pre-activates the neuromuscular pathways that allow you to sustain high cadence under threshold load, which is critical for avoiding the slow-cadence, force-biased grinding pattern that typifies poorly-executed threshold work. HR in the 135–152 bpm range indicates correct loading. Pay specific attention to hip stability: if your pelvis rocks at 95–100 rpm at this power, your core is not adequately engaged and will be a limiting factor during the Threshold blocks. The transition from this phase to Threshold 1 will feel abrupt — resist the psychological urge to ease into the threshold effort; set the resistance to target power and commit from the first pedal stroke." },
      { name: "Threshold 1",  timing: "13:00 – 26:00",mins: 13, zone: "Zone 4",   cadence: "85–95 rpm", power: "95–105% FTP", rpe: "7–8", hr: "Z4 · 163–174 bpm",  adaptation: "Lactate threshold elevation", notes: "Thirteen minutes at 95–105% FTP is the gold standard for raising FTP — you are training at the exact intensity where lactate production equals lactate clearance, which over time increases the power output at which this equilibrium occurs. HR in the 163–174 bpm band is the confirmation of correct loading; above 174 bpm suggests you are above threshold and the effort is not sustainable for 13 minutes — reduce by 3% FTP. Cadence in the 85–95 rpm range is critical: below 83 rpm at this power, type-II fibre recruitment increases disproportionately and lactate production exceeds the threshold adaptation zone. In minutes 8–11, the effort will feel nearly intolerable — this is the lactate steady-state zone and it is exactly the stimulus you are seeking. Failure signal: power dropping more than 5% FTP involuntarily for more than 30 seconds means you have exceeded your current FTP and must reduce resistance." },
      { name: "Recovery",     timing: "26:00 – 31:00",mins: 5,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–60% FTP",  rpe: "2–3", hr: "<130 bpm",          adaptation: "Lactate clearance",         notes: "Five minutes of genuine aerobic recovery at 50–60% FTP — this interval is calibrated to allow meaningful lactate clearance without being so long that the neuromuscular system fully resets, which ensures the second threshold block produces additional adaptive stimulus on a partially-fatigued system. HR should fall below 130 bpm within 2 minutes; slower recovery suggests Block 1 depleted glycogen more rapidly than expected and Block 2 targets should be reduced to 90–100% FTP. Maintain 80–90 rpm throughout: do not drop cadence below 78 rpm even at low power, because the rotational movement is the primary driver of blood flow through the working muscles. Use the final 60 seconds to set your mental approach for Threshold 2: the second block is shorter (10 minutes) but harder due to accumulated fatigue — this is intentional and this is where adaptation is maximised." },
      { name: "Threshold 2",  timing: "31:00 – 41:00",mins: 10, zone: "Zone 4",   cadence: "85–95 rpm", power: "95–105% FTP", rpe: "8–9", hr: "Z4 · 163–177 bpm",  adaptation: "Lactate threshold elevation", notes: "Ten minutes at 95–105% FTP with pre-fatigued legs — this is the session's highest adaptive stimulus because you are sustaining threshold power against a background of reduced glycogen, elevated blood lactate, and neuromuscular fatigue. HR will likely be 4–7 bpm higher than Threshold 1 at equivalent power; this is correct and expected. The cadence target of 85–95 rpm must be actively maintained, as the natural fatigue response is to slow the cadence and rely more heavily on force — if cadence drops below 83 rpm, reduce resistance by 3% FTP to preserve the neuromuscular pattern. Minutes 7–10 are where the most significant adaptation signal is generated: hold power within ±5% FTP and resist the overwhelming urge to back off. This second block is the reason this session produces superior FTP gains compared to a single longer threshold effort." },
      { name: "Cool Down",    timing: "41:00 – 45:00",mins: 4,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Four minutes at 40–50% FTP to initiate the recovery process after 23 minutes of total threshold work — the adaptation from this session occurs during the following 24–48 hours, so recovery quality post-session is as important as execution quality during the session. HR should descend below 115 bpm by the end; if still above 120 bpm, add 2 more minutes before dismounting. Note your power output stability across both threshold blocks: consistent power with rising HR (cardiac drift) indicates aerobic fitness is the current limiter; consistent HR with falling power indicates neuromuscular fatigue — these are different limiting factors and require different training responses over the following week." },
    ],
  },
  "Power Tempo": {
    overview: "Sustained tempo efforts punctuated by short power accelerations. Builds aerobic base and neuromuscular power simultaneously — two adaptations in one session.",
    phases: [
      { name: "Warm Up",          timing: "0:00 – 7:00",  mins: 7,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "50–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",        notes: "Build from 50% to 65% FTP over 7 minutes at 80–90 rpm, keeping HR below 125 bpm. This session combines two distinct physiological demands — sustained aerobic tempo and supramaximal power surges — so the warm-up must prepare both the oxidative and the glycolytic metabolic pathways. At minutes 4 and 6, execute 8-second accelerations to approximately 90% effort to prime the PCr system that will power the surges. Establish a smooth, circular pedal stroke now: the power surges will require you to maintain high efficiency at elevated cadence, and a mechanically sound baseline makes this significantly easier under fatigue." },
      { name: "Tempo Foundation", timing: "7:00 – 18:00", mins: 11, zone: "Zone 3",   cadence: "85–95 rpm", power: "76–84% FTP",  rpe: "6–7", hr: "Z3 · 152–163 bpm",  adaptation: "Aerobic base development",  notes: "Eleven minutes at 76–84% FTP and 85–95 rpm — this is pure sweet-spot work building the aerobic base that gives the power surges meaning. HR should stabilise in the 152–163 bpm band within 3 minutes. Focus on metabolic efficiency: breathe rhythmically, keep the upper body relaxed, and push through a flat foot rather than a toe-pointed position. The key execution target is consistency: power and cadence variation of less than ±3% and ±3 rpm respectively. Any drift above these tolerances during the foundation block will compromise your ability to produce quality surges in the next phase, because metabolic fatigue will already be elevated beyond what the tempo block alone should cause." },
      { name: "Power Surges",     timing: "18:00 – 28:00",mins: 10, zone: "Zone 4–5", cadence: "95–105 rpm",power: "100–120% FTP",rpe: "8–9", hr: "Z4–5 · 163–180 bpm", adaptation: "Neuromuscular efficiency",  notes: "Five × 30-second surges embedded within the tempo effort — do not reduce tempo power between surges, return to the 76–84% FTP tempo base immediately after each surge. The surge targets 100–120% FTP at 95–105 rpm: the combination of elevated power and elevated cadence recruits type-II fast-twitch fibres against an already-fatigued aerobic background, which is a highly specific stimulus for improving race-pace power-to-weight ratio. HR during surges will peak in the 163–180 bpm range; between surges it should return toward the 152–163 bpm tempo band — if inter-surge HR climbs progressively above 168 bpm, reduce surge power to 100–108% FTP to preserve the tempo base quality. Failure signal: if cadence drops below 92 rpm during a surge, resistance is too heavy for the intended neuromuscular stimulus." },
      { name: "Tempo Sustain",    timing: "28:00 – 39:00",mins: 11, zone: "Zone 3",   cadence: "85–95 rpm", power: "76–84% FTP",  rpe: "6–7", hr: "Z3 · 152–168 bpm",  adaptation: "Lactate threshold elevation", notes: "Return to full tempo effort at 76–84% FTP for 11 minutes after the surge block — this is the most physiologically demanding component of the session because you are sustaining threshold-adjacent power on a system already taxed by the surges. HR will likely run 5–8 bpm higher than the initial Tempo Foundation block at equivalent power; this is expected and is the overload mechanism that drives adaptation. If HR exceeds 168 bpm consistently, reduce power by 4% FTP — you are in threshold territory rather than sweet spot and the recovery cost is disproportionate. Cadence must not drop below 83 rpm; fatigue-induced cadence drop at this stage significantly increases glycolytic contribution and undermines the aerobic adaptation objective. Note any lap-by-lap power trends: the ability to hold 80%+ FTP in the final 3 minutes of this block is a direct measure of your fatigue resistance — a key performance determinant in criterium and road racing." },
      { name: "Cool Down",        timing: "39:00 – 45:00",mins: 6,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Six minutes at 40–50% FTP to clear the metabolic residue from a session that accumulated approximately 22 minutes of sweet-spot and surge work. HR should descend below 115 bpm within 3 minutes; slower recovery indicates a higher-than-typical fatigue load and warrants reducing tomorrow's training intensity. Keep cadence at 70–80 rpm rather than lower — very slow spinning at low power does not efficiently move blood through the quadriceps. Note your power output trend across the two tempo blocks: a less than 3% FTP reduction between Foundation and Sustain blocks indicates strong aerobic fitness; a greater than 5% reduction suggests the surge block power targets were too high for your current condition." },
    ],
  },
  "Evening Flow": {
    overview: "A moderate-intensity ride designed to end your day on a high. Flowing, rhythmic effort that energises without leaving you depleted — the perfect antidote to a desk day.",
    phases: [
      { name: "Warm Up",      timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1",   cadence: "75–85 rpm", power: "45–60% FTP", rpe: "2",   hr: "<120 bpm",          adaptation: "Metabolic priming",        notes: "Begin at 45–50% FTP and increase gradually to 60% FTP across the 8 minutes at 75–85 rpm — after a full working day, parasympathetic tone is high and the cardiovascular system requires more time to mobilise than a morning session. HR should be below 120 bpm throughout; if it is already elevated above this at 50% FTP, reduce targets for the entire session by 5% FTP to account for accumulated daily stress. Use these 8 minutes deliberately: roll the shoulders back, establish a neutral lumbar spine, and decompress the thoracic extension that builds up during a sedentary working day. The breathing pattern — controlled nasal inhalation, slow oral exhalation — serves a dual purpose here: it activates the aerobic metabolic pathway and begins the parasympathetic downshift that makes the subsequent flow blocks feel genuinely restorative." },
      { name: "Flow Block 1", timing: "8:00 – 20:00", mins: 12, zone: "Zone 2",   cadence: "85–95 rpm", power: "62–74% FTP", rpe: "3–4", hr: "Z2 · 125–152 bpm",  adaptation: "Aerobic base development",  notes: "Twelve minutes at 62–74% FTP and 85–95 rpm — pure Zone 2 aerobic work targeting the fat-oxidation pathway that underpins all endurance performance. HR in the 125–152 bpm band confirms you are in the aerobic training zone; above 155 bpm means you have crossed into glycolytic territory and must reduce resistance. The subjective feeling should be 'comfortably rhythmic' — you could hold a full conversation but would not choose to. Monitor for cadence consistency: in a well-trained cyclist, cadence variation across a 12-minute Zone 2 block should not exceed ±4 rpm; greater variation suggests core instability or neuromuscular fatigue. This block is the physiological equivalent of steady-state running: it drives mitochondrial biogenesis and capillary density in the slow-twitch fibre pool, both of which are the foundations of aerobic economy." },
      { name: "Tempo Lift",   timing: "20:00 – 32:00",mins: 12, zone: "Zone 2–3", cadence: "88–98 rpm", power: "70–80% FTP", rpe: "5–6", hr: "Z2–3 · 142–163 bpm", adaptation: "Lactate threshold elevation", notes: "Increase power to the 70–80% FTP sweet-spot zone and lift cadence to 88–98 rpm — this is a deliberate transition from pure aerobic to aerobic-plus-glycolytic work, which increases mitochondrial density and fat-oxidation capacity at higher intensities. HR in the 142–163 bpm range is the target; above 165 bpm at this power suggests fatigue-induced cardiovascular stress and warrants a return to Flow Block 1 prescription. Maintain the relaxed, flowing quality of the lower block — the increase in effort should come from added resistance, not from tension in the upper body or a choppy pedal stroke. In the final 3 minutes, monitor HR drift: stable HR in this range across the block confirms adequate aerobic fitness for this load; progressive HR rise of more than 5 bpm suggests you have slightly exceeded the sweet-spot zone." },
      { name: "Recovery",     timing: "32:00 – 36:00",mins: 4,  zone: "Zone 1",   cadence: "80–85 rpm", power: "45–55% FTP", rpe: "2",   hr: "<125 bpm",          adaptation: "Lactate clearance",         notes: "Four minutes at 45–55% FTP and 80–85 rpm — the slight cadence elevation relative to a typical cool-down is intentional for this phase, as it maintains blood flow for lactate clearance while the load is low enough to allow cardiovascular recovery. HR should drop below 125 bpm within 90 seconds; slower recovery here indicates the Tempo Lift block was slightly above your current aerobic capacity threshold. Use this time to perform slow abdominal breathing — a 4-count inhale expanding the belly, followed by a 6-count exhale — which activates the vagal nerve and accelerates the parasympathetic shift that makes this session genuinely restorative rather than simply non-depleting." },
      { name: "Cool Down",    timing: "36:00 – 45:00",mins: 9,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "A deliberately extended 9-minute cool-down appropriate for an evening session where transitioning to rest is part of the session's goal. Maintain 40–50% FTP at 70–80 rpm; HR should be below 115 bpm within the first 4 minutes. In the final 4 minutes, reduce cadence to 65 rpm and allow resistance to drop to 35–40% FTP — this final de-escalation bridges the gap between exercise and rest and supports the sleep-onset processes that are critical for recovery. Check in on perceived exertion for the full session: Evening Flow should feel like a 5–6/10 on days with low accumulated fatigue and a 6.5–7/10 on high-fatigue days — if it felt harder than that, reduce the frequency of tempo-lift sessions in the current training block." },
    ],
  },
  "Easy Endurance": {
    overview: "Pure aerobic base training. Low intensity, long sustained effort. This is the foundation all fitness is built upon — do not underestimate how important this session is.",
    phases: [
      { name: "Warm Up",        timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1",   cadence: "75–85 rpm", power: "45–58% FTP", rpe: "2", hr: "<120 bpm",          adaptation: "Metabolic priming",        notes: "Start at 45% FTP and increase to 58% FTP across 8 minutes at 75–85 rpm, keeping HR below 120 bpm throughout — at this intensity, any HR above 120 bpm before the main endurance block indicates insufficient recovery from prior sessions or excessive non-training stress, and today's entire session target should be reduced by 5% FTP. Establish a nasal breathing pattern from the first minute: the ability to breathe exclusively through the nose at Zone 1–2 intensity is both a marker and a driver of aerobic fitness — if you cannot maintain nasal breathing at 58% FTP after 6 minutes of warming up, your aerobic system is currently underdeveloped relative to your target training load. Focus on a smooth pedal stroke, specifically the upstroke: active hip flexor engagement through the 6–12 o'clock arc is often neglected at low intensities but develops the muscular recruitment pattern that pays dividends at higher efforts." },
      { name: "Endurance Base", timing: "8:00 – 38:00", mins: 30, zone: "Zone 2",   cadence: "82–92 rpm", power: "60–72% FTP", rpe: "3–4", hr: "Z2 · 125–152 bpm",  adaptation: "Aerobic base development",  notes: "Thirty minutes at 60–72% FTP and 82–92 rpm — this is classic Zone 2 aerobic base training and the single most evidence-based intervention for improving endurance performance at all levels. HR must remain in the 125–152 bpm band for the entire block; any consistent reading above 152 bpm means you are above Zone 2 and accumulating glycolytic fatigue that defeats the purpose of this session — reduce resistance immediately. The subjective feel should be: you can hold a full, complete conversation without pausing for breath. If you cannot do this, ease off. Monitor for HR drift across the 30-minute block: in good aerobic condition, HR at equivalent power should rise no more than 8–10 bpm from minute 5 to minute 30; greater drift than this indicates Zone 2 is currently at the limit of your aerobic capacity — exactly the stimulus that will improve it over 6–8 weeks." },
      { name: "Cool Down",      timing: "38:00 – 45:00",mins: 7,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Seven minutes at 40–50% FTP to transition out of the sustained aerobic work — even at Zone 2, 30 minutes of continuous effort elevates blood lactate above resting levels and requires active clearance. HR should descend below 115 bpm within 3 minutes. Use the final 3 minutes to note your session data: average HR for the endurance block, perceived exertion, and any cadence drift below 82 rpm. Tracking these metrics across repeated Easy Endurance sessions is how you quantify aerobic adaptation — the primary signal of improving fitness is a lower average HR for the same power output, typically observable after 4–6 consistent sessions of this type." },
    ],
  },
  "Recovery Ride": {
    overview: "Active recovery session. The goal is movement, not exertion. Keep intensity very low to promote blood flow, clear lactate, and aid the adaptations from previous hard sessions.",
    phases: [
      { name: "Easy Roll", timing: "0:00 – 45:00", mins: 45, zone: "Zone 1", cadence: "75–90 rpm", power: "40–55% FTP", rpe: "1–2", hr: "<115 bpm", adaptation: "Lactate clearance", notes: "Maintain 40–55% FTP at 75–90 rpm for the full 45 minutes with HR below 115 bpm — if your HR climbs above 120 bpm at this power, reduce resistance without negotiation; the entire physiological purpose of this session is parasympathetic enhancement through non-stressful movement, and any loading above Zone 1 converts it from a recovery session into an additional training stress. Cadence should sit toward the higher end of the range (85–90 rpm) if the preceding 24–48 hours contained heavy strength or climbing work, as the lighter force-per-stroke accelerates blood flow through metabolically fatigued muscle fibres without adding mechanical load. The adaptation being sought here is not fitness — it is the removal of residual metabolic by-products and the re-sensitisation of cellular receptors that are downregulated by heavy training. Treat this as deliberately as your hardest sessions: arriving at a hard session with properly executed recovery work between sessions is the difference between 85% and 100% quality in those hard efforts." },
    ],
  },
  "Midday Burn": {
    overview: "A lunchtime efficiency session — maximum benefit in minimum time. Moderate intensity with just enough push to make every minute count.",
    phases: [
      { name: "Warm Up",      timing: "0:00 – 6:00",  mins: 6,  zone: "Zone 1–2", cadence: "80–90 rpm", power: "52–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",        notes: "A 6-minute warm-up is on the short end for the subsequent effort levels — execute it precisely to compensate for brevity. Build from 52% to 65% FTP across the 6 minutes, adding resistance every 90 seconds, and target HR in the 110–125 bpm range by minute 5. At minute 4, execute 2 × 6-second accelerations to 85–90% effort to pre-activate the fast-twitch motor units that will be needed in the Power Finish block. If HR exceeds 125 bpm before the main effort, today's fatigue state is elevated and the Power Finish target should be dropped to 85–95% FTP. Ensure your pedal stroke is mechanically sound before increasing intensity — at lunchtime, the body often carries residual muscular tension from desk work, making a focused neuromuscular check during the warm-up particularly valuable." },
      { name: "Tempo Block",  timing: "6:00 – 24:00", mins: 18, zone: "Zone 3",   cadence: "85–95 rpm", power: "76–86% FTP",  rpe: "6–7", hr: "Z3 · 152–163 bpm",  adaptation: "Lactate threshold elevation", notes: "Eighteen minutes at 76–86% FTP is the highest-volume sweet-spot block in the studio programme — for a time-constrained session, this represents an excellent return on investment because sweet-spot work produces near-threshold adaptations at a significantly lower recovery cost than true threshold intervals. HR in the 152–163 bpm band confirms correct loading; if HR climbs above 165 bpm, you are in Zone 4 threshold territory and the 18-minute duration becomes unsustainable — reduce by 4% FTP immediately. Cadence must not drift below 83 rpm: the temptation in a long sweet-spot block is to drop cadence and rely on increased force, which shifts the metabolic demand glycolytically and reduces the aerobic training stimulus. In minutes 12–16, focus on maintaining power consistency over the previous 6 minutes rather than how much time remains — a distraction-free execution focus produces significantly better sustained output." },
      { name: "Power Finish", timing: "24:00 – 36:00",mins: 12, zone: "Zone 4",   cadence: "90–100 rpm",power: "88–100% FTP", rpe: "7–8", hr: "Z4 · 163–174 bpm",  adaptation: "Lactate threshold elevation", notes: "Twelve minutes at 88–100% FTP following 18 minutes of sweet-spot work — you are now at functional threshold with pre-fatigued legs, which is exactly the overload condition that drives the greatest FTP adaptation. HR should be in the 163–174 bpm zone; above 174 bpm indicates you are working above threshold on a depleted system and should reduce to 92–96% FTP. Increase cadence slightly to 90–100 rpm versus the tempo block: the higher cadence partially offloads the peak torque demand and allows the cardiovascular system to carry more of the total demand, which is the mechanism through which this block produces a second wave of adaptation after the sustained tempo. Failure signal: power dropping more than 7% FTP involuntarily for more than 20 seconds in the final 4 minutes means you have slightly over-reached — note the exact minute this occurs as your current aerobic-to-threshold fatigue threshold." },
      { name: "Cool Down",    timing: "36:00 – 45:00",mins: 9,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Nine minutes of active recovery at 40–50% FTP — longer than the work blocks, which is appropriate given the combined 30 minutes of sweet-spot and threshold work just completed. HR should be below 120 bpm within 3 minutes and below 115 bpm by the session end. Maintain 70–80 rpm rather than stopping or slowing below 65 rpm; the rotational motion is the mechanical driver of metabolic clearance. If you must return to work within 15 minutes of finishing, prioritise the cool-down over any stretching — vascular clearance of lactate is more time-critical in the short term than flexibility. Eat a mixed carbohydrate-protein snack within 30 minutes of this session to exploit the post-exercise glycogen-resynthesis window." },
    ],
  },
  "Night Ride": {
    overview: "A moderate evening session to cap the day. Balanced intensity with a focus on leaving it all on the bike before rest — and still winding down properly.",
    phases: [
      { name: "Warm Up",       timing: "0:00 – 8:00",  mins: 8,  zone: "Zone 1–2", cadence: "78–88 rpm", power: "50–65% FTP", rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",        notes: "Build from 50% to 65% FTP across 8 minutes at 78–88 rpm — evening sessions carry the accumulated fatigue and psychological load of the full working day, so the warm-up has both a physiological and a mental resetting function. HR should remain below 125 bpm; if it is already elevated entering the session, reduce all subsequent targets by 5% FTP. Deliberately check posture from the outset: after a day of sitting, hip flexors are often shortened and thoracic mobility is restricted — spend 30 seconds in the first 2 minutes exaggerating thoracic extension (chest up, shoulders back) and actively resetting the neutral pelvis position on the saddle. The 3-count nasal inhale, 4-count exhale breathing pattern begun here will moderate cortisol and support the parasympathetic shift you will need for quality sleep 60–90 minutes after the session ends." },
      { name: "Endurance Base",timing: "8:00 – 22:00", mins: 14, zone: "Zone 2",   cadence: "85–92 rpm", power: "62–74% FTP", rpe: "3–4", hr: "Z2 · 125–152 bpm",  adaptation: "Aerobic base development",  notes: "Fourteen minutes at 62–74% FTP and 85–92 rpm in Zone 2 — the primary objective here is fat-oxidation pathway loading at a stimulus intensity that will not significantly elevate cortisol or impair sleep onset. HR in the 125–152 bpm band is the critical constraint: exceeding 152 bpm shifts the metabolic profile from predominantly aerobic to glycolytic and increases the post-session sympathetic tone that can delay sleep. Monitor cadence consistency: at this power and cadence combination, you should be able to maintain ±3 rpm around your target without active effort — this reflects the degree to which the neuromuscular pattern has become automatic. If cadence requires active management to maintain, increase session frequency at this intensity, as automaticity is a marker of Zone 2 adaptation." },
      { name: "Tempo Effort",  timing: "22:00 – 36:00",mins: 14, zone: "Zone 3",   cadence: "88–96 rpm", power: "76–86% FTP", rpe: "6–7", hr: "Z3 · 152–168 bpm",  adaptation: "Lactate threshold elevation", notes: "Increase to 76–86% FTP for 14 minutes — this is the session's primary training stimulus and the transition from aerobic maintenance to genuine adaptation-inducing load. HR in the 152–168 bpm range confirms correct loading; above 170 bpm at this time of day after an accumulated daily stress load suggests the body's total allostatic load is high, and this block should be reduced to 72–80% FTP. Cadence should increase slightly to 88–96 rpm versus the endurance base: the higher cadence reduces per-stroke force demand and limits the lactate accumulation that would compromise both session quality and post-session sleep architecture. In the final 4 minutes, maintain focus on power consistency: a reduction of more than 4% FTP in the last 4 minutes relative to the first 4 minutes indicates the block duration slightly exceeds your current capacity for this load at this time of day." },
      { name: "Cool Down",     timing: "36:00 – 45:00",mins: 9,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Nine minutes at 40–50% FTP — the extended cool-down is deliberate and critical for a night session. HR should descend below 115 bpm within 4 minutes; if still above 120 bpm at 6 minutes, reduce resistance to 35% FTP. In the final 3 minutes, reduce cadence to 65 rpm and allow the body to fully decelerate — this controlled deceleration supports the drop in core temperature and heart rate that is prerequisite for quality sleep onset. Avoid checking performance data or social media immediately after this cool-down: mental stimulation post-exercise extends the sympathetic activation window. Note your session RPE: Night Ride should feel like a 5.5–6.5/10; if it felt harder than 7, tomorrow should be a rest or recovery day." },
    ],
  },
  "Endurance Builder": {
    overview: "Progressive endurance session building volume at aerobic intensity. Each block is slightly longer than the last — deliberate overload that compounds over weeks.",
    phases: [
      { name: "Warm Up", timing: "0:00 – 7:00",  mins: 7,  zone: "Zone 1",   cadence: "78–88 rpm", power: "48–60% FTP", rpe: "2",   hr: "<120 bpm",          adaptation: "Metabolic priming",        notes: "Build from 48% to 60% FTP over 7 minutes at 78–88 rpm with HR below 120 bpm — the endurance builder session is a progressive-overload aerobic session and demands a conservative, gradual warm-up that does not pre-fatigue the aerobic system before any of the three main blocks. Establish nasal breathing from the first minute: exclusive nasal breathing at 60% FTP after a 7-minute warm-up is the baseline standard for adequate aerobic fitness at this session type. At minutes 4 and 6, check pedal stroke quality: activate the hamstring actively through the backstroke and focus on a quiet, smooth circular motion rather than a two-stroke push-and-coast pattern. Note your resting HR before the session and compare to the HR you achieve at 60% FTP by minute 6 — this ratio is a sensitive marker of daily readiness status." },
      { name: "Block 1",  timing: "7:00 – 17:00", mins: 10, zone: "Zone 2",   cadence: "85–92 rpm", power: "62–72% FTP", rpe: "3–4", hr: "Z2 · 125–152 bpm",  adaptation: "Aerobic base development",  notes: "Ten minutes at 62–72% FTP and 85–92 rpm — pure Zone 2 aerobic base work targeting fat oxidation and mitochondrial biogenesis. HR must remain in the 125–152 bpm band; any consistent reading above 152 bpm means you are above Zone 2 and must reduce resistance. Establish your sustainable rhythm in this block because it will serve as the physiological and technical reference point for blocks 2 and 3. A key diagnostic: if your power at HR 148–152 bpm is in the lower half of the 62–72% FTP range rather than the upper half, your aerobic fitness is currently limiting this session and regular execution of this programme will produce measurable improvement in the 62–72% FTP range within 4–6 weeks." },
      { name: "Block 2",  timing: "17:00 – 29:00",mins: 12, zone: "Zone 2–3", cadence: "85–95 rpm", power: "68–78% FTP", rpe: "4–5", hr: "Z2–3 · 135–163 bpm", adaptation: "Aerobic base development",  notes: "Increase power to 68–78% FTP and cadence slightly to 85–95 rpm — 2 minutes longer than Block 1 and at slightly higher intensity, which is the session's deliberate progressive overload. HR will naturally drift 5–8 bpm higher than Block 1 at comparable power due to cardiovascular drift from accumulated duration; this is expected and does not represent a failure. If HR exceeds 163 bpm, reduce power by 4% FTP — you have crossed from sweet-spot territory into threshold, which has a disproportionately higher recovery cost relative to the aerobic training benefit of this session. Cadence should increase slightly to compensate for the higher power: a higher rpm at higher power maintains the proportion of aerobic-to-glycolytic demand, which is the mechanism that allows each successive block to be slightly harder without crossing the threshold." },
      { name: "Block 3",  timing: "29:00 – 43:00",mins: 14, zone: "Zone 3",   cadence: "88–95 rpm", power: "74–84% FTP", rpe: "6–7", hr: "Z3 · 148–163 bpm",  adaptation: "Lactate threshold elevation", notes: "The longest block of the session at 14 minutes and 74–84% FTP — you are now in sweet-spot territory with two prior aerobic blocks creating a meaningful background of cardiovascular fatigue. This is exactly the overload condition that produces the strongest aerobic adaptation signal because the mitochondria are being recruited at elevated capacity against a background of glycogen depletion and elevated blood lactate. HR will run higher than the earlier blocks at equivalent power; if it exceeds 168 bpm, reduce power by 4% FTP. Monitor power consistency across the 14 minutes: maintaining power within ±3% FTP throughout, despite increasing fatigue, is the primary execution KPI and the measure that will improve most visibly across repeated sessions of this programme. The final 3 minutes are the most adaptive — hold position." },
      { name: "Cool Down",timing: "43:00 – 45:00",mins: 2,  zone: "Zone 1",   cadence: "70–80 rpm", power: "40–50% FTP", rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Two minutes is the absolute minimum for an on-bike cool-down after 36 minutes of progressive aerobic work — immediately follow this with at least 5 minutes of off-bike walking or light movement to continue the lactate clearance and cardiovascular deceleration process. HR should descend toward 115 bpm within these 2 minutes; if it is still above 130 bpm at the end, slow walking and controlled breathing off-bike are essential before any stretching. Record your average HR across all three blocks and track this metric weekly: a systematic decline in block-average HR at equivalent power targets is the primary quantitative marker that this programme is producing the intended aerobic adaptation." },
    ],
  },
  "Lunch Sprint": {
    overview: "Short, sharp and no-nonsense. A lunchtime session designed to maximise intensity in minimal time — you will feel this one all afternoon.",
    phases: [
      { name: "Warm Up",          timing: "0:00 – 6:00",  mins: 6,  zone: "Zone 1–2", cadence: "80–90 rpm",  power: "52–65% FTP",  rpe: "2–3", hr: "<125 bpm",          adaptation: "Metabolic priming",        notes: "Six minutes to prepare for maximum sprint efforts — this is an abbreviated warm-up and must be executed with precision to compensate for brevity. Build from 52% to 65% FTP every 90 seconds at 80–90 rpm, targeting HR in the 110–125 bpm range by minute 5. At minutes 3 and 5, execute 8-second accelerations to 90% effort to pre-activate the PCr system and fast-twitch motor unit pool that will deliver sprint power. If HR has not reached 110 bpm by minute 4, increase resistance more aggressively — arriving at the Building Efforts phase cold will mean the first sprint is a warm-up in disguise rather than a genuine maximal effort. Lunchtime sessions often carry morning cortisol residue; the elevated catecholamine state can actually support sprint performance, but only if the warm-up has fully engaged the cardiovascular system." },
      { name: "Building Efforts", timing: "6:00 – 14:00", mins: 8,  zone: "Zone 3",   cadence: "88–96 rpm",  power: "76–86% FTP",  rpe: "6–7", hr: "Z3 · 152–168 bpm",  adaptation: "Lactate threshold elevation", notes: "Three × 2-minute building efforts at 76–86% FTP — these are not recovery intervals; they are a final high-quality neuromuscular activation phase that prepares the fast-twitch fibre pool for maximal sprint output. Each 2-minute effort should feel progressively harder: minute 1 at 76–79% FTP, minute 2 at 82–86% FTP. HR should reach the 152–168 bpm range by the end of each effort; recovery between efforts is a 30-second reduction to 65–70% FTP, not a full stop. The cadence target of 88–96 rpm pre-loads the neuromuscular pattern that the sprint block will demand at 100–115 rpm — the closer your building-effort cadence is to your sprint cadence, the more effective the neurological priming. If HR does not come below 150 bpm in the 30-second recovery, extend the inter-effort rest to 45 seconds to ensure each building effort is executed at full quality." },
      { name: "Sprint Block",     timing: "14:00 – 32:00",mins: 18, zone: "Zone 5–6", cadence: "100–115 rpm",power: "120–150% FTP", rpe: "9–10 / max", hr: "Z5–6 · >174 bpm", adaptation: "Anaerobic capacity",        notes: "Six × 30-second maximum-effort sprints with 2-minute active recovery between each — the 1:4 work-to-rest ratio allows near-complete PCr resynthesis between efforts, which means each sprint should be executed at approximately the same peak power. If sprint 3 or 4 shows more than a 10% power drop versus sprint 1, PCr resynthesis is incomplete and the 2-minute recovery periods are not being executed at a low enough intensity — ensure recovery power is below 50% FTP. Drive cadence from 100 to 115 rpm within the first 5 seconds of each sprint using pre-loaded leg speed rather than a grinding force build-up; the explosive cadence onset is the stimulus that maximally recruits type-IIx fibres. Peak sprint power should be recorded for each effort: a flat or improving trend across 6 sprints indicates excellent phosphocreatine resynthesis efficiency; a declining trend beyond sprint 3 reveals an aerobic base deficit that limits recovery between efforts." },
      { name: "Cool Down",        timing: "32:00 – 45:00",mins: 13, zone: "Zone 1",   cadence: "70–80 rpm",  power: "40–50% FTP",  rpe: "1–2", hr: "<115 bpm",          adaptation: "Lactate clearance",         notes: "Thirteen minutes of active recovery — deliberately generous for a sprint session to ensure complete metabolic clearance before returning to professional or academic work, where cognitive performance can be compromised by residual lactate and sympathetic nervous system activation. Maintain 40–50% FTP at 70–80 rpm throughout; HR should reach below 120 bpm within the first 4 minutes and below 115 bpm by minute 8. In minutes 9–13, reduce cadence to 65 rpm and allow the body to fully decelerate: this graduated deceleration accelerates the cardiovascular and thermal recovery that makes the afternoon productive rather than fatigued. Note your peak power for each sprint and your HR recovery rate (bpm drop per minute in cool-down) — both metrics should improve measurably across 4–6 weeks of consistent Lunch Sprint sessions." },
    ],
  },
}

const INTENSITY_PROFILES = {
  "Evening Flow":      [2, 3, 4, 5, 4, 3, 5, 4, 3, 2, 3, 2],
  "Tempo Foundation":  [4, 5, 6, 5, 7, 6, 5, 7, 6, 5, 6, 5],
  "Threshold Push":    [3, 5, 7, 8, 9, 8, 7, 9, 8, 7, 6, 5],
  "Power Tempo":       [3, 5, 6, 8, 9, 7, 6, 8, 9, 7, 5, 4],
  "Sunrise Power":     [2, 3, 5, 4, 6, 8, 7, 5, 7, 6, 4, 3],
  "Lunch Sprint":      [4, 6, 8, 9, 7, 8, 9, 7, 6, 8, 5, 3],
  "Cadence Control":   [5, 6, 5, 6, 7, 6, 5, 6, 7, 6, 5, 6],
  "Rhythm Ride":       [3, 5, 4, 6, 5, 7, 6, 5, 6, 7, 5, 4],
  "Easy Endurance":    [2, 2, 3, 2, 3, 3, 2, 3, 2, 3, 2, 2],
  "Recovery Ride":     [1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2],
  "Endurance Builder": [2, 3, 4, 3, 4, 4, 5, 4, 3, 4, 3, 4],
  "HIIT Blast":        [2, 5, 9, 3, 9, 3, 9, 3, 9, 3, 9, 5],
  "Midday Burn":       [3, 5, 7, 6, 8, 7, 6, 7, 6, 7, 5, 3],
  "Night Ride":        [3, 4, 5, 6, 7, 6, 5, 7, 6, 5, 6, 5],
  "Climb Intervals":   [2, 3, 5, 7, 9, 5, 3, 6, 8, 9, 6, 3],
}

function getIntensity(name) {
  return INTENSITY_PROFILES[name] || [2, 4, 3, 7, 9, 6, 4, 3, 6, 5, 8, 7]
}

// Each interval: [seconds, zone 1-7]
const SESSION_INTERVALS = {
  _default: [
    [300,1],[180,2],[240,3],[90,2],[240,3],[90,2],[300,3],[120,2],[300,3],[120,2],[300,2],[300,1],
  ],
  "Sunrise Power": [
    [180,1],[120,2],[120,2],
    [120,2],[90,3],[60,2],[90,3],[60,2],
    [120,3],[60,2],[120,3],[60,2],[150,4],[60,2],[120,4],[60,2],[90,4],
    [60,4],[60,6],[120,1],[60,6],[120,1],[60,6],[60,1],
    [180,1],[300,1],
  ],
  "Rhythm Ride": [
    [180,1],[180,2],
    [90,2],[60,3],[30,2],[90,3],[60,2],[90,3],[60,2],[120,3],
    [60,2],[90,3],[30,2],[60,3],[30,2],[90,3],[60,2],[90,3],[60,3],[30,2],
    [60,3],[90,4],[60,3],[90,4],[60,3],[90,4],[60,3],[90,4],
    [240,2],[300,1],
  ],
  "Cadence Control": [
    [240,1],[120,2],[120,2],
    [60,2],[90,3],[60,3],[90,3],[60,2],[90,3],[60,3],[60,2],[60,3],[60,3],[60,2],[90,3],[60,2],
    [60,3],[60,4],[60,3],[60,4],[60,3],[60,4],[60,3],[60,4],[60,3],[60,4],
    [30,4],[60,5],[60,1],[60,5],[60,1],[60,5],[60,1],[60,5],[90,1],
    [120,2],[120,1],
  ],
  "Climb Intervals": [
    [150,1],[150,2],[120,2],[60,3],
    [240,4],[60,1],[270,4],[60,2],
    [60,4],[120,5],[60,4],[60,2],
    [120,4],[60,5],[60,6],[60,4],[120,1],
    [120,3],[240,4],[120,3],[60,4],[120,3],
    [180,2],[120,1],
  ],
  "Tempo Foundation": [
    [240,1],[180,2],
    [120,2],[180,3],[60,2],[180,3],[60,2],[180,3],[60,2],
    [90,3],[120,4],[90,3],[120,4],[90,3],[120,4],
    [60,4],[60,5],[120,3],[60,5],[120,3],[60,4],
    [180,2],[120,1],
  ],
  "HIIT Blast": [
    [240,1],[120,2],[120,3],
    [30,5],[30,1],[30,5],[30,1],[30,5],[30,1],[30,5],[30,1],[30,5],[60,1],
    [120,2],
    [30,6],[30,1],[30,6],[30,1],[30,6],[30,1],[30,6],[30,1],[30,6],[60,1],
    [120,2],
    [30,6],[30,1],[30,6],[30,1],[30,6],[30,1],[30,6],[30,1],[30,7],[60,1],
    [120,2],
    [30,7],[30,1],[30,7],[30,1],[30,7],[30,1],[30,7],[30,1],[30,7],[90,1],
    [180,2],[120,1],
  ],
  "Threshold Push": [
    [180,1],[120,2],[120,3],[60,2],
    [120,3],[180,4],[60,2],
    [720,4],
    [180,2],
    [600,4],
    [120,2],[180,1],
  ],
  "Power Tempo": [
    [180,1],[180,2],[60,3],
    [120,3],[60,4],[60,3],[60,4],[60,3],[60,4],[60,3],
    [120,2],
    [90,3],[60,4],[30,5],[60,4],[30,5],[60,4],[30,5],[60,4],[90,3],
    [120,2],
    [90,4],[60,5],[30,2],[60,5],[30,2],[60,5],[30,2],[60,5],[90,3],
    [120,2],[120,1],
  ],
  "Evening Flow": [
    [180,1],[240,2],[120,2],
    [240,2],[90,3],[90,2],[90,3],[90,2],
    [360,2],
    [90,3],[120,2],[90,3],[120,2],
    [360,2],
    [90,3],[120,2],[90,3],
    [180,2],[180,1],
  ],
  "Easy Endurance": [
    [180,1],[300,2],[180,2],
    [600,2],[120,2],
    [90,3],[300,2],[90,3],[180,2],
    [300,2],[90,3],[90,2],
    [180,2],[180,1],
  ],
  "Recovery Ride": [
    [300,1],[480,2],[300,1],
    [480,2],[240,1],[120,2],
    [360,2],[180,2],[120,1],[120,1],
  ],
  "Midday Burn": [
    [180,1],[120,2],[120,3],
    [90,3],[60,4],[60,3],[60,4],[60,3],[60,4],[60,3],[60,4],[60,3],
    [60,2],
    [90,4],[30,5],[60,4],[30,5],[60,4],[30,5],[60,4],[90,3],
    [60,2],
    [90,3],[60,4],[30,5],[60,4],[30,5],[90,3],[60,4],[60,3],
    [180,2],[120,1],
  ],
  "Night Ride": [
    [180,1],[180,2],[120,2],
    [90,2],[120,3],[60,2],[120,3],[60,2],[120,3],[60,2],
    [120,3],[90,4],[120,3],[90,4],[120,3],[90,4],
    [60,4],[60,5],[60,4],[60,5],[60,4],[60,5],[60,3],
    [240,2],[120,1],[120,1],
  ],
  "Endurance Builder": [
    [180,1],[240,2],[120,2],
    [240,3],[60,2],[300,3],[60,2],[360,3],[60,2],
    [90,3],[120,4],[90,3],[120,4],[90,2],
    [300,2],[120,1],
  ],
  "Lunch Sprint": [
    [180,1],[120,2],[60,3],
    [30,4],[30,5],[30,6],[30,5],[30,2],[60,2],
    [30,4],[30,6],[30,7],[30,6],[30,2],[60,2],
    [30,4],[30,6],[30,7],[30,6],[30,2],[60,2],
    [30,4],[30,6],[30,7],[30,7],[30,2],[60,2],
    [30,5],[30,6],[30,7],[30,7],[30,7],[30,6],[30,2],[60,2],
    [180,3],[120,3],
    [90,4],[30,6],[30,7],[60,6],[30,4],[60,3],
    [180,2],[120,1],
  ],
}

const ZONE_COLORS  = ["#36aee2","#82ed3c","#fde53d","#fb7512","#e91236","#741a10","#6c3d84"]
const ZONE_HEIGHTS = [12, 28, 46, 64, 80, 92, 100]
const ZONE_NAMES   = ["Recovery","Endurance","Tempo","Threshold","VO₂ Max","Anaerobic","Sprint"]

function fmtSecs(s) {
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60), r = s % 60
  return r ? `${m}m ${r}s` : `${m}m`
}

function processIntervals(raw) {
  // 1. Merge consecutive same-zone intervals
  const merged = raw.reduce((acc, [secs, zone]) => {
    if (acc.length && acc[acc.length - 1][1] === zone) {
      acc[acc.length - 1] = [acc[acc.length - 1][0] + secs, zone]
    } else {
      acc.push([secs, zone])
    }
    return acc
  }, [])

  // 2. Split any high-intensity (Z5+) block longer than 90s into effort + recovery
  const out = []
  for (const [secs, zone] of merged) {
    if (zone >= 5 && secs > 90) {
      const effortSecs = 60
      const restSecs   = secs - effortSecs
      out.push([effortSecs, zone])
      out.push([restSecs, 1])
    } else {
      out.push([secs, zone])
    }
  }

  // 3. Re-merge after splitting (catches new adjacencies in the Z1 blocks)
  return out.reduce((acc, [secs, zone]) => {
    if (acc.length && acc[acc.length - 1][1] === zone) {
      acc[acc.length - 1] = [acc[acc.length - 1][0] + secs, zone]
    } else {
      acc.push([secs, zone])
    }
    return acc
  }, [])
}

function WorkoutChart({ sessionName, darkMode }) {
  const [hov, setHov] = useState(null)
  const intervals = processIntervals(SESSION_INTERVALS[sessionName] || SESSION_INTERVALS._default)
  const total     = intervals.reduce((s, iv) => s + iv[0], 0)

  return (
    <div className="relative select-none">
      {/* Tooltip */}
      {hov !== null && (() => {
        const [secs, zone] = intervals[hov]
        const leftPct = intervals.slice(0, hov).reduce((s, iv) => s + iv[0], 0) / total * 100
        return (
          <div className={`absolute bottom-full mb-2 text-xs px-2.5 py-1.5 rounded-lg pointer-events-none whitespace-nowrap z-10 font-medium
            ${darkMode ? "bg-gray-700 text-white" : "bg-gray-900 text-white"}`}
            style={{ left: `clamp(0%, ${leftPct}%, calc(100% - 120px))` }}>
            {fmtSecs(secs)} · Zone {zone} · {ZONE_NAMES[zone - 1]}
          </div>
        )
      })()}

      {/* Bars */}
      <div className="flex items-end w-full" style={{ height: 80, gap: "1.5px" }}>
        {intervals.map(([secs, zone], i) => (
          <div
            key={i}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={{
              flex: `0 0 calc(${secs / total * 100}% - 1.5px)`,
              height: `${ZONE_HEIGHTS[zone - 1]}%`,
              background: ZONE_COLORS[zone - 1],
              borderRadius: "2px 2px 0 0",
              opacity: hov === null || hov === i ? 1 : 0.45,
              transition: "opacity 0.1s",
              cursor: "default",
            }}
          />
        ))}
      </div>

      {/* Time axis */}
      <div className="relative mt-2" style={{ height: 14 }}>
        {[0, 600, 1200, 1800, 2400].concat([total]).map((s, i, arr) => {
          const unique = arr.indexOf(s) === i
          if (!unique || s > total + 30) return null
          const pct = (Math.min(s, total) / total) * 100
          const label = `${Math.floor(s / 60)}:00`
          return (
            <span key={s} className={`absolute text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}
              style={{ left: `${pct}%`, top: 0, transform: pct < 4 ? "none" : pct > 93 ? "translateX(-100%)" : "translateX(-50%)" }}>
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function SessionDonut({ sessionName, darkMode }) {
  const [hov, setHov] = useState(null)
  const intervals = SESSION_INTERVALS[sessionName] || SESSION_INTERVALS._default
  const total     = intervals.reduce((s, [secs]) => s + secs, 0)

  const zt = Array(7).fill(0)
  intervals.forEach(([secs, zone]) => { zt[zone - 1] += secs })

  const zones = zt
    .map((secs, i) => ({ zone: i + 1, secs, pct: secs / total, color: ZONE_COLORS[i], name: ZONE_NAMES[i] }))
    .filter(z => z.pct >= 0.01)

  const size = 120, cx = 60, cy = 60, outerR = 54, innerR = 35
  let angle = -90
  const slices = zones.map(z => {
    const start = angle
    const sweep = z.pct * 360
    angle += sweep
    return { ...z, start, sweep }
  })

  function arc(start, sweep, outer, inner) {
    const r = d => d * Math.PI / 180
    const clampedSweep = Math.min(sweep, 359.99)
    const x1 = cx + outer * Math.cos(r(start)),           y1 = cy + outer * Math.sin(r(start))
    const x2 = cx + outer * Math.cos(r(start+clampedSweep)), y2 = cy + outer * Math.sin(r(start+clampedSweep))
    const x3 = cx + inner * Math.cos(r(start+clampedSweep)), y3 = cy + inner * Math.sin(r(start+clampedSweep))
    const x4 = cx + inner * Math.cos(r(start)),           y4 = cy + inner * Math.sin(r(start))
    const lg = clampedSweep > 180 ? 1 : 0
    return `M${x1},${y1} A${outer},${outer} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${inner},${inner} 0 ${lg} 0 ${x4},${y4} Z`
  }

  const pct = i => Math.round(zt[i] / total * 100)
  const recov   = pct(0) + pct(1)
  const tempo   = pct(2)
  const thresh  = pct(3)
  const hi      = pct(4) + pct(5) + pct(6)

  let line1, line2
  if (hi > 15) {
    const ratio = Math.round(recov / (hi || 1))
    line1 = `${hi}% of session time is spent at Zone 5 or above, with ${recov}% as structured active recovery — a ${ratio}:1 rest-to-work ratio calibrated to sustain maximal output quality across every effort.`
    line2 = `Repeated supramaximal exposures at this density drive anaerobic capacity and VO₂ max adaptations that typically take 6–8 weeks of consistent stimulus to fully express in race-level performance.`
  } else if (thresh > 30) {
    const threshMins = Math.round(zt[3] / 60)
    line1 = `${thresh}% of this session — approximately ${threshMins} minutes — is spent at Zone 4 threshold, making it a direct FTP development stimulus rather than an aerobic maintenance session.`
    line2 = `Each sustained threshold minute above 20 per session begins to drive the capillarisation and mitochondrial enzyme upregulation that raises sustainable power output over a 6–12 week training block.`
  } else if (recov > 62) {
    line1 = `${recov}% of session time in Zone 1–2 specifically targets fat oxidation efficiency and mitochondrial density — adaptations that require accumulated sub-threshold volume, not intensity.`
    line2 = `The ${tempo}% tempo component adds a modest aerobic overload above the first lactate threshold without generating accumulation that would compromise recovery quality or subsequent hard sessions.`
  } else {
    const domLabel = tempo >= thresh ? `sweet spot (Zone 3, ${tempo}%)` : `threshold (Zone 4, ${thresh}%)`
    line1 = `The primary training stimulus centres on ${domLabel} work, with ${recov}% of session time allocated to warm-up and active recovery between efforts.`
    line2 = `Multi-zone sessions of this structure develop lactate buffering capacity — the ability to sustain output while managing rising metabolite concentrations — a defining characteristic of race-ready aerobic fitness.`
  }

  const hovZ = hov !== null ? zones[hov] : null

  return (
    <div className="flex flex-col sm:flex-row gap-5 items-start">
      {/* Donut */}
      <div className="flex-shrink-0 relative">
        <svg width={size} height={size} style={{ display: "block" }}>
          {slices.map((s, i) => (
            <path key={i}
              d={arc(s.start, s.sweep, hov === i ? outerR + 4 : outerR, innerR)}
              fill={s.color}
              opacity={hov === null || hov === i ? 1 : 0.3}
              style={{ cursor: "default", transition: "opacity 0.12s" }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            />
          ))}
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize={13} fontWeight={700}
            fill={hovZ ? hovZ.color : (darkMode ? "#f9fafb" : "#1b2333")}>
            {hovZ ? `${Math.round(hovZ.pct * 100)}%` : "45m"}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" fontSize={9} fontWeight={500}
            fill={darkMode ? "#6b7280" : "#9aa3b0"}>
            {hovZ ? hovZ.name : "session"}
          </text>
        </svg>
      </div>

      {/* Legend + analysis */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
          {zones.map((z, i) => (
            <div key={i} className="flex items-center gap-1.5 cursor-default"
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color,
                opacity: hov === null || hov === i ? 1 : 0.3 }} />
              <span className="text-xs font-medium transition-colors"
                style={{ color: hov === i ? z.color : darkMode ? "#9ca3af" : "#6b7280" }}>
                Z{z.zone} · {ZONE_NAMES[z.zone - 1]} · {Math.round(z.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
        <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {line1} {line2}
        </p>
      </div>
    </div>
  )
}

function BookingsPage({ darkMode, onToggleDarkMode }) {
  const [selectedSession, setSelectedSession] = useState(null)
  const [selectedBike, setSelectedBike]       = useState(null)
  const bookingDrag = useDragToDismiss(() => { setSelectedSession(null); setShowPlan(false) })
  const [bookedSessions, setBookedSessions]   = useState([])
  const [toast, setToast]                     = useState(null)
  const [showPlan, setShowPlan]               = useState(false)
  const [weekOffset, setWeekOffset]           = useState(0)
  const [selectedDate, setSelectedDate]       = useState(BOOKING_TODAY)
  const [viewMode, setViewMode]               = useState("week")
  const [monthView, setMonthView]             = useState({ year: 2026, month: 2 })

  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const heading = darkMode ? "text-white"      : "text-gray-900"
  const muted   = darkMode ? "text-gray-400"   : "text-gray-500"
  const subtle  = darkMode ? "bg-gray-800"     : "bg-gray-50"
  const divider = darkMode ? "border-gray-800" : "border-gray-100"

  const weekDates   = getWeekDates(weekOffset)
  const dayData     = sessionsByDate[selectedDate] || { morning: [], afternoon: [], evening: [] }
  const hasSessions = Object.values(dayData).some(arr => arr.length > 0)
  const monthCells  = getMonthGrid(monthView.year, monthView.month)
  const isPast      = selectedDate < BOOKING_TODAY

  function handleBook(session) {
    const key = session.time + session.name
    setBookedSessions(prev => [...prev, key])
    setToast(`Booked: ${session.name}`)
    setSelectedSession({ ...session, state: "booked" })
    setTimeout(() => setToast(null), 2500)
  }

  function selectDay(dateStr) {
    setSelectedDate(dateStr)
    setSelectedSession(null)
    setWeekOffset(weekOffsetForDate(dateStr))
    setViewMode("week")
  }

  function SessionCard({ session }) {
    const key        = session.time + session.name
    const isBooked   = bookedSessions.includes(key) || session.state === "booked"
    const isSelected = selectedSession?.name === session.name && selectedSession?.time === session.time
    return (
      <div
        onClick={() => setSelectedSession(session)}
        className={`p-4 border-b cursor-pointer transition-all ${divider}
          ${isSelected ? "border-l-2 border-l-[#00aa13] bg-[#e6f9e8]" : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-xs mb-1 ${muted}`}>{session.time}</p>
            <p className={`text-sm font-medium ${isSelected ? "text-[#00aa13]" : heading}`}>{session.name}</p>
            <p className={`text-xs ${muted}`}>{session.instructor} · 45 mins · {session.studio}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isPast
              ? <span className={`text-xs ${muted}`}>View only</span>
              : isBooked
              ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aa13]"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13] flex-shrink-0" />Booked</span>
              : session.state === "book"     ? <>
                  <span className={`text-xs ${muted}`}>{session.spaces} spaces</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aa13]"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13] flex-shrink-0" />Available</span>
                </>
              : session.state === "full"     ? <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? "bg-gray-500" : "bg-gray-300"}`} />Full</span>
              : session.state === "waitlist" ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />Waitlist</span>
              : session.state === "waiting"  ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />#{session.position} on list</span>
              : null
            }
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 flex flex-col md:h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>Browse sessions</h1>
          <p className={`text-sm ${muted}`}>Find a class that fits your week</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          {/* Week / Month toggle */}
          <div className={`flex rounded-lg p-0.5 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            {["week","month"].map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize
                  ${viewMode === v
                    ? darkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
                    : muted}`}>
                {v}
              </button>
            ))}
          </div>
          <span className={`hidden sm:inline text-sm ${muted}`}>eenieJIM</span>
          <Avatar name="eenieJIM" size={32} user />
        </div>
      </div>

      {viewMode === "month" ? (

        /* ── Month view ── */
        <div className={`${card} flex-1 flex flex-col overflow-hidden`}>
          {/* Month navigation */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
            <button onClick={() => setMonthView(mv => { const d = new Date(mv.year, mv.month - 2, 1); return { year: d.getFullYear(), month: d.getMonth() + 1 } })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>‹</button>
            <h2 className={`font-semibold ${heading}`}>{MONTH_NAMES_FULL[monthView.month - 1]} {monthView.year}</h2>
            <button onClick={() => setMonthView(mv => { const d = new Date(mv.year, mv.month, 1); return { year: d.getFullYear(), month: d.getMonth() + 1 } })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}>›</button>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* Left: calendar */}
            <div className={`flex flex-col flex-1 min-w-0 border-r ${divider}`}>
              <div className={`grid grid-cols-7 px-4 pt-3 pb-2 border-b ${divider}`}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                  <div key={d} className={`text-xs font-medium text-center ${muted}`}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 p-3 gap-1.5 flex-1 content-start overflow-y-auto">
                {monthCells.map((day, i) => {
                  if (!day) return <div key={i} />
                  const ds        = `${monthView.year}-${String(monthView.month).padStart(2,"0")}-${String(day).padStart(2,"0")}`
                  const isToday   = ds === BOOKING_TODAY
                  const isSel     = ds === selectedDate
                  const count     = sessionCount(ds)
                  return (
                    <button key={i} onClick={() => selectDay(ds)}
                      className={`rounded-xl p-1.5 flex flex-col items-center justify-start min-h-[52px] transition-all
                        ${isSel ? "bg-[#00aa13] text-white shadow-sm"
                          : isToday ? darkMode ? "border border-[#00aa13] bg-gray-800" : "border border-[#00aa13] bg-[#f0fdf4]"
                          : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                      <span className={`text-sm font-semibold ${isSel ? "text-white" : isToday ? "text-[#00aa13]" : heading}`}>{day}</span>
                      {count > 0 && (
                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                          {Array.from({length: Math.min(count, 3)}).map((_, ci) => (
                            <div key={ci} className={`w-1 h-1 rounded-full ${isSel ? "bg-white/70" : "bg-[#00aa13]"}`} />
                          ))}
                          {count > 3 && <span className={`text-[8px] font-bold ${isSel ? "text-white/70" : "text-[#00aa13]"}`}>+{count - 3}</span>}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className={`px-4 py-3 border-t ${divider} flex items-center gap-4`}>
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00aa13]" /><span className={`text-xs ${muted}`}>Available</span></div>
                <div className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} /><span className={`text-xs ${muted}`}>Not released</span></div>
              </div>
            </div>

            {/* Right: selected day panel */}
            <div className={`hidden md:flex flex-col w-72 flex-shrink-0 overflow-y-auto`}>
              {(() => {
                const DAYS_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
                const d = new Date(selectedDate + "T00:00:00")
                const dayName = DAYS_FULL[(d.getDay() + 6) % 7]
                const dayNum  = d.getDate()
                const monthName = MONTH_NAMES_FULL[d.getMonth()]
                const sd = sessionsByDate[selectedDate] || { morning: [], afternoon: [], evening: [] }
                const allSessions = [...(sd.morning||[]), ...(sd.afternoon||[]), ...(sd.evening||[])]
                return (
                  <>
                    <div className={`px-5 py-4 border-b ${divider}`}>
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${muted}`}>{dayName}</p>
                      <p className={`text-lg font-bold ${heading}`}>{dayNum} {monthName}</p>
                    </div>
                    {allSessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-3 py-10">
                        <span className="text-3xl">🗓️</span>
                        <p className={`text-sm font-semibold ${heading}`}>Classes not yet released</p>
                        <p className={`text-xs ${muted}`}>Check back soon — the schedule for this day hasn't been published yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {allSessions.map((s, i) => {
                          const stateColor = s.state === "book" ? "text-[#00aa13]"
                            : s.state === "full" ? (darkMode ? "text-gray-500" : "text-gray-400")
                            : s.state === "booked" ? "text-[#00aa13]"
                            : "text-amber-500"
                          const stateLabel = s.state === "book" ? `${s.spaces} spaces`
                            : s.state === "full" ? "Full"
                            : s.state === "booked" ? "Booked"
                            : s.state === "waitlist" ? `Waitlist (${s.count})`
                            : s.state === "waiting" ? `#${s.position} waitlist`
                            : s.state
                          return (
                            <button key={i} onClick={() => { selectDay(selectedDate); setViewMode("week"); setSelectedSession(s) }}
                              className={`px-5 py-3.5 border-b ${divider} text-left transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className={`text-sm font-semibold truncate ${heading}`}>{s.name}</p>
                                  <p className={`text-xs mt-0.5 ${muted}`}>{s.time} · {s.studio}</p>
                                  <p className={`text-xs ${muted}`}>{s.instructor}</p>
                                </div>
                                <span className={`text-xs font-semibold flex-shrink-0 mt-0.5 ${stateColor}`}>{stateLabel}</span>
                              </div>
                            </button>
                          )
                        })}
                        <div className={`px-5 py-4 mt-auto`}>
                          <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                            <p className={`text-xs font-semibold mb-2 ${heading}`}>{allSessions.length} class{allSessions.length !== 1 ? "es" : ""} scheduled</p>
                            <p className={`text-xs ${muted}`}>{allSessions.filter(s => s.state === "book").length} available · {allSessions.filter(s => s.state === "full").length} full · {allSessions.filter(s => s.state === "booked" || bookedSessions.includes(s.time + s.name)).length} booked</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

          </div>
        </div>

      ) : (

        /* ── Week view ── */
        <>
          {/* Week navigation */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setWeekOffset(w => w - 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors flex-shrink-0
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >‹</button>
            <span className={`font-semibold text-base ${heading}`}>{weekRangeLabel(weekDates)}</span>
            <button
              onClick={() => setWeekOffset(w => w + 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors flex-shrink-0
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >›</button>
          </div>

          {/* Day tabs */}
          <div className="flex gap-2 mb-4">
            {weekDates.map(({ dateStr, dayLabel, dayNum }) => {
              const isToday = dateStr === BOOKING_TODAY
              const isSel   = dateStr === selectedDate
              return (
                <button key={dateStr}
                  onClick={() => { setSelectedDate(dateStr); setSelectedSession(null) }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-0.5
                    ${isSel
                      ? "bg-[#00aa13] text-white shadow-sm"
                      : isToday
                        ? darkMode ? "border border-[#00aa13] bg-gray-800 text-[#00aa13]" : "border border-[#00aa13] text-[#00aa13] bg-[#f0fdf4]"
                        : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"}`}
                >
                  <span className="opacity-70 text-xs">{dayLabel}</span>
                  <span className="font-bold text-sm">{dayNum}</span>
                </button>
              )
            })}
          </div>

          {/* Sessions list + Detail panel */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 md:overflow-hidden md:min-h-0">

            {/* Session list */}
            <div className={`${card} flex-1 overflow-y-auto`}>
              {hasSessions
                ? ["morning","afternoon","evening"].map(section => {
                    const sessions = dayData[section]
                    if (!sessions.length) return null
                    return (
                      <div key={section}>
                        <p className={`text-xs font-semibold uppercase tracking-widest px-4 py-3 border-b ${divider} ${muted}`}>{section}</p>
                        {sessions.map((s, i) => <SessionCard key={i} session={s} />)}
                      </div>
                    )
                  })
                : <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>🗓️</div>
                    <p className={`text-sm font-semibold ${heading}`}>Classes not yet released</p>
                    <p className={`text-xs text-center max-w-xs ${muted}`}>Check back soon — classes for this day haven't been added to the schedule yet.</p>
                  </div>
              }
            </div>

            {/* Detail panel — desktop sidebar only */}
            {selectedSession ? (
              <div className={`hidden md:block ${card} w-96 flex-shrink-0 overflow-y-auto`}>
                <div className={`p-5 border-b ${divider}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-xs ${muted}`}>Session details</p>
                    <button onClick={() => { setSelectedSession(null); setShowPlan(false) }} className={`text-xs ${muted} hover:text-red-400`}>✕ Close</button>
                  </div>
                  <div className="flex items-start justify-between">
                    <h2 className={`text-xl font-bold ${heading}`}>{selectedSession.name}</h2>
                    <span className={`text-xs ${muted}`}>{selectedSession.studio}</span>
                  </div>
                  <div className={`flex items-center justify-between mt-1 text-xs ${muted}`}>
                    <span>{selectedDate}</span>
                    <span>{selectedSession.time}</span>
                    <span>45 mins</span>
                  </div>
                </div>

                <div className={`p-5 border-b ${divider}`}>
                  <div className={`flex items-center gap-3 rounded-xl p-4 ${subtle}`}>
                    <Avatar name={selectedSession.instructor} size={40} />
                    <div>
                      <p className={`text-sm font-medium ${heading}`}>{selectedSession.instructor}</p>
                      <p className={`text-xs ${muted}`}>Lead Instructor</p>
                      <p className={`text-xs italic mt-1 ${muted}`}>"{getInstructorQuote(selectedSession.instructor, selectedSession.name)}"</p>
                    </div>
                  </div>
                </div>

                <div className={`p-5 border-b ${divider}`}>
                  <p className={`text-sm font-semibold mb-4 ${heading}`}>Session plan</p>
                  <div className="flex items-end gap-1 h-20 mb-2">
                    {getIntensity(selectedSession.name).map((v, i) => {
                      const zone = getFTPZone(v)
                      return <div key={i} className="flex-1 rounded-sm" style={{ height: `${zone.height}%`, backgroundColor: zone.color }} />
                    })}
                  </div>
                  <p className={`text-xs text-center ${muted}`}>Intensity preview</p>
                  <div className={`flex justify-between mt-3 text-xs ${muted}`}>
                    <div><p>Lowest:</p><p className={`font-medium ${heading}`}>55 rpm</p></div>
                    <div className="text-center"><p>Highest:</p><p className={`font-medium ${heading}`}>90 rpm</p></div>
                    <div className="text-right"><p>Average:</p><p className={`font-medium ${heading}`}>75 rpm</p></div>
                  </div>
                  <button
                    onClick={() => setShowPlan(true)}
                    className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold transition-all border border-[#00aa13] text-[#00aa13] hover:bg-[#e6f9e8] flex items-center justify-center gap-1.5"
                  >
                    <span>View full session plan</span>
                    <span className="text-sm leading-none">→</span>
                  </button>
                </div>

                <div className={`p-5 border-b ${divider}`}>
                  <p className={`text-sm font-semibold mb-2 ${heading}`}>Ride insight</p>
                  {(() => { const ins = getBookingInsight(selectedSession.name); return (
                  <div className={`rounded-xl p-4 ${subtle} text-xs`}>
                    <p className={muted}>Based on your last {selectedSession.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className={heading}>Position: <span className="font-bold">{ins.pos} riders</span></p>
                      <p className="text-[#00aa13] text-xs">{ins.trend}</p>
                    </div>
                    <p className={`mt-1 ${heading}`}>Avg cadence: <span className="font-bold">{ins.cadence}</span></p>
                    <p className={heading}>Energy: <span className="font-bold">{ins.energy}</span></p>
                  </div>
                  )})()}
                </div>

                {isPast ? (
                  <div className="p-5 text-center">
                    <p className={`text-sm ${muted} py-4`}>This session has passed — view only</p>
                  </div>
                ) : selectedSession.state === "full" ? (
                  <div className="p-5 pt-6 pb-6">
                    <div className={`rounded-xl px-4 py-5 text-center ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                      <p className={`text-sm font-semibold mb-1 ${heading}`}>Class full</p>
                      <p className={`text-xs ${muted}`}>No spaces remaining — check back for cancellations.</p>
                    </div>
                    <button disabled className={`w-full mt-4 py-3 rounded-xl text-sm font-semibold cursor-not-allowed ${darkMode ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
                      Unavailable
                    </button>
                  </div>
                ) : (selectedSession.state === "waitlist" || selectedSession.state === "waiting") ? (
                  <div className="p-5">
                    <p className={`text-sm font-semibold mb-3 ${muted}`}>Bike selection not available</p>
                    <div className="flex flex-col gap-2 opacity-25 pointer-events-none select-none mb-4">
                      <div className="flex justify-center mb-1">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs ${muted}`}>Instructor</span>
                          <div className="w-8 h-10 rounded-lg bg-[#00aa13]" />
                        </div>
                      </div>
                      {(STUDIO_LAYOUTS[selectedSession.studio]?.rows || bikes).map((row, ri) => (
                        <div key={ri} className="flex gap-2 justify-center">
                          {row.map(num => (
                            <div key={num} className={`w-8 h-10 rounded-lg flex items-center justify-center text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-400"}`}>{num}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {selectedSession.state === "waiting" ? (<>
                      <p className={`text-xs text-center mb-4 ${muted}`}>You are #{selectedSession.position} on the waitlist</p>
                      <button className={`w-full py-3 rounded-xl text-sm font-semibold border transition-colors ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Leave Waitlist</button>
                    </>) : (<>
                      <p className={`text-xs text-center mb-4 ${muted}`}>{selectedSession.count} {selectedSession.count === 1 ? "person" : "people"} ahead on waitlist</p>
                      <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors">Join Waitlist</button>
                    </>)}
                  </div>
                ) : (
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className={`text-sm font-semibold ${heading}`}>Choose your bike</p>
                      <span className={`text-xs ${muted}`}>{STUDIO_LAYOUTS[selectedSession.studio]?.label || "24 bikes"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-center mb-1">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs ${muted}`}>Instructor</span>
                          <div className="w-8 h-10 rounded-lg bg-[#00aa13]" />
                        </div>
                      </div>
                      {(STUDIO_LAYOUTS[selectedSession.studio]?.rows || bikes).map((row, ri) => (
                        <div key={ri} className="flex gap-2 justify-center">
                          {row.map(num => (
                            <button key={num} onClick={() => setSelectedBike(num)}
                              className={`w-8 h-10 rounded-lg text-xs font-medium transition-all
                                ${selectedBike === num ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                              {num}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleBook(selectedSession)}
                      className="w-full mt-6 py-3 rounded-xl bg-[#00aa13] hover:bg-[#008a0f] text-white font-semibold text-sm transition-colors">
                      {bookedSessions.includes(selectedSession.time + selectedSession.name) ? "✓ Booked!" : "Confirm booking"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={`hidden md:flex ${card} w-96 flex-shrink-0 items-center justify-center`}>
                <div className="text-center px-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>🚴</div>
                  <p className={`text-sm font-semibold ${heading}`}>Select a session</p>
                  <p className={`text-xs mt-1 ${muted}`}>Choose a class from the list to view details and book your spot.</p>
                </div>
              </div>
            )}

          </div>
        </>
      )}

      {/* ── Mobile bottom sheet — session details ── */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setSelectedSession(null); setShowPlan(false) }} />
          {/* Sheet */}
          <div className={`relative rounded-t-3xl flex flex-col overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}
            style={bookingDrag.sheetStyle} {...bookingDrag.handlers}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className={`w-10 h-1 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
            </div>
            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1">
              {/* Header */}
              <div className={`px-5 pt-3 pb-4 border-b ${divider}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs ${muted} mb-1`}>Session details</p>
                    <h2 className={`text-xl font-bold ${heading}`}>{selectedSession.name}</h2>
                  </div>
                  <button onClick={() => { setSelectedSession(null); setShowPlan(false) }}
                    className={`mt-1 w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>✕</button>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs ${muted}`}>
                  <span>{selectedSession.studio}</span>
                  <span>·</span>
                  <span>{selectedSession.time}</span>
                  <span>·</span>
                  <span>45 mins</span>
                </div>
              </div>
              {/* Instructor */}
              <div className={`px-5 py-4 border-b ${divider}`}>
                <div className={`flex items-center gap-3 rounded-xl p-4 ${subtle}`}>
                  <Avatar name={selectedSession.instructor} size={40} />
                  <div>
                    <p className={`text-sm font-medium ${heading}`}>{selectedSession.instructor}</p>
                    <p className={`text-xs ${muted}`}>Lead Instructor</p>
                    <p className={`text-xs italic mt-1 ${muted}`}>"Push past your limits — you're stronger than you think."</p>
                  </div>
                </div>
              </div>
              {/* Session plan */}
              <div className={`px-5 py-4 border-b ${divider}`}>
                <p className={`text-sm font-semibold mb-4 ${heading}`}>Session plan</p>
                <div className="flex items-end gap-1 h-20 mb-2">
                  {intensityData.map((v, i) => {
                    const zone = getFTPZone(v)
                    return <div key={i} className="flex-1 rounded-sm" style={{ height: `${zone.height}%`, backgroundColor: zone.color }} />
                  })}
                </div>
                <p className={`text-xs text-center ${muted}`}>Intensity preview</p>
                <button onClick={() => setShowPlan(true)}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-semibold transition-all border border-[#00aa13] text-[#00aa13] hover:bg-[#e6f9e8] flex items-center justify-center gap-1.5">
                  <span>View full session plan</span><span className="text-sm leading-none">→</span>
                </button>
              </div>
              {/* Ride insight */}
              <div className={`px-5 py-4 border-b ${divider}`}>
                <p className={`text-sm font-semibold mb-2 ${heading}`}>Ride insight</p>
                <div className={`rounded-xl p-4 ${subtle} text-xs`}>
                  <p className={muted}>You rode a similar session recently</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={heading}>Position: <span className="font-bold">4 / 18 riders</span></p>
                    <p className="text-[#00aa13] text-xs">+3% → 3rd place</p>
                  </div>
                  <p className={`mt-1 ${heading}`}>Avg cadence: <span className="font-bold">82 rpm</span></p>
                  <p className={heading}>Energy: <span className="font-bold">1.2 kWh</span></p>
                </div>
              </div>
              {/* Bike + book or past message */}
              {isPast ? (
                <div className="px-5 py-6 text-center">
                  <p className={`text-sm ${muted}`}>This session has passed — view only</p>
                </div>
              ) : (
                <div className="px-5 py-4 pb-10">
                  <p className={`text-sm font-semibold mb-4 ${heading}`}>Choose your bike</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center mb-1">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xs ${muted}`}>Instructor</span>
                        <div className="w-8 h-10 rounded-lg bg-[#00aa13]" />
                      </div>
                    </div>
                    {(STUDIO_LAYOUTS[selectedSession.studio]?.rows || bikes).map((row, ri) => (
                      <div key={ri} className="flex gap-2 justify-center">
                        {row.map(num => (
                          <button key={num} onClick={() => setSelectedBike(num)}
                            className={`w-8 h-10 rounded-lg text-xs font-medium transition-all
                              ${selectedBike === num ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {num}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleBook(selectedSession)}
                    className="w-full mt-6 py-3 rounded-xl bg-[#00aa13] hover:bg-[#008a0f] text-white font-semibold text-sm transition-colors">
                    {bookedSessions.includes(selectedSession.time + selectedSession.name) ? "✓ Booked!" : "Confirm booking"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPlan && selectedSession && (
        <SessionPlanModal
          session={selectedSession}
          darkMode={darkMode}
          onClose={() => setShowPlan(false)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#00aa13] text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── MY SCHEDULE DATA ────────────────────────────────────────────────────────
// Personal schedule: only sessions the user has committed to (attended / booked / waitlist / cancelled).

const mySchedule = {
  "2026-02-16": [
    { time: "19:00", name: "Evening Flow",      instructor: "Zen Kiwi",        studio: "Studio 2", state: "attended", cadence: 79, energy: 1.1, position: 8,  total: 20 },
  ],
  "2026-02-17": [
    { time: "08:30", name: "Tempo Foundation",  instructor: "Rio Banana",      studio: "Studio 2", state: "attended", cadence: 83, energy: 1.3, position: 5,  total: 22 },
    { time: "18:30", name: "Threshold Push",    instructor: "Max Lime",        studio: "Studio 1", state: "attended", cadence: 86, energy: 1.5, position: 3,  total: 18 },
  ],
  "2026-02-18": [
    { time: "16:30", name: "Power Tempo",       instructor: "Anna Banana",     studio: "Studio 1", state: "attended", cadence: 81, energy: 1.2, position: 7,  total: 20 },
  ],
  "2026-02-19": [
    { time: "06:15", name: "Sunrise Power",     instructor: "Anna Banana",     studio: "Studio 1", state: "attended", cadence: 88, energy: 1.5, position: 2,  total: 18 },
    { time: "12:00", name: "Lunch Sprint",      instructor: "Clueless Banana", studio: "Studio 2", state: "cancelled" },
  ],
  "2026-02-20": [
    { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",   studio: "Studio 1", state: "attended", cadence: 77, energy: 1.0, position: 11, total: 22 },
  ],
  "2026-02-21": [
    { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",      studio: "Studio 1", state: "attended", cadence: 85, energy: 1.4, position: 4,  total: 18 },
  ],
  "2026-02-22": [
    { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",    studio: "Studio 1", state: "attended", cadence: 72, energy: 0.9, position: 12, total: 20 },
    { time: "15:00", name: "Recovery Ride",     instructor: "Loopy Banana",    studio: "Studio 1", state: "attended", cadence: 68, energy: 0.8, position: 15, total: 20 },
  ],
  "2026-02-23": [
    { time: "07:15", name: "Endurance Builder", instructor: "Alien Banana",    studio: "Studio 1", state: "attended", cadence: 80, energy: 1.2, position: 6,  total: 24 },
    { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",        studio: "Studio 1", state: "attended", cadence: 76, energy: 1.0, position: 9,  total: 20 },
  ],
  "2026-02-24": [
    { time: "07:00", name: "Cadence Control",   instructor: "Liam Gallager",   studio: "Studio 1", state: "attended", cadence: 84, energy: 1.3, position: 4,  total: 22 },
    { time: "18:30", name: "Threshold Push",    instructor: "Max Lime",        studio: "Studio 1", state: "attended", cadence: 87, energy: 1.6, position: 2,  total: 18 },
  ],
  "2026-02-25": [],
  "2026-02-26": [
    { time: "16:30", name: "Power Tempo",       instructor: "Anna Banana",     studio: "Studio 1", state: "booked"                  },
    { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",        studio: "Studio 1", state: "booked"                  },
    { time: "19:30", name: "HIIT Blast",        instructor: "Anya Banana",     studio: "Studio 2", state: "waiting",  position: 1   },
  ],
  "2026-02-27": [
    { time: "08:00", name: "Cadence Control",   instructor: "Liam Gallager",   studio: "Studio 1", state: "booked"                  },
    { time: "12:30", name: "Midday Burn",       instructor: "Alex Papaya",     studio: "Studio 1", state: "booked"                  },
  ],
  "2026-02-28": [
    { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",      studio: "Studio 1", state: "booked"                  },
  ],
  "2026-03-01": [
    { time: "09:00", name: "Easy Endurance",    instructor: "Lemon Banana",    studio: "Studio 1", state: "booked"                  },
  ],
  "2026-03-02": [
    { time: "06:30", name: "Sunrise Power",     instructor: "Anna Banana",     studio: "Studio 1", state: "booked"                  },
  ],
  "2026-03-03": [
    { time: "19:00", name: "Night Ride",        instructor: "Max Lime",        studio: "Studio 1", state: "waitlist", count: 2      },
  ],
  "2026-03-05": [
    { time: "18:00", name: "Evening Flow",      instructor: "Zen Kiwi",        studio: "Studio 2", state: "waitlist", count: 3      },
  ],
  "2026-03-07": [
    { time: "09:00", name: "Rhythm Ride",       instructor: "Rob Banana",      studio: "Studio 1", state: "booked"                  },
  ],
}

// ─── CALENDAR PAGE ──────────────────────────────────────────────────────────

function CalendarPage({ darkMode, onToggleDarkMode }) {
  const [calView, setCalView]           = useState("month")
  const [selectedDate, setSelectedDate] = useState(BOOKING_TODAY)
  const [calMonth, setCalMonth]         = useState({ year: 2026, month: 2 })
  const [calWeekOff, setCalWeekOff]     = useState(0)
  const [widgetIdx, setWidgetIdx]       = useState(0)
  const [showCalPlan, setShowCalPlan]   = useState(false)

  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const heading = darkMode ? "text-white"      : "text-gray-900"
  const muted   = darkMode ? "text-gray-400"   : "text-gray-500"
  const divider = darkMode ? "border-gray-800" : "border-gray-100"
  const subtle  = darkMode ? "bg-gray-800"     : "bg-gray-50"

  const monthCells   = getMonthGrid(calMonth.year, calMonth.month)
  const weekDates    = getWeekDates(calWeekOff)
  const mySessions   = mySchedule[selectedDate] || []
  const widgetCount  = mySessions.length
  const clampedIdx   = Math.min(widgetIdx, Math.max(0, widgetCount - 1))
  const widgetSession = mySessions[clampedIdx] || null
  const isToday      = selectedDate === BOOKING_TODAY
  const isPast       = selectedDate < BOOKING_TODAY

  function selectDate(ds) {
    setSelectedDate(ds)
    setWidgetIdx(0)
    if (calView === "week") setCalWeekOff(weekOffsetForDate(ds))
  }

  function dayDotCount(dateStr) {
    return (mySchedule[dateStr] || []).length
  }

  function sessionBadge(s) {
    if (s.state === "attended")  return <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? "bg-gray-500" : "bg-gray-400"}`} />Attended</span>
    if (s.state === "booked")    return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00aa13]"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13] flex-shrink-0" />Booked</span>
    if (s.state === "cancelled") return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />Cancelled</span>
    if (s.state === "waitlist")  return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />Waitlist · {s.count} ahead</span>
    if (s.state === "waiting")   return <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />#{s.position} on list</span>
    return null
  }

  function renderWidget() {
    if (!widgetSession) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <span className="text-2xl">📭</span>
          <p className={`text-xs ${muted}`}>No sessions this day</p>
        </div>
      )
    }
    const s = widgetSession
    const initials = s.instructor.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

    return (
      <div className="flex flex-col gap-3">
        {/* Context label + page indicator */}
        <div className="flex items-center justify-between">
          <div>
            {isToday && s.state === "booked" && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#00aa13] text-white font-semibold tracking-wide">Up Next</span>
            )}
            {isToday && s.state === "waiting" && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">On waitlist</span>
            )}
            {isPast && s.state === "attended" && (
              <span className={`text-xs font-medium ${muted}`}>Completed</span>
            )}
            {isPast && s.state === "cancelled" && (
              <span className="text-xs font-medium text-red-400">Cancelled</span>
            )}
            {!isToday && !isPast && s.state === "booked" && (
              <span className={`text-xs font-medium ${muted}`}>Upcoming</span>
            )}
            {!isToday && !isPast && (s.state === "waitlist" || s.state === "waiting") && (
              <span className="text-xs font-medium text-amber-600">On waitlist</span>
            )}
          </div>
          {widgetCount > 1 && (
            <span className={`text-xs tabular-nums ${muted}`}>{clampedIdx + 1} / {widgetCount}</span>
          )}
        </div>

        {/* Session name */}
        <div>
          <p className={`text-lg font-bold leading-tight ${heading}`}>{s.name}</p>
          <p className={`text-xs mt-0.5 ${muted}`}>{s.time} · {s.studio} · 45 mins</p>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2.5">
          <Avatar name={s.instructor} size={28} />
          <div>
            <p className={`text-xs font-medium ${heading}`}>{s.instructor}</p>
            <p className={`text-xs ${muted}`}>Lead Instructor</p>
          </div>
        </div>

        {/* Status badge */}
        <div>{sessionBadge(s)}</div>

        {/* Attended stats */}
        {s.state === "attended" && (
          <div className={`grid grid-cols-3 gap-1.5 rounded-xl p-3 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="text-center">
              <p className={`text-xs ${muted} mb-0.5`}>Position</p>
              <p className={`text-sm font-bold ${heading}`}>{s.position}<span className={`text-xs font-normal ${muted}`}>/{s.total}</span></p>
            </div>
            <div className="text-center">
              <p className={`text-xs ${muted} mb-0.5`}>Avg cadence</p>
              <p className={`text-sm font-bold ${heading}`}>{s.cadence}<span className={`text-xs font-normal ${muted}`}> rpm</span></p>
            </div>
            <div className="text-center">
              <p className={`text-xs ${muted} mb-0.5`}>Energy</p>
              <p className={`text-sm font-bold ${heading}`}>{s.energy}<span className={`text-xs font-normal ${muted}`}> kWh</span></p>
            </div>
          </div>
        )}

        {/* Session overview text */}
        {(s.state === "booked" || s.state === "attended") && (() => {
          const plan = SESSION_PLANS[s.name] || SESSION_PLANS._default
          return (
            <p className={`text-xs leading-relaxed ${muted}`}>{plan.overview}</p>
          )
        })()}

        {/* Instructor quote */}
        {(s.state === "booked") && (
          <div className={`flex items-start gap-2.5 rounded-xl p-3 ${subtle}`}>
            <Avatar name={s.instructor} size={28} />
            <p className={`text-xs italic leading-relaxed ${muted}`}>"{getInstructorQuote(s.instructor, s.name)}"</p>
          </div>
        )}

        {/* Intensity chart */}
        {(s.state === "booked" || s.state === "attended") && (
          <div>
            <div className="flex items-end gap-0.5 h-12">
              {getIntensity(s.name).map((v, i) => {
                const zone = getFTPZone(v)
                return <div key={i} className="flex-1 rounded-sm" style={{ height: `${zone.height}%`, backgroundColor: zone.color }} />
              })}
            </div>
            <p className={`text-xs mt-1 ${muted}`}>Intensity profile</p>
          </div>
        )}

        {/* Phase summary */}
        {(s.state === "booked" || s.state === "attended") && (() => {
          const plan = SESSION_PLANS[s.name] || SESSION_PLANS._default
          return (
            <div className={`rounded-xl overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
              {plan.phases.map((ph, pi) => (
                <div key={pi} className={`flex items-center gap-2.5 px-3 py-2 border-b last:border-b-0 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: (() => { const nums = (ph.zone.match(/\d+/g)||["2"]).map(Number); return FTP_ZONES[Math.min(Math.max(...nums)-1,6)].color })() }} />
                  <span className={`text-xs font-medium flex-1 ${heading}`}>{ph.name}</span>
                  <span className={`text-xs tabular-nums ${muted}`}>{ph.mins} min</span>
                  <span className={`text-xs ${muted}`}>{ph.cadence}</span>
                </div>
              ))}
            </div>
          )
        })()}

        {/* View full plan button */}
        {(s.state === "booked" || s.state === "attended") && (
          <button onClick={() => setShowCalPlan(true)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all border border-[#00aa13] text-[#00aa13] hover:bg-[#e6f9e8] flex items-center justify-center gap-1.5">
            View full session plan →
          </button>
        )}

        {/* Waitlist info */}
        {s.state === "waitlist" && s.count != null && (
          <p className={`text-xs ${muted}`}>{s.count} {s.count === 1 ? "person" : "people"} ahead of you on the waitlist.</p>
        )}

        {/* Prev / Next carousel */}
        {widgetCount > 1 && (
          <div className={`flex items-center justify-between pt-3 border-t ${divider}`}>
            <button
              onClick={e => { e.stopPropagation(); setWidgetIdx(i => Math.max(0, i - 1)) }}
              disabled={clampedIdx === 0}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl font-light transition-all
                ${clampedIdx === 0 ? "opacity-25 cursor-not-allowed" : darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}
            >‹</button>
            <div className="flex gap-1 items-center">
              {Array.from({ length: widgetCount }).map((_, j) => (
                <button key={j} onClick={e => { e.stopPropagation(); setWidgetIdx(j) }}
                  className={`rounded-full transition-all ${j === clampedIdx ? "w-4 h-1.5 bg-[#00aa13]" : `w-1.5 h-1.5 ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}`} />
              ))}
            </div>
            <button
              onClick={e => { e.stopPropagation(); setWidgetIdx(i => Math.min(widgetCount - 1, i + 1)) }}
              disabled={clampedIdx === widgetCount - 1}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl font-light transition-all
                ${clampedIdx === widgetCount - 1 ? "opacity-25 cursor-not-allowed" : darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}
            >›</button>
          </div>
        )}
      </div>
    )
  }

  function renderDayPanel() {
    return (
      <div className={`border-t ${divider} p-4 md:p-5 flex flex-col sm:flex-row gap-4 md:gap-5`} style={{ minHeight: "160px" }}>

        {/* Session list */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <h3 className={`font-semibold mb-3 ${heading}`}>
            {isToday ? "Today's Sessions" : isPast ? "Session History" : "Upcoming Sessions"}
          </h3>
          {mySessions.length > 0 ? (
            <div className={`flex flex-col divide-y ${darkMode ? "divide-gray-800" : "divide-gray-100"}`}>
              {mySessions.map((s, i) => (
                <button key={i}
                  onClick={() => setWidgetIdx(i)}
                  className={`flex items-center justify-between py-2.5 w-full text-left transition-colors rounded-xl px-3
                    ${i === clampedIdx ? darkMode ? "bg-gray-800" : "bg-[#f0fdf4]" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs w-10 flex-shrink-0 font-medium tabular-nums ${muted}`}>{s.time}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${i === clampedIdx ? "text-[#00aa13]" : heading}`}>{s.name}</p>
                      <p className={`text-xs ${muted}`}>{s.instructor}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-3">{sessionBadge(s)}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>🌿</div>
              <div>
                <p className={`text-sm font-semibold ${heading}`}>Classes not yet released</p>
                <p className={`text-xs ${muted}`}>Check back soon — classes haven't been added yet.</p>
              </div>
            </div>
          )}
        </div>

        {/* Session widget — wider, with full details */}
        <div className={`w-full sm:w-72 md:w-80 sm:flex-shrink-0 rounded-2xl p-4 ${subtle}`}>
          {renderWidget()}
        </div>

      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 flex flex-col md:h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>Calendar</h1>
          <p className={`text-sm ${muted}`}>Your schedule at a glance</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          <div className={`flex rounded-lg p-0.5 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            {["month","week"].map(v => (
              <button key={v}
                onClick={() => { setCalView(v); if (v === "week") setCalWeekOff(weekOffsetForDate(selectedDate)) }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize
                  ${calView === v
                    ? darkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
                    : muted}`}>
                {v}
              </button>
            ))}
          </div>
          <span className={`hidden sm:inline text-sm ${muted}`}>eenieJIM</span>
          <Avatar name="eenieJIM" size={32} user />
        </div>
      </div>

      {calView === "month" ? (

        /* ── Month view ── */
        <div className={`${card} flex-1 flex flex-col overflow-hidden`}>

          {/* Month navigation */}
          <div className={`flex items-center justify-between px-6 py-3 border-b ${divider}`}>
            <button
              onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month - 2, 1); return { year: d.getFullYear(), month: d.getMonth() + 1 } })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >‹</button>
            <h2 className={`font-semibold ${heading}`}>{MONTH_NAMES_FULL[calMonth.month - 1]} {calMonth.year}</h2>
            <button
              onClick={() => setCalMonth(m => { const d = new Date(m.year, m.month, 1); return { year: d.getFullYear(), month: d.getMonth() + 1 } })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >›</button>
          </div>

          {/* Day-of-week headers */}
          <div className={`grid grid-cols-7 px-6 pt-3 pb-2 border-b ${divider}`}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div key={d} className={`text-xs font-medium text-center ${muted}`}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 px-4 pt-2 pb-1 flex-1 content-start">
            {monthCells.map((day, i) => {
              if (!day) return <div key={i} />
              const ds      = `${calMonth.year}-${String(calMonth.month).padStart(2,"0")}-${String(day).padStart(2,"0")}`
              const isTdy   = ds === BOOKING_TODAY
              const isSel   = ds === selectedDate
              const count   = dayDotCount(ds)
              return (
                <button key={i} onClick={() => selectDate(ds)}
                  className={`m-0.5 border rounded-xl p-2 flex flex-col items-center transition-all min-h-[52px]
                    ${isSel
                      ? "border-[#00aa13] bg-[#e6f9e8]"
                      : isTdy
                        ? darkMode ? "border-[#00aa13] bg-gray-800" : "border-[#00aa13] bg-[#f0fdf4]"
                        : darkMode ? "border-gray-800 hover:border-gray-600 hover:bg-gray-800" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                >
                  <span className={`text-xs font-semibold ${isSel || isTdy ? "text-[#00aa13]" : heading}`}>{day}</span>
                  {count > 0 ? (
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#00aa13]" />
                      ))}
                    </div>
                  ) : <div className="h-2.5" />}
                </button>
              )
            })}
          </div>

          {/* Bottom panel — always rendered */}
          {renderDayPanel()}
        </div>

      ) : (

        /* ── Week view ── */
        <div className="flex flex-col flex-1 gap-4 md:overflow-hidden">

          {/* Week navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCalWeekOff(w => w - 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors flex-shrink-0
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >‹</button>
            <span className={`font-semibold text-base ${heading}`}>{weekRangeLabel(weekDates)}</span>
            <button
              onClick={() => setCalWeekOff(w => w + 1)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl font-light transition-colors flex-shrink-0
                ${darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
            >›</button>
          </div>

          {/* 7-column timeline */}
          <div className={`${card} flex-1 md:overflow-hidden flex flex-col md:min-h-0 overflow-x-auto`}>

            {/* Column headers */}
            <div className={`grid grid-cols-7 border-b ${divider} flex-shrink-0 min-w-[560px]`}>
              {weekDates.map(({ dateStr, dayLabel, dayNum, monthShort }) => {
                const isTdy = dateStr === BOOKING_TODAY
                const isSel = dateStr === selectedDate
                return (
                  <button key={dateStr} onClick={() => selectDate(dateStr)}
                    className={`py-3 px-1 flex flex-col items-center gap-0.5 border-r last:border-r-0 transition-all ${divider}
                      ${isSel ? darkMode ? "bg-gray-800" : "bg-[#f0fdf4]" : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                  >
                    <span className={`text-xs ${muted}`}>{dayLabel}</span>
                    <span className={`text-sm font-bold ${isTdy ? "text-[#00aa13]" : heading}`}>{dayNum}</span>
                    <span className={`text-xs ${muted}`}>{monthShort}</span>
                    {isTdy && <div className="w-1 h-1 rounded-full bg-[#00aa13] mt-0.5" />}
                  </button>
                )
              })}
            </div>

            {/* Session columns — from personal schedule only */}
            <div className={`grid grid-cols-7 flex-1 overflow-y-auto divide-x min-w-[560px] ${darkMode ? "divide-gray-800" : "divide-gray-100"}`}>
              {weekDates.map(({ dateStr }) => {
                const sessions = mySchedule[dateStr] || []
                const isSel    = dateStr === selectedDate
                return (
                  <div key={dateStr} onClick={() => selectDate(dateStr)}
                    className={`p-1.5 cursor-pointer transition-all
                      ${isSel ? darkMode ? "bg-gray-800/60" : "bg-[#f9fffe]" : darkMode ? "hover:bg-gray-800/40" : "hover:bg-gray-50/80"}`}
                  >
                    {sessions.length === 0 ? (
                      <div className="flex items-center justify-center min-h-[80px]">
                        <span className={`text-xs ${muted}`}>–</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {sessions.map((s, i) => (
                          <div key={i} className={`rounded-lg px-2 py-1.5 text-xs
                            ${s.state === "booked"
                              ? "bg-[#e6f9e8] border border-[#00aa13]/20"
                              : s.state === "attended"
                              ? darkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-100 border border-gray-200"
                              : s.state === "cancelled"
                              ? "bg-red-50 border border-red-100"
                              : "bg-amber-50 border border-amber-100"}`}
                          >
                            <p className={`font-semibold leading-tight truncate
                              ${s.state === "booked"    ? "text-[#00aa13]"
                              : s.state === "attended"  ? darkMode ? "text-gray-300" : "text-gray-600"
                              : s.state === "cancelled" ? "text-red-500"
                              : "text-amber-700"}`}>
                              {s.name}
                            </p>
                            <p className={`mt-0.5 ${muted}`}>{s.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom panel — always rendered */}
          <div className={`${card} flex-shrink-0`}>
            {renderDayPanel()}
          </div>
        </div>
      )}
      {showCalPlan && widgetSession && (
        <SessionPlanModal
          session={{ ...widgetSession, time: widgetSession.time, studio: widgetSession.studio || "Studio 1" }}
          darkMode={darkMode}
          onClose={() => setShowCalPlan(false)}
        />
      )}
    </div>
  )
}

// ─── RIDES PAGE ─────────────────────────────────────────────────────────────

function generateRideData(ride) {
  const profile = INTENSITY_PROFILES[ride.name] || [3,4,5,6,7,6,5,7,6,5,4,3]
  const seed = ride.name.charCodeAt(0) * 31 + ride.cadence + Math.round(ride.energy * 100)
  function rng(i) { const x = Math.sin(seed + i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
  const skill = 1 - (ride.position - 1) / ride.total  // 1 = best, 0 = worst

  return Array.from({ length: 45 }, (_, m) => {
    const profIdx = Math.floor(m / 45 * 12)
    const intensity = profile[Math.min(profIdx, 11)]
    const r1 = rng(m), r2 = rng(m + 50), r3 = rng(m + 100)

    const warmup  = m < 7
    const cooldown = m > 39
    const scale = warmup ? 0.75 + m / 7 * 0.25 : cooldown ? 0.7 + (45 - m) / 6 * 0.3 : 1

    const cadence = Math.round(
      (ride.cadence * scale + (intensity - 5) * 2) + (r1 - 0.5) * 9
    )
    const resistance = Math.round(Math.min(100, Math.max(10,
      20 + intensity * 7 * scale + (r2 - 0.5) * 12
    )))
    const zoneAccuracy = Math.round(Math.min(100, Math.max(35,
      55 + skill * 25 + intensity * 1.5 * scale + (r3 - 0.5) * 16
    )))
    return { min: m, cadence, resistance, zoneAccuracy }
  })
}

function RideLineChart({ data, ride, darkMode, pxWidth, hideLegend }) {
  const [hovIdx, setHovIdx] = useState(null)
  const W = 400, H = 190, ml = 4, mr = 4, mt = 6, mb = 18
  const cw = W - ml - mr, ch = H - mt - mb
  const svgSize = pxWidth ? { width: pxWidth, height: pxWidth * H / W } : { width: "100%" }

  const cadMin = 45, cadMax = Math.max(ride.peakCadence + 5, 130)
  const normCad = v => Math.min(100, Math.max(0, (v - cadMin) / (cadMax - cadMin) * 100))
  function pts(fn) {
    return data.map((d, i) => ({
      x: ml + (i / (data.length - 1)) * cw,
      y: mt + (1 - fn(d) / 100) * ch,
    }))
  }
  // Catmull-Rom → cubic bezier for a smooth, flowing line
  function smooth(points) {
    if (points.length < 2) return ""
    const t = 0.166
    let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] || p2
      const c1x = p1.x + (p2.x - p0.x) * t, c1y = p1.y + (p2.y - p0.y) * t
      const c2x = p2.x - (p3.x - p1.x) * t, c2y = p2.y - (p3.y - p1.y) * t
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
    }
    return d
  }

  const paths = {
    cad:  smooth(pts(d => normCad(d.cadence))),
    res:  smooth(pts(d => d.resistance)),
    zone: smooth(pts(d => d.zoneAccuracy)),
  }
  const hovX = hovIdx !== null ? ml + (hovIdx / (data.length - 1)) * cw : null
  const muted = darkMode ? "#4B5563" : "#E5E7EB"

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible", ...svgSize }}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const frac = (e.clientX - rect.left) / rect.width
          setHovIdx(Math.max(0, Math.min(data.length - 1, Math.round(frac * (data.length - 1)))))
        }}
        onMouseLeave={() => setHovIdx(null)}>
        {[25, 50, 75].map(p => {
          const y = mt + (1 - p / 100) * ch
          return <line key={p} x1={ml} x2={W - mr} y1={y} y2={y} stroke={muted} strokeWidth="0.75" />
        })}
        <path d={paths.res}  fill="none" stroke="#fb7512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
        <path d={paths.zone} fill="none" stroke="#00aa13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        <path d={paths.cad}  fill="none" stroke="#2888F8" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" />
        {hovIdx !== null && hovX !== null && (() => {
          const d = data[hovIdx]
          return <>
            <line x1={hovX} x2={hovX} y1={mt} y2={mt + ch} stroke={darkMode ? "#6B7280" : "#D1D5DB"} strokeWidth="1" strokeDasharray="3 2" />
            <circle cx={hovX} cy={mt + (1 - normCad(d.cadence) / 100) * ch}  r={3.5} fill="#2888F8" />
            <circle cx={hovX} cy={mt + (1 - d.resistance / 100) * ch}       r={3.5} fill="#fb7512" />
            <circle cx={hovX} cy={mt + (1 - d.zoneAccuracy / 100) * ch}     r={3.5} fill="#00aa13" />
          </>
        })()}
        {[0, 10, 20, 30, 40, 45].map(min => {
          const x = ml + (Math.min(min, 44) / 44) * cw
          return <text key={min} x={x} y={H - 2} fontSize={8.5} fill={darkMode ? "#6B7280" : "#9CA3AF"}
            textAnchor={min === 0 ? "start" : min === 45 ? "end" : "middle"}>{min}m</text>
        })}
      </svg>
      {hovIdx !== null && hovX !== null && (
        <div className={`absolute pointer-events-none text-xs px-2 py-1.5 rounded-lg whitespace-nowrap z-10
          ${darkMode ? "bg-gray-700 text-white" : "bg-gray-900 text-white"}`}
          style={{ top: 2, left: `${(hovIdx / (data.length - 1)) * 100}%`,
            transform: hovIdx < 5 ? "translateX(4px)" : hovIdx > 39 ? "translateX(-100%)" : "translateX(-50%)" }}>
          <span style={{ color: "#2888F8" }}>●</span> {data[hovIdx].cadence} rpm &nbsp;
          <span style={{ color: "#fb7512" }}>●</span> {data[hovIdx].resistance}% resistance &nbsp;
          <span style={{ color: "#00aa13" }}>●</span> {data[hovIdx].zoneAccuracy}% zone
        </div>
      )}
      {!hideLegend && (
        <div className="flex items-center gap-4 mt-2.5">
          {[["#2888F8","Cadence"],["#fb7512","Resistance"],["#00aa13","Zone accuracy"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-4 rounded-full" style={{ height: 2, background: c }} />
              <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RideChartModal({ ride, darkMode, onClose }) {
  const data    = generateRideData(ride)
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const bg      = darkMode ? "bg-gray-900"   : "bg-white"
  const border  = darkMode ? "border-gray-800" : "border-gray-100"

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${bg} rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden z-10`}
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div className={`px-6 pt-6 pb-4 flex items-start justify-between border-b ${border} flex-shrink-0`}>
          <div className="min-w-0 pr-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#00aa13] mb-1">Ride Telemetry</p>
            <h2 className={`text-xl font-bold leading-tight ${heading}`}>{ride.name}</h2>
            <p className={`text-sm mt-0.5 ${muted}`}>{ride.date} · {ride.time} · {ride.instructor}</p>
          </div>
          <button onClick={onClose}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
              ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>✕</button>
        </div>

        {/* Legend */}
        <div className={`px-6 py-3 flex items-center gap-4 border-b ${border} flex-shrink-0`}>
          {[["#2888F8","Cadence"],["#fb7512","Resistance"],["#00aa13","Zone accuracy"]].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-4 rounded-full" style={{ height: 2, background: c }} />
              <span className={`text-xs ${muted}`}>{l}</span>
            </div>
          ))}
        </div>

        {/* Chart — fills modal width */}
        <div className="overflow-y-auto flex-1 p-6 pt-8">
          <RideLineChart data={data} ride={ride} darkMode={darkMode} hideLegend />
          <p className={`text-xs mt-4 text-center ${muted}`}>Hover across the line to read values at each minute</p>
        </div>
      </div>
    </div>
  )
}

function RideVsClass({ ride, darkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const trackBg = darkMode ? "bg-gray-700"   : "bg-gray-100"
  const skill   = 1 - (ride.position - 1) / ride.total

  const zoneYou  = Math.round(55 + skill * 30)
  const zoneCls  = 65
  const cadMax   = Math.max(ride.cadence, ride.classAvg.cadence, 90) * 1.15
  const engMax   = Math.max(ride.energy,  ride.classAvg.energy,  1)  * 1.2

  const rows = [
    { label: "Class position",  youPct: skill * 100,
      clsPct: 50, youLabel: `#${ride.position} / ${ride.total}`, clsLabel: "median" },
    { label: "Cadence",
      youPct: (ride.cadence / cadMax) * 100, clsPct: (ride.classAvg.cadence / cadMax) * 100,
      youLabel: `${ride.cadence} rpm`, clsLabel: `${ride.classAvg.cadence} rpm` },
    { label: "Energy output",
      youPct: (ride.energy / engMax) * 100, clsPct: (ride.classAvg.energy / engMax) * 100,
      youLabel: `${ride.energy} kWh`, clsLabel: `${ride.classAvg.energy} kWh` },
    { label: "Zone accuracy",
      youPct: zoneYou, clsPct: zoneCls,
      youLabel: `${zoneYou}%`, clsLabel: `${zoneCls}%` },
  ]

  return (
    <div className="flex flex-col gap-3.5">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-medium ${muted}`}>{r.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#00aa13]">{r.youLabel}</span>
              <span className={`text-xs ${muted}`}>avg {r.clsLabel}</span>
            </div>
          </div>
          <div className={`relative h-1.5 rounded-full ${trackBg}`}>
            <div className="absolute inset-y-0 left-0 rounded-full bg-[#00aa13]"
              style={{ width: `${Math.min(100, r.youPct)}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 rounded-full"
              style={{ left: `${Math.min(100, r.clsPct)}%`, background: darkMode ? "#9CA3AF" : "#6B7280" }} />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-5 mt-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1.5 rounded-full bg-[#00aa13]" />
          <span className={`text-xs ${muted}`}>You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-px h-3.5 rounded-full" style={{ background: darkMode ? "#9CA3AF" : "#6B7280" }} />
          <span className={`text-xs ${muted}`}>Class average</span>
        </div>
      </div>
    </div>
  )
}

function RidesPage({ darkMode, onToggleDarkMode }) {
  const [selectedRide, setSelectedRide]       = useState(ridesData[0])
  const [collectedStreaks, setCollectedStreaks] = useState(new Set())
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
  const [chartModalOpen, setChartModalOpen]   = useState(false)
  const ridesDrag = useDragToDismiss(() => setMobileSheetOpen(false))

  function collectStreak(ride) {
    setCollectedStreaks(prev => new Set([...prev, ride.date + ride.name]))
  }

  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const heading = darkMode ? "text-white"      : "text-gray-900"
  const muted   = darkMode ? "text-gray-400"   : "text-gray-500"
  const divider = darkMode ? "border-gray-800" : "border-gray-100"
  const subtle  = darkMode ? "bg-gray-800"     : "bg-gray-50"

  const top10Count = ridesData.filter(r => r.badges.some(b => b === "Top 10%" || b === "Top 5%")).length

  return (
    <div className="p-4 md:p-8 flex flex-col md:h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>My Rides</h1>
          <p className={`text-sm ${muted}`}>{ridesData.length} rides · Feb – Mar 2026</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          <span className={`hidden sm:inline text-sm ${muted}`}>eenieJIM</span>
          <Avatar name="eenieJIM" size={32} user />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 md:overflow-hidden">

        {/* ── Ride list ── */}
        <div className={`${card} flex-1 overflow-y-auto`}>
          <div className={`flex items-center justify-between px-5 py-3 border-b ${divider}`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Feb – Mar 2026</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#00aa13" }}>
                ⭐ Top 10%: {top10Count}×
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                {ridesData.length} rides
              </span>
            </div>
          </div>

          {ridesData.map((ride, i) => {
            const isSel = selectedRide === ride
            const tier  = positionTier(ride.position, ride.total)
            return (
              <div key={i} onClick={() => { setSelectedRide(ride); setMobileSheetOpen(true) }}
                className={`px-5 py-4 border-b cursor-pointer transition-all ${divider}
                  ${isSel ? "border-l-2 border-l-[#00aa13] bg-[#e6f9e8]" : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`text-sm font-semibold ${isSel ? "text-[#00aa13]" : heading}`}>{ride.name}</p>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {ride.badges.map(b => {
                      const cfg = RIDE_BADGES[b]
                      if (!cfg) return null
                      return (
                        <span key={b} className="text-xs font-semibold"
                          style={{ color: cfg.colors[0] }}>
                          {cfg.icon} {cfg.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <p className={`text-xs mb-2 ${muted}`}>{ride.date} · {ride.time} · {ride.instructor}</p>
                <div className={`flex gap-5 text-xs ${muted}`}>
                  <span>
                    <span className="font-semibold" style={{ color: tier.color || (isSel ? "#00aa13" : undefined) }}>
                      {ride.position}/{ride.total}
                    </span>
                    {tier.tier && <span className="ml-1 font-medium" style={{ color: tier.color }}>({tier.tier})</span>}
                  </span>
                  <span>Cadence <span className={`font-semibold ${isSel ? "text-[#00aa13]" : heading}`}>{ride.cadence} rpm</span></span>
                  <span>Energy <span className={`font-semibold ${isSel ? "text-[#00aa13]" : heading}`}>{ride.energy} kWh</span></span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Detail panel ── */}
        {selectedRide ? (
          <div className={`hidden md:block ${card} md:w-[420px] md:flex-shrink-0 overflow-y-auto`}>

            {/* Header */}
            <div className={`p-5 border-b ${divider}`}>
              <div className="flex items-start justify-between mb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-[#00aa13]">Ride Analysis</p>
                <button onClick={() => setSelectedRide(null)} className={`text-xs ${muted} hover:text-red-400`}>✕ Close</button>
              </div>
              <h2 className={`text-xl font-bold mt-1 ${heading}`}>{selectedRide.name}</h2>
              <p className={`text-xs mt-1 ${muted}`}>{selectedRide.date} · {selectedRide.time} · {selectedRide.studio}</p>
              <div className={`flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-xl ${subtle}`}>
                <Avatar name={selectedRide.instructor} size={32} />
                <div>
                  <p className={`text-xs font-semibold ${heading}`}>{selectedRide.instructor}</p>
                  <p className={`text-xs ${muted}`}>Lead Instructor · 45 min</p>
                </div>
              </div>

              {/* Streak collect */}
              {(() => {
                const key = selectedRide.date + selectedRide.name
                const collected = collectedStreaks.has(key)
                return collected ? (
                  <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                    style={{ background: darkMode ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.07)" }}>
                    <span style={{ fontSize: 15 }}>📈</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "#06B6D4" }}>Streak collected</p>
                      <p className={`text-xs ${muted}`}>Counts toward Streak Collector badge</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#06B6D4" }}>✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => collectStreak(selectedRide)}
                    className={`w-full mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors active:scale-[0.98] border border-[#00aa13] ${darkMode ? "bg-gray-900" : "bg-white"}`}
                    style={{ animation: "streakRing 2s ease-out infinite" }}>
                    <span style={{ fontSize: 15 }}>📈</span>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold text-[#00aa13]">Collect Streak</p>
                      <p className={`text-xs ${muted}`}>Tap to log that you reviewed this ride</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#00aa13]">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )
              })()}
            </div>

            {/* Metrics grid */}
            <div className={`p-5 border-b ${divider}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Performance</p>
              <div className="grid grid-cols-2 gap-2.5">
                {(() => {
                  const tier = positionTier(selectedRide.position, selectedRide.total)
                  return (
                    <div className={`rounded-2xl p-3.5 ${subtle}`}>
                      <p className={`text-xs mb-1 ${muted}`}>Class position</p>
                      <p className="text-2xl font-bold leading-none" style={{ color: tier.color || "#6B7280" }}>
                        {selectedRide.position}
                        <span className={`text-sm font-normal ${muted}`}> / {selectedRide.total}</span>
                      </p>
                      {tier.tier && <p className="text-xs font-bold mt-1" style={{ color: tier.color }}>{tier.tier}</p>}
                    </div>
                  )
                })()}
                <div className={`rounded-2xl p-3.5 ${subtle}`}>
                  <p className={`text-xs mb-1 ${muted}`}>Avg cadence</p>
                  <p className={`text-2xl font-bold leading-none ${heading}`}>
                    {selectedRide.cadence}
                    <span className={`text-sm font-normal ${muted}`}> rpm</span>
                  </p>
                  <p className={`text-xs mt-1 ${muted}`}>Peak {selectedRide.peakCadence} rpm</p>
                </div>
                <div className={`rounded-2xl p-3.5 ${subtle}`}>
                  <p className={`text-xs mb-1 ${muted}`}>Energy output</p>
                  <p className={`text-2xl font-bold leading-none ${heading}`}>
                    {selectedRide.energy}
                    <span className={`text-sm font-normal ${muted}`}> kWh</span>
                  </p>
                  <p className={`text-xs mt-1 ${muted}`}>Avg {selectedRide.avgPower}% FTP</p>
                </div>
                <div className={`rounded-2xl p-3.5 ${subtle}`}>
                  <p className={`text-xs mb-1 ${muted}`}>Peak power</p>
                  <p className={`text-2xl font-bold leading-none ${heading}`}>
                    {selectedRide.maxPower}
                    <span className={`text-sm font-normal ${muted}`}> W</span>
                  </p>
                  <p className={`text-xs mt-1 ${muted}`}>
                    Class avg {selectedRide.classAvg.cadence} rpm · {selectedRide.classAvg.energy} kWh
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            {selectedRide.badges.length > 0 && (
              <div className={`p-5 border-b ${divider}`}>
                <div className="flex items-center justify-between mb-4">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Achievements</p>
                  <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                    <span className="text-[#00aa13] font-bold">⭐ {top10Count}×</span>
                    <span className={muted}>Top 10% from {ridesData.length} rides</span>
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {selectedRide.badges.map(b => {
                    const cfg = RIDE_BADGES[b]
                    if (!cfg) return null
                    return (
                      <div key={b} className="flex flex-col items-center gap-2">
                        <PremiumBadge icon={cfg.icon} colors={cfg.colors} size={64} earned={true} darkMode={darkMode} />
                        <p className={`text-xs font-semibold text-center leading-tight ${heading}`} style={{ maxWidth: "64px" }}>
                          {cfg.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Insight */}
            <div className={`p-5 border-b ${divider}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Ride Insight</p>
              <p className={`text-sm leading-relaxed ${heading}`}>{selectedRide.insight}</p>
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  {selectedRide.vsLastRide}
                </span>
                <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-[#e6f9e8] text-[#00aa13]">
                  {selectedRide.vsPB}
                </span>
              </div>
            </div>

            {/* Session profile */}
            <div className={`p-5 border-b ${divider}`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Session Profile</p>
                <button onClick={() => setChartModalOpen(true)}
                  className="text-xs font-semibold text-[#00aa13] hover:underline flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  Expand
                </button>
              </div>
              <div className="flex items-end gap-0.5 h-20 mb-5">
                {getIntensity(selectedRide.name).map((v, i) => {
                  const zone = getFTPZone(v)
                  return <div key={i} className="flex-1 rounded-sm" style={{ height: `${zone.height}%`, backgroundColor: zone.color }} />
                })}
              </div>
              <RideLineChart data={generateRideData(selectedRide)} ride={selectedRide} darkMode={darkMode} />
            </div>

            {/* You vs class */}
            <div className={`p-5 border-b ${divider}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>You vs the Class</p>
              <RideVsClass ride={selectedRide} darkMode={darkMode} />
            </div>

            {/* Bike position */}
            <div className="p-5">
              <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>Bike Used</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-center mb-1">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs ${muted}`}>Instructor</span>
                    <div className="w-8 h-10 rounded-lg bg-[#00aa13]" />
                  </div>
                </div>
                {[[1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16],[17,18,19,20,21,22,23,24]].map((row, ri) => (
                  <div key={ri} className="flex gap-2 justify-center">
                    {row.map(num => (
                      <div key={num} className={`w-8 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors
                        ${num === selectedRide.bike ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                        {num === selectedRide.bike ? num : ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className={`hidden md:flex ${card} w-[420px] flex-shrink-0 items-center justify-center`}>
            <div className="text-center px-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>🚴</div>
              <p className={`text-sm font-semibold ${heading}`}>Select a ride</p>
              <p className={`text-xs mt-1 ${muted}`}>Choose any session from the list to view your full performance analysis.</p>
            </div>
          </div>
        )}

      </div>

      {/* ── Mobile bottom sheet — ride detail ── */}
      {mobileSheetOpen && selectedRide && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSheetOpen(false)} />
          <div className={`relative rounded-t-3xl flex flex-col overflow-hidden ${darkMode ? "bg-gray-900" : "bg-white"}`}
            style={ridesDrag.sheetStyle} {...ridesDrag.handlers}>
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className={`w-10 h-1 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-300"}`} />
            </div>
            <div className="overflow-y-auto flex-1">
              {/* Header */}
              <div className={`p-5 border-b ${divider}`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#00aa13]">Ride Analysis</p>
                  <button onClick={() => setMobileSheetOpen(false)} className={`text-xs ${muted} hover:text-red-400`}>✕ Close</button>
                </div>
                <h2 className={`text-xl font-bold mt-1 ${heading}`}>{selectedRide.name}</h2>
                <p className={`text-xs mt-1 ${muted}`}>{selectedRide.date} · {selectedRide.time} · {selectedRide.studio}</p>
                <div className={`flex items-center gap-2.5 mt-3 px-3 py-2.5 rounded-xl ${subtle}`}>
                  <div className="w-8 h-8 rounded-full bg-[#e6f9e8] flex items-center justify-center text-xs font-bold text-[#00aa13] flex-shrink-0">
                    {selectedRide.instructor.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${heading}`}>{selectedRide.instructor}</p>
                    <p className={`text-xs ${muted}`}>Lead Instructor · 45 min</p>
                  </div>
                </div>
                {(() => {
                  const key = selectedRide.date + selectedRide.name
                  const collected = collectedStreaks.has(key)
                  return collected ? (
                    <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                      style={{ background: darkMode ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.07)" }}>
                      <span style={{ fontSize: 15 }}>📈</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold" style={{ color: "#06B6D4" }}>Streak collected</p>
                        <p className={`text-xs ${muted}`}>Counts toward Streak Collector badge</p>
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#06B6D4" }}>✓</span>
                    </div>
                  ) : (
                    <button onClick={() => collectStreak(selectedRide)}
                      className={`w-full mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors active:scale-[0.98] border border-[#00aa13] ${darkMode ? "bg-gray-900" : "bg-white"}`}
                      style={{ animation: "streakRing 2s ease-out infinite" }}>
                      <span style={{ fontSize: 15 }}>📈</span>
                      <div className="flex-1 text-left">
                        <p className="text-xs font-semibold text-[#00aa13]">Collect Streak</p>
                        <p className={`text-xs ${muted}`}>Tap to log that you reviewed this ride</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#00aa13]">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )
                })()}
              </div>
              {/* Metrics */}
              <div className={`p-5 border-b ${divider}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Performance</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {(() => {
                    const tier = positionTier(selectedRide.position, selectedRide.total)
                    return (
                      <div className={`rounded-2xl p-3.5 ${subtle}`}>
                        <p className={`text-xs mb-1 ${muted}`}>Class position</p>
                        <p className="text-2xl font-bold leading-none" style={{ color: tier.color || "#6B7280" }}>
                          {selectedRide.position}<span className={`text-sm font-normal ${muted}`}> / {selectedRide.total}</span>
                        </p>
                        {tier.tier && <p className="text-xs font-bold mt-1" style={{ color: tier.color }}>{tier.tier}</p>}
                      </div>
                    )
                  })()}
                  <div className={`rounded-2xl p-3.5 ${subtle}`}>
                    <p className={`text-xs mb-1 ${muted}`}>Avg cadence</p>
                    <p className={`text-2xl font-bold leading-none ${heading}`}>{selectedRide.cadence}<span className={`text-sm font-normal ${muted}`}> rpm</span></p>
                    <p className={`text-xs mt-1 ${muted}`}>Peak {selectedRide.peakCadence} rpm</p>
                  </div>
                  <div className={`rounded-2xl p-3.5 ${subtle}`}>
                    <p className={`text-xs mb-1 ${muted}`}>Energy output</p>
                    <p className={`text-2xl font-bold leading-none ${heading}`}>{selectedRide.energy}<span className={`text-sm font-normal ${muted}`}> kWh</span></p>
                    <p className={`text-xs mt-1 ${muted}`}>Avg {selectedRide.avgPower}% FTP</p>
                  </div>
                  <div className={`rounded-2xl p-3.5 ${subtle}`}>
                    <p className={`text-xs mb-1 ${muted}`}>Peak power</p>
                    <p className={`text-2xl font-bold leading-none ${heading}`}>{selectedRide.maxPower}<span className={`text-sm font-normal ${muted}`}> W</span></p>
                    <p className={`text-xs mt-1 ${muted}`}>Class avg {selectedRide.classAvg.cadence} rpm · {selectedRide.classAvg.energy} kWh</p>
                  </div>
                </div>
              </div>
              {/* Achievements */}
              {selectedRide.badges.length > 0 && (
                <div className={`p-5 border-b ${divider}`}>
                  <div className="flex items-center justify-between mb-4">
                    <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Achievements</p>
                    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                      <span className="text-[#00aa13] font-bold">⭐ {top10Count}×</span>
                      <span className={muted}>Top 10% from {ridesData.length} rides</span>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {selectedRide.badges.map(b => {
                      const cfg = RIDE_BADGES[b]
                      if (!cfg) return null
                      return (
                        <div key={b} className="flex flex-col items-center gap-2">
                          <PremiumBadge icon={cfg.icon} colors={cfg.colors} size={64} earned={true} darkMode={darkMode} />
                          <p className={`text-xs font-semibold text-center leading-tight ${heading}`} style={{ maxWidth: "64px" }}>{cfg.label}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {/* Insight */}
              <div className={`p-5 border-b ${divider}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${muted}`}>Ride Insight</p>
                <p className={`text-sm leading-relaxed ${heading}`}>{selectedRide.insight}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <span className={`text-xs px-3 py-1.5 rounded-xl font-medium ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{selectedRide.vsLastRide}</span>
                  <span className="text-xs px-3 py-1.5 rounded-xl font-medium bg-[#e6f9e8] text-[#00aa13]">{selectedRide.vsPB}</span>
                </div>
              </div>
              {/* Session profile */}
              <div className={`p-5 border-b ${divider}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Session Profile</p>
                  <button onClick={() => setChartModalOpen(true)}
                    className="text-xs font-semibold text-[#00aa13] hover:underline flex items-center gap-1">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    Expand
                  </button>
                </div>
                <div className="flex items-end gap-0.5 h-12 mb-4">
                  {getIntensity(selectedRide.name).map((v, i) => {
                    const zone = getFTPZone(v)
                    return <div key={i} className="flex-1 rounded-sm" style={{ height: `${zone.height}%`, backgroundColor: zone.color }} />
                  })}
                </div>
                <RideLineChart data={generateRideData(selectedRide)} ride={selectedRide} darkMode={darkMode} />
              </div>
              {/* You vs class */}
              <div className={`p-5 border-b ${divider}`}>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>You vs the Class</p>
                <RideVsClass ride={selectedRide} darkMode={darkMode} />
              </div>
              {/* Bike position */}
              <div className="p-5 pb-10">
                <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>Bike Used</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center mb-1">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs ${muted}`}>Instructor</span>
                      <div className="w-8 h-10 rounded-lg bg-[#00aa13]" />
                    </div>
                  </div>
                  {[[1,2,3,4,5,6,7,8],[9,10,11,12,13,14,15,16],[17,18,19,20,21,22,23,24]].map((row, ri) => (
                    <div key={ri} className="flex gap-2 justify-center">
                      {row.map(num => (
                        <div key={num} className={`w-8 h-10 rounded-lg flex items-center justify-center text-xs font-medium
                          ${num === selectedRide.bike ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-700 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                          {num === selectedRide.bike ? num : ""}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {chartModalOpen && selectedRide && (
        <RideChartModal ride={selectedRide} darkMode={darkMode} onClose={() => setChartModalOpen(false)} />
      )}
    </div>
  )
}

// ─── ACHIEVEMENTS PAGE ──────────────────────────────────────────────────────

function AchievementsPage({ darkMode, onToggleDarkMode, onNavigate }) {
  const card    = `rounded-2xl border p-6 transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className={`text-xl font-semibold ${heading}`}>Achievements</h1>
          <p className={`text-sm ${muted}`}>Track your progress and milestones</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline text-sm ${muted}`}>eenieJIM</span>
          <Avatar name="eenieJIM" size={32} user />
        </div>
      </div>

      {/* Earned */}
      <h2 className={`font-semibold mb-4 ${heading}`}>Earned</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {achievements.filter(a => a.earned).map((a, i) => (
          <div key={i} className={`${card} flex items-center gap-4`}>
            <PremiumBadge icon={a.icon} colors={achGradient(a.name)} size={56} earned={true} darkMode={darkMode} />
            <div>
              <p className={`font-semibold ${heading}`}>{a.name}</p>
              <p className={`text-xs mt-1 ${muted}`}>{a.description}</p>
              <p className="text-xs text-[#00aa13] font-medium mt-2">Completed ✓</p>
            </div>
          </div>
        ))}
      </div>

      {/* In progress */}
      <h2 className={`font-semibold mb-4 ${heading}`}>In Progress</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {achievements.filter(a => !a.earned && a.progress > 0).map((a, i) => {
          const [c1, c2] = achGradient(a.name)
          return (
            <div key={i} className={card}>
              <div className="flex items-center gap-4 mb-4">
                <PremiumBadge icon={a.icon} colors={achGradient(a.name)} size={56} earned={false} darkMode={darkMode} />
                <div>
                  <p className={`font-semibold ${heading}`}>{a.name}</p>
                  <p className={`text-xs mt-1 ${muted}`}>{a.progress} of {a.total} {a.unit}</p>
                </div>
              </div>
              <div className={`w-full rounded-full h-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${(a.progress/a.total)*100}%`, background: c1 }} />
              </div>
              <p className={`text-xs mt-2 text-right ${muted}`}>{Math.round((a.progress/a.total)*100)}%</p>
            </div>
          )
        })}
      </div>

      {/* Locked */}
      <h2 className={`font-semibold mb-1 ${heading}`}>Locked</h2>
      <p className={`text-sm mb-4 ${muted}`}>Complete these challenges to earn new badges</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.filter(a => !a.earned && a.progress === 0).map((a, i) => (
          <div key={i} className={`${card} flex flex-col items-center text-center gap-3 py-6`}
            style={a.name === "Streak Collector" ? { borderColor: "#06B6D4", borderWidth: 1.5 } : {}}>
            <PremiumBadge icon={a.icon} colors={achGradient(a.name)} size={52} earned={false} darkMode={darkMode} />
            <div>
              <p className={`text-sm font-semibold ${heading}`}>{a.name}</p>
              <p className={`text-xs mt-1 leading-snug ${muted}`}>{a.description}</p>
              <p className={`text-xs mt-2 font-medium ${muted}`}>{a.total} {a.unit}</p>
            </div>
            {a.name === "Streak Collector" && (
              <button onClick={() => onNavigate("Rides")}
                className={`w-full mt-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-colors border border-[#0891B2] ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <span className="text-xs font-semibold text-[#0891B2]">Check ride history</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-[#0891B2]">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SETTINGS PAGE ──────────────────────────────────────────────────────────

function SToggle({ on, onChange, darkMode }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      flexShrink: 0, width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", padding: 0,
      background: on ? "#00aa13" : darkMode ? "#4B5563" : "#D1D5DB", transition: "background 0.18s", position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.22)", transition: "left 0.18s",
      }} />
    </button>
  )
}

function SettingsRow({ label, sub, children, darkMode, danger }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 px-5">
      <div className="min-w-0">
        <p className={`text-sm font-medium ${danger ? "text-red-500" : heading}`}>{label}</p>
        {sub && <p className={`text-xs mt-0.5 ${muted}`}>{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function SettingsSection({ title, children, darkMode }) {
  const muted  = darkMode ? "text-gray-500" : "text-gray-400"
  const card   = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
  const divider = darkMode ? "divide-gray-800" : "divide-gray-100"
  return (
    <div>
      {title && <p className={`text-xs font-semibold uppercase tracking-widest px-1 mb-2 ${muted}`}>{title}</p>}
      <div className={`rounded-2xl border divide-y ${card} ${divider} overflow-hidden`}>{children}</div>
    </div>
  )
}

function SettingsPage({ darkMode, onToggleDarkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"
  const chipBg  = darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"

  const [notif, setNotif] = useState({
    classReminders: true, bookingConfirm: true, waitlistUpdates: true,
    weeklySummary: true, achievements: true, promotions: false,
  })
  const [prefs, setPrefs] = useState({
    units: "metric", defaultView: "week",
  })
  const [booking, setBooking] = useState({ reminderHours: 2 })
  const [connected, setConnected] = useState({ strava: true, appleHealth: false, garmin: false })

  function SelectChip({ options, value, onChange }) {
    return (
      <div className={`inline-flex rounded-lg overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        {options.map(o => (
          <button key={o.value} onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${value === o.value
              ? "bg-[#00aa13] text-white"
              : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            {o.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-16">

      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-xl font-semibold ${heading}`}>Settings</h1>
        <p className={`text-sm mt-1 ${muted}`}>Manage your account, preferences and notifications</p>
      </div>

      <div className="flex flex-col gap-7">

        {/* Profile */}
        <SettingsSection darkMode={darkMode}>
          <div className={`flex items-center gap-4 px-5 py-4 ${subtle}`}>
            <Avatar name="eenieJIM" size={56} user />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${heading}`}>eenieJIM</p>
              <p className={`text-sm ${muted}`}>camih014@gmail.com</p>
              <p className={`text-xs mt-0.5 ${muted}`}>Member since January 2025</p>
            </div>
            <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              Edit
            </button>
          </div>
          <SettingsRow label="Change password" sub="Last updated 3 months ago" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
          <SettingsRow label="Manage membership" sub="Active · Monthly plan" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" darkMode={darkMode}>
          <SettingsRow label="Class reminders" sub="Remind me before a booked session" darkMode={darkMode}>
            <SToggle on={notif.classReminders} onChange={v => setNotif(n => ({...n, classReminders: v}))} darkMode={darkMode} />
          </SettingsRow>
          {notif.classReminders && (
            <SettingsRow label="Reminder timing" sub="How far in advance to notify" darkMode={darkMode}>
              <SelectChip options={[{value:1,label:"1h"},{value:2,label:"2h"},{value:24,label:"Day before"}]}
                value={booking.reminderHours} onChange={v => setBooking(b => ({...b, reminderHours: v}))} />
            </SettingsRow>
          )}
          <SettingsRow label="Booking confirmations" sub="Confirm when a spot is reserved" darkMode={darkMode}>
            <SToggle on={notif.bookingConfirm} onChange={v => setNotif(n => ({...n, bookingConfirm: v}))} darkMode={darkMode} />
          </SettingsRow>
          <SettingsRow label="Waitlist updates" sub="Notify me if a spot opens up" darkMode={darkMode}>
            <SToggle on={notif.waitlistUpdates} onChange={v => setNotif(n => ({...n, waitlistUpdates: v}))} darkMode={darkMode} />
          </SettingsRow>
          <SettingsRow label="Achievement alerts" sub="When you earn or get close to a badge" darkMode={darkMode}>
            <SToggle on={notif.achievements} onChange={v => setNotif(n => ({...n, achievements: v}))} darkMode={darkMode} />
          </SettingsRow>
          <SettingsRow label="Weekly summary" sub="Every Monday — your previous week at a glance" darkMode={darkMode}>
            <SToggle on={notif.weeklySummary} onChange={v => setNotif(n => ({...n, weeklySummary: v}))} darkMode={darkMode} />
          </SettingsRow>
          <SettingsRow label="Promotions & offers" sub="Membership deals and studio news" darkMode={darkMode}>
            <SToggle on={notif.promotions} onChange={v => setNotif(n => ({...n, promotions: v}))} darkMode={darkMode} />
          </SettingsRow>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences" darkMode={darkMode}>
          <SettingsRow label="Dark mode" sub="Switch between light and dark theme" darkMode={darkMode}>
            <SToggle on={darkMode} onChange={onToggleDarkMode} darkMode={darkMode} />
          </SettingsRow>
          <SettingsRow label="Units" sub="Affects power and distance displays" darkMode={darkMode}>
            <SelectChip options={[{value:"metric",label:"Metric"},{value:"imperial",label:"Imperial"}]}
              value={prefs.units} onChange={v => setPrefs(p => ({...p, units: v}))} />
          </SettingsRow>
          <SettingsRow label="Default booking view" darkMode={darkMode}>
            <SelectChip options={[{value:"week",label:"Week"},{value:"month",label:"Month"}]}
              value={prefs.defaultView} onChange={v => setPrefs(p => ({...p, defaultView: v}))} />
          </SettingsRow>
        </SettingsSection>

        {/* Booking */}
        <SettingsSection title="Booking" darkMode={darkMode}>
          <SettingsRow label="Booking history" sub="View and manage all past bookings" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
          <SettingsRow label="Cancellation policy" sub="Free up to 8 hours before class" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
        </SettingsSection>

        {/* Connected apps */}
        <SettingsSection title="Connected Apps" darkMode={darkMode}>
          {[
            { key: "strava",      label: "Strava",        sub: "Sync rides to your Strava activity feed",     icon: "🟠" },
            { key: "appleHealth", label: "Apple Health",  sub: "Write workouts to the Health app",            icon: "❤️" },
            { key: "garmin",      label: "Garmin Connect", sub: "Sync to Garmin devices and Connect IQ",      icon: "⌚" },
          ].map(app => (
            <SettingsRow key={app.key} label={<span className="flex items-center gap-2"><span>{app.icon}</span>{app.label}</span>}
              sub={app.sub} darkMode={darkMode}>
              <SToggle on={connected[app.key]} onChange={v => setConnected(c => ({...c, [app.key]: v}))} darkMode={darkMode} />
            </SettingsRow>
          ))}
        </SettingsSection>

        {/* Data & Privacy */}
        <SettingsSection title="Data & Privacy" darkMode={darkMode}>
          <div className={`px-5 py-4 ${darkMode ? "bg-gray-800/60" : "bg-blue-50/60"}`}>
            <p className={`text-xs font-semibold mb-1 ${darkMode ? "text-blue-400" : "text-blue-700"}`}>How your data is used</p>
            <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Your ride statistics contribute to anonymised class averages and performance benchmarks. No personally identifiable information is shared. You can export or delete your data at any time under GDPR.
            </p>
          </div>
          <SettingsRow label="Download my data" sub="Export all your ride history and stats" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
          <SettingsRow label="Privacy policy" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
          <SettingsRow label="Terms of service" darkMode={darkMode}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={muted}><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
        </SettingsSection>

        {/* Account / danger */}
        <SettingsSection title="Account" darkMode={darkMode}>
          <SettingsRow label="Sign out" darkMode={darkMode} danger>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
          <SettingsRow label="Delete account" sub="Permanently remove your data" darkMode={darkMode} danger>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-red-400"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </SettingsRow>
        </SettingsSection>

        <p className={`text-xs text-center pb-2 ${muted}`}>Version 1.0.0 · Made with ♥ for riders</p>

      </div>
    </div>
  )
}

// ─── PROFILE PAGE ───────────────────────────────────────────────────────────

function ProfilePage({ darkMode, onToggleDarkMode }) {
  const heading  = darkMode ? "text-white"    : "text-gray-900"
  const muted    = darkMode ? "text-gray-400" : "text-gray-500"
  const card     = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const subtle   = darkMode ? "bg-gray-800"   : "bg-gray-50"
  const divider  = darkMode ? "divide-gray-800 border-gray-800" : "divide-gray-100 border-gray-100"

  // Goals state
  const [weeklyTarget, setWeeklyTarget]   = useState(4)
  const [energyTarget, setEnergyTarget]   = useState(15)
  const [prefClasses, setPrefClasses]     = useState(["Rhythm Ride","Threshold Push","Sunrise Power"])
  const [experience, setExperience]       = useState("Intermediate")

  // Derived fitness data
  const totalRides  = ridesData.length
  const totalEnergy = parseFloat(ridesData.reduce((s, r) => s + r.energy, 0).toFixed(1))
  const avgPosPct   = Math.round((1 - ridesData.reduce((s,r) => s + r.position/r.total, 0)/totalRides) * 100)
  const ftpEst      = 165
  const weekRides   = 3  // current week from WEEK_DATA
  const monthEnergy = parseFloat((totalEnergy * 0.84).toFixed(1)) // approx current month

  const allClasses  = ["Rhythm Ride","Threshold Push","Sunrise Power","HIIT Blast",
                       "Cadence Control","Evening Flow","Climb Intervals","Tempo Foundation"]

  const HR_ZONES = [
    { label:"Z1",color:"#36aee2",range:"<111 bpm",desc:"Recovery"   },
    { label:"Z2",color:"#82ed3c",range:"111–130",  desc:"Endurance"  },
    { label:"Z3",color:"#fde53d",range:"130–148",  desc:"Tempo"      },
    { label:"Z4",color:"#fb7512",range:"148–167",  desc:"Threshold"  },
    { label:"Z5",color:"#e91236",range:"167–185",  desc:"VO₂ Max"    },
  ]

  function GoalBar({ value, total, color = "#00aa13" }) {
    return (
      <div className={`h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        <div className="h-1.5 rounded-full transition-all" style={{ width:`${Math.min(100,(value/total)*100)}%`, background:color }} />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-16">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-xl font-semibold ${heading}`}>Profile</h1>
        <div className="flex items-center gap-3">
          <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
          <Avatar name="eenieJIM" size={32} user />
        </div>
      </div>

      {/* Identity card */}
      <div className={`${card} p-5 mb-5`}>
        <div className="flex items-center gap-4">
          <Avatar name="eenieJIM" size={64} square user />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className={`text-xl font-bold ${heading}`}>eenieJIM</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#e6f9e8] text-[#00aa13]">Rider</span>
            </div>
            <p className={`text-sm mt-0.5 ${muted}`}>camih014@gmail.com</p>
          </div>
          <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex-shrink-0 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Edit</button>
        </div>
      </div>

      {/* ── ROLE ── */}
      <div className={`${card} p-5 mb-5`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>Role</p>

        {/* Archetype */}
        <div className={`flex items-center gap-4 p-4 rounded-xl mb-4 ${subtle}`}>
          <div style={{ width:48,height:48,borderRadius:14,padding:3,flexShrink:0,
            background:"linear-gradient(145deg,#F8E878 0%,#D4A018 35%,#8B6000 65%,#C8980C 100%)",
            boxShadow:"0 2px 8px rgba(0,0,0,0.16)" }}>
            <div style={{ width:"100%",height:"100%",borderRadius:10,background:"#1A58C8",
              display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(170deg,rgba(255,255,255,0.28) 0%,transparent 48%)",pointerEvents:"none" }}/>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{position:"relative"}}><path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 21.2l1.4-6.8L2.2 9.7l6.9-.7z"/></svg>
            </div>
          </div>
          <div>
            <p className={`text-sm font-bold ${heading}`}>Weekend Warrior</p>
            <p className={`text-xs mt-0.5 ${muted}`}>Consistent · social · Sunday-loyal</p>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-sm font-medium ${heading}`}>Experience level</span>
          <div className={`inline-flex rounded-lg overflow-hidden border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            {["Beginner","Intermediate","Advanced"].map(lvl => (
              <button key={lvl} onClick={() => setExperience(lvl)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${experience === lvl
                  ? "bg-[#00aa13] text-white"
                  : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                {lvl}
              </button>
            ))}
          </div>
        </div>


        {/* Preferred classes */}
        <p className={`text-sm font-medium mb-2.5 ${heading}`}>Preferred classes</p>
        <div className="flex flex-wrap gap-2">
          {allClasses.map(cls => {
            const on = prefClasses.includes(cls)
            return (
              <button key={cls} onClick={() => setPrefClasses(p => on ? p.filter(c=>c!==cls) : [...p,cls])}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${on
                  ? "bg-[#e6f9e8] border-[#00aa13] text-[#00aa13]"
                  : darkMode ? "border-gray-700 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                {cls}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── FITNESS ── */}
      <div className={`${card} p-5 mb-5`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>Fitness</p>

        {/* FTP + level */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className={`rounded-xl p-3.5 ${subtle}`}>
            <p className={`text-xs ${muted} mb-1`}>Est. FTP</p>
            <p className={`text-2xl font-bold ${heading}`}>165<span className={`text-sm font-normal ${muted}`}> W</span></p>
            <p className={`text-xs mt-0.5 ${muted}`}>functional threshold</p>
          </div>
          <div className={`rounded-xl p-3.5 ${subtle}`}>
            <p className={`text-xs ${muted} mb-1`}>Avg position</p>
            <p className={`text-2xl font-bold ${heading}`}>Top<span className={`text-sm font-normal ${muted}`}> {100-avgPosPct}%</span></p>
            <p className={`text-xs mt-0.5 ${muted}`}>across all rides</p>
          </div>
          <div className={`rounded-xl p-3.5 ${subtle}`}>
            <p className={`text-xs ${muted} mb-1`}>Total energy</p>
            <p className={`text-2xl font-bold ${heading}`}>{totalEnergy}<span className={`text-sm font-normal ${muted}`}> kWh</span></p>
            <p className={`text-xs mt-0.5 ${muted}`}>all rides combined</p>
          </div>
        </div>

        {/* HR zones */}
        <p className={`text-xs font-semibold mb-2.5 ${muted}`}>Heart rate zones · est. max 185 bpm</p>
        <div className="flex rounded-xl overflow-hidden mb-2" style={{height:28}}>
          {HR_ZONES.map((z, i) => (
            <div key={i} className="flex-1 flex items-center justify-center" style={{background:z.color}}>
              <span className="text-white text-xs font-bold">{z.label}</span>
            </div>
          ))}
        </div>
        <div className="flex">
          {HR_ZONES.map((z, i) => (
            <div key={i} className="flex-1 text-center">
              <p className={`text-[10px] ${muted}`}>{z.range}</p>
            </div>
          ))}
        </div>

        {/* Fitness score */}
        <div className={`rounded-xl p-4 mt-4 ${subtle}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${muted}`}>Fitness Score</p>
              <div className="flex items-end gap-2">
                <span className={`text-4xl font-bold ${heading}`}>68</span>
                <span className="text-sm font-semibold text-[#00aa13] mb-1.5">↑ +4 this month</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs ${muted} mb-0.5`}>vs riders your level</p>
              <p className={`text-sm font-bold ${heading}`}>Top 14%</p>
              <p className={`text-xs ${muted}`}>of intermediate riders</p>
            </div>
          </div>

          {/* Score bar */}
          <div className={`relative h-2 rounded-full mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "68%", background: "linear-gradient(90deg, #36aee2, #00aa13)" }} />
            {/* Peer average marker */}
            <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full" style={{ left: "52%", background: darkMode ? "#9CA3AF" : "#6B7280" }} />
          </div>
          <div className="flex justify-between mb-4">
            <span className={`text-xs ${muted}`}>0</span>
            <div className="flex items-center gap-1">
              <div className="w-px h-2.5 rounded-full" style={{ background: darkMode ? "#9CA3AF" : "#6B7280" }} />
              <span className={`text-xs ${muted}`}>avg 52</span>
            </div>
            <span className={`text-xs ${muted}`}>100</span>
          </div>

          {/* Three sub-scores */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:"Aerobic base",  score:72, color:"#00aa13",  desc:"Built over weeks of consistent riding" },
              { label:"Current load",  score:45, color:"#fb7512",  desc:"Recent training stress this week" },
              { label:"Form",          score:27, color:"#2888F8",  desc:"Base minus load — you're fresh" },
            ].map((s, i) => (
              <div key={i} className={`rounded-xl p-3 ${darkMode ? "bg-gray-900/60" : "bg-white/70"}`}>
                <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1.5 ${muted}`}>{s.label}</p>
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.score}</p>
                <p className={`text-[10px] mt-1 leading-snug ${muted}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GOALS ── */}
      <div className={`${card} p-5 mb-5`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${muted}`}>Goals</p>

        {/* Weekly rides */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className={`text-sm font-semibold ${heading}`}>Weekly rides</p>
              <p className={`text-xs ${muted}`}>{weekRides} of {weeklyTarget} this week</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeeklyTarget(t => Math.max(1, t - 1))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>−</button>
              <span className={`text-sm font-bold w-4 text-center ${heading}`}>{weeklyTarget}</span>
              <button onClick={() => setWeeklyTarget(t => Math.min(7, t + 1))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>+</button>
            </div>
          </div>
          <GoalBar value={weekRides} total={weeklyTarget} />
        </div>

        {/* Monthly energy */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className={`text-sm font-semibold ${heading}`}>Monthly energy output</p>
              <p className={`text-xs ${muted}`}>{monthEnergy} of {energyTarget} kWh this month</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEnergyTarget(t => Math.max(5, t - 5))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>−</button>
              <span className={`text-xs font-bold w-12 text-center ${heading}`}>{energyTarget} kWh</span>
              <button onClick={() => setEnergyTarget(t => Math.min(50, t + 5))}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>+</button>
            </div>
          </div>
          <GoalBar value={monthEnergy} total={energyTarget} color="#fb7512" />
        </div>

        {/* Streak goal */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className={`text-sm font-semibold ${heading}`}>8-week streak</p>
              <p className={`text-xs ${muted}`}>4 of 8 weeks completed</p>
            </div>
            <span className="text-xs font-semibold text-[#00aa13]">4 weeks to go</span>
          </div>
          <GoalBar value={4} total={8} color="#F0C040" />
        </div>

        {/* Next badge */}
        {(() => {
          const next = achievements.filter(a => !a.earned && a.progress > 0)
            .sort((a,b) => (b.progress/b.total) - (a.progress/a.total))[0]
          if (!next) return null
          const [c1] = achGradient(next.name)
          return (
            <div className={`flex items-center gap-3 p-3.5 rounded-xl ${subtle}`}>
              <PremiumBadge icon={next.icon} colors={achGradient(next.name)} size={40} earned={false} darkMode={darkMode} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${heading}`}>Next up: {next.name}</p>
                <p className={`text-xs mb-1.5 ${muted}`}>{next.progress} / {next.total} {next.unit}</p>
                <GoalBar value={next.progress} total={next.total} color={c1} />
              </div>
            </div>
          )
        })()}
      </div>

      {/* ── MEMBERSHIP ── */}
      <div className={`${card} overflow-hidden mb-5`}>
        <div className={`px-5 py-4 border-b ${divider}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>Membership</p>
        </div>

        <div className={`px-5 py-4 border-b ${divider}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${heading}`}>Monthly Unlimited</p>
              <p className={`text-xs mt-0.5 ${muted}`}>Auto-renews 8 July 2026</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e6f9e8] text-[#00aa13]">Active</span>
          </div>
        </div>

        {/* Connected gym */}
        <div className={`flex items-center gap-3 px-5 py-4 border-b ${divider}`}>
          <div className="w-9 h-9 rounded-xl bg-[#e6f9e8] flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00aa13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${heading}`}>SpinOut · Hampstead, London</p>
            <p className={`text-xs ${muted}`}>Studio 1 & Studio 2</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#e6f9e8] text-[#00aa13] flex-shrink-0">Connected</span>
        </div>

        {[
          { label:"Member since",   value:"January 2025"         },
          { label:"Total rides",    value:`${totalRides} sessions` },
          { label:"Member number",  value:"EJ-2025-00841"         },
        ].map((row, i) => (
          <div key={i} className={`flex items-center justify-between px-5 py-3.5 border-b last:border-b-0 ${divider}`}>
            <span className={`text-sm ${muted}`}>{row.label}</span>
            <span className={`text-sm font-medium ${heading}`}>{row.value}</span>
          </div>
        ))}

        <div className="px-5 py-4">
          <button className={`w-full py-2.5 rounded-xl text-sm font-semibold border transition-colors ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            Manage membership
          </button>
        </div>
      </div>

    </div>
  )
}

// ─── LOG OUT PAGE ────────────────────────────────────────────────────────────

function LogOutPage({ darkMode }) {
  const [confirmed, setConfirmed] = useState(false)
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"

  if (confirmed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-[#e6f9e8] flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
          <p className={`text-lg font-semibold mb-2 ${heading}`}>Signed out</p>
          <p className={`text-sm ${muted}`}>Your data is saved. See you next ride.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-sm w-full">
        <div className={`rounded-2xl border p-8 text-center ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <Avatar name="eenieJIM" size={64} user />
          <h2 className={`text-lg font-bold mb-1 ${heading}`}>Sign out?</h2>
          <p className={`text-sm mb-1 ${muted}`}>eenieJIM · camih014@gmail.com</p>
          <p className={`text-xs mb-7 ${muted}`}>Your ride history, bookings and achievements are saved to your account and will be here when you return.</p>
          <button onClick={() => setConfirmed(true)}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors mb-3">
            Sign out
          </button>
          <button className={`w-full py-3 rounded-xl text-sm font-semibold border transition-colors ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── INSTRUCTOR DATA ─────────────────────────────────────────────────────────

const INSTRUCTOR_TODAY = "Thu 26 Feb"

const RIDER_POOL = [
  "Olivia Hart","Noah Patel","Emma Cole","Liam Ward","Ava Reid","Jack Doyle","Mia Foster",
  "Leo Barnes","Sophie Lane","Ethan Cross","Isla Webb","Max Field","Ruby Shaw","Finn Walsh",
  "Grace Hill","Oscar Penn","Lily Frost","Cole Hayes","Nina Vance","Theo Marsh","Daisy Quinn",
  "Sam Rourke","Zara Bly","Kit Mercer","Eve Larsson","Jonah Reece","Tess Aldridge","Rory Vale",
]

function rosterFor(seed, booked) {
  // deterministic pick of riders + bike assignments
  const out = []
  const used = new Set()
  for (let i = 0; i < booked; i++) {
    const r = (seed * 17 + i * 31) % RIDER_POOL.length
    let name = RIDER_POOL[r]
    let n = r
    while (used.has(name)) { n = (n + 1) % RIDER_POOL.length; name = RIDER_POOL[n] }
    used.add(name)
    const bike = ((seed * 7 + i * 13) % 24) + 1
    out.push({ name, bike, checkedIn: (seed + i) % 3 !== 0 })
  }
  // unique bikes
  const seenBikes = new Set()
  out.forEach(r => { while (seenBikes.has(r.bike)) r.bike = (r.bike % 24) + 1; seenBikes.add(r.bike) })
  return out
}

const instructorClasses = [
  { dateLabel: "Today",     dateIso: "2026-02-26", time: "06:15", name: "Sunrise Power",   studio: "Studio 1", capacity: 24, booked: 22, waitlist: 3, status: "upcoming", seed: 3 },
  { dateLabel: "Today",     dateIso: "2026-02-26", time: "12:00", name: "Lunch Sprint",    studio: "Studio 2", capacity: 20, booked: 16, waitlist: 0, status: "upcoming", seed: 7 },
  { dateLabel: "Today",     dateIso: "2026-02-26", time: "18:00", name: "Evening Flow",    studio: "Studio 1", capacity: 24, booked: 14, waitlist: 0, status: "upcoming", seed: 11 },
  { dateLabel: "Tomorrow",  dateIso: "2026-02-27", time: "08:00", name: "Cadence Control", studio: "Studio 1", capacity: 24, booked: 19, waitlist: 0, status: "upcoming", seed: 5 },
  { dateLabel: "Tomorrow",  dateIso: "2026-02-27", time: "19:00", name: "HIIT Blast",      studio: "Studio 1", capacity: 24, booked: 24, waitlist: 6, status: "upcoming", seed: 9 },
  { dateLabel: "Sat 28 Feb",dateIso: "2026-02-28", time: "09:00", name: "Rhythm Ride",     studio: "Studio 1", capacity: 24, booked: 21, waitlist: 1, status: "upcoming", seed: 2 },
  // past
  { dateLabel: "Wed 25 Feb",dateIso: "2026-02-25", time: "07:00", name: "Threshold Push",  studio: "Studio 1", capacity: 24, booked: 23, waitlist: 0, status: "done", seed: 4, rating: 4.9, attended: 21 },
  { dateLabel: "Tue 24 Feb",dateIso: "2026-02-24", time: "18:30", name: "Climb Intervals", studio: "Studio 2", capacity: 20, booked: 18, waitlist: 0, status: "done", seed: 8, rating: 4.8, attended: 17 },
  { dateLabel: "Mon 23 Feb",dateIso: "2026-02-23", time: "06:30", name: "Sunrise Power",   studio: "Studio 1", capacity: 24, booked: 24, waitlist: 2, status: "done", seed: 6, rating: 5.0, attended: 23 },
]

const INSTRUCTOR_REVIEWS = [
  { name: "Olivia Hart",  rating: 5, text: "Best class of my week — the energy is unreal.",            cls: "Sunrise Power"  },
  { name: "Noah Patel",   rating: 5, text: "Tough but so well structured. Loved the threshold blocks.", cls: "Threshold Push" },
  { name: "Mia Foster",   rating: 4, text: "Great playlist, pushed me harder than I expected.",         cls: "HIIT Blast"     },
  { name: "Leo Barnes",   rating: 5, text: "Clear cues, great pacing. Always leave buzzing.",            cls: "Climb Intervals"},
]

// ─── INSTRUCTOR PAGES ────────────────────────────────────────────────────────

function InstructorTopBar({ title, sub, darkMode, onToggleDarkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className={`text-xl font-semibold ${heading}`}>{title}</h1>
        {sub && <p className={`text-sm mt-0.5 ${muted}`}>{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
        <span className={`hidden sm:inline text-sm ${muted}`}>JIM · Instructor</span>
        <Avatar name="JIM" size={32} />
      </div>
    </div>
  )
}

function CapacityBar({ booked, capacity, darkMode }) {
  const pct = Math.min(100, (booked / capacity) * 100)
  const full = booked >= capacity
  return (
    <div className={`h-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: full ? "#fb7512" : "#00aa13" }} />
    </div>
  )
}

function InstructorHomePage({ darkMode, onToggleDarkMode, onOpenRoster }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"

  const today = instructorClasses.filter(c => c.dateLabel === "Today")
  const ridersToday = today.reduce((s, c) => s + c.booked, 0)

  const stats = [
    { label: "Classes today",   value: today.length },
    { label: "Riders booked",   value: ridersToday },
    { label: "This week",       value: "6 classes" },
    { label: "Avg rating",      value: "4.9 ★" },
  ]

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-16">
      <InstructorTopBar title="Good morning, JIM" sub={`${today.length} classes to teach today · SpinOut Hampstead`} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${card} p-4`}>
            <p className={`text-xs ${muted} mb-1`}>{s.label}</p>
            <p className={`text-xl font-bold ${heading}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Today's classes */}
      <h2 className={`font-semibold mb-3 ${heading}`}>Today's classes</h2>
      <div className="flex flex-col gap-3 mb-8">
        {today.map((c, i) => (
          <div key={i} className={`${card} p-5`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-sm font-bold tabular-nums ${heading}`}>{c.time}</span>
                  <span className={`text-base font-bold ${heading}`}>{c.name}</span>
                </div>
                <p className={`text-xs mt-0.5 ${muted}`}>{c.studio} · 45 mins</p>
              </div>
              <button onClick={() => onOpenRoster(c)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#00aa13] text-white hover:bg-[#008a0f] transition-colors flex-shrink-0">
                View roster
              </button>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs ${muted}`}>{c.booked} / {c.capacity} booked{c.waitlist > 0 && ` · ${c.waitlist} waitlist`}</span>
              <span className={`text-xs font-semibold ${c.booked >= c.capacity ? "text-orange-500" : "text-[#00aa13]"}`}>
                {c.booked >= c.capacity ? "Full" : `${c.capacity - c.booked} spaces`}
              </span>
            </div>
            <CapacityBar booked={c.booked} capacity={c.capacity} darkMode={darkMode} />
          </div>
        ))}
      </div>

      {/* Recent reviews */}
      <h2 className={`font-semibold mb-3 ${heading}`}>Recent rider feedback</h2>
      <div className="flex flex-col gap-3">
        {INSTRUCTOR_REVIEWS.slice(0, 3).map((r, i) => (
          <div key={i} className={`${card} p-4 flex items-start gap-3`}>
            <Avatar name={r.name} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${heading}`}>{r.name}</p>
                <span className="text-xs text-amber-500">{"★".repeat(r.rating)}<span className={muted}>{"★".repeat(5-r.rating)}</span></span>
              </div>
              <p className={`text-xs mt-1 ${muted}`}>"{r.text}"</p>
              <p className={`text-xs mt-1.5 text-[#00aa13] font-medium`}>{r.cls}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClassRoster({ cls, darkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"
  const divider = darkMode ? "border-gray-800" : "border-gray-100"

  const roster  = rosterFor(cls.seed, cls.booked)
  const layout  = STUDIO_LAYOUTS[cls.studio] || STUDIO_LAYOUTS["Studio 1"]
  const bikeMap = {}
  roster.forEach(r => { bikeMap[r.bike] = r })

  return (
    <div className="flex flex-col gap-4">
      {/* Class header */}
      <div className={`${card} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className={`text-lg font-bold ${heading}`}>{cls.name}</h2>
            <p className={`text-xs mt-0.5 ${muted}`}>{cls.dateLabel} · {cls.time} · {cls.studio} · 45 mins</p>
          </div>
          {cls.status === "done"
            ? <span className="text-xs font-semibold text-amber-500 flex-shrink-0">{cls.rating} ★</span>
            : <span className={`text-xs font-semibold flex-shrink-0 ${cls.booked >= cls.capacity ? "text-orange-500" : "text-[#00aa13]"}`}>{cls.booked >= cls.capacity ? "Full" : `${cls.capacity - cls.booked} spaces`}</span>}
        </div>
        <div className="flex items-center justify-between mt-3 mb-1.5">
          <span className={`text-xs ${muted}`}>{cls.booked} / {cls.capacity} booked{cls.waitlist > 0 && ` · ${cls.waitlist} waitlist`}</span>
        </div>
        <CapacityBar booked={cls.booked} capacity={cls.capacity} darkMode={darkMode} />
      </div>

      {/* Bike layout */}
      <div className={`${card} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-semibold ${heading}`}>Studio layout</p>
          <span className={`text-xs ${muted}`}>{layout.label}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center mb-2">
            <div className="flex flex-col items-center gap-1">
              <span className={`text-xs ${muted}`}>You</span>
              <div className="w-9 h-11 rounded-lg bg-[#00aa13] flex items-center justify-center text-white text-xs font-bold">JIM</div>
            </div>
          </div>
          {layout.rows.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 justify-center">
              {row.map(num => {
                const rider = bikeMap[num]
                return (
                  <div key={num} title={rider ? `${rider.name} · Bike ${num}` : `Bike ${num} · empty`}
                    className={`w-9 h-11 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors
                      ${rider
                        ? rider.checkedIn ? "bg-[#00aa13] text-white" : "bg-[#e6f9e8] text-[#00aa13] border border-[#00aa13]"
                        : darkMode ? "bg-gray-800 text-gray-600" : "bg-gray-100 text-gray-400"}`}>
                    {rider ? rider.name.split(" ").map(w=>w[0]).join("") : num}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#00aa13]" /><span className={`text-xs ${muted}`}>Checked in</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#e6f9e8] border border-[#00aa13]" /><span className={`text-xs ${muted}`}>Booked</span></div>
          <div className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} /><span className={`text-xs ${muted}`}>Empty</span></div>
        </div>
      </div>

      {/* Rider list */}
      <div className={`${card} overflow-hidden`}>
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${divider}`}>
          <p className={`text-sm font-semibold ${heading}`}>Booked riders</p>
          <span className={`text-xs ${muted}`}>{roster.filter(r=>r.checkedIn).length} checked in · {cls.booked} total</span>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {roster.map((r, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 border-b last:border-b-0 ${divider}`}>
              <Avatar name={r.name} size={34} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${heading}`}>{r.name}</p>
                <p className={`text-xs ${muted}`}>Bike {r.bike}</p>
              </div>
              {r.checkedIn
                ? <span className="text-xs font-semibold text-[#00aa13] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00aa13]" />Checked in</span>
                : <span className={`text-xs ${muted}`}>Booked</span>}
            </div>
          ))}
        </div>
        {cls.waitlist > 0 && (
          <div className={`px-5 py-3 border-t ${divider} ${subtle}`}>
            <p className={`text-xs font-semibold text-amber-600`}>{cls.waitlist} on the waitlist</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InstructorClassesPage({ darkMode, onToggleDarkMode, initialClass }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const divider = darkMode ? "border-gray-800" : "border-gray-100"

  const initialTab = initialClass?.status === "done" ? "past" : "upcoming"
  const [tab, setTab]           = useState(initialTab)
  const [selected, setSelected] = useState(initialClass || instructorClasses.find(c => c.status === "upcoming"))
  const [mobileDetail, setMobileDetail] = useState(!!initialClass)

  const list = instructorClasses.filter(c => tab === "upcoming" ? c.status === "upcoming" : c.status === "done")

  function pick(c) { setSelected(c); setMobileDetail(true) }
  function switchTab(t) {
    setTab(t)
    const first = instructorClasses.find(c => t === "upcoming" ? c.status === "upcoming" : c.status === "done")
    setSelected(first)
  }

  const ClassList = (
    <div className={`${card} overflow-hidden`}>
      {list.map((c, i) => {
        const on = c === selected
        return (
          <button key={i} onClick={() => pick(c)}
            className={`w-full text-left flex items-center gap-4 px-5 py-4 border-b last:border-b-0 ${divider} transition-colors
              ${on ? darkMode ? "bg-gray-800 border-l-2 border-l-[#00aa13]" : "bg-[#e6f9e8] border-l-2 border-l-[#00aa13]" : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
            <div className="w-14 flex-shrink-0">
              <p className={`text-xs font-medium ${muted}`}>{c.dateLabel}</p>
              <p className={`text-sm font-bold tabular-nums ${on ? "text-[#00aa13]" : heading}`}>{c.time}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${on ? "text-[#00aa13]" : heading}`}>{c.name}</p>
              <p className={`text-xs mt-0.5 ${muted}`}>{c.studio} · {c.booked}/{c.capacity} riders{c.waitlist > 0 && ` · ${c.waitlist} waitlist`}</p>
            </div>
            {c.status === "done"
              ? <span className="text-xs font-semibold text-amber-500 flex-shrink-0">{c.rating} ★</span>
              : <span className={`text-xs font-semibold flex-shrink-0 ${c.booked >= c.capacity ? "text-orange-500" : "text-[#00aa13]"}`}>{c.booked >= c.capacity ? "Full" : `${c.capacity - c.booked} left`}</span>}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-16">
      <InstructorTopBar title="My Classes" sub="Classes you're teaching at SpinOut" darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />

      {/* Tabs — hidden on mobile when viewing detail */}
      <div className={`${mobileDetail ? "hidden md:flex" : "flex"} inline-flex rounded-xl p-0.5 mb-5 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} style={{ width: "fit-content" }}>
        {["upcoming","past"].map(t => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${tab === t
              ? darkMode ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-900 shadow-sm"
              : muted}`}>{t}</button>
        ))}
      </div>

      {/* Mobile back button when in detail */}
      {mobileDetail && (
        <button onClick={() => setMobileDetail(false)}
          className={`md:hidden flex items-center gap-1.5 mb-4 text-sm font-medium ${muted}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          All classes
        </button>
      )}

      {/* Desktop: list + detail side by side. Mobile: one or the other. */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className={`md:w-[340px] md:flex-shrink-0 ${mobileDetail ? "hidden md:block" : "block"}`}>
          {ClassList}
        </div>
        <div className={`flex-1 min-w-0 ${mobileDetail ? "block" : "hidden md:block"}`}>
          {selected ? <ClassRoster cls={selected} darkMode={darkMode} />
            : <div className={`${card} p-10 text-center`}><p className={`text-sm ${muted}`}>Select a class to view its roster</p></div>}
        </div>
      </div>
    </div>
  )
}

function ClassBuilderPage({ darkMode, onToggleDarkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"
  const inputCls = `w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#00aa13] focus:border-transparent transition ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"}`

  const [name, setName]       = useState("New Power Ride")
  const [studio, setStudio]   = useState("Studio 1")
  const [phases, setPhases]   = useState([
    { name: "Warm Up",      zone: 1, mins: 7 },
    { name: "Build",        zone: 3, mins: 8 },
    { name: "Threshold",    zone: 4, mins: 12 },
    { name: "Recovery",     zone: 1, mins: 4 },
    { name: "Sprints",      zone: 5, mins: 9 },
    { name: "Cool Down",    zone: 1, mins: 5 },
  ])

  const total = phases.reduce((s, p) => s + p.mins, 0)

  function updatePhase(i, patch) { setPhases(p => p.map((ph, j) => j === i ? { ...ph, ...patch } : ph)) }
  function removePhase(i) { setPhases(p => p.filter((_, j) => j !== i)) }
  function addPhase() { setPhases(p => [...p, { name: "New Phase", zone: 2, mins: 5 }]) }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-16">
      <InstructorTopBar title="Class Builder" sub="Design a session plan for your riders" darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />

      {/* Details */}
      <div className={`${card} p-5 mb-5`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Class name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${muted}`}>Studio</label>
            <div className={`inline-flex rounded-xl overflow-hidden border w-full ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              {["Studio 1","Studio 2"].map(s => (
                <button key={s} onClick={() => setStudio(s)}
                  className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${studio === s ? "bg-[#00aa13] text-white" : darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live preview chart */}
      <div className={`${card} p-5 mb-5`}>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-semibold ${heading}`}>Intensity preview</p>
          <span className={`text-xs ${muted}`}>{total} min total</span>
        </div>
        <div className="flex items-end w-full gap-1" style={{ height: 90 }}>
          {phases.map((ph, i) => (
            <div key={i} className="rounded-t-sm flex items-end justify-center transition-all"
              style={{ flex: ph.mins, height: `${FTP_ZONES[Math.min(ph.zone-1,6)].height}%`, background: FTP_ZONES[Math.min(ph.zone-1,6)].color }}
              title={`${ph.name} · Z${ph.zone} · ${ph.mins} min`} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${muted}`}>0:00</span>
          <span className={`text-xs ${muted}`}>{total}:00</span>
        </div>
      </div>

      {/* Phase editor */}
      <div className={`${card} overflow-hidden mb-5`}>
        <div className={`px-5 py-3.5 border-b ${darkMode ? "border-gray-800" : "border-gray-100"} flex items-center justify-between`}>
          <p className={`text-sm font-semibold ${heading}`}>Phases</p>
          <button onClick={addPhase} className="text-xs font-semibold text-[#00aa13] hover:underline">+ Add phase</button>
        </div>
        {phases.map((ph, i) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-3 border-b last:border-b-0 ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: FTP_ZONES[Math.min(ph.zone-1,6)].color }} />
            <input value={ph.name} onChange={e => updatePhase(i, { name: e.target.value })}
              className={`flex-1 min-w-0 bg-transparent text-sm font-medium focus:outline-none ${heading}`} />
            {/* Zone */}
            <div className="flex items-center gap-1">
              <span className={`text-xs ${muted}`}>Z</span>
              <select value={ph.zone} onChange={e => updatePhase(i, { zone: +e.target.value })}
                className={`text-xs font-semibold rounded-lg px-1.5 py-1 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"}`}>
                {[1,2,3,4,5,6,7].map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            {/* Mins */}
            <div className="flex items-center gap-1">
              <button onClick={() => updatePhase(i, { mins: Math.max(1, ph.mins-1) })} className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>−</button>
              <span className={`text-xs font-bold w-10 text-center tabular-nums ${heading}`}>{ph.mins}m</span>
              <button onClick={() => updatePhase(i, { mins: Math.min(30, ph.mins+1) })} className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>+</button>
            </div>
            <button onClick={() => removePhase(i)} className={`w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0 ${darkMode ? "hover:bg-gray-800 text-gray-500" : "hover:bg-gray-100 text-gray-400"}`}>✕</button>
          </div>
        ))}
      </div>

      <button className="w-full py-3 rounded-xl bg-[#00aa13] hover:bg-[#008a0f] text-white font-semibold text-sm transition-colors">
        Publish class plan
      </button>
    </div>
  )
}

function InstructorStatsPage({ darkMode, onToggleDarkMode }) {
  const heading = darkMode ? "text-white"    : "text-gray-900"
  const muted   = darkMode ? "text-gray-400" : "text-gray-500"
  const card    = `rounded-2xl border transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`
  const subtle  = darkMode ? "bg-gray-800"   : "bg-gray-50"

  const weeks = [
    { label: "5 wks ago", classes: 5, riders: 96 },
    { label: "4 wks ago", classes: 6, riders: 118 },
    { label: "3 wks ago", classes: 5, riders: 104 },
    { label: "2 wks ago", classes: 7, riders: 142 },
    { label: "Last week",  classes: 6, riders: 128 },
    { label: "This week",  classes: 6, riders: 134 },
  ]
  const maxRiders = Math.max(...weeks.map(w => w.riders))

  const stats = [
    { label: "Earnings this month", value: "£2,140" },
    { label: "Classes taught",      value: "28" },
    { label: "Riders taught",       value: "622" },
    { label: "Avg rating",          value: "4.9 ★" },
  ]

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-16">
      <InstructorTopBar title="Insights & Earnings" sub="Your teaching performance over time" darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${card} p-4`}>
            <p className={`text-xs ${muted} mb-1`}>{s.label}</p>
            <p className={`text-xl font-bold ${heading}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Riders per week chart */}
      <div className={`${card} p-5 mb-6`}>
        <p className={`text-sm font-semibold mb-5 ${heading}`}>Riders taught per week</p>
        <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
          {weeks.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className={`text-xs font-bold ${heading}`}>{w.riders}</span>
              <div className="w-full rounded-t-lg transition-all" style={{ height: `${(w.riders/maxRiders)*100}%`, background: i === weeks.length-1 ? "#00aa13" : darkMode ? "#374151" : "#d1fae5" }} />
              <span className={`text-[10px] text-center ${muted}`}>{w.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <h2 className={`font-semibold mb-3 ${heading}`}>Latest reviews</h2>
      <div className="flex flex-col gap-3">
        {INSTRUCTOR_REVIEWS.map((r, i) => (
          <div key={i} className={`${card} p-4 flex items-start gap-3`}>
            <Avatar name={r.name} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${heading}`}>{r.name}</p>
                <span className="text-xs text-amber-500">{"★".repeat(r.rating)}<span className={muted}>{"★".repeat(5-r.rating)}</span></span>
              </div>
              <p className={`text-xs mt-1 ${muted}`}>"{r.text}"</p>
              <p className="text-xs mt-1.5 text-[#00aa13] font-medium">{r.cls}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PLACEHOLDER ────────────────────────────────────────────────────────────

function PlaceholderPage({ title, darkMode }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className={`text-2xl font-semibold ${darkMode ? "text-gray-700" : "text-gray-300"}`}>
        {title} — coming soon
      </p>
    </div>
  )
}
