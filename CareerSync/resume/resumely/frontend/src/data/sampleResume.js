export const sampleResume = {
  templateId: "modern-minimal",
  personal: {
    fullName: "Alexandra Chen",
    title: "Senior Product Designer",
    email: "alex.chen@example.com",
    phone: "+1 (415) 555-0132",
    location: "San Francisco, CA",
    website: "alexchen.design",
    linkedin: "linkedin.com/in/alexchen",
    summary:
      "Product designer with 8+ years of experience shaping consumer and B2B products at scale. Led design for teams at Stripe and Airbnb. Passionate about clarity, systems thinking, and craft.",
  },
  experience: [
    {
      company: "Stripe",
      role: "Senior Product Designer",
      startDate: "Feb 2022",
      endDate: "Present",
      location: "San Francisco, CA",
      bullets: [
        "Led end-to-end design for Stripe Checkout mobile revamp, improving conversion by 14%.",
        "Built a shared component library used by 40+ engineers across 6 product teams.",
        "Mentored 4 junior designers; established weekly design critique rituals.",
      ],
    },
    {
      company: "Airbnb",
      role: "Product Designer",
      startDate: "Jun 2019",
      endDate: "Jan 2022",
      location: "San Francisco, CA",
      bullets: [
        "Shipped host-onboarding redesign that cut drop-off by 22% in first-week activation.",
        "Partnered with research to run 30+ interviews influencing 2023 hosting roadmap.",
      ],
    },
    {
      company: "Dropbox",
      role: "Product Designer",
      startDate: "Aug 2016",
      endDate: "May 2019",
      location: "San Francisco, CA",
      bullets: [
        "Owned design for Dropbox Paper collaboration features used by 1.5M weekly actives.",
      ],
    },
  ],
  education: [
    {
      school: "Rhode Island School of Design",
      degree: "BFA",
      field: "Graphic Design",
      startDate: "2012",
      endDate: "2016",
      location: "Providence, RI",
      notes: "Dean's List; Type Design minor",
    },
  ],
  skills: [
    "Product Design",
    "Design Systems",
    "Figma",
    "Prototyping",
    "User Research",
    "Design Ops",
    "Typography",
    "HTML/CSS",
  ],
  projects: [
    {
      name: "Grid - Open Source Layout Kit",
      link: "github.com/alexchen/grid",
      description: "A modular CSS grid framework used by 3k+ developers.",
      tech: "CSS, JS",
    },
  ],
  certifications: [
    { name: "Nielsen Norman UX Certification", issuer: "NN/g", date: "2021" },
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Mandarin", level: "Fluent" },
  ],
};

export const emptyResume = {
  templateId: "modern-minimal",
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

