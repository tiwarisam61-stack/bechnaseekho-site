// Client-side error reporter: sends unhandled errors + boundary reports to
// /api/public/report-error. Best-effort; never throws.
// Rate-limited per session so a feedback loop can't flood the endpoint.

const ENDPOINT = "/api/public/report-error";
const MAX_REPORTS = 5;
const WINDOW_MS = 5 * 60 * 1000;

const sent: number[] = [];
const dedupe = new Set<string>();

function allowed(key: string): boolean {
  const now = Date.now();
  while (sent.length && now - sent[0] > WINDOW_MS) sent.shift();
  if (sent.length >= MAX_REPORTS) return false;
  if (dedupe.has(key)) return false;
  dedupe.add(key);
  sent.push(now);
  // Forget dedupe key after the window
  setTimeout(() => dedupe.delete(key), WINDOW_MS);
  return true;
}

async function safeScreenshot(): Promise<string | null> {
  // Screenshot capture is optional. `html2canvas` is not installed by
  // default; if you want screenshots, run `bun add html2canvas` and wire
  // it up here. Returning null keeps the reporter working without it.
  return null;
}

async function post(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(ENDPOINT, blob);
      return;
    }
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // Silent
  }
}

export async function reportError(
  error: unknown,
  extra?: Record<string, unknown>,
): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const err =
      error instanceof Error
        ? error
        : new Error(typeof error === "string" ? error : JSON.stringify(error));
    const key = `${err.message}::${(err.stack ?? "").split("\n")[1] ?? ""}`;
    if (!allowed(key)) return;

    const screenshot = await safeScreenshot();
    await post({
      message: err.message,
      stack: err.stack ?? null,
      route: window.location.pathname + window.location.search,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screenshot,
      extra: extra ?? null,
      ts: new Date().toISOString(),
    });
  } catch {
    // Never throw from the reporter itself.
  }
}

let installed = false;
export function installGlobalErrorReporter(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    if (!event.error && !event.message) return;
    void reportError(event.error ?? event.message, {
      source: "window.error",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    void reportError(event.reason, { source: "unhandledrejection" });
  });
}
