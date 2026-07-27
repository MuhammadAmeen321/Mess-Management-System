# Annapurna Mess — Mess Management System

### a. What it does, and the problem it solves

Annapurna Mess is a complete management system for a hostel/college **mess (dining hall)** — the shared kitchen that feeds residents on a subscription/meal-plan basis.

**The real problem:** most hostel and college messes I've seen are still run on paper registers and WhatsApp groups. The mess admin tracks members, who ate what meal, who has paid, and handles food-quality complaints all by hand — which means billing errors, lost complaints, and no visibility into how the mess is actually running. This app replaces that paper register with a single dashboard the admin can actually use day to day.

**Who it's for:** mess/hostel administrators (the primary user, who signs in and runs the app) and, indirectly, the students/residents whose meals, bills, and complaints are being tracked.

> ✍️ *Personalize this paragraph with your own real story — e.g. which hostel/mess this is based on, and what specifically was broken about the manual process you saw.*

---

### b. Live URL

🔗 **[https://YOUR-DEPLOYMENT-URL.vercel.app](https://YOUR-DEPLOYMENT-URL.vercel.app)** — replace after deploying (see "How to run / deploy" below).

---

### c. Features

**Admin authentication**
- Sign-in gate before the dashboard is accessible.

**Dashboard**
- Live stat cards: active members, meals served today, revenue collected, pending dues, open complaints — each with a trend indicator.
- Weekly meal-turnout bar chart.
- Meal-plan distribution donut chart.
- Today's menu at a glance.
- Recent activity feed (latest complaints + new member sign-ups).

**Member management**
- Add, edit, delete members (name, room, contact, meal plan, join date, status).
- Search/filter by name or room.

**Menu management**
- Full weekly Breakfast/Lunch/Dinner grid.
- Inline click-to-edit for any dish.

**Attendance tracking**
- Mark each active member present/absent per meal, per day.
- Live per-meal totals.

**Billing**
- Bills auto-calculated from meals actually taken × per-meal rate.
- Mark bills paid/unpaid.

**Complaints & feedback**
- Log new complaints against a member.
- Toggle complaint status (Open/Resolved).
- **AI-powered complaint triage** (see below) — the flagship AI feature.

**Design**
- Custom "mess ledger register" visual identity (maroon/brass/paper palette, serif + mono typography) built from scratch — not a default template.
- Fixed left sidebar navigation, responsive layout.

---

### d. The AI feature

**Feature name:** AI Complaint Insights (triage assistant)

**What it does:** On the Complaints page, the admin clicks **"Analyze with AI."** The app sends every logged complaint (subject, message, status, date) to a serverless backend, which calls an LLM with a custom system prompt. The model groups the raw complaints into themes (e.g. *Food quality, Hygiene, Timing*), assigns each theme a priority (High/Medium/Low), and — critically — writes **one short, concrete action** the admin can actually take, instead of leaving them to read every complaint individually. This turns an unstructured pile of complaints into a prioritized to-do list in seconds.

**Model used:** `claude-sonnet-5` via the Anthropic Messages API, called from a Vercel serverless function (`/api/analyze-complaints.js`) so the API key never reaches the browser.

**The exact system prompt I wrote** (see `api/analyze-complaints.js`):

```
You are an operations assistant embedded inside a college/hostel mess (dining hall) management system, used by a mess administrator who has limited time and a growing list of resident complaints.

Your job: read the raw list of complaints (each with subject, message, status, date) and turn them into a short, actionable triage report for the administrator.

Rules you must follow:
1. Group complaints into a small number of clear themes (e.g. "Food quality", "Hygiene", "Timing", "Staff behaviour", "Billing"). Do not create more than 6 themes. Merge anything that doesn't fit cleanly into an "Other" theme.
2. For each theme, assign a priority of "High", "Medium", or "Low" based on severity and how many complaints fall into it. Health/hygiene/safety issues are always at least "Medium", and any mention of illness, contamination, or safety is "High".
3. For each theme, write ONE short, concrete, practical suggestedAction (max 20 words) the mess administrator can actually do this week — not vague advice.
4. Write a 1-2 sentence overall "summary" of the state of complaints in plain, direct language.
5. Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "summary": string,
  "themes": [
    { "theme": string, "priority": "High" | "Medium" | "Low", "count": number, "suggestedAction": string }
  ]
}
6. If there are no complaints, return {"summary": "No complaints logged yet.", "themes": []}.
```

The frontend then renders the returned JSON as a summary line plus a card per theme, each showing its priority pill, how many complaints it covers, and the suggested action.

---

### e. Tools, services, and AI models used to build it

- **Frontend:** React 18 + Vite
- **Charts:** Recharts (bar chart, donut chart)
- **Icons:** lucide-react
- **AI model:** Claude (`claude-sonnet-5`) via the Anthropic Messages API
- **Backend for AI calls:** Vercel Serverless Function (Node.js), so the API key stays server-side
- **Hosting/deployment:** Vercel
- **Version control:** Git + GitHub
- **Built with the help of:** Claude (Anthropic) as an AI pair-programmer for scaffolding the UI, theme system, and serverless function

---

### f. Screenshots

> 📸 Add at least 3 screenshots to the `/screenshots` folder (Dashboard, Complaints page with an AI analysis result, and one more page such as Billing or Members) and reference them below:

```markdown
![Dashboard](./screenshots/dashboard.png)
![AI Complaint Insights](./screenshots/ai-complaints.png)
![Billing](./screenshots/billing.png)
```

---

### g. How to run the project

**Prerequisites:** Node.js 18+ and an Anthropic API key ([console.anthropic.com](https://console.anthropic.com)).

**1. Clone and install**
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
npm install
```

**2. Environment variable**
```bash
cp .env.example .env
# then edit .env and paste your real key:
# ANTHROPIC_API_KEY=sk-ant-...
```

**3. Run locally**

The frontend alone (dashboard, members, menu, attendance, billing all work without the AI feature):
```bash
npm run dev
```

To also test the **AI Complaint Insights** feature locally, the `/api` serverless function needs the Vercel runtime, so use the Vercel CLI instead:
```bash
npm install -g vercel
vercel dev
```

**4. Deploy to Vercel**
```bash
npm install -g vercel   # if not already installed
vercel login
vercel
```
Then in the Vercel dashboard → your project → **Settings → Environment Variables**, add:
```
ANTHROPIC_API_KEY = your_real_key
```
Redeploy (`vercel --prod`) so the function picks up the key. Never commit the real key to git — it's already excluded via `.gitignore`.

**5. Log in**

The login screen is demo-mode: any Admin ID and password will sign you in.
