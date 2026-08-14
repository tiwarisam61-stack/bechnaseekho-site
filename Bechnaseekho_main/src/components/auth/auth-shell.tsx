import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink">
      <div className="aurora" />
      <div className="absolute inset-0 grid-hero-bg opacity-70" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/favicon.png"
            alt="BechnaSeekho logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            draggable={false}
          />
          <span className="font-display text-lg font-bold tracking-tight">BechnaSeekho</span>
        </Link>
        <Link to="/" className="text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to home
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl glass-strong p-8 sm:p-10"
        >
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
        </motion.div>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, type = "text", className, ...rest }: FieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </span>
      <input
        type={type}
        {...rest}
        className={`mt-1.5 w-full rounded-xl border border-line bg-white/80 px-4 py-3 text-sm text-ink outline-none ring-brand/20 transition focus:border-brand focus:ring-4 ${className ?? ""}`}
      />
    </label>
  );
}
