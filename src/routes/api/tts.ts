import { createFileRoute } from "@tanstack/react-router";

// Server-side proxy for natural (ElevenLabs) text-to-speech, used by
// /interview-practice.html. The ElevenLabs API key lives only in this
// server's environment (ELEVENLABS_API_KEY) and is never sent to the
// browser — the client just POSTs { text, language_code } here and gets
// back an audio/mpeg stream.
const ELEVEN_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // ElevenLabs' own default multilingual example voice
const ELEVEN_MODEL = "eleven_multilingual_v2";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { text, language_code } = (await request.json()) as {
            text?: unknown;
            language_code?: unknown;
          };

          if (typeof text !== "string" || !text.trim()) {
            return new Response("text required", { status: 400 });
          }
          // Keep requests bounded — interview questions are short.
          const clipped = text.slice(0, 2000);
          const lang = language_code === "hi" ? "hi" : "en";

          const key = process.env.ELEVENLABS_API_KEY;
          if (!key) return new Response("Missing ELEVENLABS_API_KEY", { status: 500 });

          const upstream = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}?output_format=mp3_44100_128`,
            {
              method: "POST",
              headers: {
                "xi-api-key": key,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                text: clipped,
                model_id: ELEVEN_MODEL,
                language_code: lang,
                voice_settings: {
                  stability: 0.34,
                  similarity_boost: 0.88,
                  style: 0.36,
                  use_speaker_boost: true,
                },
              }),
            },
          );

          if (!upstream.ok || !upstream.body) {
            if (upstream.status === 401)
              return Response.json({ error: "Voice provider rejected the request." }, { status: 401 });
            if (upstream.status === 429)
              return Response.json({ error: "Natural voice quota exhausted for now." }, { status: 429 });
            const body = await upstream.text().catch(() => "");
            return Response.json({ error: `Voice provider error: ${body}` }, { status: 500 });
          }

          return new Response(upstream.body, {
            headers: {
              "Content-Type": upstream.headers.get("content-type") ?? "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        } catch (err) {
          return Response.json({ error: (err as Error).message }, { status: 500 });
        }
      },
    },
  },
});
