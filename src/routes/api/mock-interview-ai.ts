import { createFileRoute } from "@tanstack/react-router";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function outputText(data: any): string {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks: string[] = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("");
}

export const Route = createFileRoute("/api/mock-interview-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const payload = (await request.json()) as {
            action?: unknown;
            system?: unknown;
            prompt?: unknown;
            max_tokens?: unknown;
          };

          if (typeof payload.prompt !== "string" || !payload.prompt.trim()) {
            return new Response("prompt required", { status: 400 });
          }

          const key = process.env.OPENAI_API_KEY;
          if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });

          const maxTokens = Math.max(120, Math.min(1800, Number(payload.max_tokens) || 900));
          const system =
            typeof payload.system === "string" && payload.system.trim()
              ? payload.system.slice(0, 4000)
              : "You are a helpful interview coach for BechnaSeekho.";

          const upstream = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              authorization: `Bearer ${key}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              instructions: system,
              input: payload.prompt.slice(0, 9000),
              max_output_tokens: maxTokens,
              store: false,
            }),
          });

          if (!upstream.ok) {
            const body = await upstream.text().catch(() => "");
            return Response.json({ error: body || "OpenAI request failed" }, { status: upstream.status || 500 });
          }

          const data = await upstream.json();
          return Response.json({ model: OPENAI_MODEL, result: outputText(data) });
        } catch (err) {
          return Response.json({ error: (err as Error).message }, { status: 500 });
        }
      },
    },
  },
});
