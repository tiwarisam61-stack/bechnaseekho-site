import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { absoluteUrl, breadcrumbSchema, canonicalLink, jsonLdScript } from "@/lib/seo";

type Section = { title: string; text: string; items: string[] };
type EmployerPage = {
  path: string;
  label: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  highlight: string;
  intro: string;
  sections: Section[];
  exampleTitle: string;
  example: string[];
  faqs: { question: string; answer: string }[];
};

export const employerPages = {
  employers: {
    path: "/employers",
    label: "For employers",
    title: "Post Jobs & Hire Employees in India | CareerSync",
    description:
      "Post jobs on CareerSync, review applications and share hiring updates on CareerFeed. Explore hiring tools for companies, HR teams and hiring managers.",
    eyebrow: "CAREERSYNC + CAREERFEED · FOR EMPLOYERS",
    heading: "Your next hire starts with",
    highlight: "a clear opportunity.",
    intro:
      "Give candidates a role they can understand and a place to apply. Publish reviewed job listings on CareerSync, then introduce your team and share the opportunity on CareerFeed.",
    sections: [
      {
        title: "Give every opening a proper home",
        text: "A hiring message can start interest. A detailed job listing gives candidates the information they need to apply.",
        items: [
          "Describe responsibilities, required skills and experience.",
          "State location, employment type and salary range.",
          "Submit the opening for review through an authorised recruiter account.",
        ],
      },
      {
        title: "Keep applications organised",
        text: "Use the CareerSync hiring workspace to review applicants and update hiring stages as your team makes decisions.",
        items: [
          "Review applications against the role requirements.",
          "Keep screening and interview progress in the hiring workflow.",
          "Close filled openings and keep live listings accurate.",
        ],
      },
      {
        title: "Let candidates meet the people behind the role",
        text: "Use CareerFeed to explain what your team does, share hiring context and answer candidate questions.",
        items: [
          "Share a hiring update with a link to the live job.",
          "Explain the work, team expectations and interview process.",
          "Invite relevant questions in the conversation.",
        ],
      },
    ],
    exampleTitle: "A job post candidates can act on",
    example: [
      "Role: Inside Sales Executive",
      "Location: Gurugram · Office-based",
      "Pay: Specify fixed monthly salary and incentives separately",
      "Experience: State whether freshers can apply",
      "Work: Explain the product, customer type and daily responsibilities",
      "Apply: Add the live CareerSync listing link",
    ],
    faqs: [
      {
        question: "How can my company post a job on CareerSync?",
        answer:
          "Create a company account using a work email. Complete the required company approval steps, then use an authorised recruiter account to submit the job. Listings are reviewed before public publication.",
      },
      {
        question: "Can I use CareerSync and CareerFeed together?",
        answer:
          "Yes. Publish the detailed job on CareerSync, then separately share a hiring update on CareerFeed with a link to that listing. Sharing to CareerFeed is a separate posting step.",
      },
      {
        question: "Is a personal Gmail address enough for company signup?",
        answer:
          "Company signup requires a work email domain. If you need help with your company account or approval, contact BechnaSeekho before submitting jobs.",
      },
      {
        question: "Does posting guarantee applicants or hires?",
        answer:
          "No. Results depend on the role, compensation, location, requirements and candidate interest. Clear details and timely recruiter follow-up help candidates make informed decisions.",
      },
    ],
  },
  hr: {
    path: "/for-hr-teams",
    label: "For HR teams",
    title: "Job Posting for HR Teams & Recruiters | CareerSync",
    description:
      "Create clear job listings, review applications and manage hiring stages with CareerSync. Share recruiter updates and answer candidate questions on CareerFeed.",
    eyebrow: "FOR HR TEAMS & TALENT ACQUISITION",
    heading: "Less hiring confusion.",
    highlight: "A clearer next step.",
    intro:
      "Turn a hiring brief into a structured opening. CareerSync helps HR teams publish reviewed jobs and organise applications, while CareerFeed gives recruiters a place to explain opportunities and answer questions.",
    sections: [
      {
        title: "Start with a brief your team agrees on",
        text: "Before publishing, separate essential requirements from preferences so candidates know what matters.",
        items: [
          "Confirm the role title, reporting line and essential skills.",
          "Agree on salary range, office location, shifts and joining expectations.",
          "Describe screening stages and who will review applications.",
        ],
      },
      {
        title: "Move from applications to decisions",
        text: "Use hiring-stage updates to keep your review process organised and your next action visible.",
        items: [
          "Screen applicants against the same role requirements.",
          "Update stages when candidates are shortlisted or interviewed.",
          "Review stalled applications and follow up with your hiring team.",
        ],
      },
      {
        title: "Answer repeated questions in one hiring conversation",
        text: "A CareerFeed hiring post can explain practical details that candidates often ask before applying.",
        items: [
          "Clarify shifts, work mode and interview arrangements.",
          "Link to the approved CareerSync opening.",
          "Keep private candidate documents out of public comments.",
        ],
      },
    ],
    exampleTitle: "Your pre-publication HR checklist",
    example: [
      "A searchable, accurate role title",
      "Fixed salary and variable pay explained",
      "Must-have skills separated from preferred skills",
      "Exact work location and shift expectations",
      "A realistic description of daily work",
      "An application route and clear selection stages",
    ],
    faqs: [
      {
        question: "Who is this hiring workflow for?",
        answer:
          "It is for HR professionals, talent acquisition teams and authorised company recruiters who need to publish openings and review applications. Company approval and account permissions apply.",
      },
      {
        question: "Can HR teams track application stages?",
        answer:
          "CareerSync provides a hiring workflow for reviewing applications and updating stages. Recruiters should keep those stages current as screening and interviews progress.",
      },
      {
        question: "What should HR include in a hiring post on CareerFeed?",
        answer:
          "Include the role, company, location, experience requirements, compensation context and the live CareerSync application link. Use comments for general questions, not for collecting sensitive candidate documents.",
      },
    ],
  },
  managers: {
    path: "/for-hiring-managers",
    label: "For hiring managers",
    title: "Hire for Your Team: Hiring Manager Guide | CareerSync",
    description:
      "Define the skills your team needs, write a practical hiring brief and work with your recruiter to post jobs on CareerSync. Introduce your team on CareerFeed.",
    eyebrow: "FOR TEAM LEADS & HIRING MANAGERS",
    heading: "You know the work.",
    highlight: "Help candidates see it.",
    intro:
      "Translate your team's hiring needs into a role people can understand. Define the work, agree on essential skills and partner with an authorised recruiter to publish your opening on CareerSync.",
    sections: [
      {
        title: "Describe success in the role",
        text: "A useful brief starts with what someone will actually do after joining your team.",
        items: [
          "List the main tasks and the customers or colleagues involved.",
          "Explain what a successful first month would look like.",
          "Identify skills needed on day one and skills you can teach.",
        ],
      },
      {
        title: "Give your recruiter a practical screening brief",
        text: "Clear selection criteria make it easier to discuss applicants and focus interviews.",
        items: [
          "Choose a small set of job-relevant screening questions.",
          "Agree on experience, location and availability requirements.",
          "Review applications consistently and share timely decisions.",
        ],
      },
      {
        title: "Introduce your team through CareerFeed",
        text: "Help interested candidates understand the manager, expectations and team behind a vacancy.",
        items: [
          "Explain why you are hiring and what the team is building.",
          "Describe support and learning available to a new joiner.",
          "Share the approved job link and answer role-specific questions.",
        ],
      },
    ],
    exampleTitle: "Example brief: customer support executive",
    example: [
      "Daily work: Handle customer queries and document resolutions",
      "Essential skills: Listening, clear writing and problem solving",
      "Training: Explain product training available after joining",
      "Conditions: State office location, shifts and weekly offs",
      "Interview: Discuss a fictional customer scenario",
      "Success: Define quality expectations and escalation responsibilities",
    ],
    faqs: [
      {
        question: "Can a hiring manager post directly?",
        answer:
          "Job posting depends on your account permissions and company approval. Work with your company's authorised recruiter, or create a company account and complete the required approval steps.",
      },
      {
        question: "What should I send HR before they publish a vacancy?",
        answer:
          "Send the role purpose, daily tasks, essential skills, salary range, work conditions and selection criteria. Explain which requirements are flexible so suitable candidates are not discouraged unnecessarily.",
      },
      {
        question: "Can I explain my team's work on CareerFeed?",
        answer:
          "Yes. Sign in to share a post about your team and the opportunity. Link to the live job listing so candidates have a clear application route.",
      },
    ],
  },
  feed: {
    path: "/careerfeed-for-recruiters",
    label: "CareerFeed for recruiters",
    title: "Share Hiring Posts & Connect with Candidates | CareerFeed",
    description:
      "Share hiring updates on CareerFeed, introduce your company and answer candidate questions. Link your posts to CareerSync jobs so interested candidates can apply.",
    eyebrow: "CAREERFEED · FOR RECRUITERS & COMPANIES",
    heading: "Put a human voice",
    highlight: "behind your hiring.",
    intro:
      "Tell candidates why the opportunity matters. Share hiring updates, introduce your team and answer career questions on CareerFeed. Connect each vacancy post to its CareerSync listing for applications.",
    sections: [
      {
        title: "Write a hiring update with useful details",
        text: "Make the first few lines count: tell readers who you need, where the role is based and what the work involves.",
        items: [
          "Use the Hiring post type for a hiring announcement.",
          "Include role, location, experience and compensation details.",
          "Add a live application link and keep the post current.",
        ],
      },
      {
        title: "Build familiarity between openings",
        text: "Give people reasons to understand and remember your company beyond a vacancy announcement.",
        items: [
          "Share an honest description of a typical working day.",
          "Introduce team members with their permission.",
          "Explain your interview process and offer practical preparation tips.",
        ],
      },
      {
        title: "Make the conversation useful",
        text: "Help readers decide whether an opening fits them, then direct applications into the formal hiring workflow.",
        items: [
          "Answer questions about responsibilities and eligibility.",
          "Offer clear application guidance instead of asking for public phone numbers.",
          "Update the discussion when the opening has closed.",
        ],
      },
    ],
    exampleTitle: "A hiring update you can adapt",
    example: [
      "We're hiring a [role] at [company] in [location].",
      "You'll work on [main responsibilities].",
      "We're looking for [essential skills / experience].",
      "Salary: [fixed range] + [variable pay, if any].",
      "Work mode and shifts: [details].",
      "View the full role and apply: [live CareerSync job link].",
    ],
    faqs: [
      {
        question: "How do I share a hiring post on CareerFeed?",
        answer:
          "Open CareerFeed, sign in and create a post. Choose the Hiring post type, add accurate role details and include the application link. Review your post before publishing.",
      },
      {
        question: "Does a CareerFeed post create a CareerSync job automatically?",
        answer:
          "No. Create and publish the job through CareerSync's approval workflow, then separately share its link in your CareerFeed post.",
      },
      {
        question: "Can people read CareerFeed without signing in?",
        answer:
          "Public CareerFeed discussions can be read without signing in. Posting, commenting and reacting require login.",
      },
      {
        question: "Should candidates leave their resumes in comments?",
        answer:
          "Direct candidates to the job's application route. Public comments are better used for general questions; candidates should avoid posting resumes, phone numbers or other sensitive details publicly.",
      },
    ],
  },
} satisfies Record<string, EmployerPage>;

export type EmployerPageKey = keyof typeof employerPages;

export function employerPageHead(key: EmployerPageKey) {
  const page = employerPages[key];
  return {
    meta: [
      { title: page.title },
      { name: "description", content: page.description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl(page.path) },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: page.description },
    ],
    links: canonicalLink(page.path),
    scripts: jsonLdScript(`employer-${key}-schema`, {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": absoluteUrl(page.path),
          url: absoluteUrl(page.path),
          name: page.title,
          description: page.description,
          inLanguage: "en-IN",
          publisher: { "@id": absoluteUrl("/#organization") },
        },
        breadcrumbSchema([
          { name: "Home", path: "/" },
          ...(key === "employers" ? [] : [{ name: "For employers", path: "/employers" }]),
          { name: page.label, path: page.path },
        ]),
      ],
    }),
  };
}

const primaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700";
const secondaryClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700";

export function EmployerLandingPage({ pageKey }: { pageKey: EmployerPageKey }) {
  const page = employerPages[pageKey];
  const feed = pageKey === "feed";
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#employer-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="employer-content" className="pt-28">
        <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_1fr] lg:py-24">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-8 flex flex-wrap gap-2 text-sm text-slate-600"
              >
                <a href="/">Home</a>
                <span aria-hidden="true">/</span>
                {pageKey !== "employers" && (
                  <>
                    <a href="/employers">For employers</a>
                    <span aria-hidden="true">/</span>
                  </>
                )}
                <span aria-current="page">{page.label}</span>
              </nav>
              <p className="text-xs font-bold tracking-[0.12em] text-blue-800">{page.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {page.heading} <span className="text-blue-700">{page.highlight}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={feed ? "/careerfeed" : "/post-job"} className={primaryClass}>
                  {feed ? "Share a hiring update" : "Post a job on CareerSync"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="/signup?role=company" className={secondaryClass}>
                  Create company account
                </a>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {feed
                  ? "Sign in to post. Link to a published job for applications."
                  : "New here? Start with a company account and work email. Company approval and job review apply."}
              </p>
            </div>
            <aside className="self-center rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-blue-900/5">
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                THE CONNECTED HIRING JOURNEY
              </span>
              <h2 className="mt-5 text-2xl font-bold">One role. Two ways to connect.</h2>
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <BriefcaseBusiness
                    className="mt-1 h-6 w-6 shrink-0 text-blue-700"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-bold">CareerSync</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Publish a reviewed job and manage applications through the hiring workspace.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageSquare
                    className="mt-1 h-6 w-6 shrink-0 text-blue-700"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-bold">CareerFeed</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      Share the job link, introduce your team and answer candidate questions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <p>Job publication and community sharing are separate steps.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
          <h2 className="text-3xl font-bold">
            {feed ? "How to share a hiring post on CareerFeed" : "How to post a job on CareerSync"}
          </h2>
          <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(feed
              ? [
                  ["Sign in", "Open CareerFeed and sign in to your account."],
                  ["Choose Hiring", "Create a post and select the Hiring post type."],
                  [
                    "Add the opportunity",
                    "Explain the role and link to the published CareerSync job.",
                  ],
                  [
                    "Publish and respond",
                    "Review your details, publish and answer candidate questions.",
                  ],
                ]
              : [
                  ["Create your account", "Use your company work email to start company signup."],
                  [
                    "Complete approval",
                    "Complete company approval and use an authorised recruiter account.",
                  ],
                  [
                    "Submit your job",
                    "Add responsibilities, requirements, salary and location for review.",
                  ],
                  [
                    "Review applications",
                    "After publication, review applicants and update hiring stages.",
                  ],
                ]
            ).map(([title, text], index) => (
              <li key={title} className="border-l-2 border-blue-200 pl-4">
                <p className="text-xs font-bold text-blue-700">STEP {index + 1}</p>
                <h3 className="mt-2 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          aria-label="Hiring guidance"
          className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3"
        >
          {page.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <p className="text-sm font-bold text-blue-700">0{index + 1}</p>
              <h2 className="mt-4 text-xl font-bold">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{section.text}</p>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed">
                    <CheckCircle2
                      className="mt-1 h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <div className="grid gap-8 rounded-3xl bg-slate-900 p-7 text-white sm:p-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-blue-200">
                PRACTICAL STARTING POINT
              </p>
              <h2 className="mt-3 text-3xl font-bold">{page.exampleTitle}</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Use this as a guide. Replace example details with accurate information about your
                actual opening before publishing.
              </p>
            </div>
            <ul className="space-y-3">
              {page.example.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm leading-relaxed text-slate-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
          <h2 className="text-3xl font-bold">Questions before you start?</h2>
          <div className="mt-6 space-y-3">
            {page.faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="border-y border-blue-100 bg-blue-50 px-5 py-14 text-center">
          <h2 className="text-3xl font-bold">Give your next opening a clear next step.</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Publish the role on CareerSync. Bring the conversation to CareerFeed.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/post-job" className={primaryClass}>
              Post a job
            </a>
            <a href="/careerfeed" className={secondaryClass}>
              Open CareerFeed
            </a>
          </div>
          <p className="mt-5 text-sm">
            <a href="/pricing" className="underline underline-offset-4">
              View current pricing
            </a>
            <span className="px-3" aria-hidden="true">
              ·
            </span>
            <a href="/contact" className="underline underline-offset-4">
              Get help with company approval
            </a>
          </p>
        </section>
        <nav aria-label="Employer resources" className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <h2 className="text-lg font-bold">Explore hiring resources</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(employerPages)
              .filter(([key]) => key !== pageKey)
              .map(([key, item]) => (
                <a
                  key={key}
                  href={item.path}
                  className="rounded-xl border border-slate-200 bg-white p-4 font-semibold text-blue-800 hover:border-blue-400"
                >
                  {item.label} <span aria-hidden="true">→</span>
                </a>
              ))}
          </div>
        </nav>
      </main>
      <Footer />
    </div>
  );
}
