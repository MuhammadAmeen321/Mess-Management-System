// /api/analyze-complaints — Vercel serverless function
// Keeps the Anthropic API key server-side. Never call the AI provider
// directly from the browser with a hard-coded key.

const SYSTEM_PROMPT = `You are an operations assistant embedded inside a college/hostel mess (dining hall) management system, used by a mess administrator who has limited time and a growing list of resident complaints.

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
6. If there are no complaints, return {"summary": "No complaints logged yet.", "themes": []}.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    return;
  }

  try {
    const { complaints } = req.body || {};
    if (!Array.isArray(complaints)) {
      res.status(400).json({ error: "complaints must be an array" });
      return;
    }

    const userMessage = `Here are the current mess complaints as JSON:\n${JSON.stringify(
      complaints,
      null,
      2
    )}\n\nProduce the triage report now, following the rules exactly.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      res.status(502).json({ error: "AI provider request failed" });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    const raw = textBlock ? textBlock.text : "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { summary: "AI response could not be parsed.", themes: [] };
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unexpected server error" });
  }
}
