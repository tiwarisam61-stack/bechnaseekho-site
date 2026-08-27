import { createFileRoute } from "@tanstack/react-router";

// Public endpoint — accepts client-side error reports.
// Writes to public.error_reports via the service role. If email is set up
// later, this handler will also send an alert to OPS_ALERT_EMAIL.
export const Route = createFileRoute("/api/public/report-error")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.text();
          if (raw.length > 400_000) {
            return new Response("Payload too large", { status: 413 });
          }
          const body = JSON.parse(raw) as {
            message?: unknown;
            stack?: unknown;
            route?: unknown;
            user_agent?: unknown;
            viewport?: unknown;
            screenshot?: unknown;
            extra?: unknown;
          };

          const str = (v: unknown, max = 2000) =>
            typeof v === "string" ? v.slice(0, max) : null;

          const record = {
            message: str(body.message, 1000) ?? "Unknown error",
            stack: str(body.stack, 8000),
            route: str(body.route, 500),
            user_agent: str(body.user_agent, 500),
            viewport: str(body.viewport, 32),
            screenshot_url: str(body.screenshot, 350_000),
            extra:
              body.extra && typeof body.extra === "object"
                ? (JSON.parse(JSON.stringify(body.extra)) as Record<string, unknown>)
                : null,
          };


          const hasSupabaseAdminCreds = Boolean(
            process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
          );

          if (hasSupabaseAdminCreds) {
            try {
              const { supabaseAdmin } = await import(
                "@/integrations/supabase/client.server"
              );
              const { error } = await supabaseAdmin
                .from("error_reports")
                // Cast: `extra` is a Json column; our Record<string, unknown> is
                // JSON-serializable but not structurally assignable to Json.
                .insert(record as unknown as never);

              if (error) {
                console.error("[report-error] insert failed:", error);
              }
            } catch (insertErr) {
              console.error("[report-error] insert skipped:", insertErr);
            }
          } else {
            console.warn("[report-error] Supabase admin credentials are missing; skipping persistence.");
          }

          // Optional: email alert if configured. Uses the configured sender
          // when both an inbox and API key are present.
          const inbox = process.env.OPS_ALERT_EMAIL;
          const apiKey = process.env.LOVABLE_API_KEY;
          const sender = process.env.SENDER_DOMAIN;
          if (inbox && apiKey && sender) {
            try {
              await fetch("https://api.lovable.dev/v1/email/send", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  from: `alerts@${sender}`,
                  to: inbox,
                  subject: `[BechnaSeekho] Error: ${record.message.slice(0, 80)}`,
                  html: `
                    <h2>App error</h2>
                    <p><b>Message:</b> ${escapeHtml(record.message)}</p>
                    <p><b>Route:</b> ${escapeHtml(record.route ?? "-")}</p>
                    <p><b>Viewport:</b> ${escapeHtml(record.viewport ?? "-")}</p>
                    <p><b>UA:</b> ${escapeHtml(record.user_agent ?? "-")}</p>
                    <pre style="background:#f6f7fb;padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap">${escapeHtml(record.stack ?? "(no stack)")}</pre>
                    ${record.screenshot_url ? `<p><b>Screenshot:</b></p><img src="${record.screenshot_url}" style="max-width:100%;border:1px solid #eee;border-radius:8px" />` : ""}
                  `,
                }),
              });
            } catch (mailErr) {
              console.error("[report-error] email failed:", mailErr);
            }
          }

          return new Response("ok", { status: 200 });
        } catch (err) {
          console.error("[report-error] handler crashed:", err);
          return new Response("bad request", { status: 400 });
        }
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
