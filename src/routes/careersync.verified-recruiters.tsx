import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Globe2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Search,
    Send,
    ShieldCheck,
    Users,
} from "lucide-react";
import { CareerSyncNavbar } from "./careersync";
import { Footer } from "@/components/landing/footer";
import { useCareerSyncSnapshot } from "@/services/careersync/careersync-service";
import type { DemoJobRecord } from "@/lib/careersync-demo";

export const Route = createFileRoute("/careersync/verified-recruiters")({
    head: () => ({
        meta: [
            { title: "Verified Recruiters | CareerSync" },
            {
                name: "description",
                content: "Explore verified CareerSync recruiters and the active roles they are hiring for.",
            },
            { property: "og:title", content: "Verified Recruiters | CareerSync" },
            { property: "og:description", content: "Find genuine opportunities from verified hiring partners." },
        ],
    }),
    component: VerifiedRecruitersPage,
});

type RecruiterCompany = {
    name: string;
    initials: string;
    jobs: DemoJobRecord[];
    locations: string[];
    industries: string[];
    website: string | null;
};

function isValidWebsite(value: string | null | undefined) {
    if (!value) return false;
    try {
        const url = new URL(value.startsWith("http") ? value : `https://${value}`);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function initials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "CS";
}

function groupCompanies(jobs: DemoJobRecord[]) {
    const grouped = new Map<string, RecruiterCompany>();
    for (const job of jobs) {
        const name = job.company.trim() || "Verified employer";
        const key = name.toLowerCase();
        const current = grouped.get(key) ?? {
            name,
            initials: initials(name),
            jobs: [],
            locations: [],
            industries: [],
            website: null,
        };
        current.jobs.push(job);
        if (job.location && !current.locations.includes(job.location)) current.locations.push(job.location);
        if (job.industry && !current.industries.includes(job.industry)) current.industries.push(job.industry);
        if (!current.website && isValidWebsite(job.company_website)) current.website = job.company_website;
        grouped.set(key, current);
    }
    return [...grouped.values()].sort((a, b) => b.jobs.length - a.jobs.length || a.name.localeCompare(b.name));
}

function formatCount(value: number) {
    return new Intl.NumberFormat("en-IN").format(value);
}

function CompanyCard({ company }: { company: RecruiterCompany }) {
    const query = encodeURIComponent(company.name);
    return (
        <article className="group flex min-h-[300px] flex-col rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_16px_45px_-28px_rgba(15,23,42,0.42)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_25px_60px_-30px_rgba(37,99,235,0.35)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-sm font-black text-blue-700 ring-1 ring-blue-100">
                        {company.initials}
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-slate-900">{company.name}</h3>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-500">Verified recruiter</p>
                    </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                    <Check className="h-3 w-3" /> Verified
                </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Live roles</p>
                    <p className="mt-1 text-base font-black text-slate-900">{formatCount(company.jobs.length)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Locations</p>
                    <p className="mt-1 line-clamp-2 text-xs font-bold leading-4 text-slate-700">{company.locations.join(", ") || "Multiple locations"}</p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
                {(company.industries.length ? company.industries : ["Verified hiring"]).slice(0, 2).map((industry) => (
                    <span key={industry} className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">{industry}</span>
                ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {company.website && (
                    <a href={company.website.startsWith("http") ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700">
                        <Globe2 className="h-3.5 w-3.5" /> Company website
                    </a>
                )}
                <Link to="/careersync/jobs" search={{ query }} className="inline-flex items-center gap-1.5 rounded-full bg-[#071538] px-3.5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-blue-700">
                    View jobs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </article>
    );
}

function VerificationStep({ number, title, text, icon: Icon, tone }: { number: string; title: string; text: string; icon: typeof Building2; tone: string }) {
    return (
        <div className={`relative rounded-2xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur ${tone}`}>
            <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black tracking-wider text-blue-700">{number}</p>
                    <h3 className="mt-1 text-sm font-extrabold text-slate-900">{title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
                </div>
            </div>
        </div>
    );
}

function ContactPanel() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const body = `Full Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
        window.location.href = `mailto:contact@bechnaseekho.com?subject=${encodeURIComponent(form.subject || "Verified Recruiters enquiry")}&body=${encodeURIComponent(body)}`;
        setSent(true);
    };

    return (
        <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-50 via-white to-indigo-100/70 p-4 ring-1 ring-blue-100 sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
                    <div className="rounded-2xl bg-[#071538] p-6 text-white sm:p-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">Get in touch</p>
                        <h2 className="mt-2 text-3xl font-black tracking-tight">Contact Us</h2>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">Have questions about a recruiter or need assistance? Our team is here to help.</p>
                        <div className="mt-8 space-y-5 text-sm">
                            <a href="tel:+919310665960" className="flex items-start gap-3 text-blue-50 hover:text-white"><Phone className="mt-0.5 h-4 w-4 text-cyan-300" /><span><strong className="block text-white">Phone</strong>+91 93106 65960</span></a>
                            <a href="mailto:contact@bechnaseekho.com" className="flex items-start gap-3 text-blue-50 hover:text-white"><Mail className="mt-0.5 h-4 w-4 text-cyan-300" /><span><strong className="block text-white">Email</strong>contact@bechnaseekho.com</span></a>
                            <div className="flex items-start gap-3 text-blue-50"><Clock3 className="mt-0.5 h-4 w-4 text-cyan-300" /><span><strong className="block text-white">Working hours</strong>Mon-Sat, 10:00 AM - 6:00 PM IST</span></div>
                            <div className="flex items-start gap-3 text-blue-50"><MessageCircle className="mt-0.5 h-4 w-4 text-cyan-300" /><span><strong className="block text-white">Response time</strong>Usually within 24-48 hours</span></div>
                        </div>
                        <div className="mt-8 flex gap-2">
                            {[
                                ["LinkedIn", "https://www.linkedin.com/groups/18017028/"],
                                ["Instagram", "https://www.instagram.com/bechnaseekho_"],
                                ["WhatsApp", "https://wa.me/919310665960"],
                            ].map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-bold text-blue-100 transition hover:bg-white/10 hover:text-white">{label}</a>)}
                        </div>
                    </div>

                    <form onSubmit={submit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-7">
                        <div className="flex items-center justify-between gap-4">
                            <div><p className="text-sm font-extrabold text-slate-900">Send us a Message</p><p className="mt-1 text-xs text-slate-500">We will open your email client with the details filled in.</p></div>
                            <Send className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="text-xs font-bold text-slate-600">Full Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
                            <label className="text-xs font-bold text-slate-600">Email Address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
                            <label className="text-xs font-bold text-slate-600 sm:col-span-2">Subject<input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
                            <label className="text-xs font-bold text-slate-600 sm:col-span-2">Message<textarea required minLength={20} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
                        </div>
                        <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-[0_12px_24px_-12px_rgba(37,99,235,0.8)] transition hover:bg-blue-700">Send Message <ArrowRight className="h-4 w-4" /></button>
                        {sent && <p className="mt-3 text-xs font-semibold text-emerald-700">Your email client should now be ready with this enquiry.</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}

function VerifiedRecruitersPage() {
    const snapshot = useCareerSyncSnapshot();
    const [search, setSearch] = useState("");
    const companies = useMemo(() => {
        const jobs = snapshot.jobs.filter((job) => job.status === "approved" && job.is_active && job.is_verified);
        return groupCompanies(jobs);
    }, [snapshot.jobs]);
    const filteredCompanies = useMemo(() => {
        const query = search.trim().toLowerCase();
        return query ? companies.filter((company) => `${company.name} ${company.industries.join(" ")} ${company.locations.join(" ")}`.toLowerCase().includes(query)) : companies;
    }, [companies, search]);
    const totalRoles = companies.reduce((sum, company) => sum + company.jobs.length, 0);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f8faff] text-slate-900">
            <CareerSyncNavbar />
            <main className="pt-24">
                <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/70 to-indigo-100/70 px-4 pb-12 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
                    <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-blue-200/60" />
                    <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
                    <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700 shadow-sm ring-1 ring-blue-100"><CheckCircle2 className="h-3.5 w-3.5" /> 100% verified</span>
                            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-[#0b173d] sm:text-6xl">Verified Hiring <span className="text-blue-600">Network</span></h1>
                            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">Partner with trusted companies actively hiring on CareerSync. Every listing is reviewed so candidates can discover genuine opportunities with confidence.</p>
                            <div className="mt-7 flex flex-wrap gap-3"><Link to="/careersync/jobs" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Browse Verified Jobs <ArrowRight className="h-4 w-4" /></Link><Link to="/post-job" className="inline-flex items-center gap-2 rounded-lg border border-blue-500 bg-white/70 px-5 py-3 text-xs font-extrabold text-blue-700 transition hover:bg-white">Post a Role <ArrowRight className="h-4 w-4" /></Link></div>
                            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                                {[[formatCount(companies.length), "Verified Companies"], [formatCount(totalRoles), "Active Jobs"], ["100%", "Verified listings"], ["24-48h", "Review response"]].map(([value, label], index) => <div key={label} className="rounded-xl bg-white/80 p-3 text-center shadow-sm ring-1 ring-white"><div className="text-xl font-black text-[#0b173d]">{value}</div><div className="mt-1 text-[9px] font-bold text-slate-500">{label}</div></div>)}
                            </div>
                        </div>
                        <div className="relative mx-auto flex aspect-square w-full max-w-[510px] items-center justify-center">
                            <div className="absolute inset-[10%] rounded-full border border-blue-200/70 bg-white/35 shadow-[0_35px_80px_-35px_rgba(37,99,235,0.65)]" />
                            <div className="absolute bottom-[18%] h-10 w-[65%] rounded-[50%] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-80 blur-sm" />
                            <div className="relative grid h-48 w-40 place-items-center rounded-[35%] border-4 border-blue-300 bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 shadow-[0_25px_45px_-15px_rgba(37,99,235,0.75)] [clip-path:polygon(50%_0,92%_18%,86%_68%,50%_100%,14%_68%,8%_18%)] sm:h-64 sm:w-52"><Check className="h-20 w-20 text-white drop-shadow-lg sm:h-28 sm:w-28" strokeWidth={3} /></div>
                            <div className="absolute right-[8%] top-[18%] grid h-12 w-12 place-items-center rounded-full bg-white text-indigo-600 shadow-xl"><Users className="h-6 w-6" /></div>
                            <div className="absolute bottom-[27%] left-[8%] grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-xl"><CheckCircle2 className="h-6 w-6" /></div>
                            <div className="absolute bottom-[18%] right-[8%] grid h-12 w-12 place-items-center rounded-full bg-orange-400 text-white shadow-xl"><Building2 className="h-6 w-6" /></div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Recruiter directory</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b173d] sm:text-4xl">Companies with <span className="text-blue-600">verified activity</span></h2></div><p className="max-w-md text-sm leading-6 text-slate-500">Public contact details stay protected. Candidates apply through CareerSync and recruiters receive applicant data only through the approved workflow.</p></div>
                    <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200"><Search className="ml-2 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies, industries or locations" className="w-full bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400" /></div>
                    {filteredCompanies.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredCompanies.map((company) => <CompanyCard key={company.name} company={company} />)}</div> : <div className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">No verified recruiters match your search yet.</div>}
                </section>

                <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="text-center"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Our verification process</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b173d]">How <span className="text-blue-600">Verification Works</span></h2><p className="mx-auto mt-3 max-w-lg text-sm text-slate-500">We follow a strict three-step process to ensure only genuine companies can access our network.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3"><VerificationStep number="01" title="Company Identity & Review" text="We identify the company and thoroughly review their business details, domain, and credibility." icon={Building2} tone="bg-blue-50/70" /><VerificationStep number="02" title="Approval Queue" text="The company is added to our approval queue and verified by our team of experts." icon={Clock3} tone="bg-emerald-50/70" /><VerificationStep number="03" title="Protected Applicant Access" text="Once approved, the company gets access to our platform and can hire verified candidates." icon={ShieldCheck} tone="bg-indigo-50/70" /></div></div></section>

                <section className="pt-16 sm:pt-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-8 text-center"><p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">Need help?</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#0b173d]">Connect with the <span className="text-blue-600">CareerSync team</span></h2></div></div><ContactPanel /></section>
            </main>
            <Footer />
        </div>
    );
}
