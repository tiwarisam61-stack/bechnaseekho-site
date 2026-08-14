export const FREE_EMAIL_PROVIDERS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.co.uk",
  "outlook.com", "hotmail.com", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "protonmail.com", "proton.me", "pm.me",
  "zoho.com", "gmx.com", "gmx.us", "yandex.com", "yandex.ru",
  "mail.com", "tutanota.com", "fastmail.com", "rediffmail.com",
]);

export function isFreeEmailProvider(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return FREE_EMAIL_PROVIDERS.has(domain);
}

export type SignupRole = "candidate" | "company" | "employee";
