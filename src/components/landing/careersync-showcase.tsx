import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
    ArrowUpRight,
    Bookmark,
    Briefcase,
    CheckCircle2,
    Cpu,
    Search,
    Sparkles,
    Users,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

type Stat = {
    label: string;
    value: number;
    suffix?: string;
    delta: string;
};

const RECRUITER_STATS: Stat[] = [
    { label: "Applications", value: 348, delta: "+12%" },
    { label: "Screened", value: 92, delta: "+8%" },
    { label: "Interviews", value: 34, delta: "+5%" },
    { label: "Offers", value: 8, delta: "+3%" },
];

const CANDIDATES = [
    { name: "Riya Sharma", role: "Product Designer", exp: "5+ yrs", location: "Bengaluru", match: 95 },
    { name: "Kabir Mehta", role: "Software Engineer", exp: "4+ yrs", location: "Remote", match: 92 },
    { name: "Ishaan Patel", role: "UI/UX Designer", exp: "6+ yrs", location: "Mumbai", match: 88 },
];

export function CareerSyncShowcase() {
    return (
        <section className="relative overflow-hidden py-18 sm:py-22" aria-label="CareerSync platform showcase">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-10 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
                <div className="absolute -left-20 bottom-8 h-56 w-56 rounded-full bg-cyan-100/50 blur-3xl" />
                <div className="absolute -right-20 top-12 h-56 w-56 rounded-full bg-indigo-100/45 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.55 }}
                    className="text-center"
                >
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">CareerSync Showcase</p>
                    <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
                        Connecting <span className="text-gradient-brand">Recruiters</span> and <span className="text-gradient-brand">Candidates</span>
                    </h2>
                </motion.div>

                <div className="relative mt-9 grid gap-4 lg:grid-cols-[1.22fr_0.72fr_1.22fr] lg:items-stretch">
                    <RecruiterCard />
                    <CenterSyncCard />
                    <CandidateCard />

                    <ConnectorLayer />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="mt-8 flex justify-center"
                >
                    <Link
                        to="/careersync"
                        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-blue-200 bg-white px-8 py-3.5 text-base font-bold text-blue-700 shadow-[0_18px_46px_-24px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-800"
                        aria-label="Open CareerSync"
                    >
                        <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.22),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <span className="pointer-events-none absolute inset-0 -z-10">
                            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/65 opacity-0 group-hover:animate-ping" />
                        </span>
                        Open CareerSync
                        <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function RecruiterCard() {
    return (
        <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55 }}
            className="relative rounded-[22px] bg-white/95 p-5 ring-1 ring-blue-100 shadow-[0_24px_65px_-36px_rgba(15,23,42,0.4)] backdrop-blur"
        >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">For Recruiters</p>
            <h3 className="mt-2 font-display text-[29px] font-black leading-tight text-ink">Find the right person, fast.</h3>
            <p className="mt-1 text-sm text-ink-soft">Your hiring pipeline from application to signed offer.</p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {RECRUITER_STATS.map((s) => (
                    <StatBox key={s.label} stat={s} />
                ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-bold text-slate-600">Hiring Pipeline</p>
                    <svg viewBox="0 0 220 90" className="mt-2 h-20 w-full" aria-hidden>
                        <defs>
                            <linearGradient id="pipeline-line" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                        <path d="M8 66 C34 58, 45 62, 72 52 C98 42, 118 47, 144 34 C165 25, 190 31, 212 16" fill="none" stroke="url(#pipeline-line)" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="212" cy="16" r="4" fill="#2563eb" className="cs-dot-pulse" />
                    </svg>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-600">+30% this week</p>
                </div>

                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 p-3 text-white shadow-lg">
                    <p className="text-xs font-semibold text-blue-100">Quality of Hire</p>
                    <div className="mt-2 grid place-items-center">
                        <div className="relative grid h-20 w-20 place-items-center rounded-full" style={{ background: "conic-gradient(#ffffff 0 331deg, rgba(255,255,255,0.22) 331deg 360deg)" }}>
                            <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-lg font-black">92%</div>
                        </div>
                    </div>
                    <p className="mt-2 text-center text-[11px] text-blue-100">Amazing! You are doing great.</p>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-2.5">
                <RecruiterIllustration />
                <p className="text-xs font-semibold text-slate-700">Post a role and get 5 matched candidates in under 24 hours.</p>
            </div>
        </motion.article>
    );
}

function StatBox({ stat }: { stat: Stat }) {
    const { ref, value } = useCountUp(stat.value, 1.2);
    return (
        <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold text-slate-500">{stat.label}</p>
            <div className="mt-1 flex items-end gap-1.5">
                <span ref={ref} className="font-numeric text-2xl font-black text-slate-900">
                    {Math.round(value)}{stat.suffix ?? ""}
                </span>
                <span className="pb-0.5 text-[10px] font-bold text-emerald-600">{stat.delta}</span>
            </div>
        </div>
    );
}

function RecruiterIllustration() {
    return (
        <svg viewBox="0 0 90 74" className="h-16 w-16 shrink-0" role="img" aria-label="Recruiter illustration">
            <defs>
                <linearGradient id="avatar-a" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
            </defs>
            <rect x="2" y="30" width="86" height="34" rx="14" fill="#dbeafe" />
            <circle cx="45" cy="20" r="12" fill="#f1f5f9" />
            <path d="M31 50 C38 41, 52 41, 59 50" fill="url(#avatar-a)" />
            <rect x="19" y="54" width="52" height="6" rx="3" fill="#93c5fd" />
        </svg>
    );
}

function CenterSyncCard() {
    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.45 }}
            className="relative grid min-h-[220px] place-items-center overflow-hidden rounded-[22px] bg-white/70 p-4 ring-1 ring-blue-200/90 shadow-[0_22px_52px_-28px_rgba(59,130,246,0.62)] backdrop-blur-2xl"
        >
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.18),transparent_55%)]" />
            <span className="pointer-events-none absolute inset-4 rounded-2xl border border-white/60" />
            <span className="cs-float-particle absolute left-5 top-8 h-2 w-2 rounded-full bg-cyan-300" />
            <span className="cs-float-particle absolute right-6 top-12 h-1.5 w-1.5 rounded-full bg-blue-300" style={{ animationDelay: "0.6s" }} />
            <span className="cs-float-particle absolute bottom-9 left-8 h-1.5 w-1.5 rounded-full bg-indigo-300" style={{ animationDelay: "1.1s" }} />

            <div className="relative z-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                    <Cpu className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-2xl font-black text-slate-900">CareerSync</p>
                <p className="mt-1 text-sm font-medium text-slate-600">Connecting Talent with Opportunities</p>
            </div>
        </motion.article>
    );
}

function CandidateCard() {
    return (
        <motion.article
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.55 }}
            className="relative rounded-[22px] bg-white/95 p-5 ring-1 ring-blue-100 shadow-[0_24px_65px_-36px_rgba(15,23,42,0.4)] backdrop-blur"
        >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">For Candidates</p>
            <h3 className="mt-2 font-display text-[29px] font-black leading-tight text-ink">Get discovered and hired.</h3>

            <div className="pointer-events-none absolute right-5 top-4 hidden sm:block">
                <CandidateIllustration />
            </div>

            <ul className="mt-3 space-y-1.5">
                {[
                    "Create your profile",
                    "Resume analysis",
                    "Instant AI job matching",
                    "One-click application",
                ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" /> {item}
                    </li>
                ))}
            </ul>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="flex-1 text-sm text-slate-500">Search jobs, companies or skills...</span>
                <button type="button" className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-2.5 py-1.5 text-xs font-semibold text-white">
                    AI Match
                </button>
            </div>

            <div className="mt-3 space-y-2.5">
                {CANDIDATES.map((c, idx) => (
                    <motion.div
                        key={c.name}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.07 * idx }}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5"
                    >
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-sm font-bold text-blue-700">
                            {c.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">{c.name}</p>
                            <p className="truncate text-xs text-slate-500">{c.role}</p>
                            <p className="truncate text-[11px] text-slate-400">{c.exp} · {c.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{c.match}% Match</p>
                            <button type="button" className="mt-1 inline-flex items-center text-slate-400 hover:text-blue-600" aria-label={`Bookmark ${c.name}`}>
                                <Bookmark className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 text-xs font-semibold text-slate-700">
                    <Users className="mb-1 h-4 w-4 text-blue-600" /> 52K+ Learners Hired
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200 text-xs font-semibold text-slate-700">
                    <Briefcase className="mb-1 h-4 w-4 text-blue-600" /> 92% Placement Success
                </div>
            </div>
        </motion.article>
    );
}

function CandidateIllustration() {
    return (
        <svg viewBox="0 0 68 86" className="h-16 w-12" role="img" aria-label="Candidate illustration">
            <defs>
                <linearGradient id="candidate-a" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <circle cx="34" cy="20" r="13" fill="#eef2ff" />
            <path d="M12 77 C17 56, 51 56, 56 77" fill="url(#candidate-a)" />
            <rect x="19" y="38" width="30" height="8" rx="4" fill="#a5b4fc" />
        </svg>
    );
}

function ConnectorLayer() {
    return (
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden>
            <svg className="h-full w-full" viewBox="0 0 1200 460" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="cs-conn-a" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="cs-conn-b" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
                    </linearGradient>
                </defs>

                <path d="M356 221 C430 193, 471 198, 545 224" stroke="url(#cs-conn-a)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M654 224 C730 198, 770 191, 844 208" stroke="url(#cs-conn-b)" strokeWidth="3" fill="none" strokeLinecap="round" />

                <path d="M356 221 C430 193, 471 198, 545 224" stroke="#93c5fd" strokeOpacity="0.28" strokeWidth="9" fill="none" strokeLinecap="round" />
                <path d="M654 224 C730 198, 770 191, 844 208" stroke="#67e8f9" strokeOpacity="0.25" strokeWidth="9" fill="none" strokeLinecap="round" />
            </svg>

            <motion.span
                className="absolute h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(37,99,235,0.7)]"
                animate={{ left: ["33%", "47%"], top: ["48%", "50%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
                className="absolute h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.7)]"
                animate={{ left: ["55%", "69%"], top: ["50%", "46%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />

            <p className="absolute left-[37%] top-[43%] rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-blue-100">Recruiters</p>
            <p className="absolute left-[66%] top-[40%] rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-600 ring-1 ring-cyan-100">Candidates</p>
            <Sparkles className="absolute left-[49%] top-[44%] h-4 w-4 text-indigo-500/70" />
        </div>
    );
}
