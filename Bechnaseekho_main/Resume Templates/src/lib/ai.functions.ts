import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

async function chat(messages: unknown[], jsonMode = false) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("AI is busy right now — please retry in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
    throw new Error(`AI request failed [${res.status}]: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

const ACTIONS = {
  improve: "Improve clarity and impact while keeping the meaning and length similar.",
  rewrite: "Rewrite from scratch with stronger phrasing and a fresh structure.",
  professional: "Rewrite in a confident, professional recruiter-friendly tone.",
  shorter: "Make it about 40% shorter without losing key facts.",
  longer: "Expand with concrete detail and context, roughly 50% longer.",
  ats: "Optimise for ATS: use standard terminology, strong keywords, no jargon or symbols.",
  grammar: "Fix grammar, spelling and punctuation only. Keep wording as close as possible.",
  bullets: "Turn this into 3-5 achievement-focused resume bullet points, one per line, each starting with a strong action verb and including a measurable outcome where plausible.",
  achievements: "Generate 3-4 quantified achievement bullets based on this content, one per line.",
  summary: "Write a 2-3 sentence professional resume summary in first person implied (no 'I'), highlighting impact.",
  skills: "Return a comma separated list of 10-14 relevant, ATS-friendly skills. No other text.",
  projects: "Suggest 2 concise resume project entries with one impact line each, one per line.",
} as const;

export const aiAssist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        action: z.enum(Object.keys(ACTIONS) as [keyof typeof ACTIONS, ...(keyof typeof ACTIONS)[]]),
        text: z.string().max(6000),
        context: z.string().max(600).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const instruction = ACTIONS[data.action];
    const content = await chat([
      {
        role: "system",
        content:
          "You are an expert resume writer and ATS specialist. Return ONLY the rewritten resume content — no preamble, no markdown fences, no quotes, no commentary.",
      },
      {
        role: "user",
        content: `Section: ${data.context ?? "resume content"}\nTask: ${instruction}\n\nContent:\n${data.text || "(empty — generate suitable content)"}`,
      },
    ]);
    return { text: content.trim() };
  });

export const aiParseResume = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ text: z.string().min(20).max(60000), fileName: z.string().max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const raw = await chat(
      [
        {
          role: "system",
          content:
            "You extract structured resume data. Respond with strict JSON only, matching the requested schema. Use empty strings/arrays for anything not present. Include a confidence integer 0-100 per top-level group.",
        },
        {
          role: "user",
          content: `Extract this resume (file: ${data.fileName}).\n\nJSON schema:\n{"profile":{"fullName":"","headline":"","email":"","phone":"","location":"","linkedin":"","portfolio":""},"summary":"","experience":[{"title":"","company":"","dates":"","location":"","bullets":[""]}],"education":[{"degree":"","school":"","dates":"","bullets":[""]}],"projects":[{"name":"","context":"","dates":"","bullets":[""]}],"technicalSkills":[""],"softSkills":[""],"certifications":[{"name":"","issuer":"","dates":""}],"achievements":[""],"awards":[""],"languages":[""],"internships":[{"title":"","company":"","dates":"","bullets":[""]}],"interests":[""],"references":"","confidence":{"profile":0,"summary":0,"experience":0,"education":0,"skills":0,"projects":0,"certifications":0}}\n\nRESUME TEXT:\n${data.text.slice(0, 40000)}`,
        },
      ],
      true,
    );
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
      JSON.parse(cleaned);
      return { json: cleaned };
    } catch {
      throw new Error("Could not read that resume. Try a text-based PDF or DOCX file.");
    }
  });
