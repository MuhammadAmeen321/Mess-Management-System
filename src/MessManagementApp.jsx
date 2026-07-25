import React, { useState, useMemo } from "react";
import {
  LayoutGrid, Users, UtensilsCrossed, CalendarCheck, Receipt,
  MessageSquareWarning, LogOut, Search, Plus, Pencil, Trash2,
  X, CheckCircle2, Circle, IndianRupee, TrendingUp, ChefHat, Lock
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

/* ------------------------------------------------------------------ */
/*  THEME — classic mess-ledger identity                              */
/*  Maroon register cover, brass stitching, warm sage-paper ground    */
/* ------------------------------------------------------------------ */
const THEME = `
  :root{
    --maroon-950:#3E1218;
    --maroon-900:#5C1B22;
    --maroon-800:#6E1F2B;
    --maroon-700:#832A38;
    --brass-600:#B8862F;
    --brass-500:#D9A441;
    --brass-300:#EBC97A;
    --paper-100:#F4F6EF;
    --paper-200:#EDF0E4;
    --paper-300:#E2E6D6;
    --ink-900:#221F1C;
    --ink-600:#5B564E;
    --ink-400:#8B857A;
    --sage-600:#4B6B4F;
    --sage-100:#E6EEE3;
    --rust-600:#A33B2C;
    --rust-100:#F4E1DC;
  }
  .mm-root{
    font-family: 'Source Sans 3', ui-sans-serif, system-ui, sans-serif;
    background: var(--paper-100);
    color: var(--ink-900);
  }
  .mm-serif{
    font-family: 'Fraunces', 'Playfair Display', Georgia, serif;
  }
  .mm-mono{
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
  }
  .mm-ledger-card{
    background: #FFFFFF;
    border: 1px solid var(--paper-300);
    border-top: 3px solid var(--brass-500);
    box-shadow: 0 1px 2px rgba(34,31,28,0.04);
  }
  .mm-stitch{
    background-image: repeating-linear-gradient(
      90deg, var(--brass-500) 0 8px, transparent 8px 16px
    );
    height: 2px;
    opacity: 0.55;
  }
  .mm-sidebar{
    background: linear-gradient(180deg, var(--maroon-900), var(--maroon-950));
  }
  .mm-navitem{
    color: #E9D9C9;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .mm-navitem:hover{
    background: rgba(217,164,65,0.12);
    color: var(--brass-300);
  }
  .mm-navitem.active{
    background: rgba(217,164,65,0.16);
    color: var(--brass-300);
    box-shadow: inset 3px 0 0 var(--brass-500);
  }
  .mm-btn-primary{
    background: var(--maroon-800);
    color: #FBF3E7;
    transition: background 0.15s ease;
  }
  .mm-btn-primary:hover{ background: var(--maroon-700); }
  .mm-btn-brass{
    background: var(--brass-500);
    color: var(--maroon-950);
    transition: background 0.15s ease;
  }
  .mm-btn-brass:hover{ background: var(--brass-600); color: #fff; }
  .mm-pill-open{ background: var(--rust-100); color: var(--rust-600); }
  .mm-pill-resolved{ background: var(--sage-100); color: var(--sage-600); }
  .mm-pill-paid{ background: var(--sage-100); color: var(--sage-600); }
  .mm-pill-unpaid{ background: var(--rust-100); color: var(--rust-600); }
  .mm-table th{
    color: var(--ink-600);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--paper-300);
  }
  .mm-table td{
    border-bottom: 1px dashed var(--paper-300);
  }
  .mm-input{
    background: #fff;
    border: 1px solid var(--paper-300);
    color: var(--ink-900);
  }
  .mm-input:focus{
    outline: none;
    border-color: var(--brass-500);
    box-shadow: 0 0 0 3px rgba(217,164,65,0.18);
  }
  .mm-scroll::-webkit-scrollbar{ width: 8px; height: 8px; }
  .mm-scroll::-webkit-scrollbar-thumb{ background: var(--paper-300); border-radius: 4px; }

  /* ---------------------------------------------------------------- */
  /*  Plain-CSS layout utilities (no Tailwind build step required)     */
  /* ---------------------------------------------------------------- */
  *{ box-sizing: border-box; }
  .flex{ display:flex; }
  .inline-flex{ display:inline-flex; }
  .grid{ display:grid; }
  .hidden{ display:none; }
  .flex-1{ flex:1 1 0%; }
  .flex-col{ flex-direction:column; }
  .flex-wrap{ flex-wrap:wrap; }
  .shrink-0{ flex-shrink:0; }
  .items-center{ align-items:center; }
  .items-start{ align-items:flex-start; }
  .justify-between{ justify-content:space-between; }
  .justify-center{ justify-content:center; }
  .justify-end{ justify-content:flex-end; }
  .grid-cols-1{ grid-template-columns:repeat(1,minmax(0,1fr)); }
  .grid-cols-3{ grid-template-columns:repeat(3,minmax(0,1fr)); }
  .relative{ position:relative; }
  .absolute{ position:absolute; }
  .fixed{ position:fixed; }
  .inset-0{ top:0; right:0; bottom:0; left:0; }
  .left-3{ left:0.75rem; }
  .top-1\/2{ top:50%; }
  .-translate-y-1\/2{ transform:translateY(-50%); }
  .z-50{ z-index:50; }
  .w-full{ width:100%; }
  .w-64{ width:16rem; }
  .w-14{ width:3.5rem; }
  .w-9{ width:2.25rem; }
  .w-8{ width:2rem; }
  .h-14{ height:3.5rem; }
  .h-9{ height:2.25rem; }
  .h-8{ height:2rem; }
  .min-h-screen{ min-height:100vh; }
  .min-w-0{ min-width:0; }
  .max-w-sm{ max-width:24rem; }
  .max-w-xs{ max-width:20rem; }
  .max-w-md{ max-width:28rem; }
  .max-h-\[90vh\]{ max-height:90vh; }
  .min-w-\[140px\]{ min-width:140px; }
  .min-w-\[160px\]{ min-width:160px; }
  .p-1{ padding:0.25rem; }
  .p-1\.5{ padding:0.375rem; }
  .p-2{ padding:0.5rem; }
  .p-3{ padding:0.75rem; }
  .p-4{ padding:1rem; }
  .p-5{ padding:1.25rem; }
  .p-6{ padding:1.5rem; }
  .px-1{ padding-left:0.25rem; padding-right:0.25rem; }
  .px-2{ padding-left:0.5rem; padding-right:0.5rem; }
  .px-3{ padding-left:0.75rem; padding-right:0.75rem; }
  .px-4{ padding-left:1rem; padding-right:1rem; }
  .px-5{ padding-left:1.25rem; padding-right:1.25rem; }
  .py-1{ padding-top:0.25rem; padding-bottom:0.25rem; }
  .py-1\.5{ padding-top:0.375rem; padding-bottom:0.375rem; }
  .py-2{ padding-top:0.5rem; padding-bottom:0.5rem; }
  .py-2\.5{ padding-top:0.625rem; padding-bottom:0.625rem; }
  .py-3{ padding-top:0.75rem; padding-bottom:0.75rem; }
  .py-4{ padding-top:1rem; padding-bottom:1rem; }
  .py-6{ padding-top:1.5rem; padding-bottom:1.5rem; }
  .py-8{ padding-top:2rem; padding-bottom:2rem; }
  .pl-8{ padding-left:2rem; }
  .pl-9{ padding-left:2.25rem; }
  .pr-3{ padding-right:0.75rem; }
  .pt-6{ padding-top:1.5rem; }
  .mb-1{ margin-bottom:0.25rem; }
  .mb-3{ margin-bottom:0.75rem; }
  .mb-4{ margin-bottom:1rem; }
  .mb-6{ margin-bottom:1.5rem; }
  .mb-8{ margin-bottom:2rem; }
  .mt-1{ margin-top:0.25rem; }
  .mt-2{ margin-top:0.5rem; }
  .mt-auto{ margin-top:auto; }
  .mx-auto{ margin-left:auto; margin-right:auto; }
  .gap-1{ gap:0.25rem; }
  .gap-1\.5{ gap:0.375rem; }
  .gap-2{ gap:0.5rem; }
  .gap-3{ gap:0.75rem; }
  .gap-4{ gap:1rem; }
  .gap-5{ gap:1.25rem; }
  .gap-6{ gap:1.5rem; }
  .text-2xl{ font-size:1.5rem; line-height:2rem; }
  .text-3xl{ font-size:1.875rem; line-height:2.25rem; }
  .text-lg{ font-size:1.125rem; line-height:1.75rem; }
  .text-sm{ font-size:0.875rem; line-height:1.25rem; }
  .text-xs{ font-size:0.75rem; line-height:1rem; }
  .text-\[10px\]{ font-size:10px; }
  .text-\[11px\]{ font-size:11px; }
  .font-medium{ font-weight:500; }
  .font-semibold{ font-weight:600; }
  .text-center{ text-align:center; }
  .text-left{ text-align:left; }
  .text-right{ text-align:right; }
  .uppercase{ text-transform:uppercase; }
  .tracking-widest{ letter-spacing:0.1em; }
  .leading-none{ line-height:1; }
  .whitespace-nowrap{ white-space:nowrap; }
  .rounded{ border-radius:0.375rem; }
  .rounded-md{ border-radius:0.5rem; }
  .rounded-full{ border-radius:9999px; }
  .bg-white{ background:#fff; }
  .overflow-x-auto{ overflow-x:auto; }
  .overflow-y-auto{ overflow-y:auto; }
  .align-top{ vertical-align:top; }
  button{ cursor:pointer; font:inherit; }
  input, select, textarea{ font:inherit; }
  table{ border-collapse:collapse; width:100%; }
  a{ color:inherit; }
  .hover\:bg-black\/5:hover{ background:rgba(0,0,0,0.05); }
  .hover\:bg-white\/10:hover{ background:rgba(255,255,255,0.1); }
  .hover\:underline:hover{ text-decoration:underline; }
  @media (min-width:640px){
    .sm\:grid-cols-2{ grid-template-columns:repeat(2,minmax(0,1fr)); }
  }
  @media (min-width:768px){
    .md\:block{ display:block; }
    .md\:flex{ display:flex; }
    .md\:hidden{ display:none; }
    .md\:p-8{ padding:2rem; }
    .md\:px-8{ padding-left:2rem; padding-right:2rem; }
  }
  @media (min-width:1024px){
    .lg\:col-span-2{ grid-column:span 2 / span 2; }
    .lg\:grid-cols-3{ grid-template-columns:repeat(3,minmax(0,1fr)); }
    .lg\:grid-cols-5{ grid-template-columns:repeat(5,minmax(0,1fr)); }
  }
`;

const FONT_LINK_ID = "mm-fonts";
if (typeof document !== "undefined" && !document.getElementById(FONT_LINK_ID)) {
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];
const MEAL_RATES = { Breakfast: 40, Lunch: 80, Dinner: 80 };

const initialMembers = [
  { id: 1, name: "Aarav Sharma", room: "A-101", contact: "9821004411", plan: "Full Mess", joinDate: "2026-01-12", status: "Active" },
  { id: 2, name: "Priya Nair", room: "B-203", contact: "9812233445", plan: "Full Mess", joinDate: "2026-02-03", status: "Active" },
  { id: 3, name: "Rohit Verma", room: "A-114", contact: "9900112233", plan: "Dinner Only", joinDate: "2026-03-19", status: "Active" },
  { id: 4, name: "Sana Malik", room: "C-305", contact: "9765544332", plan: "Full Mess", joinDate: "2026-01-27", status: "Inactive" },
  { id: 5, name: "Devika Rao", room: "B-210", contact: "9654321098", plan: "Lunch + Dinner", joinDate: "2026-04-02", status: "Active" },
];

const initialMenu = {
  Mon: { Breakfast: "Poha & Chai", Lunch: "Dal, Rice, Roti, Sabzi", Dinner: "Rajma Chawal" },
  Tue: { Breakfast: "Idli Sambhar", Lunch: "Chole, Rice, Roti", Dinner: "Veg Pulao & Raita" },
  Wed: { Breakfast: "Paratha & Curd", Lunch: "Dal Fry, Rice, Roti", Dinner: "Paneer Curry & Roti" },
  Thu: { Breakfast: "Upma & Chutney", Lunch: "Kadhi, Rice, Roti", Dinner: "Mix Veg & Roti" },
  Fri: { Breakfast: "Sandwich & Tea", Lunch: "Sambhar Rice", Dinner: "Egg Curry / Paneer & Roti" },
  Sat: { Breakfast: "Chole Bhature", Lunch: "Dal, Rice, Roti", Dinner: "Biryani & Raita" },
  Sun: { Breakfast: "Aloo Puri", Lunch: "Special Thali", Dinner: "Soup & Light Meal" },
};

const initialComplaints = [
  { id: 1, memberName: "Rohit Verma", subject: "Food quality", message: "Dinner was undercooked yesterday.", date: "2026-07-21", status: "Open" },
  { id: 2, memberName: "Priya Nair", subject: "Timing", message: "Lunch counter closes too early.", date: "2026-07-19", status: "Resolved" },
  { id: 3, memberName: "Aarav Sharma", subject: "Hygiene", message: "Please refill hand-wash near lunch counter.", date: "2026-07-23", status: "Open" },
];

const weeklyAttendanceChart = [
  { day: "Mon", meals: 132 },
  { day: "Tue", meals: 141 },
  { day: "Wed", meals: 128 },
  { day: "Thu", meals: 150 },
  { day: "Fri", meals: 137 },
  { day: "Sat", meals: 118 },
  { day: "Sun", meals: 96 },
];

function initAttendanceToday(members) {
  const map = {};
  members.forEach((m, i) => {
    map[m.id] = {
      Breakfast: i % 2 === 0,
      Lunch: true,
      Dinner: i % 3 !== 0,
    };
  });
  return map;
}

function initMonthlyMeals(members) {
  const map = {};
  members.forEach((m, i) => {
    map[m.id] = {
      Breakfast: 18 + (i % 4),
      Lunch: 24 + (i % 3),
      Dinner: 22 + (i % 5),
    };
  });
  return map;
}

/* ------------------------------------------------------------------ */
/*  SMALL UI PRIMITIVES                                                */
/* ------------------------------------------------------------------ */
function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="mm-ledger-card rounded-md p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs mm-mono tracking-widest uppercase" style={{ color: "var(--ink-600)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: accent || "var(--sage-100)" }}
        >
          <Icon size={16} style={{ color: "var(--maroon-800)" }} />
        </div>
      </div>
      <div className="mm-serif text-3xl font-semibold" style={{ color: "var(--maroon-900)" }}>
        {value}
      </div>
      {sub && <div className="text-xs" style={{ color: "var(--ink-400)" }}>{sub}</div>}
    </div>
  );
}

function Pill({ children, tone }) {
  const cls = tone === "Open" || tone === "Unpaid" ? "mm-pill-open"
    : tone === "Resolved" || tone === "Paid" ? "mm-pill-resolved"
    : "mm-pill-open";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(34,31,28,0.45)" }}>
      <div className="mm-ledger-card rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto mm-scroll">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--paper-300)" }}>
          <h3 className="mm-serif text-lg font-semibold" style={{ color: "var(--maroon-900)" }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOGIN                                                              */
/* ------------------------------------------------------------------ */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Enter both admin ID and password.");
      return;
    }
    setError("");
    onLogin(username.trim());
  }

  return (
    <div className="mm-root min-h-screen flex items-center justify-center px-4" style={{ background: "var(--maroon-950)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: "var(--brass-500)" }}>
            <ChefHat size={26} style={{ color: "var(--maroon-950)" }} />
          </div>
          <h1 className="mm-serif text-3xl font-semibold" style={{ color: "#FBF3E7" }}>Annapurna Mess</h1>
          <p className="text-sm mt-1" style={{ color: "#C9A98F" }}>Mess Management Register &mdash; Admin Sign In</p>
        </div>
        <form onSubmit={submit} className="mm-ledger-card rounded-md p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Admin ID</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
              placeholder="e.g. mess.admin"
            />
          </div>
          <div>
            <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Password</label>
            <div className="relative mt-1">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-400)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mm-input w-full rounded pl-8 pr-3 py-2 text-sm"
                placeholder="Enter password"
              />
            </div>
          </div>
          {error && <p className="text-xs" style={{ color: "var(--rust-600)" }}>{error}</p>}
          <button type="submit" className="mm-btn-primary rounded py-2.5 text-sm font-semibold mt-1">
            Sign in to dashboard
          </button>
          <p className="text-[11px] text-center" style={{ color: "var(--ink-400)" }}>
            Demo mode — any ID and password will sign you in.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD                                                          */
/* ------------------------------------------------------------------ */
function Dashboard({ members, attendanceToday, complaints, billing }) {
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const presentToday = useMemo(() => {
    let count = 0;
    Object.values(attendanceToday).forEach((rec) => {
      MEALS.forEach((meal) => { if (rec[meal]) count++; });
    });
    return count;
  }, [attendanceToday]);
  const revenue = useMemo(
    () => billing.reduce((sum, b) => sum + (b.paid ? b.totalAmount : 0), 0),
    [billing]
  );
  const pendingDues = useMemo(
    () => billing.reduce((sum, b) => sum + (b.paid ? 0 : b.totalAmount), 0),
    [billing]
  );
  const openComplaints = complaints.filter((c) => c.status === "Open").length;
  const today = DAYS[(new Date().getDay() + 6) % 7];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Today's Register</h2>
        <p className="text-sm" style={{ color: "var(--ink-600)" }}>Overview of members, meals, and dues at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Active Members" value={activeMembers} sub={`${members.length} total on record`} />
        <StatCard icon={CalendarCheck} label="Meals Served Today" value={presentToday} sub="Across breakfast, lunch, dinner" accent="var(--paper-200)" />
        <StatCard icon={IndianRupee} label="Revenue Collected" value={`Rs. ${revenue.toLocaleString()}`} sub="This billing cycle" />
        <StatCard icon={Receipt} label="Pending Dues" value={`Rs. ${pendingDues.toLocaleString()}`} sub="Awaiting payment" accent="var(--rust-100)" />
        <StatCard icon={MessageSquareWarning} label="Open Complaints" value={openComplaints} sub={`${complaints.length} total logged`} accent="var(--rust-100)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 mm-ledger-card rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="mm-serif text-lg font-semibold" style={{ color: "var(--maroon-900)" }}>Weekly Meal Turnout</h3>
            <TrendingUp size={18} style={{ color: "var(--brass-600)" }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendanceChart}>
              <CartesianGrid vertical={false} stroke="#E2E6D6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--ink-600)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--ink-600)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 6, border: "1px solid var(--paper-300)", fontSize: 12 }}
                cursor={{ fill: "rgba(184,134,47,0.08)" }}
              />
              <Bar dataKey="meals" fill="var(--maroon-800)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mm-ledger-card rounded-md p-5">
          <h3 className="mm-serif text-lg font-semibold mb-1" style={{ color: "var(--maroon-900)" }}>Today's Menu</h3>
          <p className="text-xs mb-3" style={{ color: "var(--ink-400)" }}>{today}</p>
          <div className="mm-stitch mb-4" />
          <div className="flex flex-col gap-3">
            {MEALS.map((meal) => (
              <div key={meal} className="flex justify-between text-sm">
                <span className="font-semibold" style={{ color: "var(--ink-900)" }}>{meal}</span>
                <span style={{ color: "var(--ink-600)" }}>{initialMenu[today][meal]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MEMBERS                                                            */
/* ------------------------------------------------------------------ */
function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: "", room: "", contact: "", plan: "Full Mess", joinDate: new Date().toISOString().slice(0, 10), status: "Active" }
  );
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (form.name.trim()) onSave(form); }}
      className="flex flex-col gap-3"
    >
      {[
        ["name", "Full name"],
        ["room", "Room number"],
        ["contact", "Contact number"],
      ].map(([key, label]) => (
        <div key={key}>
          <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>{label}</label>
          <input
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
            required
          />
        </div>
      ))}
      <div>
        <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Meal plan</label>
        <select
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value })}
          className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
        >
          <option>Full Mess</option>
          <option>Lunch + Dinner</option>
          <option>Dinner Only</option>
          <option>Breakfast Only</option>
        </select>
      </div>
      <div>
        <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="flex gap-2 mt-2">
        <button type="submit" className="mm-btn-primary rounded px-4 py-2 text-sm font-semibold flex-1">Save member</button>
        <button type="button" onClick={onCancel} className="rounded px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--paper-300)" }}>Cancel</button>
      </div>
    </form>
  );
}

function Members({ members, setMembers }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', member }

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) || m.room.toLowerCase().includes(query.toLowerCase())
  );

  function addMember(data) {
    setMembers([...members, { ...data, id: Date.now() }]);
    setModal(null);
  }
  function updateMember(data) {
    setMembers(members.map((m) => (m.id === modal.member.id ? { ...m, ...data } : m)));
    setModal(null);
  }
  function deleteMember(id) {
    setMembers(members.filter((m) => m.id !== id));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Members</h2>
          <p className="text-sm" style={{ color: "var(--ink-600)" }}>{members.length} residents on the mess register.</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="mm-btn-brass rounded px-4 py-2 text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add member
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--ink-400)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or room"
          className="mm-input w-full rounded pl-9 pr-3 py-2 text-sm"
        />
      </div>

      <div className="mm-ledger-card rounded-md overflow-x-auto mm-scroll">
        <table className="w-full text-sm mm-table">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Room</th>
              <th className="text-left py-3 px-4">Contact</th>
              <th className="text-left py-3 px-4">Plan</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="py-3 px-4 font-semibold" style={{ color: "var(--ink-900)" }}>{m.name}</td>
                <td className="py-3 px-4">{m.room}</td>
                <td className="py-3 px-4">{m.contact}</td>
                <td className="py-3 px-4">{m.plan}</td>
                <td className="py-3 px-4">{m.joinDate}</td>
                <td className="py-3 px-4">
                  <Pill tone={m.status === "Active" ? "Resolved" : "Open"}>{m.status}</Pill>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setModal({ mode: "edit", member: m })} className="p-1.5 rounded hover:bg-black/5">
                      <Pencil size={15} style={{ color: "var(--maroon-800)" }} />
                    </button>
                    <button onClick={() => deleteMember(m.id)} className="p-1.5 rounded hover:bg-black/5">
                      <Trash2 size={15} style={{ color: "var(--rust-600)" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-sm" style={{ color: "var(--ink-400)" }}>No members match that search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add new member" : "Edit member"} onClose={() => setModal(null)}>
          <MemberForm
            initial={modal.mode === "edit" ? modal.member : null}
            onSave={modal.mode === "add" ? addMember : updateMember}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MENU                                                               */
/* ------------------------------------------------------------------ */
function MenuManager({ menu, setMenu }) {
  const [editing, setEditing] = useState(null); // { day, meal }
  const [draft, setDraft] = useState("");

  function startEdit(day, meal) {
    setEditing({ day, meal });
    setDraft(menu[day][meal]);
  }
  function save() {
    setMenu({ ...menu, [editing.day]: { ...menu[editing.day], [editing.meal]: draft } });
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Weekly Menu</h2>
        <p className="text-sm" style={{ color: "var(--ink-600)" }}>Click any dish to update it for that meal.</p>
      </div>

      <div className="mm-ledger-card rounded-md overflow-x-auto mm-scroll">
        <table className="w-full text-sm mm-table">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Meal</th>
              {DAYS.map((d) => <th key={d} className="text-left py-3 px-4">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {MEALS.map((meal) => (
              <tr key={meal}>
                <td className="py-3 px-4 font-semibold" style={{ color: "var(--maroon-800)" }}>{meal}</td>
                {DAYS.map((day) => (
                  <td key={day} className="py-3 px-4 align-top">
                    {editing && editing.day === day && editing.meal === meal ? (
                      <div className="flex flex-col gap-2 min-w-[160px]">
                        <input
                          autoFocus
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          className="mm-input rounded px-2 py-1 text-xs"
                        />
                        <div className="flex gap-1">
                          <button onClick={save} className="mm-btn-brass rounded px-2 py-1 text-xs font-semibold">Save</button>
                          <button onClick={() => setEditing(null)} className="rounded px-2 py-1 text-xs" style={{ border: "1px solid var(--paper-300)" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(day, meal)}
                        className="text-left hover:underline min-w-[140px]"
                        style={{ color: "var(--ink-700)" }}
                      >
                        {menu[day][meal]}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ATTENDANCE                                                         */
/* ------------------------------------------------------------------ */
function Attendance({ members, attendanceToday, setAttendanceToday }) {
  function toggle(memberId, meal) {
    setAttendanceToday({
      ...attendanceToday,
      [memberId]: { ...attendanceToday[memberId], [meal]: !attendanceToday[memberId][meal] },
    });
  }

  const totals = MEALS.reduce((acc, meal) => {
    acc[meal] = members.filter((m) => attendanceToday[m.id]?.[meal]).length;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Today's Attendance</h2>
        <p className="text-sm" style={{ color: "var(--ink-600)" }}>Mark which meals each member has taken today.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md">
        {MEALS.map((meal) => (
          <div key={meal} className="mm-ledger-card rounded-md p-3 text-center">
            <p className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>{meal}</p>
            <p className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>{totals[meal]}</p>
          </div>
        ))}
      </div>

      <div className="mm-ledger-card rounded-md overflow-x-auto mm-scroll">
        <table className="w-full text-sm mm-table">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Member</th>
              <th className="text-left py-3 px-4">Room</th>
              {MEALS.map((meal) => <th key={meal} className="text-center py-3 px-4">{meal}</th>)}
            </tr>
          </thead>
          <tbody>
            {members.filter((m) => m.status === "Active").map((m) => (
              <tr key={m.id}>
                <td className="py-3 px-4 font-semibold" style={{ color: "var(--ink-900)" }}>{m.name}</td>
                <td className="py-3 px-4">{m.room}</td>
                {MEALS.map((meal) => (
                  <td key={meal} className="py-3 px-4 text-center">
                    <button onClick={() => toggle(m.id, meal)} className="inline-flex">
                      {attendanceToday[m.id]?.[meal] ? (
                        <CheckCircle2 size={20} style={{ color: "var(--sage-600)" }} />
                      ) : (
                        <Circle size={20} style={{ color: "var(--ink-400)" }} />
                      )}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BILLING                                                             */
/* ------------------------------------------------------------------ */
function Billing({ members, billing, setBilling }) {
  function togglePaid(memberId) {
    setBilling(billing.map((b) => (b.memberId === memberId ? { ...b, paid: !b.paid } : b)));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Monthly Billing</h2>
        <p className="text-sm" style={{ color: "var(--ink-600)" }}>
          Bills calculated from meals taken this month at Rs. {MEAL_RATES.Breakfast}/Rs. {MEAL_RATES.Lunch}/Rs. {MEAL_RATES.Dinner} per breakfast, lunch and dinner.
        </p>
      </div>

      <div className="mm-ledger-card rounded-md overflow-x-auto mm-scroll">
        <table className="w-full text-sm mm-table">
          <thead>
            <tr>
              <th className="text-left py-3 px-4">Member</th>
              <th className="text-center py-3 px-4">Breakfasts</th>
              <th className="text-center py-3 px-4">Lunches</th>
              <th className="text-center py-3 px-4">Dinners</th>
              <th className="text-right py-3 px-4">Total</th>
              <th className="text-center py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {billing.map((b) => {
              const member = members.find((m) => m.id === b.memberId);
              if (!member) return null;
              return (
                <tr key={b.memberId}>
                  <td className="py-3 px-4 font-semibold" style={{ color: "var(--ink-900)" }}>{member.name}</td>
                  <td className="py-3 px-4 text-center">{b.mealsCount.Breakfast}</td>
                  <td className="py-3 px-4 text-center">{b.mealsCount.Lunch}</td>
                  <td className="py-3 px-4 text-center">{b.mealsCount.Dinner}</td>
                  <td className="py-3 px-4 text-right mm-mono font-semibold" style={{ color: "var(--maroon-900)" }}>
                    Rs. {b.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Pill tone={b.paid ? "Paid" : "Unpaid"}>{b.paid ? "Paid" : "Unpaid"}</Pill>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => togglePaid(b.memberId)}
                      className="rounded px-3 py-1.5 text-xs font-semibold"
                      style={{ border: "1px solid var(--paper-300)", color: "var(--maroon-800)" }}
                    >
                      Mark {b.paid ? "unpaid" : "paid"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  COMPLAINTS                                                         */
/* ------------------------------------------------------------------ */
function Complaints({ complaints, setComplaints, members }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ memberName: members[0]?.name || "", subject: "", message: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setComplaints([
      { ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10), status: "Open" },
      ...complaints,
    ]);
    setForm({ memberName: members[0]?.name || "", subject: "", message: "" });
    setModal(false);
  }

  function toggleStatus(id) {
    setComplaints(
      complaints.map((c) => (c.id === id ? { ...c, status: c.status === "Open" ? "Resolved" : "Open" } : c))
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="mm-serif text-2xl font-semibold" style={{ color: "var(--maroon-900)" }}>Complaints & Feedback</h2>
          <p className="text-sm" style={{ color: "var(--ink-600)" }}>{complaints.filter((c) => c.status === "Open").length} open of {complaints.length} total.</p>
        </div>
        <button onClick={() => setModal(true)} className="mm-btn-brass rounded px-4 py-2 text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Log complaint
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {complaints.map((c) => (
          <div key={c.id} className="mm-ledger-card rounded-md p-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: "var(--ink-900)" }}>{c.subject}</span>
                <Pill tone={c.status}>{c.status}</Pill>
              </div>
              <p className="text-sm mb-1" style={{ color: "var(--ink-600)" }}>{c.message}</p>
              <p className="text-xs" style={{ color: "var(--ink-400)" }}>{c.memberName} &middot; {c.date}</p>
            </div>
            <button
              onClick={() => toggleStatus(c.id)}
              className="rounded px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
              style={{ border: "1px solid var(--paper-300)", color: "var(--maroon-800)" }}
            >
              Mark {c.status === "Open" ? "resolved" : "open"}
            </button>
          </div>
        ))}
        {complaints.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "var(--ink-400)" }}>No complaints logged yet.</p>
        )}
      </div>

      {modal && (
        <Modal title="Log a new complaint" onClose={() => setModal(false)}>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Member</label>
              <select
                value={form.memberName}
                onChange={(e) => setForm({ ...form, memberName: e.target.value })}
                className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
              >
                {members.map((m) => <option key={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Subject</label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
                placeholder="e.g. Food quality"
                required
              />
            </div>
            <div>
              <label className="text-xs mm-mono uppercase tracking-widest" style={{ color: "var(--ink-600)" }}>Details</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mm-input w-full rounded px-3 py-2 mt-1 text-sm"
                rows={4}
                required
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="mm-btn-primary rounded px-4 py-2 text-sm font-semibold flex-1">Submit complaint</button>
              <button type="button" onClick={() => setModal(false)} className="rounded px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--paper-300)" }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP SHELL                                                          */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "members", label: "Members", icon: Users },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "billing", label: "Billing", icon: Receipt },
  { key: "complaints", label: "Complaints", icon: MessageSquareWarning },
];

export default function MessManagementApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [active, setActive] = useState("dashboard");

  const [members, setMembers] = useState(initialMembers);
  const [menu, setMenu] = useState(initialMenu);
  const [attendanceToday, setAttendanceToday] = useState(() => initAttendanceToday(initialMembers));
  const [complaints, setComplaints] = useState(initialComplaints);

  const billing = useMemo(() => {
    const monthly = initMonthlyMeals(members);
    return members.map((m) => {
      const mealsCount = monthly[m.id];
      const totalAmount =
        mealsCount.Breakfast * MEAL_RATES.Breakfast +
        mealsCount.Lunch * MEAL_RATES.Lunch +
        mealsCount.Dinner * MEAL_RATES.Dinner;
      return { memberId: m.id, mealsCount, totalAmount, paid: m.id % 2 === 0 };
    });
  }, [members]);
  const [billingState, setBillingState] = useState(billing);

  if (!loggedIn) {
    return (
      <>
        <style>{THEME}</style>
        <Login onLogin={(name) => { setAdminName(name); setLoggedIn(true); }} />
      </>
    );
  }

  return (
    <div className="mm-root min-h-screen flex">
      <style>{THEME}</style>

      <aside className="mm-sidebar w-64 shrink-0 hidden md:flex flex-col py-6 px-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--brass-500)" }}>
            <ChefHat size={18} style={{ color: "var(--maroon-950)" }} />
          </div>
          <div>
            <p className="mm-serif text-lg font-semibold leading-none" style={{ color: "#FBF3E7" }}>Annapurna</p>
            <p className="text-[10px] mm-mono uppercase tracking-widest" style={{ color: "var(--brass-300)" }}>Mess Register</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`mm-navitem flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium ${active === item.key ? "active" : ""}`}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="mm-stitch mb-4" />
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "#FBF3E7" }}>{adminName || "Admin"}</p>
              <p className="text-[11px]" style={{ color: "#C9A98F" }}>Mess Administrator</p>
            </div>
            <button onClick={() => setLoggedIn(false)} className="p-2 rounded hover:bg-white/10">
              <LogOut size={16} style={{ color: "var(--brass-300)" }} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white" style={{ borderBottom: "1px solid var(--paper-300)" }}>
          <div className="md:hidden flex items-center gap-2">
            <ChefHat size={18} style={{ color: "var(--maroon-800)" }} />
            <span className="mm-serif font-semibold" style={{ color: "var(--maroon-900)" }}>Annapurna</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2 text-xs mm-mono" style={{ color: "var(--ink-400)" }}>
            {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        <nav className="md:hidden flex overflow-x-auto gap-1 px-3 py-2 bg-white mm-scroll" style={{ borderBottom: "1px solid var(--paper-300)" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
              style={{
                background: active === item.key ? "var(--maroon-800)" : "var(--paper-200)",
                color: active === item.key ? "#FBF3E7" : "var(--ink-600)",
              }}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto mm-scroll">
          {active === "dashboard" && (
            <Dashboard members={members} attendanceToday={attendanceToday} complaints={complaints} billing={billingState} />
          )}
          {active === "members" && <Members members={members} setMembers={setMembers} />}
          {active === "menu" && <MenuManager menu={menu} setMenu={setMenu} />}
          {active === "attendance" && (
            <Attendance members={members} attendanceToday={attendanceToday} setAttendanceToday={setAttendanceToday} />
          )}
          {active === "billing" && <Billing members={members} billing={billingState} setBilling={setBillingState} />}
          {active === "complaints" && <Complaints complaints={complaints} setComplaints={setComplaints} members={members} />}
        </main>
      </div>
    </div>
  );
}
