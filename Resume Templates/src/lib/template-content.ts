import type { ResumeProfile, ResumeSection } from "./resume-types";
const uid = () => Math.random().toString(36).slice(2, 10);

export interface RoleItem {
  title: string;
  subtitle?: string;
  meta?: string;
  location?: string;
  bullets?: string[];
}

export interface RoleContent {
  profile: ResumeProfile;
  summary: string;
  skills: string[];
  softSkills: string[];
  experience: RoleItem[];
  projects: RoleItem[];
  education: RoleItem[];
  certifications: RoleItem[];
  achievements: string[];
  languages: string[];
}

const p = (
  fullName: string,
  headline: string,
  email: string,
  phone: string,
  location: string,
  linkedin: string,
  github = "",
  portfolio = "",
): ResumeProfile => ({
  fullName,
  headline,
  email,
  phone,
  location,
  linkedin,
  github,
  portfolio,
});

export const ROLE_CONTENT: Record<string, RoleContent> = {
  "software-engineer": {
    profile: p(
      "Aarav Sharma",
      "Software Engineer",
      "aarav.sharma@email.com",
      "+91 98765 43210",
      "Bengaluru, India",
      "linkedin.com/in/aaravsharma",
      "github.com/aaravsharma",
      "aaravsharma.dev",
    ),
    summary:
      "Software Engineer with 5+ years building scalable, test-driven web platforms in Java and TypeScript. Delivered microservices handling 40M+ requests per day, reduced p95 latency by 46%, and mentored 5 engineers across two product teams.",
    skills: [
      "Java",
      "Spring Boot",
      "TypeScript",
      "React",
      "Node.js",
      "REST APIs",
      "Microservices",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Docker",
      "Kubernetes",
      "AWS",
      "CI/CD",
      "JUnit",
      "Git",
    ],
    softSkills: ["Ownership", "Code review", "Mentoring", "Cross-team communication", "Problem solving"],
    experience: [
      {
        title: "Software Engineer II",
        subtitle: "Northwind Technologies",
        meta: "Mar 2022 — Present",
        location: "Bengaluru, IN",
        bullets: [
          "Designed and shipped 12 Spring Boot microservices serving 40M+ daily requests at 99.98% uptime.",
          "Reduced p95 API latency from 820ms to 440ms by introducing Redis caching and query optimisation.",
          "Automated the release pipeline with GitHub Actions, cutting deployment time from 55 to 9 minutes.",
          "Mentored 5 engineers and led weekly design reviews adopted as the org-wide standard.",
        ],
      },
      {
        title: "Software Engineer",
        subtitle: "Lumen Labs",
        meta: "Jul 2019 — Feb 2022",
        location: "Pune, IN",
        bullets: [
          "Built the billing and subscription module processing ₹18 Cr in annual recurring revenue.",
          "Raised backend unit test coverage from 38% to 86%, reducing production defects by 41%.",
          "Migrated a monolith module to containerised services, cutting infrastructure cost by 27%.",
        ],
      },
    ],
    projects: [
      {
        title: "DistributedTaskQ",
        subtitle: "Open-source job queue",
        meta: "2024",
        bullets: [
          "Kafka-backed distributed task queue in Java with exactly-once delivery; 900+ GitHub stars.",
        ],
      },
      {
        title: "CodeReview Copilot",
        subtitle: "Side project",
        meta: "2023",
        bullets: ["Static-analysis bot that comments on pull requests; adopted by 3 internal teams."],
      },
    ],
    education: [
      {
        title: "B.Tech, Computer Science & Engineering",
        subtitle: "National Institute of Technology, Surathkal",
        meta: "2015 — 2019",
        bullets: ["CGPA 8.7/10 · Dean's List for three consecutive semesters"],
      },
    ],
    certifications: [
      { title: "AWS Certified Developer — Associate", subtitle: "Amazon Web Services", meta: "2023" },
      { title: "Oracle Certified Professional, Java SE 11", subtitle: "Oracle", meta: "2021" },
    ],
    achievements: [
      "Winner, Northwind internal hackathon 2023 (out of 64 teams).",
      "Cut cloud spend by ₹42 lakh annually through right-sizing and autoscaling policies.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Kannada (Conversational)"],
  },

  "python-developer": {
    profile: p(
      "Rohan Mehta",
      "Python Developer",
      "rohan.mehta@email.com",
      "+91 99820 11223",
      "Hyderabad, India",
      "linkedin.com/in/rohanmehta",
      "github.com/rohanmehta",
      "rohanmehta.io",
    ),
    summary:
      "Python Developer with 4+ years designing REST APIs and data pipelines using Django, FastAPI and Flask. Shipped services supporting 250K monthly active users, automated reporting that saved 30 hours per week, and maintained 90%+ PyTest coverage.",
    skills: [
      "Python",
      "Django",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Celery",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Docker",
      "Git",
      "Linux",
      "AWS",
      "CI/CD",
      "PyTest",
      "Pandas",
      "NumPy",
      "Scikit-Learn",
    ],
    softSkills: ["Analytical thinking", "Documentation", "Agile collaboration", "Debugging"],
    experience: [
      {
        title: "Python Developer",
        subtitle: "Finlytics Systems",
        meta: "Jan 2022 — Present",
        location: "Hyderabad, IN",
        bullets: [
          "Built 30+ FastAPI endpoints powering a lending platform used by 250K monthly active users.",
          "Reduced nightly ETL runtime from 4.2 hours to 38 minutes with Pandas vectorisation and Celery workers.",
          "Containerised 6 Django services with Docker and deployed to AWS ECS via GitLab CI/CD.",
          "Maintained 92% PyTest coverage, lowering post-release bug reports by 35%.",
        ],
      },
      {
        title: "Junior Python Developer",
        subtitle: "Bluecore Analytics",
        meta: "Aug 2020 — Dec 2021",
        location: "Remote",
        bullets: [
          "Automated 14 recurring finance reports with Pandas and NumPy, saving 30 team-hours weekly.",
          "Developed a Flask internal dashboard consumed daily by 120 operations staff.",
        ],
      },
    ],
    projects: [
      {
        title: "ChurnPredict API",
        subtitle: "Scikit-Learn + FastAPI",
        meta: "2024",
        bullets: [
          "Gradient-boosting churn model served over FastAPI with 0.88 ROC-AUC and sub-90ms inference.",
        ],
      },
      {
        title: "DjangoShop",
        subtitle: "Open-source e-commerce starter",
        meta: "2023",
        bullets: ["Django + PostgreSQL storefront with Stripe checkout and 95% test coverage."],
      },
    ],
    education: [
      {
        title: "B.E., Information Technology",
        subtitle: "Osmania University",
        meta: "2016 — 2020",
        bullets: ["First Class with Distinction · 78.4%"],
      },
    ],
    certifications: [
      { title: "Python for Everybody Specialization", subtitle: "University of Michigan", meta: "2021" },
      { title: "AWS Certified Cloud Practitioner", subtitle: "Amazon Web Services", meta: "2022" },
    ],
    achievements: [
      "Top 2% on HackerRank Python (6-star problem solver).",
      "Speaker, PyCon India lightning talk on async FastAPI patterns (2023).",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Telugu (Conversational)"],
  },

  "full-stack-developer": {
    profile: p(
      "Ananya Iyer",
      "Full Stack Developer",
      "ananya.iyer@email.com",
      "+91 90045 66778",
      "Pune, India",
      "linkedin.com/in/ananyaiyer",
      "github.com/ananyaiyer",
      "ananyaiyer.dev",
    ),
    summary:
      "Full Stack Developer with 6 years shipping end-to-end products across React, Node.js and PostgreSQL. Owned features from discovery to production for a SaaS platform with 120K monthly users, improving conversion by 34% and halving page load time.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "Tailwind CSS",
      "Jest",
      "Playwright",
      "Docker",
      "AWS",
      "CI/CD",
      "Git",
    ],
    softSkills: ["Product thinking", "Cross-functional collaboration", "Mentoring", "Prioritisation"],
    experience: [
      {
        title: "Senior Full Stack Developer",
        subtitle: "Zenwork SaaS",
        meta: "Apr 2022 — Present",
        location: "Pune, IN",
        bullets: [
          "Rebuilt the customer dashboard in Next.js for 120K monthly users, lifting task completion by 34%.",
          "Cut median page load from 3.1s to 1.4s via route-level code splitting and image optimisation.",
          "Designed a GraphQL gateway consolidating 9 REST services, reducing client round-trips by 60%.",
          "Introduced Playwright end-to-end suites covering 85% of critical user journeys.",
        ],
      },
      {
        title: "Full Stack Developer",
        subtitle: "Kite Digital",
        meta: "Jun 2018 — Mar 2022",
        location: "Mumbai, IN",
        bullets: [
          "Delivered 20+ production features across onboarding, billing and analytics surfaces.",
          "Built a reusable React component library adopted by 4 teams, cutting UI build time by 40%.",
        ],
      },
    ],
    projects: [
      {
        title: "TeamSync",
        subtitle: "Realtime collaboration app",
        meta: "2024",
        bullets: ["Next.js + WebSocket workspace with offline sync; 3K registered users."],
      },
      {
        title: "OpenInvoice",
        subtitle: "Open-source invoicing",
        meta: "2022",
        bullets: ["Node.js + PostgreSQL invoicing tool with PDF export and multi-currency support."],
      },
    ],
    education: [
      {
        title: "B.Tech, Computer Engineering",
        subtitle: "College of Engineering, Pune",
        meta: "2014 — 2018",
        bullets: ["CGPA 8.4/10"],
      },
    ],
    certifications: [
      { title: "Meta Front-End Developer Professional Certificate", subtitle: "Meta", meta: "2022" },
      { title: "MongoDB Associate Developer", subtitle: "MongoDB", meta: "2023" },
    ],
    achievements: [
      "Reduced infrastructure cost by 28% through server-side rendering and CDN caching strategy.",
      "Maintainer of two open-source repositories with a combined 1.5K GitHub stars.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Marathi (Fluent)"],
  },

  "data-analyst": {
    profile: p(
      "Priya Nair",
      "Data Analyst",
      "priya.nair@email.com",
      "+91 98111 20394",
      "Gurugram, India",
      "linkedin.com/in/priyanair",
      "github.com/priyanair",
      "",
    ),
    summary:
      "Data Analyst with 4 years turning raw operational data into decisions for retail and fintech teams. Built 40+ Power BI dashboards, automated SQL reporting that saved 25 hours per month, and delivered pricing analysis that added ₹3.2 Cr in annual margin.",
    skills: [
      "SQL",
      "Python",
      "Pandas",
      "NumPy",
      "Excel (Advanced)",
      "Power BI",
      "Tableau",
      "Looker Studio",
      "Google BigQuery",
      "Snowflake",
      "ETL",
      "Statistics",
      "A/B Testing",
      "Data Visualisation",
      "DAX",
      "Git",
    ],
    softSkills: ["Storytelling with data", "Stakeholder management", "Attention to detail", "Business acumen"],
    experience: [
      {
        title: "Data Analyst",
        subtitle: "Meridian Retail Group",
        meta: "Feb 2022 — Present",
        location: "Gurugram, IN",
        bullets: [
          "Built 40+ Power BI dashboards used weekly by 200 stakeholders across merchandising and supply chain.",
          "Delivered a price-elasticity analysis that increased gross margin by ₹3.2 Cr annually.",
          "Automated 18 recurring SQL reports in Python, saving 25 analyst hours per month.",
          "Ran 22 A/B tests on checkout flows, raising conversion by 11.4% at 95% confidence.",
        ],
      },
      {
        title: "Junior Data Analyst",
        subtitle: "PayNorth Fintech",
        meta: "Jul 2020 — Jan 2022",
        location: "Noida, IN",
        bullets: [
          "Created cohort and retention models in SQL that identified a 9% leak in month-2 activation.",
          "Cleaned and consolidated 12 fragmented data sources into a single BigQuery warehouse.",
        ],
      },
    ],
    projects: [
      {
        title: "Retail Demand Forecasting",
        subtitle: "Python, Prophet",
        meta: "2024",
        bullets: ["Weekly SKU-level forecast with 8.6% MAPE, reducing stock-outs by 19%."],
      },
      {
        title: "Customer Segmentation Study",
        subtitle: "K-Means, Tableau",
        meta: "2023",
        bullets: ["Segmented 1.2M customers into 6 actionable personas used by the CRM team."],
      },
    ],
    education: [
      {
        title: "M.Sc., Statistics",
        subtitle: "University of Delhi",
        meta: "2018 — 2020",
        bullets: ["Gold Medallist · 82%"],
      },
      { title: "B.Sc., Mathematics", subtitle: "Miranda House, University of Delhi", meta: "2015 — 2018" },
    ],
    certifications: [
      { title: "Google Data Analytics Professional Certificate", subtitle: "Google", meta: "2021" },
      { title: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", subtitle: "Microsoft", meta: "2023" },
    ],
    achievements: [
      "Recognised as Analyst of the Year 2023 at Meridian Retail Group.",
      "Reduced monthly reporting cycle from 6 days to 1 day through pipeline automation.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Malayalam (Native)"],
  },

  "sales-executive": {
    profile: p(
      "Vikram Singh",
      "Sales Executive",
      "vikram.singh@email.com",
      "+91 98330 45566",
      "Mumbai, India",
      "linkedin.com/in/vikramsingh",
      "",
      "",
    ),
    summary:
      "Results-driven Sales Executive with 6 years in B2B SaaS and enterprise accounts. Consistently exceeded quota (average 128% attainment), grew territory revenue from ₹4.1 Cr to ₹11.6 Cr, and closed 90+ new logos through disciplined pipeline management.",
    skills: [
      "B2B Sales",
      "Lead Generation",
      "CRM (Salesforce)",
      "HubSpot",
      "Sales Funnel Management",
      "Cold Calling",
      "Negotiation",
      "Client Relationship Management",
      "Account Management",
      "Revenue Growth",
      "Business Development",
      "Upselling & Cross-selling",
      "Forecasting",
      "Territory Planning",
      "Solution Selling",
      "Contract Closing",
    ],
    softSkills: ["Persuasion", "Active listening", "Resilience", "Presentation skills", "Relationship building"],
    experience: [
      {
        title: "Senior Sales Executive",
        subtitle: "Cloudspan Software Pvt. Ltd.",
        meta: "May 2021 — Present",
        location: "Mumbai, IN",
        bullets: [
          "Grew West-India territory revenue from ₹4.1 Cr to ₹11.6 Cr in three years (183% growth).",
          "Achieved 128% of annual quota for three consecutive years; ranked #1 of 24 reps in FY2024.",
          "Closed 90+ new enterprise logos with an average deal size of ₹12.4 lakh.",
          "Reduced sales cycle from 96 to 64 days by restructuring the discovery-to-demo funnel in Salesforce.",
        ],
      },
      {
        title: "Sales Executive",
        subtitle: "Brightpath Media",
        meta: "Jun 2018 — Apr 2021",
        location: "Mumbai, IN",
        bullets: [
          "Generated 1,400+ qualified leads through cold calling, email sequences and LinkedIn outreach.",
          "Maintained a 34% lead-to-opportunity conversion rate, 11 points above team average.",
          "Renewed 96% of assigned accounts through proactive quarterly business reviews.",
        ],
      },
    ],
    projects: [
      {
        title: "Enterprise Playbook Rollout",
        subtitle: "Cloudspan Software",
        meta: "2023",
        bullets: ["Authored a 5-stage enterprise sales playbook adopted by all 24 reps nationally."],
      },
    ],
    education: [
      {
        title: "MBA, Marketing & Sales",
        subtitle: "Symbiosis Institute of Business Management",
        meta: "2016 — 2018",
        bullets: ["Specialisation in B2B Marketing · CGPA 3.6/4"],
      },
      { title: "B.Com, Commerce", subtitle: "University of Mumbai", meta: "2013 — 2016" },
    ],
    certifications: [
      { title: "Salesforce Certified Administrator", subtitle: "Salesforce", meta: "2022" },
      { title: "SPIN Selling Certification", subtitle: "Huthwaite International", meta: "2020" },
    ],
    achievements: [
      "President's Club winner 2022, 2023 and 2024.",
      "Signed the largest single contract in company history (₹1.8 Cr, 3-year term).",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Marathi (Conversational)"],
  },

  "hr-professional": {
    profile: p(
      "Sneha Kulkarni",
      "HR Professional",
      "sneha.kulkarni@email.com",
      "+91 97654 33221",
      "Bengaluru, India",
      "linkedin.com/in/snehakulkarni",
      "",
      "",
    ),
    summary:
      "HR Professional with 7 years across talent acquisition, employee relations and HR operations for organisations of 200–1,800 employees. Cut time-to-hire by 38%, raised engagement scores from 68% to 84%, and rolled out a POSH-compliant policy framework company-wide.",
    skills: [
      "Talent Acquisition",
      "End-to-End Recruitment",
      "Onboarding",
      "Employee Engagement",
      "Employee Relations",
      "Performance Management",
      "HRIS (Workday, Darwinbox)",
      "Payroll Coordination",
      "HR Policy & Compliance",
      "Labour Law",
      "Compensation & Benefits",
      "Learning & Development",
      "Exit Management",
      "HR Analytics",
      "Stakeholder Management",
    ],
    softSkills: ["Empathy", "Conflict resolution", "Confidentiality", "Coaching", "Negotiation"],
    experience: [
      {
        title: "HR Business Partner",
        subtitle: "Verdant Technologies",
        meta: "Sep 2021 — Present",
        location: "Bengaluru, IN",
        bullets: [
          "Partnered with 6 department heads supporting 640 employees on hiring, performance and retention.",
          "Reduced average time-to-hire from 52 to 32 days by restructuring the interview funnel in Workday.",
          "Raised employee engagement score from 68% to 84% through quarterly listening sessions and action plans.",
          "Lowered voluntary attrition from 21% to 13% with a structured stay-interview programme.",
        ],
      },
      {
        title: "HR Executive — Talent Acquisition",
        subtitle: "Anchor Consulting Services",
        meta: "Jul 2017 — Aug 2021",
        location: "Pune, IN",
        bullets: [
          "Closed 210+ positions across engineering, sales and operations with a 91% offer-acceptance rate.",
          "Implemented a structured onboarding journey that improved 90-day new-hire retention to 96%.",
          "Managed payroll inputs and statutory compliance (PF, ESI, gratuity) for 480 employees.",
        ],
      },
    ],
    projects: [
      {
        title: "Diversity Hiring Initiative",
        subtitle: "Verdant Technologies",
        meta: "2023",
        bullets: ["Increased women in technical roles from 19% to 31% within 18 months."],
      },
      {
        title: "HR Analytics Dashboard",
        subtitle: "Power BI",
        meta: "2022",
        bullets: ["Live attrition, hiring-funnel and headcount dashboard used in monthly leadership reviews."],
      },
    ],
    education: [
      {
        title: "MBA, Human Resource Management",
        subtitle: "Symbiosis Institute of Management Studies",
        meta: "2015 — 2017",
        bullets: ["CGPA 3.7/4 · HR Club Secretary"],
      },
      { title: "BBA, Business Administration", subtitle: "Savitribai Phule Pune University", meta: "2012 — 2015" },
    ],
    certifications: [
      { title: "SHRM Certified Professional (SHRM-CP)", subtitle: "SHRM", meta: "2022" },
      { title: "POSH Certified Trainer", subtitle: "Indian Institute of Compliance", meta: "2021" },
    ],
    achievements: [
      "Designed the company-wide POSH and grievance-redressal framework adopted across 4 offices.",
      "Awarded HR Excellence Award 2023 for the retention turnaround programme.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Marathi (Native)"],
  },

  "marketing-executive": {
    profile: p(
      "Ishita Verma",
      "Marketing Executive",
      "ishita.verma@email.com",
      "+91 98220 77889",
      "New Delhi, India",
      "linkedin.com/in/ishitaverma",
      "",
      "ishitaverma.com",
    ),
    summary:
      "Marketing Executive with 5 years running performance and content campaigns across D2C and SaaS. Scaled organic traffic 4.6x, managed a ₹2.4 Cr annual ad budget at 5.8x ROAS, and generated 12,000+ marketing-qualified leads.",
    skills: [
      "Digital Marketing",
      "SEO",
      "SEM / Google Ads",
      "Meta Ads",
      "Content Marketing",
      "Email Marketing",
      "Marketing Automation (HubSpot)",
      "Google Analytics 4",
      "Social Media Strategy",
      "Copywriting",
      "Brand Positioning",
      "Campaign Management",
      "Conversion Rate Optimisation",
      "Influencer Marketing",
      "Budget Management",
      "Marketing Analytics",
    ],
    softSkills: ["Creativity", "Data-driven decision making", "Collaboration", "Deadline discipline"],
    experience: [
      {
        title: "Marketing Executive",
        subtitle: "Nimbus D2C Brands",
        meta: "Mar 2022 — Present",
        location: "New Delhi, IN",
        bullets: [
          "Managed a ₹2.4 Cr annual paid-media budget across Google and Meta at a blended 5.8x ROAS.",
          "Grew organic traffic 4.6x (28K to 129K monthly sessions) through a 120-article SEO content programme.",
          "Generated 12,000+ MQLs in FY2024, contributing 41% of the total sales pipeline.",
          "Lifted email revenue 62% by rebuilding lifecycle flows in HubSpot with behavioural triggers.",
        ],
      },
      {
        title: "Marketing Associate",
        subtitle: "Craftly Studio",
        meta: "Aug 2019 — Feb 2022",
        location: "Noida, IN",
        bullets: [
          "Ran 60+ social campaigns growing the combined follower base from 18K to 145K.",
          "Improved landing-page conversion from 2.1% to 4.7% through structured A/B testing.",
        ],
      },
    ],
    projects: [
      {
        title: "Festive Launch Campaign",
        subtitle: "Nimbus D2C Brands",
        meta: "2024",
        bullets: ["Integrated 6-week campaign delivering ₹4.7 Cr revenue at a 3.2x return on ad spend."],
      },
      {
        title: "SEO Content Engine",
        subtitle: "Editorial system",
        meta: "2023",
        bullets: ["Keyword-clustered publishing workflow producing 10 ranked articles per month."],
      },
    ],
    education: [
      {
        title: "MBA, Marketing",
        subtitle: "Amity Business School",
        meta: "2017 — 2019",
        bullets: ["CGPA 3.5/4"],
      },
      { title: "B.A. (Hons), English Literature", subtitle: "University of Delhi", meta: "2014 — 2017" },
    ],
    certifications: [
      { title: "Google Ads Search Certification", subtitle: "Google", meta: "2023" },
      { title: "HubSpot Inbound Marketing Certified", subtitle: "HubSpot Academy", meta: "2022" },
    ],
    achievements: [
      "Campaign of the Year 2024 at Nimbus D2C Brands.",
      "Reduced cost per acquisition by 37% while doubling monthly spend.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)"],
  },

  "finance-professional": {
    profile: p(
      "Arjun Desai",
      "Finance Professional",
      "arjun.desai@email.com",
      "+91 99300 55447",
      "Mumbai, India",
      "linkedin.com/in/arjundesai",
      "",
      "",
    ),
    summary:
      "Finance Professional (CA) with 8 years in financial planning, controllership and audit for listed and PE-backed companies. Led budgeting for a ₹640 Cr P&L, delivered ₹19 Cr in cost savings, and closed month-end reporting in 4 days against a 9-day baseline.",
    skills: [
      "Financial Planning & Analysis",
      "Budgeting & Forecasting",
      "Financial Modelling",
      "Variance Analysis",
      "Management Reporting",
      "Statutory Audit",
      "Internal Controls",
      "IND-AS / IFRS",
      "Taxation (GST, TDS)",
      "Cash Flow Management",
      "Cost Optimisation",
      "SAP FICO",
      "Advanced Excel",
      "Power BI",
      "Tally ERP",
      "Due Diligence",
    ],
    softSkills: ["Analytical rigour", "Integrity", "Executive communication", "Process discipline"],
    experience: [
      {
        title: "Manager — Financial Planning & Analysis",
        subtitle: "Sterling Industries Ltd.",
        meta: "Jun 2021 — Present",
        location: "Mumbai, IN",
        bullets: [
          "Own the annual operating plan for a ₹640 Cr P&L across 4 business units and 11 cost centres.",
          "Identified and executed ₹19 Cr of cost savings through vendor renegotiation and spend rationalisation.",
          "Reduced month-end close from 9 days to 4 days by automating reconciliations in SAP FICO.",
          "Built a rolling 13-week cash-flow model that improved working-capital days by 16%.",
        ],
      },
      {
        title: "Assistant Manager — Audit & Assurance",
        subtitle: "Bhatia & Associates, Chartered Accountants",
        meta: "Aug 2016 — May 2021",
        location: "Mumbai, IN",
        bullets: [
          "Led statutory audits for 18 clients with turnover between ₹50 Cr and ₹900 Cr.",
          "Remediated 40+ internal control gaps, strengthening the IFC framework for three listed clients.",
          "Delivered IND-AS transition support for a ₹1,200 Cr manufacturing group.",
        ],
      },
    ],
    projects: [
      {
        title: "ERP Finance Migration",
        subtitle: "Tally to SAP FICO",
        meta: "2023",
        bullets: ["Led the finance workstream for a 9-month SAP migration delivered on time and under budget."],
      },
    ],
    education: [
      {
        title: "Chartered Accountant (CA)",
        subtitle: "Institute of Chartered Accountants of India",
        meta: "2016",
        bullets: ["Cleared all levels on first attempt · AIR 74 in CA Final"],
      },
      { title: "B.Com (Hons), Accounting & Finance", subtitle: "Narsee Monjee College", meta: "2011 — 2014" },
    ],
    certifications: [
      { title: "CFA Level II Candidate", subtitle: "CFA Institute", meta: "2024" },
      { title: "Certified SAP FICO Consultant", subtitle: "SAP", meta: "2022" },
    ],
    achievements: [
      "Recovered ₹3.4 Cr in unclaimed input tax credit through a GST reconciliation drive.",
      "Awarded Finance Excellence Award 2023 for the close-cycle automation programme.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Gujarati (Native)"],
  },

  "customer-success": {
    profile: p(
      "Neha Raghavan",
      "Customer Success Manager",
      "neha.raghavan@email.com",
      "+91 90876 22110",
      "Chennai, India",
      "linkedin.com/in/neharaghavan",
      "",
      "",
    ),
    summary:
      "Customer Success and Support professional with 5 years owning retention for SaaS portfolios worth ₹22 Cr in ARR. Lifted gross retention to 94%, raised CSAT from 4.1 to 4.8, and reduced first-response time by 58% through process and playbook redesign.",
    skills: [
      "Customer Success Management",
      "Account Retention",
      "Onboarding & Adoption",
      "Escalation Management",
      "Zendesk",
      "Freshdesk",
      "Salesforce",
      "Gainsight",
      "SLA Management",
      "Churn Analysis",
      "Upselling & Renewals",
      "Product Training",
      "Voice of Customer",
      "CSAT / NPS Programmes",
      "Technical Troubleshooting",
      "Knowledge Base Authoring",
    ],
    softSkills: ["Empathy", "Patience", "Clear communication", "Ownership", "De-escalation"],
    experience: [
      {
        title: "Customer Success Manager",
        subtitle: "Trellis Cloud",
        meta: "Jan 2022 — Present",
        location: "Chennai, IN",
        bullets: [
          "Own a 68-account portfolio worth ₹22 Cr ARR; improved gross retention from 86% to 94%.",
          "Drove ₹3.1 Cr in expansion revenue through structured quarterly business reviews.",
          "Raised CSAT from 4.1 to 4.8/5 by rebuilding the onboarding journey into a 30-60-90 day plan.",
          "Reduced churn risk flags by 44% using Gainsight health scores and proactive outreach.",
        ],
      },
      {
        title: "Customer Support Specialist",
        subtitle: "Helpwise Technologies",
        meta: "Jun 2019 — Dec 2021",
        location: "Chennai, IN",
        bullets: [
          "Resolved 180+ tickets weekly in Zendesk with a 97% SLA compliance rate.",
          "Cut average first-response time from 4h 10m to 1h 45m by redesigning ticket triage.",
          "Authored 120 knowledge-base articles that deflected 23% of inbound tickets.",
        ],
      },
    ],
    projects: [
      {
        title: "Customer Health Score Model",
        subtitle: "Gainsight + Salesforce",
        meta: "2023",
        bullets: ["Usage-and-sentiment scoring model that predicted 78% of churn 60 days in advance."],
      },
    ],
    education: [
      {
        title: "B.B.A., Business Administration",
        subtitle: "Loyola College, Chennai",
        meta: "2016 — 2019",
        bullets: ["First Class · 79%"],
      },
    ],
    certifications: [
      { title: "Certified Customer Success Manager (CCSM Level 2)", subtitle: "SuccessCOACHING", meta: "2023" },
      { title: "Zendesk Support Administrator", subtitle: "Zendesk", meta: "2021" },
    ],
    achievements: [
      "Retained the company's largest account (₹2.6 Cr ARR) through a critical escalation.",
      "Employee of the Quarter three times for sustained CSAT leadership.",
    ],
    languages: ["English (Fluent)", "Tamil (Native)", "Hindi (Conversational)"],
  },

  "fresher-graduate": {
    profile: p(
      "Karan Patel",
      "Computer Science Graduate",
      "karan.patel@email.com",
      "+91 91234 56780",
      "Ahmedabad, India",
      "linkedin.com/in/karanpatel",
      "github.com/karanpatel",
      "karanpatel.dev",
    ),
    summary:
      "Computer Science graduate (2025, 8.6 CGPA) with hands-on internship experience building React and Node.js applications. Delivered 4 academic and open-source projects, solved 500+ DSA problems, and seeking an entry-level software engineering role.",
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "React",
      "Node.js",
      "HTML5",
      "CSS3",
      "MySQL",
      "MongoDB",
      "Data Structures & Algorithms",
      "OOPs",
      "Git & GitHub",
      "REST APIs",
      "Linux",
      "Problem Solving",
    ],
    softSkills: ["Fast learner", "Teamwork", "Time management", "Curiosity", "Written communication"],
    experience: [
      {
        title: "Software Development Intern",
        subtitle: "Brightlane Technologies",
        meta: "Jan 2025 — Jun 2025",
        location: "Ahmedabad, IN",
        bullets: [
          "Built 8 reusable React components for an internal admin portal used by 60 employees.",
          "Wrote Node.js REST endpoints with MongoDB, covering 3 modules delivered ahead of schedule.",
          "Fixed 45 reported bugs and added Jest tests raising module coverage from 20% to 71%.",
        ],
      },
      {
        title: "Web Development Intern",
        subtitle: "CodeCraft Solutions",
        meta: "May 2024 — Jul 2024",
        location: "Remote",
        bullets: [
          "Developed 5 responsive landing pages in HTML, CSS and JavaScript for client campaigns.",
          "Improved Lighthouse performance scores from 61 to 92 through asset optimisation.",
        ],
      },
    ],
    projects: [
      {
        title: "StudyBuddy — Peer Learning Platform",
        subtitle: "React, Node.js, MongoDB",
        meta: "2025",
        bullets: [
          "Full-stack study-group app with authentication, chat and scheduling; 400+ campus users.",
        ],
      },
      {
        title: "ExpenseTrack",
        subtitle: "Java, MySQL",
        meta: "2024",
        bullets: ["Desktop expense manager with category analytics and CSV export; final-year project (A grade)."],
      },
    ],
    education: [
      {
        title: "B.Tech, Computer Science & Engineering",
        subtitle: "Nirma University, Ahmedabad",
        meta: "2021 — 2025",
        bullets: ["CGPA 8.6/10 · Coding Club Core Member"],
      },
      { title: "Higher Secondary (Science)", subtitle: "Gujarat Board", meta: "2019 — 2021", bullets: ["91.2%"] },
    ],
    certifications: [
      { title: "Java Programming Masterclass", subtitle: "Udemy", meta: "2024" },
      { title: "Google Cloud Digital Leader", subtitle: "Google Cloud", meta: "2025" },
    ],
    achievements: [
      "Solved 500+ data structures and algorithms problems on LeetCode (Knight badge).",
      "Runner-up, Smart India Hackathon internal round 2024 among 42 teams.",
    ],
    languages: ["English (Fluent)", "Hindi (Native)", "Gujarati (Native)"],
  },
};

export const DEFAULT_ROLE = "software-engineer";

const toItems = (list: RoleItem[]) =>
  list.map((i) => ({
    id: uid(),
    title: i.title,
    subtitle: i.subtitle ?? "",
    meta: i.meta ?? "",
    location: i.location ?? "",
    bullets: i.bullets ?? [],
  }));

export function roleSections(roleId: string): ResumeSection[] {
  const c = ROLE_CONTENT[roleId] ?? ROLE_CONTENT[DEFAULT_ROLE];
  return [
    { id: uid(), kind: "summary", label: "Professional Summary", enabled: true, text: c.summary },
    { id: uid(), kind: "experience", label: "Experience", enabled: true, items: toItems(c.experience) },
    { id: uid(), kind: "projects", label: "Projects", enabled: true, items: toItems(c.projects) },
    { id: uid(), kind: "education", label: "Education", enabled: true, items: toItems(c.education) },
    { id: uid(), kind: "technicalSkills", label: "Skills", enabled: true, tags: c.skills },
    { id: uid(), kind: "softSkills", label: "Core Competencies", enabled: true, tags: c.softSkills },
    {
      id: uid(),
      kind: "certifications",
      label: "Certifications",
      enabled: true,
      items: toItems(c.certifications),
    },
    {
      id: uid(),
      kind: "achievements",
      label: "Achievements",
      enabled: true,
      items: [{ id: uid(), title: "Key achievements", subtitle: "", meta: "", location: "", bullets: c.achievements }],
    },
    { id: uid(), kind: "languages", label: "Languages", enabled: true, tags: c.languages },
    { id: uid(), kind: "internships", label: "Internships", enabled: false, items: [] },
    { id: uid(), kind: "awards", label: "Awards", enabled: false, items: [] },
    { id: uid(), kind: "interests", label: "Interests", enabled: false, tags: [] },
    { id: uid(), kind: "references", label: "References", enabled: false, text: "" },
  ];
}

export function roleProfile(roleId: string): ResumeProfile {
  return { ...(ROLE_CONTENT[roleId] ?? ROLE_CONTENT[DEFAULT_ROLE]).profile };
}
