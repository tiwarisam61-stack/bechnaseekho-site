import { UsersRound, TrendingUp } from "lucide-react";
import recruiterArt from "@/assets/recruiter-3d.png";
import { useCountUp, useInView } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const stages = [
    { label: "Applied", value: 348, delta: "12%", tone: "brand" },
    { label: "Screening", value: 92, delta: "8%", tone: "emerald" },
    { label: "Interview", value: 34, delta: "5%", tone: "violet" },
    { label: "Offered", value: 8, delta: "3%", tone: "amber" },
] as const;

const toneClasses: Record<string, string> = {
    brand: "bg-brand-tint text-brand",
    emerald: "bg-emerald-tint text-emerald",
    violet: "bg-violet-tint text-violet",
    amber: "bg-amber-tint text-amber",
};

const pipeline = [
    { day: "Mon", value: 18 },
    { day: "Tue", value: 24 },
    { day: "Wed", value: 31 },
    { day: "Thu", value: 44 },
    { day: "Fri", value: 52 },
    { day: "Sat", value: 61 },
    { day: "Sun", value: 78 },
];

function StageCard({
    stage,
    active,
    index,
}: {
    stage: (typeof stages)[number];
    active: boolean;
    index: number;
}) {
    const count = useCountUp(stage.value, active, 1200 + index * 150);
    return (
        <div
            className={cn(
                "float-soft rounded-2xl p-4 transition-transform duration-500 hover:-translate-y-1.5",
                toneClasses[stage.tone],
            )}
            style={{ animationDelay: `${index * 0.6}s` }}
        >
            <p className="text-xs font-bold tracking-wide opacity-90">{stage.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tabular-nums">{count}</span>
                <span className="text-[11px] font-semibold text-emerald">↗ {stage.delta}</span>
            </div>
        </div>
    );
}

function PipelineChart() {
    const max = 90;
    const points = pipeline
        .map((p, i) => {
            const x = (i / (pipeline.length - 1)) * 260 + 10;
            const y = 100 - (p.value / max) * 80;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="rounded-2xl border border-border/70 bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold">Hiring Pipeline Overview</p>
                <span className="shrink-0 text-[11px] font-semibold text-emerald">+38% this week</span>
            </div>
            <svg viewBox="0 0 280 115" className="mt-3 h-28 w-full" role="img" aria-label="Hiring pipeline trend">
                <defs>
                    <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[20, 45, 70, 95].map((y) => (
                    <line key={y} x1="10" x2="270" y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
                ))}
                <polygon points={`${points} 270,100 10,100`} fill="url(#pipelineFill)" />
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="600"
                    strokeDashoffset="600"
                >
                    <animate attributeName="stroke-dashoffset" from="600" to="0" dur="1.6s" fill="freeze" />
                </polyline>
                {pipeline.map((p, i) => {
                    const x = (i / (pipeline.length - 1)) * 260 + 10;
                    const y = 100 - (p.value / max) * 80;
                    return <circle key={p.day} cx={x} cy={y} r="3" fill="var(--brand)" />;
                })}
                {pipeline.map((p, i) => (
                    <text
                        key={p.day}
                        x={(i / (pipeline.length - 1)) * 260 + 10}
                        y="113"
                        textAnchor="middle"
                        fontSize="8"
                        fill="var(--muted-foreground)"
                    >
                        {p.day}
                    </text>
                ))}
            </svg>
        </div>
    );
}

function QualityDial({ active }: { active: boolean }) {
    const pct = useCountUp(92, active, 1600);
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    return (
        <div className="bg-gradient-brand flex flex-col items-center justify-center gap-3 rounded-2xl p-5 text-primary-foreground">
            <p className="text-sm font-bold">Quality of Hire</p>
            <div className="relative">
                <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="9" />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (pct / 100) * circumference}
                        style={{ transition: "stroke-dashoffset 80ms linear" }}
                    />
                </svg>
                <span className="absolute inset-0 grid place-items-center text-2xl font-extrabold tabular-nums">
                    {pct}%
                </span>
            </div>
            <p className="text-center text-[11px] font-medium opacity-90">Amazing! You're doing great</p>
        </div>
    );
}

export function RecruiterPanel() {
    const { ref, inView } = useInView<HTMLDivElement>(0.25);

    return (
        <div ref={ref} className="panel panel-lift flex h-full flex-col p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-muted px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground">
                FOR RECRUITERS
            </span>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-[28px]">
                Find the right person, fast.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Your live hiring pipeline — from application to signed offer.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {stages.map((stage, i) => (
                    <StageCard key={stage.label} stage={stage} active={inView} index={i} />
                ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <PipelineChart />
                <QualityDial active={inView} />
            </div>

            <div className="mt-auto flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-end">
                <img
                    src={recruiterArt}
                    alt="Recruiter reviewing candidates on a laptop"
                    loading="lazy"
                    width={1024}
                    height={896}
                    className="float-slow w-32 shrink-0 sm:w-36"
                />
                <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted/70 px-4 py-3">
                    <UsersRound className="size-5 shrink-0 text-brand" />
                    <p className="min-w-0 text-sm font-semibold">
                        Post a role and get 5 matched candidates in under 24 hours.
                    </p>
                </div>
            </div>


            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <TrendingUp className="size-4 text-emerald" />
                Live data syncs every 30 seconds
            </div>
        </div>
    );
}
