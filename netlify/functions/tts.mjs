const ELEVEN_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const ELEVEN_MODEL = "eleven_multilingual_v2";
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";

function text(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
    body,
  };
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    body: JSON.stringify(payload),
  };
}

async function audioResponse(upstream) {
  const buffer = Buffer.from(await upstream.arrayBuffer());
  return {
    statusCode: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "audio/mpeg",
      "cache-control": "no-store",
    },
    isBase64Encoded: true,
    body: buffer.toString("base64"),
  };
}

async function openAiSpeech(textInput, lang) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return text(500, "Missing ELEVENLABS_API_KEY and OPENAI_API_KEY");

  const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_TTS_MODEL,
      voice: lang === "hi" ? "coral" : "marin",
      input: textInput,
      response_format: "mp3",
      instructions:
        lang === "hi"
          ? "Speak like a warm, natural Indian Hindi interviewer. Keep the pace calm, clear, and human."
          : "Speak like a warm, natural professional interviewer. Keep the pace calm, clear, and human.",
    }),
  });

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => "");
    return json(upstream.status || 500, { error: body || "OpenAI speech provider error" });
  }

  return audioResponse(upstream);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "cache-control": "no-store" }, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return text(405, "POST required");
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    if (typeof payload.text !== "string" || !payload.text.trim()) {
      return text(400, "text required");
    }

    const clipped = payload.text.slice(0, 2000);
    const lang = payload.language_code === "hi" ? "hi" : "en";
    const key = process.env.ELEVENLABS_API_KEY;

    if (!key) return openAiSpeech(clipped, lang);

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

    if (!upstream.ok) {
      if (upstream.status === 401) return json(401, { error: "Voice provider rejected the request." });
      if (upstream.status === 429) return json(429, { error: "Natural voice quota exhausted for now." });
      const body = await upstream.text().catch(() => "");
      return json(500, { error: `Voice provider error: ${body}` });
    }

    return audioResponse(upstream);
  } catch (error) {
    return json(500, { error: error?.message || "Unexpected text-to-speech error" });
  }
}
