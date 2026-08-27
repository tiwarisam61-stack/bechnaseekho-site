import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are BechnaSeekho's friendly career assistant. BechnaSeekho is a platform for careers, hiring and professional growth.

Products:
- **CareerSync** — resume builder, verified jobs, mock interviews, ATS score, personalized career roadmaps.
- **BechnaSeekho Learning** — 200+ courses, live cohorts, industry certifications, 1:1 mentorship, placement support.

Pricing: Starter (Free), Pro (₹499/month), Company (Custom).

Rules:
- Keep replies short (2-4 sentences), warm, and useful.
- Use light markdown (**bold**, bullet lists) when it helps clarity.
- To sign up, direct users to the "Get Started Free" button (/signup).
- For human help, ask them to tap the green WhatsApp button.
- Never invent pricing beyond the tiers above.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as {
            messages?: { role: "user" | "assistant"; content: string }[];
          };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response("messages required", { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              stream: true,
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            }),
          });

          if (!upstream.ok || !upstream.body) {
            const body = await upstream.text();
            if (upstream.status === 429)
              return Response.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
            if (upstream.status === 402)
              return Response.json({ error: "Service credits exhausted. Please contact support." }, { status: 402 });
            return Response.json({ error: `Chat gateway error: ${body}` }, { status: 500 });
          }

          // Transform OpenAI-style SSE into plain text chunks for the client.
          const encoder = new TextEncoder();
          const decoder = new TextDecoder();
          const stream = new ReadableStream({
            async start(controller) {
              const reader = upstream.body!.getReader();
              let buffer = "";
              try {
                while (true) {
                  const { value, done } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() ?? "";
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const payload = trimmed.slice(5).trim();
                    if (payload === "[DONE]") {
                      controller.close();
                      return;
                    }
                    try {
                      const json = JSON.parse(payload) as {
                        choices?: { delta?: { content?: string } }[];
                      };
                      const delta = json.choices?.[0]?.delta?.content;
                      if (delta) controller.enqueue(encoder.encode(delta));
                    } catch {
                      /* ignore keep-alives / partial lines */
                    }
                  }
                }
                controller.close();
              } catch (err) {
                controller.error(err);
              }
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              "X-Accel-Buffering": "no",
            },
          });
        } catch (err) {
          return Response.json({ error: (err as Error).message }, { status: 500 });
        }
      },
    },
  },
});
