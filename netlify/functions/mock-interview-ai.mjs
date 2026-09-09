const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const jsonHeaders = {
  "content-type": "application/json",
  "cache-control": "no-store",
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  };
}

function outputText(data) {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("");
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "POST required" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
    if (!prompt) return json(400, { error: "prompt required" });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return json(500, { error: "Missing OPENAI_API_KEY" });

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
        input: prompt.slice(0, 9000),
        max_output_tokens: maxTokens,
        store: false,
      }),
    });

    if (!upstream.ok) {
      const body = await upstream.text().catch(() => "");
      return json(upstream.status || 500, { error: body || "OpenAI request failed" });
    }

    const data = await upstream.json();
    return json(200, { model: OPENAI_MODEL, result: outputText(data) });
  } catch (error) {
    return json(500, { error: error?.message || "Unexpected interview AI error" });
  }
}
