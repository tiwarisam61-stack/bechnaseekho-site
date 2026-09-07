import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Filter,
  X,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  Inbox,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  Users,
  Calendar,
  Send,
  ExternalLink,
  Globe,
  ClipboardList,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { applyFilters, hasAnyFilter, type Filters, type SalaryBucket, type ExperienceBucket } from "@/lib/jobs/filter";
import { ResumeUpload } from "@/components/careersync/resume-upload";
import { applyCareerSyncJob, listCareerSyncApprovedJobs } from "@/services/careersync/careersync-service";
import { fetchPublicCareerSyncJobs } from "@/lib/careersync-jobs-api";


function timeAgo(iso: string): string {
  const parsed = new Date(iso).getTime();
  if (!Number.isFinite(parsed)) return "recently";
  const diff = Date.now() - parsed;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

type Job = {
  id: string;
  external_id?: string | null;
  updated_at?: string;
  role: string;
  company: string;
  logo: string | null;
  location: string | null;
  experience: string | null;
  salary: string | null;
  employment_type: string | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  is_verified?: boolean | null;
  industry?: string | null;
  shift?: string | null;
  open_positions?: number | null;
  responsibilities?: string[] | null;
  required_skills?: string[] | null;
  preferred_skills?: string[] | null;
  benefits?: string[] | null;
  office_address?: string | null;
  company_overview?: string | null;
  company_website?: string | null;
  recruiter_whatsapp?: string | null;
  recruiter_notes?: string | null;
  application_deadline?: string | null;
};

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const EXPERIENCE_LEVELS = ["Fresher", "1-3 years", "3-5 years", "5+ years"];
const SALARY_RANGES = [
  { label: "Any", value: "any" },
  { label: "0 - 5 LPA", value: "0-5" },
  { label: "5 - 10 LPA", value: "5-10" },
  { label: "10 - 20 LPA", value: "10-20" },
  { label: "20+ LPA", value: "20+" },
];

const QUICK_TAGS = ["Remote", "Frontend", "Backend", "Design", "Data", "Marketing", "AI/ML", "Sales"];

const VERIFIED_JOB_OVERRIDES: Record<string, Partial<Job>> = {
  "assure-capital-insurance-advisor": {
    role: "Insurance Advisor",
    company: "Assure Capital",
    industry: "Insurance",
    location: "Delhi, India",
    salary: "15K - 30K / month",
    experience: "0-6 Years",
    employment_type: "Full-time",
    shift: "10 AM - 6 PM",
    open_positions: 59,
    description:
      "Join Assure Capital to help customers choose suitable life, motor, and health insurance plans while maintaining service quality.",
    responsibilities: [
      "Understand customer requirements and suggest policy options",
      "Handle end-to-end insurance application workflow",
      "Coordinate with internal underwriting and operations",
    ],
    required_skills: [
      "Good Communication Skills",
      "Positive Attitude",
      "Basic Calling and Follow-Up Skills",
    ],
    preferred_skills: ["Communication Skills", "Hindi + English", "MS Excel"],
    benefits: ["Health Insurance", "WFH Option", "Annual Bonus"],
    office_address: "Delhi, India",
    company_overview:
      "Assure Capital is a Delhi-based insurance company focused on dependable financial protection products.",
    company_website: null,
    recruiter_whatsapp: "919810001111",
    recruiter_notes: "Freshers are welcome. Training is provided in office.",
    application_deadline: "2026-09-15",
    created_at: "2026-06-10T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
  "apna-screening-network-sales-manager": {
    role: "Sales Manager",
    company: "Apna Screening Network",
    industry: "Advertising",
    location: "Delhi NCR",
    salary: "40,000 - 50,000 / month + 5,000 travel allowance",
    experience: "3-8 Years",
    employment_type: "Full-time",
    shift: "Day Shift",
    open_positions: 1,
    description:
      "Lead field sales operations, merchant acquisition, team performance, and business growth.",
    responsibilities: [
      "Manage Team Leaders and Field Sales Executives",
      "Monitor sales activities and merchant onboarding",
      "Conduct reviews and performance tracking",
      "Submit MIS and performance reports",
    ],
    required_skills: ["Field Sales Operations", "Team Handling", "CRM", "MIS Reporting"],
    preferred_skills: ["Merchant Acquisition", "Performance Tracking"],
    benefits: ["Health Insurance", "Travel Allowance", "Performance Incentives"],
    office_address: "Sector 18, Noida, Uttar Pradesh 201301",
    company_overview:
      "Apna Screening Network supports brands with scalable advertising operations and lead programs.",
    company_website: "https://www.apna.co",
    recruiter_whatsapp: "919810002222",
    recruiter_notes:
      "Team handling experience is mandatory. Includes a 7-day offline training and evaluation program, unpaid training, and mandatory registered and administrative office attendance.",
    application_deadline: "2026-08-30",
    created_at: "2026-06-14T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
  "apna-screening-network-team-leader": {
    role: "Team Leader (Field Sales)",
    company: "Apna Screening Network",
    industry: "Advertising",
    location: "Delhi NCR",
    salary: "30,000 - 40,000 / month + 5,000 travel allowance",
    experience: "3-8 Years",
    employment_type: "Full-time",
    shift: "10 AM - 6 PM",
    open_positions: 42,
    description:
      "Manage Team Leaders and Field Sales Executives while driving performance and reporting discipline.",
    responsibilities: [
      "Manage Team Leaders",
      "Field Sales Executives",
      "Conduct Reviews",
      "Performance Tracking",
      "Submit MIS",
      "Performance Reports",
    ],
    required_skills: ["Team Management", "Merchant Onboarding", "CRM Reporting"],
    preferred_skills: ["Sales Closures", "Target Achievement"],
    benefits: ["Travel Allowance", "Team Performance Incentives"],
    office_address: "Delhi NCR",
    company_overview:
      "Apna Screening Network delivers customer engagement operations with measurable outcomes.",
    company_website: null,
    recruiter_whatsapp: "919810002222",
    recruiter_notes:
      "Includes a 7-day offline training and evaluation program, unpaid training, and mandatory registered and administrative office attendance.",
    application_deadline: "2026-09-10",
    created_at: "2026-06-20T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
  "policy-meta-insurance-consultant": {
    role: "Insurance Consultant",
    company: "Policy Meta",
    industry: "Insurance",
    location: "Noida, Uttar Pradesh",
    salary: "15K - 30K Salary",
    experience: "0-6 Years",
    employment_type: "Full-time",
    shift: "10 AM - 6 PM",
    open_positions: 99,
    description:
      "Help customers choose policy options and assist with complete onboarding documentation.",
    responsibilities: [
      "Good Communication Skills",
      "Positive Attitude",
      "Basic Calling and Follow-Up Skills",
    ],
    required_skills: ["Insurance Advisory", "Client Follow-up"],
    preferred_skills: [
      "Cross-selling",
      "Channel Sales",
      "Communication Skills",
      "Target Achievement",
      "Hindi + English",
    ],
    benefits: ["Medical Insurance", "Performance Bonus"],
    office_address: "Noida Sector 3 G34 First Floor, Office No. - F2, Near Sector 16 Metro Station",
    company_overview:
      "Policy Meta connects customers with reliable insurance offerings and dedicated advisory support.",
    company_website: null,
    recruiter_whatsapp: "919810003333",
    recruiter_notes: "Candidate should be comfortable with phone and WhatsApp communication.",
    application_deadline: "2026-08-25",
    created_at: "2026-06-08T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
  "smile-india-trust-program-coordinator": {
    role: "Program Coordinator",
    company: "Smile India Trust",
    industry: "NGO",
    location: "Noida, Uttar Pradesh",
    salary: "15100 / month",
    experience: "0-6 Years",
    employment_type: "Full-time",
    shift: "10 AM - 6 PM",
    open_positions: 49,
    description:
      "Coordinate grassroots social programs and manage reporting across NGO initiatives.",
    responsibilities: [
      "Coordinate project timelines and volunteers",
      "Compile monthly impact reports",
      "Work with partner organizations",
    ],
    required_skills: ["Program Coordination", "Documentation", "Stakeholder Communication"],
    preferred_skills: ["NGO Experience", "Event Planning"],
    benefits: ["Health Insurance", "Learning Budget", "Impact Programs"],
    office_address: "Noida Sector 4, Nearby Sector 16 Metro Station",
    company_overview:
      "Smile India Trust drives social impact through education and community outreach programs.",
    company_website: null,
    recruiter_whatsapp: "919810004444",
    recruiter_notes: "Passion for social impact is important.",
    application_deadline: "2026-09-05",
    created_at: "2026-06-12T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
  "scaler-academy-counsellor": {
    role: "Business Development Associate (BDA)",
    company: "Scaler Academy",
    industry: "EdTech",
    location: "Gurugram, Haryana",
    salary: "Up to 5.5 LPA",
    experience: "0-6 Years",
    employment_type: "Full-time",
    shift: "12 PM - 9 PM",
    open_positions: 70,
    description:
      "Guide learners through suitable upskilling pathways and support admissions conversion.",
    responsibilities: ["Good Communication Skills", "Positive Attitude"],
    required_skills: ["Counselling", "Lead Nurturing"],
    preferred_skills: ["Communication Skills", "EdTech Experience", "CRM"],
    benefits: [
      "Health Insurance",
      "ESOPs",
      "Learning Budget",
      "Virtual Interview",
      "Week Off - Sunday and Monday",
    ],
    office_address:
      "Think Plan Workplace 18-B, Institutional Area, Sector 32, Gurugram, Haryana",
    company_overview:
      "Scaler Academy helps professionals level up software careers with intensive technology programs.",
    company_website: null,
    recruiter_whatsapp: "919810005555",
    recruiter_notes:
      "Excellent communication and a positive attitude are required. Complete in-office training and process support are provided. Virtual interview is available. Week off: Sunday and Monday.",
    application_deadline: "2026-09-20",
    created_at: "2026-06-18T00:00:00+00",
    updated_at: "2026-07-04T00:00:00+00",
  },
};

export function CareerSyncJobsSection({
  initialQuery = "",
  initialLocation = "",
}: { initialQuery?: string; initialLocation?: string } = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [empType, setEmpType] = useState<string>("");
  const [experience, setExperience] = useState<ExperienceBucket>("");
  const [salary, setSalary] = useState<SalaryBucket>("any");
  const [quickTag, setQuickTag] = useState<string>("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    setLocation(initialLocation);
  }, [initialQuery, initialLocation]);


  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const sharedJobs = await fetchPublicCareerSyncJobs();
        const data = sharedJobs.length ? sharedJobs : listCareerSyncApprovedJobs();
        if (!mounted) return;
        const normalized = ((data as Job[]) ?? []).slice(0, 60).map((job) => {
          const externalId = job.external_id ?? "";
          const override = VERIFIED_JOB_OVERRIDES[externalId];
          if (!override) return job;
          return { ...job, ...override };
        });
        setJobs(normalized);
      } catch (error) {
        console.warn("[CareerSync] Falling back to local jobs", error);
        if (!mounted) return;
        const normalized = ((listCareerSyncApprovedJobs() as Job[]) ?? []).slice(0, 60).map((job) => {
          const externalId = job.external_id ?? "";
          const override = VERIFIED_JOB_OVERRIDES[externalId];
          if (!override) return job;
          return { ...job, ...override };
        });
        setJobs(normalized);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filters = useMemo<Filters>(
    () => ({ query, location, employmentType: empType, experience, salary, quickTag }),
    [query, location, empType, experience, salary, quickTag],
  );
  const filtered = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);
  const hasFilters = hasAnyFilter(filters);


  const clearAll = () => {
    setQuery("");
    setLocation("");
    setEmpType("");
    setExperience("");
    setSalary("any");
    setQuickTag("");
  };

  return (
    <section id="jobs" className="relative py-24 px-4 sm:px-6 lg:px-8 scroll-mt-24">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-96 w-[80%] -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700 mb-4 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Live Job Board
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] leading-tight">
            Explore <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Open Roles</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Search, filter and apply to opportunities that match your skills — updated in real time.
          </p>
        </motion.div>

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-3xl bg-white/80 backdrop-blur-xl ring-1 ring-blue-100 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.35)] p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <FilterField icon={<Search className="h-4 w-4 text-blue-600" />} className="md:col-span-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keyword or company"
                className="w-full bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
              />
            </FilterField>

            <FilterField icon={<MapPin className="h-4 w-4 text-blue-600" />} className="md:col-span-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (city / remote)"
                className="w-full bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-gray-400 focus:outline-none"
              />
            </FilterField>

            <FilterSelect icon={<Briefcase className="h-4 w-4 text-blue-600" />} value={empType} onChange={setEmpType} placeholder="Job type" options={EMPLOYMENT_TYPES} className="md:col-span-2" />
            <FilterSelect icon={<GraduationCap className="h-4 w-4 text-blue-600" />} value={experience} onChange={(v) => setExperience(v as ExperienceBucket)} placeholder="Experience" options={EXPERIENCE_LEVELS} className="md:col-span-2" />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="md:col-span-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)]"
            >
              <Search className="h-4 w-4" />
              <span className="md:hidden">Search</span>
            </motion.button>
          </div>

          {/* Row 2: salary + quick tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide pr-1">
              <DollarSign className="h-3.5 w-3.5" /> Salary
            </div>
            {SALARY_RANGES.map((s) => (
              <FilterChip key={s.value} active={salary === s.value} onClick={() => setSalary(s.value as SalaryBucket)}>
                {s.label}
              </FilterChip>
            ))}
            <span className="mx-2 h-4 w-px bg-blue-100" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide pr-1">
              <Filter className="h-3.5 w-3.5" /> Quick
            </div>
            {QUICK_TAGS.map((t) => (
              <FilterChip key={t} active={quickTag === t} onClick={() => setQuickTag(quickTag === t ? "" : t)}>
                {t}
              </FilterChip>
            ))}

            {hasFilters && (
              <button
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition"
              >
                <X className="h-3.5 w-3.5" /> Clear all
              </button>
            )}
          </div>
        </motion.div>

        {/* Results header */}
        <div className="flex items-center justify-between mt-8 mb-4 px-1">
          <div className="text-sm font-semibold text-gray-500">
            {loading ? (
              "Loading roles…"
            ) : (
              <>
                <span className="text-[#0F172A] font-bold">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "role" : "roles"} available
              </>
            )}
          </div>
        </div>

        {/* Results */}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/70 ring-1 ring-blue-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={!!hasFilters} onClear={clearAll} />
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} onOpen={() => setSelected(job)} onApply={() => { setSelected(job); setApplyOpen(true); }} />
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="mt-10 flex justify-center">
              <a
                href="/careersync/jobs"
                target="_blank"
                rel="noopener"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-blue-200 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
              >
                See all jobs
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </>
        )}
      </div>

      <JobDetailModal
        job={selected && !applyOpen ? selected : null}
        onClose={() => setSelected(null)}
        onApply={() => setApplyOpen(true)}
      />
      <ApplyModal
        job={applyOpen ? selected : null}
        onClose={() => { setApplyOpen(false); setSelected(null); }}
      />
    </section>
  );
}

function FilterField({
  icon,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl bg-blue-50/60 ring-1 ring-blue-100 px-3.5 py-3 focus-within:ring-blue-400 focus-within:bg-white transition ${className}`}>
      {icon}
      {children}
    </div>
  );
}

function FilterSelect({
  icon,
  value,
  onChange,
  placeholder,
  options,
  className = "",
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl bg-blue-50/60 ring-1 ring-blue-100 px-3.5 py-3 focus-within:ring-blue-400 focus-within:bg-white transition ${className}`}>
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-[#0F172A] focus:outline-none appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${active
        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md ring-1 ring-blue-500"
        : "bg-white text-gray-600 ring-1 ring-blue-100 hover:ring-blue-300 hover:text-blue-600"
        }`}
    >
      {children}
    </motion.button>
  );
}

function JobCard({
  job,
  index,
  onOpen,
  onApply,
}: {
  job: Job;
  index: number;
  onOpen: () => void;
  onApply: () => void;
}) {
  const posted = timeAgo(job.created_at);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      className="group relative cursor-pointer rounded-2xl bg-white ring-1 ring-blue-100 p-5 shadow-[0_10px_30px_-20px_rgba(37,99,235,0.35)] hover:shadow-[0_25px_60px_-25px_rgba(37,99,235,0.5)] hover:ring-blue-300 transition-all overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-0 group-hover:opacity-70 blur-2xl transition-opacity duration-500" />

      {job.is_verified && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
          <BadgeCheck className="h-3 w-3" /> Verified
        </div>
      )}

      <div className="relative flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 ring-1 ring-blue-100 text-blue-600 font-black text-lg overflow-hidden">
          {job.logo ? (
            <img src={job.logo} alt={job.company} className="h-full w-full object-contain p-1.5" />
          ) : (
            (job.company || "?").charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1 pr-16">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Building2 className="h-3 w-3" /> <span className="truncate">{job.company}</span>
            {job.industry && <span className="text-gray-300">·</span>}
            {job.industry && <span className="truncate">{job.industry}</span>}
          </div>
          <h3 className="mt-0.5 text-base font-bold text-[#0F172A] leading-snug line-clamp-2">
            {job.role}
          </h3>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {job.employment_type && <Pill>{job.employment_type}</Pill>}
        {job.experience && <Pill>{job.experience}</Pill>}
        {job.shift && <Pill tone="cyan">{job.shift}</Pill>}
        {(job.tags ?? []).slice(0, 2).map((t) => (
          <Pill key={t} tone="cyan">{t}</Pill>
        ))}
      </div>

      {job.description && (
        <p className="relative mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="relative mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location ?? "Remote"}</div>
        {job.salary && <div className="font-bold text-emerald-600">{job.salary}</div>}
      </div>

      {typeof job.open_positions === "number" && job.open_positions > 0 && (
        <div className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
          <Users className="h-3 w-3" /> {job.open_positions} openings
        </div>
      )}

      <div className="relative mt-4 flex items-center justify-between border-t border-blue-50 pt-3">
        <div className="inline-flex items-center gap-1 text-[11px] text-gray-400">
          <Clock className="h-3 w-3" /> {posted}
        </div>
        <motion.button
          whileHover={{ x: 3 }}
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition"
        >
          Apply now <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.article>
  );
}



function Pill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "cyan" }) {
  const cls =
    tone === "cyan"
      ? "bg-cyan-50 text-cyan-700 ring-cyan-100"
      : "bg-blue-50 text-blue-700 ring-blue-100";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${cls}`}>
      {children}
    </span>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Empty message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-white ring-1 ring-blue-100 p-10 text-center overflow-hidden lg:col-span-3"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
        </div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-[0_20px_50px_-15px_rgba(37,99,235,0.6)]"
        >
          <Inbox className="h-9 w-9" />
        </motion.div>
        <h3 className="relative mt-6 text-2xl font-black text-[#0F172A]">
          {hasFilters ? "No matching roles yet" : "No open roles right now"}
        </h3>
        <p className="relative mt-2 text-gray-500 max-w-md mx-auto">
          {hasFilters
            ? "Try adjusting your filters — great matches are one tweak away."
            : "We're onboarding employers as we speak. Create your profile and be first in line when new jobs drop."}
        </p>
        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
          {hasFilters && (
            <button
              onClick={onClear}
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition"
            >
              Clear filters
            </button>
          )}
          <a
            href="#about"
            className="rounded-full bg-white ring-1 ring-blue-200 hover:ring-blue-400 px-5 py-2.5 text-sm font-bold text-[#0F172A] transition"
          >
            Learn how it works
          </a>
        </div>
      </motion.div>

      {/* HR / Post a Job info card */}
      <PostJobInfoCard />
    </div>
  );
}

function PostJobInfoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1e3a8a] to-[#0891b2] p-8 text-white shadow-[0_30px_80px_-30px_rgba(37,99,235,0.7)] lg:col-span-2"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-white/25">
          <Building2 className="h-3 w-3" /> For Employers
        </div>
        <h3 className="mt-4 text-2xl font-black leading-tight">
          Hiring? <span className="text-cyan-300">Post your first job</span> in minutes.
        </h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">
          List roles, source pre-screened candidates, and manage the pipeline — all free while we onboard.
        </p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {[
            "Detailed JD with skills, location & salary",
            "Choose Full-time, Contract, Remote or Internship",
            "AI-matched candidates delivered daily",
            "Live application tracking dashboard",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <CheckIcon />
              <span className="text-white/85">{t}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/signup"
            search={{ role: "company" }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#0F172A] px-4 py-2.5 text-xs font-black shadow-md hover:bg-cyan-50 transition"
          >
            <Building2 className="h-3.5 w-3.5" /> Sign up as Company
          </Link>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/30 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
          >
            Post a Job <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 text-[10px] text-white/50">
          Company accounts require a corporate email (no free providers).
        </div>
      </div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-400/25 ring-1 ring-cyan-300/40">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-cyan-200"><path fill="currentColor" d="M4.5 8.5L2 6l1-1 1.5 1.5L9 2l1 1z" /></svg>
    </span>
  );
}


/* ============================================================
   JOB DETAIL MODAL
   ============================================================ */
function JobDetailModal({
  job,
  onClose,
  onApply,
}: {
  job: Job | null;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <AnimatePresence>
      {job && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 sm:p-7 bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25 backdrop-blur transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-start gap-4 pr-10">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur ring-1 ring-white/30 text-white font-black text-xl overflow-hidden">
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    (job.company || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-white/85 text-sm font-medium">
                    <Building2 className="h-3.5 w-3.5" /> <span className="truncate">{job.company}</span>
                    {job.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/95 text-emerald-950 px-2 py-0.5 text-[10px] font-bold uppercase">
                        <BadgeCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-black leading-tight">{job.role}</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {job.location && <HeaderChip icon={<MapPin className="h-3 w-3" />}>{job.location}</HeaderChip>}
                    {job.employment_type && <HeaderChip icon={<Briefcase className="h-3 w-3" />}>{job.employment_type}</HeaderChip>}
                    {job.experience && <HeaderChip icon={<GraduationCap className="h-3 w-3" />}>{job.experience}</HeaderChip>}
                    {job.shift && <HeaderChip icon={<Clock className="h-3 w-3" />}>{job.shift}</HeaderChip>}
                    {job.salary && <HeaderChip icon={<DollarSign className="h-3 w-3" />}>{job.salary}</HeaderChip>}
                    {typeof job.open_positions === "number" && job.open_positions > 0 && (
                      <HeaderChip icon={<Users className="h-3 w-3" />}>{job.open_positions} openings</HeaderChip>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              <Section title="Job Details">
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Job ID: </span>
                    <span className="font-semibold text-slate-800">{job.external_id ?? job.id}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Position Name: </span>
                    <span className="font-semibold text-slate-800">{job.role}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Company: </span>
                    <span className="font-semibold text-slate-800">{job.company}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Industry: </span>
                    <span className="font-semibold text-slate-800">{job.industry ?? "Not provided"}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Employment Type: </span>
                    <span className="font-semibold text-slate-800">{job.employment_type ?? "Not provided"}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Shift: </span>
                    <span className="font-semibold text-slate-800">{job.shift ?? "Not provided"}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Experience: </span>
                    <span className="font-semibold text-slate-800">{job.experience ?? "Not provided"}</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Open Positions: </span>
                    <span className="font-semibold text-slate-800">{typeof job.open_positions === "number" ? job.open_positions : "Not provided"}</span>
                  </div>
                </div>
              </Section>

              {job.description && (
                <Section title="About the role">
                  <p className="text-slate-700 leading-relaxed">{job.description}</p>
                </Section>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <Section title="Responsibilities" icon={<ClipboardList className="h-4 w-4" />}>
                  <BulletList items={job.responsibilities} />
                </Section>
              )}

              {job.required_skills && job.required_skills.length > 0 && (
                <Section title="Required skills">
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((s) => (
                      <span key={s} className="rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-3 py-1 text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                </Section>
              )}

              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <Section title="Preferred skills">
                  <div className="flex flex-wrap gap-2">
                    {job.preferred_skills.map((s) => (
                      <span key={s} className="rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100 px-3 py-1 text-xs font-semibold">{s}</span>
                    ))}
                  </div>
                </Section>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <Section title="Benefits">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {job.benefits.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {b}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {(job.office_address || job.company_overview || job.company_website) && (
                <Section title={`About ${job.company}`}>
                  {job.company_overview && <p className="text-slate-700 leading-relaxed">{job.company_overview}</p>}
                  {job.office_address && (
                    <p className="mt-2 flex items-start gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" /> {job.office_address}</p>
                  )}
                  <div className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-slate-500">Company Website:</span>
                    {job.company_website ? (
                      <a href={job.company_website} target="_blank" rel="noopener" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                        {job.company_website} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="font-semibold text-slate-800">Not provided</span>
                    )}
                  </div>
                </Section>
              )}

              {job.recruiter_notes && (
                <Section title="Recruiter notes">
                  <p className="text-slate-700 leading-relaxed text-sm bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">
                    {job.recruiter_notes}
                  </p>
                </Section>
              )}

              <Section title="Recruiter contact">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2 text-sm">
                  <span className="text-slate-500">Recruiter WhatsApp: </span>
                  <span className="font-semibold text-slate-800">{job.recruiter_whatsapp ?? "Not provided"}</span>
                </div>
              </Section>

              {job.application_deadline && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Apply by <span className="font-semibold text-slate-900">
                    {new Date(job.application_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              )}

              <Section title="Posting Timeline">
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Job Posted Date: </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(job.created_at).toLocaleDateString("en-CA")}
                    </span>
                  </div>
                  <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
                    <span className="text-slate-500">Last Updated: </span>
                    <span className="font-semibold text-slate-800">
                      {new Date(job.updated_at ?? job.created_at).toLocaleDateString("en-CA")}
                    </span>
                  </div>
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-white p-4 sm:p-5 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Posted <span className="font-semibold text-slate-700">{timeAgo(job.created_at)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onApply}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(37,99,235,0.6)]"
                >
                  Apply now <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeaderChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/25 px-2.5 py-1 text-white/95 font-semibold">
      {icon}{children}
    </span>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
        {icon}{title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-700 leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shrink-0" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   APPLY MODAL — collects candidate info, saves to DB,
   opens WhatsApp deep link to the recruiter automatically
   ============================================================ */
function ApplyModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { user, isAuthed, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<{ path: string; url: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (user) {
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      setEmail(user.email ?? "");
      const guess =
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        (user.email ? user.email.split("@")[0] : "");
      setFullName(guess);
      const p = (typeof meta.phone === "string" && meta.phone) || "";
      setPhone(p);
    }
  }, [user]);

  useEffect(() => {
    if (!job) {
      setDone(false);
      setSubmitting(false);
      setCoverLetter("");
      setResume(null);
    }
  }, [job]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!job || !user) return;
    const name = fullName.trim();
    const mail = email.trim();
    const tel = phone.trim();
    if (name.length < 2 || name.length > 100) return toast.error("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) || mail.length > 255) return toast.error("Please enter a valid email.");
    if (tel && !/^[+\d][\d\s()-]{6,20}$/.test(tel)) return toast.error("Please enter a valid phone number.");
    if (!resume) return toast.error("Please upload your resume (PDF or Word).");
    if (coverLetter.length > 1500) return toast.error("Cover letter is too long.");

    setSubmitting(true);
    let submitError: string | null = null;
    try {
      applyCareerSyncJob({
        userId: user.id,
        jobId: job.id,
        fullName: name,
        email: mail,
        phone: tel || null,
        resumeUrl: resume.url,
        resumePath: resume.path,
        coverLetter: coverLetter.trim() || null,
      });
    } catch (error) {
      submitError = error instanceof Error ? error.message : "Could not submit application. Please try again.";
    }
    setSubmitting(false);
    if (submitError) {
      toast.error(submitError);
      return;
    }
    toast.success("Application submitted! Opening WhatsApp to notify the recruiter…");
    setDone(true);

    if (job.recruiter_whatsapp) {
      const digits = job.recruiter_whatsapp.replace(/\D/g, "");
      const msg =
        `Hello ${job.company} team,%0A%0A` +
        `I just applied for the *${encodeURIComponent(job.role)}* role via CareerSync (BechnaSeekho).%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Email: ${encodeURIComponent(mail)}%0A` +
        (tel ? `Phone: ${encodeURIComponent(tel)}%0A` : "") +
        `Resume: ${encodeURIComponent(resume.url)}%0A` +
        `%0ALooking forward to your response. Thank you!`;
      const url = `https://wa.me/${digits}?text=${msg}`;
      window.open(url, "_blank", "noopener");
    }
  }


  return (
    <AnimatePresence>
      {job && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 flex flex-col"
          >
            <div className="relative p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
              <button onClick={onClose} className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Apply for</p>
              <h3 className="mt-1 text-xl font-black leading-tight">{job.role}</h3>
              <p className="mt-1 text-sm text-white/90 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {job.company} · {job.location}</p>
            </div>

            {done ? (
              <div className="p-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h4 className="mt-4 text-xl font-black text-slate-900">Application submitted!</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Your application is safely recorded. We opened WhatsApp so you can send a quick intro to the recruiter — feel free to review the message before sending.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : !isAuthed ? (
              <div className="p-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <LogIn className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-lg font-black text-slate-900">Log in to apply</h4>
                <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
                  Create a free candidate account so your applications are saved and recruiters can respond to you.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <Link to="/login" search={{ role: "candidate" }} onClick={onClose} className="rounded-full bg-white ring-1 ring-blue-200 text-blue-700 px-5 py-2 text-sm font-semibold hover:bg-blue-50">Log in</Link>
                  <Link to="/signup" search={{ role: "candidate" }} onClick={onClose} className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-bold text-white shadow-md">Sign up free</Link>
                </div>
                {authLoading && <p className="mt-4 text-xs text-slate-400">Checking session…</p>}
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 space-y-4 overflow-y-auto">
                <Field label="Full name" required>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required
                    className="w-full rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white px-3.5 py-2.5 text-sm outline-none transition" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Email" required>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required
                      className="w-full rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white px-3.5 py-2.5 text-sm outline-none transition" />
                  </Field>
                  <Field label="Phone / WhatsApp">
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="+91 98xxxxxxxx"
                      className="w-full rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white px-3.5 py-2.5 text-sm outline-none transition" />
                  </Field>
                </div>
                <Field label="Resume" required>
                  <ResumeUpload userId={user!.id} value={resume} onChange={setResume} />
                </Field>

                <Field label="Why are you a great fit? (optional)">
                  <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={4} maxLength={1500}
                    placeholder="Tell the recruiter about your relevant experience…"
                    className="w-full rounded-xl bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white px-3.5 py-2.5 text-sm outline-none transition resize-none" />
                  <div className="mt-1 text-right text-[11px] text-slate-400">{coverLetter.length}/1500</div>
                </Field>

                {job.recruiter_whatsapp && (
                  <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
                    <Send className="h-4 w-4 mt-0.5 shrink-0" />
                    After submitting, we'll open WhatsApp with a pre-written intro so you can notify the recruiter with one tap.
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit application
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
