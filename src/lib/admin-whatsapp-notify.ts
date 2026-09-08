export type AdminWhatsAppNotificationType =
  | "job_approval"
  | "profile_view_approval"
  | "approval_request";

export type AdminWhatsAppNotificationPayload = {
  type: AdminWhatsAppNotificationType;
  title: string;
  message: string;
  href?: string;
  actor?: string;
  entity?: string;
};

export async function notifyAdminWhatsApp(payload: AdminWhatsAppNotificationPayload) {
  try {
    const response = await fetch("/api/admin-whatsapp-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return (await response.json().catch(() => null)) as {
      ok?: boolean;
      configured?: boolean;
      error?: string;
    } | null;
  } catch {
    return { ok: false, configured: false, error: "WhatsApp notification request failed." };
  }
}

export function notifyAdminWhatsAppSilently(payload: AdminWhatsAppNotificationPayload) {
  void notifyAdminWhatsApp(payload);
}
