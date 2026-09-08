import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
    ArrowRight,
    Award,
    BookOpen,
    Briefcase,
    CheckCircle2,
    Clock3,
    FileText,
    Layers,
    MessageSquare,
    Rocket,
    ShieldCheck,
    Target,
    TrendingUp,
    UserCheck,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

type Course = {
    id: string;
    title: string;
    description: string;
    topics: string[];
    level: SkillLevel;
    duration: string;
    modules: number;
    category: string;
    icon: LucideIcon;
    overview: string;
    outcomes: string[];
    keySkills: string[];
    careerOpportunities: string[];
    whoShouldEnroll: string[];
    requirements: string[];
    certificate: string;
};

const COURSES: Course[] = [
    {
        id: "cold-calling-mastery",
        title: "Cold Calling Mastery",
        description:
            "Master the complete process of cold calling, handling objections, building confidence, creating sales conversations, and converting prospects into customers.",
        topics: ["Introduction", "Call Preparation", "Opening Script", "Objection Handling", "Closing Techniques", "Follow-up Strategy"],
        level: "Beginner",
        duration: "3 Hours",
        modules: 12,
        category: "Sales Communication",
        icon: MessageSquare,
        overview:
            "This course gives you a clear, repeatable cold-calling framework so you can start conversations confidently, keep prospects engaged, and move more calls toward qualified next steps.",
        outcomes: [
            "Build call plans for different customer personas",
            "Handle objections without sounding scripted",
            "Use confidence techniques to reduce call hesitation",
            "Close calls with clear follow-up actions",
        ],
        keySkills: ["Call Structuring", "Objection Management", "Active Listening", "Persuasion"],
        careerOpportunities: ["Sales Executive", "Inside Sales Associate", "Business Development Associate"],
        whoShouldEnroll: ["Students", "Freshers", "Early-stage sales professionals", "Freelancers offering sales services"],
        requirements: ["Basic communication in English or Hindi", "Smartphone or laptop", "Willingness to practice call scripts"],
        certificate: "Industry-aligned completion certificate with practical call-assessment checklist.",
    },
    {
        id: "sales-closing-techniques",
        title: "Sales & Closing Techniques",
        description:
            "Learn modern sales psychology, customer behavior, negotiation, value selling, and professional closing strategies.",
        topics: ["Sales Funnel", "Customer Psychology", "Need Analysis", "Negotiation", "Closing", "Upselling"],
        level: "Intermediate",
        duration: "5 Hours",
        modules: 18,
        category: "Revenue Growth",
        icon: Target,
        overview:
            "A structured course focused on high-conversion selling, from discovery to upsell. You will learn how to diagnose buyer intent and close ethically with value-first conversations.",
        outcomes: [
            "Map buyer behavior across funnel stages",
            "Lead discovery calls using need-analysis templates",
            "Apply negotiation tactics in real scenarios",
            "Close and upsell using trust-based frameworks",
        ],
        keySkills: ["Consultative Selling", "Negotiation", "Value Positioning", "Pipeline Management"],
        careerOpportunities: ["Sales Consultant", "Account Executive", "Revenue Associate"],
        whoShouldEnroll: ["Sales professionals", "Founders", "Business development teams", "Career switchers to sales"],
        requirements: ["Basic sales exposure recommended", "Ability to present product value", "Interest in B2B and B2C sales"],
        certificate: "Verified certificate with scoring rubric on funnel strategy and closing simulation.",
    },
    {
        id: "hr-recruitment-essentials",
        title: "HR Recruitment Essentials",
        description:
            "Understand hiring processes, candidate screening, interviewing, onboarding, ATS systems, and recruitment workflows.",
        topics: ["Candidate Sourcing", "Resume Screening", "ATS", "Interview Process", "Offer Letter", "Onboarding"],
        level: "Beginner",
        duration: "4 Hours",
        modules: 15,
        category: "Human Resources",
        icon: Users,
        overview:
            "Learn end-to-end recruitment with practical templates used by growing companies. From sourcing to onboarding, each module is built around workflow clarity and speed.",
        outcomes: [
            "Source candidates through job boards and referrals",
            "Screen resumes with objective criteria",
            "Set up ATS-friendly hiring pipelines",
            "Run structured interviews and smooth onboarding",
        ],
        keySkills: ["Talent Sourcing", "ATS Operations", "Interview Coordination", "Hiring Documentation"],
        careerOpportunities: ["HR Recruiter", "Talent Acquisition Coordinator", "HR Operations Associate"],
        whoShouldEnroll: ["HR freshers", "Office administrators", "Startup founders", "Recruitment interns"],
        requirements: ["No prior HR experience required", "Comfort using spreadsheets and docs", "Basic workplace communication"],
        certificate: "Certificate includes recruiter toolkit references and interview scorecard templates.",
    },
    {
        id: "communication-skills",
        title: "Communication Skills",
        description:
            "Develop professional communication, confidence, presentation skills, and workplace etiquette.",
        topics: ["Business Communication", "Email Writing", "Verbal Skills", "Listening", "Confidence", "Public Speaking"],
        level: "Beginner",
        duration: "3 Hours",
        modules: 14,
        category: "Career Development",
        icon: FileText,
        overview:
            "A practical communication bootcamp to improve workplace conversations, business writing, and confidence in meetings, interviews, and presentations.",
        outcomes: [
            "Write clear professional emails and messages",
            "Improve verbal clarity in meetings and interviews",
            "Practice active listening frameworks",
            "Present ideas confidently with structured storytelling",
        ],
        keySkills: ["Business Writing", "Verbal Fluency", "Presentation", "Professional Etiquette"],
        careerOpportunities: ["Customer Support Executive", "Operations Associate", "Client Service Executive"],
        whoShouldEnroll: ["Students", "Job seekers", "Early professionals", "Anyone improving confidence"],
        requirements: ["No prerequisites", "Notebook for communication drills", "Commitment to weekly practice"],
        certificate: "Completion certificate with communication score-improvement milestones.",
    },
    {
        id: "lead-generation",
        title: "Lead Generation",
        description:
            "Learn modern online and offline lead generation strategies used by startups and enterprise businesses.",
        topics: ["LinkedIn Leads", "Email Prospecting", "Cold Outreach", "CRM", "Lead Qualification"],
        level: "Intermediate",
        duration: "4 Hours",
        modules: 16,
        category: "Digital Sales",
        icon: TrendingUp,
        overview:
            "This course teaches demand creation and lead qualification methods that convert outreach into real opportunities, with practical CRM workflows and message templates.",
        outcomes: [
            "Build qualified lead lists with ICP filters",
            "Write outreach messages that earn replies",
            "Track leads across CRM stages",
            "Score and prioritize high-intent prospects",
        ],
        keySkills: ["Prospecting", "Outreach Writing", "CRM Tracking", "Qualification"],
        careerOpportunities: ["Lead Generation Specialist", "Growth Associate", "SDR"],
        whoShouldEnroll: ["Sales teams", "Marketing interns", "Agency professionals", "Startup operators"],
        requirements: ["Basic knowledge of LinkedIn and email", "Interest in B2B growth", "Spreadsheet familiarity"],
        certificate: "Certificate plus outreach frameworks and lead-qualification playbook.",
    },
    {
        id: "interview-preparation",
        title: "Interview Preparation",
        description:
            "Prepare for interviews with HR questions, technical interviews, communication tips, confidence-building, and mock interview guidance.",
        topics: ["Resume", "HR Questions", "Technical Round", "Confidence", "Salary Negotiation"],
        level: "Beginner",
        duration: "3 Hours",
        modules: 13,
        category: "Placement Readiness",
        icon: UserCheck,
        overview:
            "A complete interview readiness path with mock scenarios and proven answer frameworks to help you perform confidently across HR and technical rounds.",
        outcomes: [
            "Create role-aligned resume narratives",
            "Answer common HR and technical questions with structure",
            "Handle interview stress with confidence routines",
            "Negotiate salary professionally",
        ],
        keySkills: ["Interview Strategy", "Self-Presentation", "Salary Discussion", "Mock Practice"],
        careerOpportunities: ["Improved placement outcomes", "Faster interview conversions", "Stronger role-fit communication"],
        whoShouldEnroll: ["Final-year students", "Fresh graduates", "Working professionals changing roles"],
        requirements: ["Updated resume draft", "Target job role clarity", "Commitment to mock interview practice"],
        certificate: "Certificate includes interview-readiness evaluation checklist.",
    },
    {
        id: "freelancing-blueprint",
        title: "Freelancing Blueprint",
        description:
            "Learn how to start freelancing on Fiverr, Upwork, LinkedIn, and other platforms while building a strong client portfolio.",
        topics: ["Profile Setup", "Portfolio", "Client Acquisition", "Proposal Writing", "Payments"],
        level: "Beginner",
        duration: "5 Hours",
        modules: 20,
        category: "Freelancing & Remote Work",
        icon: Briefcase,
        overview:
            "A step-by-step freelancing roadmap that helps you define services, build authority, win clients, and deliver projects professionally across platforms.",
        outcomes: [
            "Create conversion-focused freelancer profiles",
            "Build niche portfolio case studies",
            "Write proposals that stand out",
            "Set pricing and payment workflows confidently",
        ],
        keySkills: ["Client Acquisition", "Proposal Writing", "Personal Branding", "Delivery Workflow"],
        careerOpportunities: ["Freelance Consultant", "Remote Project Specialist", "Independent Service Provider"],
        whoShouldEnroll: ["Students", "Part-time earners", "Career break returners", "Creators and consultants"],
        requirements: ["Laptop with internet", "Defined skill area", "Willingness to build portfolio samples"],
        certificate: "Completion certificate with freelancing profile and proposal audit framework.",
    },
    {
        id: "business-development",
        title: "Business Development",
        description:
            "Understand client acquisition, partnerships, sales growth, networking, relationship management, and business expansion.",
        topics: ["Prospecting", "Meetings", "Negotiation", "CRM", "Growth Strategy"],
        level: "Advanced",
        duration: "6 Hours",
        modules: 22,
        category: "Business Strategy",
        icon: Rocket,
        overview:
            "An advanced program for building scalable growth engines through strategic prospecting, partnership design, enterprise conversations, and long-term account growth.",
        outcomes: [
            "Build multi-channel business development plans",
            "Run high-value discovery and partnership meetings",
            "Design sustainable growth strategy with metrics",
            "Improve retention through relationship systems",
        ],
        keySkills: ["Strategic Prospecting", "Partnership Building", "Growth Planning", "Account Expansion"],
        careerOpportunities: ["Business Development Manager", "Partnerships Lead", "Growth Strategy Associate"],
        whoShouldEnroll: ["Experienced sales professionals", "Startup founders", "Team leads", "Growth managers"],
        requirements: ["Prior sales or client-facing experience", "Basic CRM understanding", "Goal-oriented mindset"],
        certificate: "Advanced certificate with capstone strategy review.",
    },
];

function levelClasses(level: SkillLevel) {
    if (level === "Beginner") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (level === "Intermediate") return "bg-amber-50 text-amber-700 ring-amber-200";
    return "bg-violet-50 text-violet-700 ring-violet-200";
}

function outcomePairs(course: Course) {
    return [
        { title: "Course Overview", body: course.overview },
        { title: "Learning Outcomes", list: course.outcomes },
        { title: "Key Skills", list: course.keySkills },
        { title: "Career Opportunities", list: course.careerOpportunities },
        { title: "Who Should Enroll", list: course.whoShouldEnroll },
        { title: "Requirements", list: course.requirements },
        { title: "Certificate Information", body: course.certificate },
    ];
}

export function CoursesSection() {
    const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
    const { ref: counterRef, value: courseCount } = useCountUp(COURSES.length, 1.3);
    const totalModules = useMemo(
        () => COURSES.reduce((sum, course) => sum + course.modules, 0),
        [],
    );

    return (
        <section id="courses" className="relative overflow-hidden py-24 sm:py-28" aria-label="Professional learning courses">
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.99_0.01_250),oklch(0.98_0.02_270)_55%,oklch(0.99_0.01_250))]" />
                <div className="course-ambient absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
                <div className="course-ambient absolute right-0 top-24 h-72 w-72 rounded-full bg-brand-2/10 blur-3xl" style={{ animationDelay: "1.2s" }} />
                <div className="course-ambient absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" style={{ animationDelay: "2.2s" }} />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-70px" }}
                    transition={{ duration: 0.55 }}
                    className="mx-auto max-w-4xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-line backdrop-blur">
                        <BookOpen className="h-3.5 w-3.5 text-brand" />
                        Professional Learning Hub
                    </span>

                    <h2 className="mt-5 font-display text-3xl font-black tracking-tight text-ink sm:text-5xl">
                        Upgrade Your Skills with <span className="text-gradient-brand">Industry-Focused Courses</span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
                        Learn practical business, sales, communication, HR, recruitment, freelancing, and career skills through structured,
                        easy-to-understand learning modules designed for students, freshers, job seekers, professionals, and entrepreneurs.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-ink ring-1 ring-line backdrop-blur">
                            <span ref={counterRef} className="font-numeric text-sm font-black text-brand">{Math.round(courseCount)}</span>
                            Total Courses
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-ink ring-1 ring-line backdrop-blur">
                            <Layers className="h-3.5 w-3.5 text-brand-2" />
                            {totalModules}+ Modules
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-xs font-semibold text-ink ring-1 ring-line backdrop-blur">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
                            Certificate Included
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {COURSES.map((course, index) => {
                        const isOpen = activeCourseId === course.id;
                        const Icon = course.icon;

                        return (
                            <motion.article
                                key={course.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.45, delay: index * 0.05 }}
                                whileHover={{ y: -7 }}
                                className="group relative overflow-hidden rounded-[18px] bg-white/70 p-5 ring-1 ring-line backdrop-blur-xl transition-all duration-300 hover:shadow-[0_24px_50px_-22px_oklch(0.55_0.22_264/0.42)] hover:ring-brand/45"
                            >
                                <span className="pointer-events-none absolute inset-0 -z-10 rounded-[18px] bg-[radial-gradient(circle_at_85%_15%,oklch(0.9_0.1_265/.28),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="flex items-start justify-between gap-3">
                                    <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand/85 to-brand-2/85 text-white shadow-[0_12px_28px_-12px_oklch(0.55_0.22_264/0.75)]">
                                        <Icon className="h-5 w-5 course-icon-float" />
                                    </div>
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${levelClasses(course.level)}`}>
                                        {course.level}
                                    </span>
                                </div>

                                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">{course.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{course.description}</p>

                                <div className="mt-4 grid grid-cols-2 gap-2.5">
                                    <Pill icon={Clock3} label={course.duration} />
                                    <Pill icon={Layers} label={`${course.modules} Modules`} />
                                    <Pill icon={Award} label="Certificate" />
                                    <Pill icon={Briefcase} label={course.category} />
                                </div>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {course.topics.map((topic) => (
                                        <span key={topic} className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-soft ring-1 ring-line/80">
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveCourseId(isOpen ? null : course.id)}
                                    className="group/readmore relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-2 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_14px_30px_-12px_oklch(0.55_0.22_264/0.7)]"
                                >
                                    <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/readmore:opacity-100 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.38),transparent_48%)]" />
                                    {isOpen ? "Show Less" : "Read More"}
                                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-90" : "group-hover/readmore:translate-x-0.5"}`} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                            transition={{ duration: 0.28, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-line">
                                                {outcomePairs(course).map((section) => (
                                                    <div key={section.title} className="mb-3 last:mb-0">
                                                        <p className="text-xs font-bold uppercase tracking-wide text-brand">{section.title}</p>
                                                        {"body" in section ? (
                                                            <p className="mt-1.5 text-sm text-ink-soft">{section.body}</p>
                                                        ) : (
                                                            <ul className="mt-1.5 space-y-1.5">
                                                                {section.list.map((item) => (
                                                                    <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                                                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                                                                        <span>{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.article>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="relative mt-16 overflow-hidden rounded-[24px] bg-white/75 p-7 ring-1 ring-line shadow-[0_26px_60px_-32px_oklch(0.55_0.22_264/0.35)] backdrop-blur-xl sm:p-9"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_220px_at_10%_0%,oklch(0.9_0.1_265/.3),transparent_65%),radial-gradient(700px_220px_at_90%_100%,oklch(0.9_0.08_200/.24),transparent_62%)]" />

                    <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl">Start Learning. Start Growing.</h3>
                            <p className="mt-2 max-w-2xl text-sm text-ink-soft sm:text-base">
                                Build practical skills that help you get hired faster, perform better at work, and grow your career with industry-focused learning.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            <Link
                                to="/bechnaseekho"
                                className="group/cta1 relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_14px_30px_-12px_oklch(0.55_0.22_264/0.7)]"
                            >
                                <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/cta1:opacity-100 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent_45%)]" />
                                Explore All Courses
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta1:translate-x-0.5" />
                            </Link>

                            <Link
                                to="/about"
                                className="group/cta2 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-brand/45 hover:text-brand"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
        @keyframes course-ambient {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -12px, 0) scale(1.06); }
        }

        @keyframes course-icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .course-ambient {
          animation: course-ambient 8s ease-in-out infinite;
        }

        .course-icon-float {
          animation: course-icon-float 2.8s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}

function Pill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
    return (
        <div className="inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1.5 text-[11px] font-medium text-ink-soft ring-1 ring-line/80">
            <Icon className="h-3.5 w-3.5 text-brand" />
            <span className="truncate">{label}</span>
        </div>
    );
}
