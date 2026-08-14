import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock3,
  Download,
  FileText,
  Flame,
  GraduationCap,
  MessageSquare,
  Mic,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

type Level = "Beginner" | "Intermediate";
type Tag = "Popular" | "New" | "Featured";

type CourseDetail = {
  introduction: string;
  objectives: string[];
  notes: string[];
  practicalExamples: string[];
  salesScripts: string[];
  caseStudies: string[];
  assignments: string[];
  interviewQuestions: string[];
  quiz: { q: string; a: string }[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  level: Level;
  duration: string;
  category: string;
  filterKey: string;
  learners: string;
  rating: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: Tag;
  gradient: string;
  iconBg: string;
  detail: CourseDetail;
};

// ─── Course Data ──────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: "sales-fundamentals",
    title: "Sales Fundamentals",
    description: "Build a strong foundation in sales psychology, customer interaction, and sales processes.",
    level: "Beginner",
    duration: "2 Hours",
    category: "Sales",
    filterKey: "Sales",
    learners: "18,400+",
    rating: "4.9",
    icon: TrendingUp,
    tag: "Featured",
    gradient: "from-[#0F4C81] to-[#1E88E5]",
    iconBg: "from-[#0F4C81] to-[#1E88E5]",
    detail: {
      introduction: "Sales Fundamentals gives you the complete mental model of professional selling — from understanding buyer psychology to structuring a winning sales conversation. This course is crafted for anyone starting their sales journey.",
      objectives: [
        "Understand the core principles of sales psychology",
        "Structure effective sales conversations",
        "Build genuine rapport with prospects",
        "Identify customer pain points and needs",
        "Apply consultative selling techniques",
        "Track and measure personal sales performance",
      ],
      notes: [
        "Sales is a value exchange, not a transaction. Always lead with the customer's benefit.",
        "The AIDA framework (Attention, Interest, Desire, Action) is the backbone of any pitch.",
        "Active listening is the single most underused skill in sales — master it first.",
        "People buy from people they trust. Credibility building is a core sales activity.",
        "Objections are buying signals in disguise — welcome them.",
        "The follow-up is where most sales are won. 80% of deals close after the 5th contact.",
      ],
      practicalExamples: [
        "Role-play: Cold introduction to a new prospect in under 60 seconds.",
        "Exercise: Map the decision-making journey of a customer buying insurance.",
        "Scenario: Handle a prospect who says 'I need to think about it'.",
        "Practice: Write a value proposition for a product you use daily.",
      ],
      salesScripts: [
        "Opening: 'Good morning [Name], I'm calling from [Company]. We help [target audience] achieve [specific outcome]. Do you have 2 minutes?'",
        "Need Discovery: 'What's the biggest challenge you face with [area] right now?'",
        "Value Pitch: 'Based on what you've shared, here's exactly how we can solve that for you...'",
        "Soft Close: 'Does this sound like something that would work for your situation?'",
      ],
      caseStudies: [
        "Case Study 1: How a fresh graduate closed 12 deals in his first month using structured scripts.",
        "Case Study 2: A small insurance agency that grew 3× by training staff on consultative selling.",
      ],
      assignments: [
        "Write a 30-second elevator pitch for any product you know.",
        "Record yourself handling the objection 'Your price is too high' — submit the audio.",
        "Map out a complete sales funnel for a local business of your choice.",
      ],
      interviewQuestions: [
        "What motivated you to pursue a career in sales?",
        "How do you handle rejection in sales?",
        "Describe a time you turned a 'no' into a 'yes'.",
        "How do you prioritize leads in your pipeline?",
        "What does consultative selling mean to you?",
      ],
      quiz: [
        { q: "What does AIDA stand for?", a: "Attention, Interest, Desire, Action" },
        { q: "What percentage of sales happen after the 5th follow-up?", a: "Approximately 80%" },
        { q: "What is the primary goal of need-discovery questions?", a: "To understand the customer's pain points before pitching." },
      ],
    },
  },
  {
    id: "insurance-sales",
    title: "Insurance Sales",
    description: "Master insurance selling techniques, lead conversion, objection handling, and customer trust building.",
    level: "Intermediate",
    duration: "4 Hours",
    category: "Insurance",
    filterKey: "Insurance",
    learners: "11,200+",
    rating: "4.8",
    icon: ShieldCheck,
    tag: "Popular",
    gradient: "from-[#1565C0] to-[#0288D1]",
    iconBg: "from-[#1565C0] to-[#0288D1]",
    detail: {
      introduction: "Insurance sales requires building deep trust before discussing products. This course walks you through the complete insurance selling lifecycle — from prospecting to policy issuance and renewal management.",
      objectives: [
        "Understand different types of insurance products",
        "Master needs-based insurance selling",
        "Convert warm and cold leads effectively",
        "Handle policy objections with confidence",
        "Build long-term client relationships for renewals",
        "Stay compliant with insurance regulations",
      ],
      notes: [
        "Never lead with the product. Always start with the customer's life situation.",
        "IRDA compliance is non-negotiable — know the rules before you sell.",
        "The 3-touch rule: inform, educate, and then propose.",
        "Premium comparisons kill trust. Sell the plan's benefit, not its price.",
        "Renewals are where the real income is — service existing clients as hard as you prospect.",
        "Emotional stories of claim settlements are your most powerful sales tool.",
      ],
      practicalExamples: [
        "Present a term plan to a 28-year-old professional with dependents.",
        "Explain the difference between ULIP and traditional plans to a senior citizen.",
        "Handle a customer who compares your plan's premium to a competitor's.",
      ],
      salesScripts: [
        "Opening: 'Mr. [Name], I'm reaching out because many families in [area] have been securing their futures with [Plan]. May I take 5 minutes to share how it works?'",
        "Objection — 'I already have insurance': 'That's great! My goal is to check if there are any gaps — most people don't realize what's missing until they file a claim.'",
        "Closing: 'Based on everything we've discussed, [Plan] looks like a great fit. Shall we start the paperwork today?'",
      ],
      caseStudies: [
        "Case Study: How an agent sold 40+ policies in Q1 using a referral-based approach.",
        "Case Study: Winning back a lapsed-policy customer using empathy-first communication.",
      ],
      assignments: [
        "Create a fact-find questionnaire for a new insurance prospect.",
        "Write a 3-email drip campaign to nurture a cold insurance lead.",
        "Role-play: Present a health insurance plan to someone who says 'I'm young and healthy.'",
      ],
      interviewQuestions: [
        "How do you explain complex insurance terms in simple language?",
        "What's your strategy for handling a client who wants to cancel their policy?",
        "How do you generate referrals from existing clients?",
      ],
      quiz: [
        { q: "What does IRDA stand for?", a: "Insurance Regulatory and Development Authority" },
        { q: "What is the primary goal of needs-based selling in insurance?", a: "To match the right product to the customer's actual financial and life situation." },
        { q: "What is the 3-touch rule in insurance sales?", a: "Inform, Educate, then Propose — never pitch on first contact." },
      ],
    },
  },
  {
    id: "b2b-sales",
    title: "B2B Sales",
    description: "Learn enterprise sales, business communication, client acquisition, and relationship management.",
    level: "Intermediate",
    duration: "6 Hours",
    category: "Business",
    filterKey: "Business",
    learners: "8,700+",
    rating: "4.8",
    icon: Briefcase,
    tag: "Featured",
    gradient: "from-[#4527A0] to-[#1E88E5]",
    iconBg: "from-[#4527A0] to-[#1E88E5]",
    detail: {
      introduction: "B2B sales operates on longer cycles, multiple stakeholders, and higher contract values. This course gives you a systematic framework for enterprise selling — from first contact to contract signing.",
      objectives: [
        "Understand the B2B sales funnel vs B2C",
        "Navigate multi-stakeholder buying committees",
        "Craft compelling business proposals",
        "Build executive-level relationships",
        "Manage a complex sales pipeline",
        "Negotiate terms and close enterprise deals",
      ],
      notes: [
        "In B2B, you often sell to committees — identify the champion, influencer, and decision maker.",
        "The average B2B sale involves 6.8 decision makers. Align all of them.",
        "Business value always beats product features in enterprise pitches.",
        "Follow-through is everything. Use a CRM to track every touchpoint.",
        "A proof of concept (PoC) or pilot dramatically reduces sales resistance.",
        "Contracts are negotiated — always have room to move on pricing and terms.",
      ],
      practicalExamples: [
        "Map all stakeholders for a hypothetical SaaS deal at a mid-size company.",
        "Write a 1-page executive summary for a logistics software solution.",
        "Respond to a formal RFP (Request for Proposal) template.",
      ],
      salesScripts: [
        "Cold Outreach: 'Hi [Name], I help [industry] companies reduce [pain area] by [outcome]. I'd love to share a quick case study — do you have 15 minutes this week?'",
        "Champion Enablement: 'Here's a summary slide you can share with your team to show the ROI we discussed...'",
        "Closing: 'Based on the pilot results, are you ready to move forward with the full rollout?'",
      ],
      caseStudies: [
        "Case Study: A 3-month B2B deal closed by mapping internal champions across 3 departments.",
        "Case Study: How a startup won enterprise clients by offering a free 2-week pilot.",
      ],
      assignments: [
        "Create an account map for a target company of your choice.",
        "Write a business value proposition for a software product targeting HR departments.",
        "Prepare a competitive battle card comparing two B2B solutions.",
      ],
      interviewQuestions: [
        "Describe your approach to navigating a complex buying committee.",
        "How do you handle a stalled deal with no response from the prospect?",
        "What KPIs do you use to measure your B2B sales performance?",
      ],
      quiz: [
        { q: "What is a 'champion' in a B2B sale?", a: "An internal advocate inside the prospect company who supports your solution." },
        { q: "What does RFP stand for?", a: "Request for Proposal" },
        { q: "Why is a proof of concept useful in enterprise sales?", a: "It reduces risk perception and gives prospects real evidence of value before committing." },
      ],
    },
  },
  {
    id: "rental-sales",
    title: "Rental Sales",
    description: "Understand rental business sales, customer management, and property conversion techniques.",
    level: "Beginner",
    duration: "3 Hours",
    category: "Business",
    filterKey: "Business",
    learners: "6,300+",
    rating: "4.7",
    icon: Target,
    tag: "New",
    gradient: "from-[#00796B] to-[#0097A7]",
    iconBg: "from-[#00796B] to-[#0097A7]",
    detail: {
      introduction: "Rental sales is about matching the right property or product to the right customer while managing expectations, handling multiple inquiries, and building a reliable referral pipeline.",
      objectives: [
        "Understand the rental sales funnel",
        "Qualify rental prospects effectively",
        "Present properties or products compellingly",
        "Handle price and feature objections",
        "Speed up the decision-making process",
        "Retain customers for repeat business",
      ],
      notes: [
        "Speed is critical in rentals — follow up within 1 hour of an inquiry.",
        "Anchor on the outcome, not the price. 'For ₹X more, you get peace of mind.'",
        "Always have 3 options: good, better, best. Most customers choose the middle.",
        "Photos and virtual tours convert 3× better than descriptions alone.",
        "References from happy renters are your most effective sales tool.",
      ],
      practicalExamples: [
        "Script a walkthrough presentation for a residential apartment.",
        "Handle a prospect who wants a 15% discount on the listed rent.",
        "Convert a prospect who's comparing 3 other properties.",
      ],
      salesScripts: [
        "Initial Follow-up: 'Hi [Name], I saw your inquiry for [property]. I'd love to schedule a quick 10-minute call — when works best?'",
        "Comparison Objection: 'I understand you're evaluating options. Let me share what makes [property] stand out for someone with your specific needs.'",
        "Closing: 'Great — shall I block this for you today? I'd hate for it to go to someone else while you decide.'",
      ],
      caseStudies: [
        "Case Study: How a rental agent increased closure rate by 40% using 3D virtual tours.",
        "Case Study: A referral program that generated 60% of new rental inquiries.",
      ],
      assignments: [
        "Create a rental inquiry qualification checklist.",
        "Write a WhatsApp follow-up sequence for 3 days after an inquiry.",
        "List 5 objection-handling responses for a price-sensitive rental prospect.",
      ],
      interviewQuestions: [
        "How do you handle a prospect who is comparing multiple rental options?",
        "What's your process for following up after an initial inquiry?",
        "How do you build a referral pipeline in rental sales?",
      ],
      quiz: [
        { q: "What is the ideal follow-up time after a rental inquiry?", a: "Within 1 hour" },
        { q: "What is the 'good, better, best' pricing strategy?", a: "Presenting 3 tiers of options to guide customers toward a middle-value choice." },
        { q: "What converts rental prospects 3× better than descriptions alone?", a: "Photos and virtual tours" },
      ],
    },
  },
  {
    id: "cold-calling",
    title: "Cold Calling",
    description: "Learn effective cold calling strategies, confidence building, and conversation frameworks.",
    level: "Beginner",
    duration: "2 Hours",
    category: "Sales",
    filterKey: "Sales",
    learners: "21,000+",
    rating: "4.9",
    icon: Phone,
    tag: "Popular",
    gradient: "from-[#E53935] to-[#FB8C00]",
    iconBg: "from-[#E53935] to-[#FB8C00]",
    detail: {
      introduction: "Cold calling remains one of the highest-ROI sales activities when done correctly. This course gives you a repeatable, confidence-building framework to start conversations, handle gatekeepers, and convert cold prospects.",
      objectives: [
        "Build call confidence and reduce call anxiety",
        "Craft attention-grabbing openers",
        "Navigate gatekeepers professionally",
        "Handle objections in real time",
        "Use the 3-step closing technique",
        "Track and improve call metrics",
      ],
      notes: [
        "Your first 7 seconds decide everything. Nail your opener.",
        "Smile before you dial — your energy is contagious through the phone.",
        "Gatekeepers are allies, not enemies. Treat them with respect.",
        "Never read from a script. Know it well enough to sound natural.",
        "Rejection is data, not failure. Analyze what went wrong and refine.",
        "The best time to cold call is Tuesday–Thursday, 9–11am and 4–5pm.",
      ],
      practicalExamples: [
        "Practice opening 10 different cold calls using 3 different openers.",
        "Role-play navigating a gatekeeper who says 'He doesn't take calls.'",
        "Script a voicemail that gets a callback — keep it under 25 seconds.",
      ],
      salesScripts: [
        "Opener: 'Hi [Name], this is [Your Name] from [Company]. I'll be upfront — this is a cold call, but I promise it'll be worth 90 seconds. Can I share why?'",
        "Gatekeeper: 'I completely understand. Could you tell me who handles [area]? I want to make sure I reach the right person.'",
        "Voicemail: 'Hi [Name], [Your Name] here from [Company]. We help [outcome] — I'll send you a quick email, but wanted to put a voice to the name. Talk soon.'",
      ],
      caseStudies: [
        "Case Study: An agent who made 50 calls/day and tracked one metric that changed everything.",
        "Case Study: How structured cold call scripts increased team connect rates by 35%.",
      ],
      assignments: [
        "Make 10 practice cold calls using the opener script. Record and self-evaluate.",
        "Write 3 different cold call openers for 3 different industries.",
        "Create a personal call-tracking sheet for a week.",
      ],
      interviewQuestions: [
        "How do you prepare before making cold calls?",
        "What do you do when a prospect hangs up immediately?",
        "Describe your best cold call outcome and what made it work.",
      ],
      quiz: [
        { q: "What are the best days and times to cold call?", a: "Tuesday to Thursday, 9–11am and 4–5pm" },
        { q: "What should a voicemail be limited to?", a: "Under 25 seconds" },
        { q: "What is the right mindset toward rejection in cold calling?", a: "Treat rejection as data — analyze and refine your approach." },
      ],
    },
  },
  {
    id: "communication-skills",
    title: "Communication Skills",
    description: "Improve professional speaking, active listening, and persuasive communication.",
    level: "Beginner",
    duration: "3 Hours",
    category: "Communication",
    filterKey: "Communication",
    learners: "24,500+",
    rating: "4.9",
    icon: MessageSquare,
    tag: "Popular",
    gradient: "from-[#6A1B9A] to-[#AD1457]",
    iconBg: "from-[#6A1B9A] to-[#AD1457]",
    detail: {
      introduction: "Great communicators are made, not born. This course covers the fundamentals of professional communication — speaking clearly, listening actively, writing persuasively, and presenting confidently.",
      objectives: [
        "Speak clearly and professionally in any setting",
        "Use active listening to build trust",
        "Write persuasive emails and messages",
        "Handle difficult conversations diplomatically",
        "Present ideas with confidence and clarity",
        "Use non-verbal communication effectively",
      ],
      notes: [
        "Communication is 7% words, 38% tone, 55% body language — in face-to-face interactions.",
        "Active listening means listening to understand, not to respond.",
        "The PREP framework: Point, Reason, Example, Point — perfect for professional speaking.",
        "Pause more. Silence shows confidence. Fillers (um, uh) signal insecurity.",
        "Mirror your listener's language and energy to build instant rapport.",
        "Written communication should always answer: What? Why? What next?",
      ],
      practicalExamples: [
        "Practice the PREP framework on 5 professional topics in 2 minutes each.",
        "Write a professional rejection email that preserves the relationship.",
        "Role-play a difficult conversation with a dissatisfied client.",
      ],
      salesScripts: [
        "Diplomatic Disagreement: 'I see your perspective, and here's another angle worth considering...'",
        "Professional Follow-up Email: 'Hi [Name], following up on our conversation — here's a quick summary and my recommended next step.'",
        "Confidence Opener: 'Thank you for your time today. I'd like to share 3 key points that I believe will be relevant to you.'",
      ],
      caseStudies: [
        "Case Study: How a sales professional's promotion was linked to email communication quality.",
        "Case Study: A team that doubled customer satisfaction by improving response tone.",
      ],
      assignments: [
        "Record a 2-minute self-introduction and identify 3 areas for improvement.",
        "Rewrite a poorly written complaint email into a professional version.",
        "Practice the PREP framework on 3 different topics and share recordings.",
      ],
      interviewQuestions: [
        "How do you handle communication with a difficult or demanding client?",
        "Describe a time you had to deliver bad news professionally.",
        "How do you ensure your written messages are clear and actionable?",
      ],
      quiz: [
        { q: "What does PREP stand for in professional speaking?", a: "Point, Reason, Example, Point" },
        { q: "What percentage of communication is body language in face-to-face interactions?", a: "55%" },
        { q: "What does active listening mean?", a: "Listening to understand, not to respond" },
      ],
    },
  },
  {
    id: "closing-techniques",
    title: "Closing Techniques",
    description: "Master powerful sales closing methods and increase conversion rates.",
    level: "Intermediate",
    duration: "4 Hours",
    category: "Sales",
    filterKey: "Sales",
    learners: "14,800+",
    rating: "4.8",
    icon: Zap,
    tag: "Featured",
    gradient: "from-[#F57F17] to-[#E65100]",
    iconBg: "from-[#F57F17] to-[#E65100]",
    detail: {
      introduction: "The close is where deals are won or lost. This course teaches you 12 proven closing techniques, how to read buying signals, and how to create urgency without being pushy.",
      objectives: [
        "Recognize verbal and non-verbal buying signals",
        "Apply 12 professional closing techniques",
        "Create urgency and scarcity ethically",
        "Handle last-minute objections at closing",
        "Follow up effectively after a soft close",
        "Increase your personal conversion rate",
      ],
      notes: [
        "Always close on a positive moment — never try to close when tension is high.",
        "The assumptive close: act as if the deal is already done.",
        "The summary close: recap all agreed benefits, then ask for the decision.",
        "The scarcity close: 'This offer is valid until Friday' — only use when true.",
        "Silence after asking for the order is golden — the next person to speak loses.",
        "80% of salespeople never ask for the business. Just ask.",
      ],
      practicalExamples: [
        "Practice 5 different closes on the same product with different buyer personas.",
        "Identify buying signals in a recorded sales conversation.",
        "Handle the objection 'I need to consult my spouse' just before closing.",
      ],
      salesScripts: [
        "Assumptive Close: 'Great — so shall I set up the account in your name or the company name?'",
        "Summary Close: 'So we've agreed on the premium, the coverage, and the start date — shall we proceed?'",
        "Urgency Close: 'We have 2 slots available this month — I'd hate for you to miss out. Shall we lock yours in today?'",
      ],
      caseStudies: [
        "Case Study: How a team increased closure rate by 22% by training on the summary close.",
        "Case Study: Using the silence technique — a salesperson's biggest monthly close.",
      ],
      assignments: [
        "Write scripts for 5 different closing techniques.",
        "Practice closing a mock deal from introduction to signed agreement.",
        "Create a personal post-close follow-up email template.",
      ],
      interviewQuestions: [
        "Which closing technique do you find most effective and why?",
        "How do you create urgency without being manipulative?",
        "Describe your process when a deal stalls just before closing.",
      ],
      quiz: [
        { q: "What is the assumptive close?", a: "Acting as though the deal is already decided and moving forward with logistical questions." },
        { q: "Why is silence powerful after asking for the order?", a: "The first person to break silence after an offer often concedes — staying quiet puts the decision on the buyer." },
        { q: "What percentage of salespeople never ask for the business?", a: "80%" },
      ],
    },
  },
  {
    id: "customer-handling",
    title: "Customer Handling",
    description: "Handle difficult customers professionally while improving customer satisfaction.",
    level: "Beginner",
    duration: "3 Hours",
    category: "Sales",
    filterKey: "Sales",
    learners: "16,200+",
    rating: "4.8",
    icon: UserCheck,
    tag: "Popular",
    gradient: "from-[#00695C] to-[#1565C0]",
    iconBg: "from-[#00695C] to-[#1565C0]",
    detail: {
      introduction: "Every difficult customer is an opportunity to build loyalty. This course gives you practical frameworks for de-escalating conflicts, managing complaints, and turning dissatisfied customers into your best advocates.",
      objectives: [
        "De-escalate emotional or angry customers",
        "Handle complaints with empathy and structure",
        "Turn a negative experience into a loyalty-building moment",
        "Set professional boundaries with demanding customers",
        "Use the LAST framework (Listen, Apologize, Solve, Thank)",
        "Build a customer feedback loop",
      ],
      notes: [
        "The LAST framework — Listen, Apologize, Solve, Thank — works in 95% of complaint situations.",
        "Never argue with an emotional customer. Let them speak until they're calm.",
        "Empathy is not agreement — you can empathize without accepting blame.",
        "Personalize every resolution — generic responses feel hollow.",
        "Resolution speed matters more than resolution perfection.",
        "A resolved complaint customer is more loyal than one who never complained.",
      ],
      practicalExamples: [
        "De-escalate a customer who received the wrong product and is demanding a refund.",
        "Handle a customer who threatens to leave a 1-star review publicly.",
        "Manage a situation where the complaint is valid but the solution is limited.",
      ],
      salesScripts: [
        "Opening Empathy: 'I completely understand how frustrating this must be. Let me personally make sure this is resolved for you.'",
        "Complaint Resolution: 'Here's what I'm going to do: [Solution]. Does this work for you?'",
        "Recovery Close: 'I'm glad we could sort this out. I'd love to make sure your next experience is perfect — may I check in with you next week?'",
      ],
      caseStudies: [
        "Case Study: A complaint response that went viral for the right reasons — and increased sales.",
        "Case Study: How one team reduced repeat complaints by 60% using a structured resolution protocol.",
      ],
      assignments: [
        "Write 3 complaint responses using the LAST framework.",
        "Role-play handling a furious customer on a call — record and evaluate.",
        "Design a customer satisfaction follow-up process for after issue resolution.",
      ],
      interviewQuestions: [
        "How do you handle a customer who is verbally aggressive?",
        "Describe a time you turned a customer complaint into a positive outcome.",
        "How do you maintain professionalism when you disagree with the customer?",
      ],
      quiz: [
        { q: "What does LAST stand for?", a: "Listen, Apologize, Solve, Thank" },
        { q: "Why is resolution speed important in customer handling?", a: "Customers value speed over perfection — fast resolution signals that you care." },
        { q: "Is empathy the same as accepting blame?", a: "No. You can empathize with a customer's feelings without accepting responsibility for the issue." },
      ],
    },
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    description: "Prepare for interviews with HR questions, confidence building, resume guidance, and mock interview techniques.",
    level: "Beginner",
    duration: "5 Hours",
    category: "Interview",
    filterKey: "Interview",
    learners: "29,100+",
    rating: "4.9",
    icon: GraduationCap,
    tag: "Popular",
    gradient: "from-[#1A237E] to-[#283593]",
    iconBg: "from-[#1A237E] to-[#283593]",
    detail: {
      introduction: "Most candidates lose interviews they were qualified for. This course equips you with structured answers, confidence techniques, and insider knowledge about what interviewers actually look for in sales and business roles.",
      objectives: [
        "Answer the top 30 HR and behavioral questions",
        "Structure answers using the STAR method",
        "Research and prepare for company-specific interviews",
        "Build confidence and manage interview anxiety",
        "Write a compelling resume and cover letter",
        "Handle salary negotiation professionally",
      ],
      notes: [
        "The STAR method: Situation, Task, Action, Result — use for every behavioral question.",
        "Research the company's product, mission, recent news, and competitors before any interview.",
        "First impressions are made in 7 seconds — posture, eye contact, and handshake matter.",
        "Never speak negatively about your previous employer in an interview.",
        "Prepare 5 thoughtful questions to ask the interviewer — it shows genuine interest.",
        "After the interview, send a thank-you email within 24 hours.",
      ],
      practicalExamples: [
        "Answer 'Tell me about yourself' in under 2 minutes using the Past-Present-Future framework.",
        "Respond to 'What is your greatest weakness?' without damaging your candidacy.",
        "Negotiate a salary offer confidently and professionally.",
      ],
      salesScripts: [
        "Self-introduction: 'I'm a [background] professional with [X years] of experience in [area]. Over the past [time], I've focused on [achievement]. I'm now looking to bring those skills to [company].'",
        "Salary Negotiation: 'Based on my experience and market research, I was expecting a range of ₹[X]–₹[Y]. Is there flexibility in that direction?'",
        "Closing the Interview: 'I'm genuinely excited about this opportunity. What are the next steps in your process?'",
      ],
      caseStudies: [
        "Case Study: How structured preparation helped a candidate land 3 job offers in 2 weeks.",
        "Case Study: A fresher's interview journey — from rejection to offer using mock interviews.",
      ],
      assignments: [
        "Prepare STAR answers for the top 10 behavioral interview questions.",
        "Conduct a full mock interview with a peer and exchange feedback.",
        "Update your resume using the course's ATS-optimized checklist.",
      ],
      interviewQuestions: [
        "Tell me about yourself.",
        "Why do you want to work in sales?",
        "Where do you see yourself in 5 years?",
        "Describe a challenge you faced and how you overcame it.",
        "What is your greatest strength and weakness?",
      ],
      quiz: [
        { q: "What does STAR stand for?", a: "Situation, Task, Action, Result" },
        { q: "When should you send a thank-you email after an interview?", a: "Within 24 hours" },
        { q: "How many questions should you prepare to ask the interviewer?", a: "At least 5 thoughtful questions" },
      ],
    },
  },
  {
    id: "negotiation-skills",
    title: "Negotiation Skills",
    description: "Learn win-win negotiation strategies for better sales and stronger business relationships.",
    level: "Intermediate",
    duration: "4 Hours",
    category: "Negotiation",
    filterKey: "Negotiation",
    learners: "9,800+",
    rating: "4.8",
    icon: Award,
    tag: "New",
    gradient: "from-[#880E4F] to-[#C62828]",
    iconBg: "from-[#880E4F] to-[#C62828]",
    detail: {
      introduction: "Every sale involves negotiation. This course teaches you principled negotiation — how to find creative solutions that satisfy both parties without compromising your margins or relationships.",
      objectives: [
        "Understand the principles of win-win negotiation",
        "Identify BATNA (Best Alternative to a Negotiated Agreement)",
        "Use anchoring and concession strategies",
        "Negotiate price without destroying value",
        "Handle extreme positions professionally",
        "Close negotiations with clear agreements",
      ],
      notes: [
        "BATNA — your Best Alternative to a Negotiated Agreement — is your true power in any negotiation.",
        "Whoever names the price first sets the anchor. In sales, anchor high.",
        "Never split the difference on the first counter — make them work for every concession.",
        "Trade concessions, don't give them. 'I can do X if you can do Y.'",
        "Silence is a negotiation tool. After making an offer, wait.",
        "Protect your non-negotiables. Identify them before any negotiation begins.",
      ],
      practicalExamples: [
        "Negotiate a price reduction request from a client while protecting margins.",
        "Handle a buyer who presents an extreme low-ball offer.",
        "Structure a win-win deal that includes non-monetary value for both sides.",
      ],
      salesScripts: [
        "Anchoring: 'Our standard engagement for this scope starts at ₹[X]. Depending on your priorities, there's flexibility in how we structure it.'",
        "Trading Concessions: 'I can move on the price, but I'd need [extended contract / faster payment / referral] in return.'",
        "Closing the Negotiation: 'I think we've found a structure that works for both sides. Let me summarize what we've agreed on...'",
      ],
      caseStudies: [
        "Case Study: How a sales team recovered margin by trading non-monetary value in negotiations.",
        "Case Study: A negotiation that seemed lost — rescued by identifying the buyer's real priority.",
      ],
      assignments: [
        "Identify your BATNA in 3 different sales scenarios.",
        "Practice the anchoring technique in a mock negotiation with a peer.",
        "Write a concession strategy for a deal where the client wants a 20% discount.",
      ],
      interviewQuestions: [
        "Describe your approach when a client demands a price you can't meet.",
        "How do you handle a negotiation where both sides are stuck?",
        "What is BATNA and how do you use it?",
      ],
      quiz: [
        { q: "What does BATNA stand for?", a: "Best Alternative to a Negotiated Agreement" },
        { q: "What is anchoring in negotiation?", a: "Setting the first price to establish a reference point that influences the entire negotiation." },
        { q: "What should you do after making an offer in a negotiation?", a: "Stay silent. The first person to speak after an offer often concedes." },
      ],
    },
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = ["All", "Sales", "Communication", "Interview", "Business", "Negotiation", "Insurance"] as const;
type Filter = (typeof FILTERS)[number];

const TAG_STYLES: Record<Tag, string> = {
  Popular: "bg-[#FF6B35]/10 text-[#FF6B35] ring-[#FF6B35]/25",
  New: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Featured: "bg-[#0F4C81]/10 text-[#0F4C81] ring-[#0F4C81]/25",
};

const LEVEL_STYLES: Record<Level, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 ring-amber-200",
};

// ─── Main Section ─────────────────────────────────────────────────────────────

export function BechnaseekhoCoursesSection() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return COURSES.filter((c) => {
      const matchFilter = filter === "All" || c.filterKey === filter;
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [search, filter]);

  useEffect(() => {
    document.body.style.overflow = selectedCourse ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedCourse]);

  return (
    <section id="courses" className="relative overflow-hidden pt-6 pb-12 sm:pt-8 sm:pb-16" style={{ background: "#F8FAFC" }}>
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-[#0F4C81]/8 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-[480px] w-[480px] rounded-full bg-[#1E88E5]/8 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/60 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F4C81]/20 bg-[#0F4C81]/8 px-4 py-1.5 text-xs font-semibold text-[#0F4C81]">
            📚 Professional Sales Courses
          </span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Master Sales with{" "}
            <span className="bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] bg-clip-text text-transparent">
              Industry-Focused Courses
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Learn practical sales skills through structured courses designed by industry professionals. Build confidence, improve communication, and close more deals with real-world learning.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-7 flex flex-col items-center gap-3"
        >
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses…"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${filter === f
                  ? "bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] text-white shadow-md shadow-[#1E88E5]/30"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[#1E88E5]/40 hover:text-[#1E88E5]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Course Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 text-center text-slate-400"
              >
                No courses match your search.
              </motion.div>
            ) : (
              filtered.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onOpen={() => setSelectedCourse(course)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Course Card ──────────────────────────────────────────────────────────────

function CourseCard({ course, index, onOpen }: { course: Course; index: number; onOpen: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_24px_-8px_rgba(15,76,129,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_60px_-12px_rgba(15,76,129,0.28)]"
    >
      {/* Animated gradient border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: 1.5,
          background: `linear-gradient(135deg, #0F4C81, #1E88E5)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Top gradient band */}
      <div className={`relative h-1.5 w-full bg-gradient-to-r ${course.gradient}`} />

      <div className="relative flex flex-1 flex-col p-6">
        {/* Icon + Tag */}
        <div className="flex items-start justify-between">
          <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${course.iconBg} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            <course.icon className="h-6 w-6" />
          </div>
          {course.tag && (
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ${TAG_STYLES[course.tag]}`}>
              {course.tag === "Popular" && "🔥 "}
              {course.tag === "New" && "✨ "}
              {course.tag === "Featured" && "⭐ "}
              {course.tag}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="mt-4 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-[#0F4C81]">
          {course.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{course.description}</p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${LEVEL_STYLES[course.level]}`}>
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
            <Clock3 className="h-3 w-3" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
            <Users className="h-3 w-3" /> {course.learners}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-800">{course.rating}</span>
          <span className="text-xs text-slate-400">· Updated 2026</span>
        </div>

        {/* CTA */}
        <button
          onClick={onOpen}
          className="group/btn mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#1E88E5] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#1E88E5]/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(30,136,229,0.55)]"
        >
          <span>View Access</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}

// ─── Course Modal ─────────────────────────────────────────────────────────────

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [openSection, setOpenSection] = useState<string | null>("introduction");

  const sections = [
    { id: "introduction", label: "Introduction", icon: BookOpen, content: <IntroSection course={course} /> },
    { id: "objectives", label: "Learning Objectives", icon: Target, content: <ObjectivesSection course={course} /> },
    { id: "notes", label: "Complete Notes", icon: FileText, content: <NotesSection course={course} /> },
    { id: "examples", label: "Practical Examples", icon: Mic, content: <ExamplesSection course={course} /> },
    { id: "scripts", label: "Sales Scripts", icon: MessageSquare, content: <ScriptsSection course={course} /> },
    { id: "cases", label: "Case Studies", icon: TrendingUp, content: <CaseStudiesSection course={course} /> },
    { id: "assignments", label: "Assignments", icon: CheckCircle, content: <AssignmentsSection course={course} /> },
    { id: "interview", label: "Interview Questions", icon: UserCheck, content: <InterviewSection course={course} /> },
    { id: "quiz", label: "Quiz", icon: Zap, content: <QuizSection course={course} /> },
    { id: "downloads", label: "Download Resources", icon: Download, content: <DownloadsSection course={course} /> },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
      >
        {/* Banner */}
        <div className={`relative flex-shrink-0 bg-gradient-to-r ${course.gradient} px-6 pb-6 pt-8 text-white`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-2xl bg-white/20 shadow-lg ring-1 ring-white/30">
              <course.icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{course.level}</span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{course.category}</span>
              </div>
              <h2 className="mt-2 text-xl font-extrabold leading-tight">{course.title}</h2>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 opacity-90"><Clock3 className="h-4 w-4" /> {course.duration}</span>
            <span className="flex items-center gap-1.5 opacity-90"><Users className="h-4 w-4" /> {course.learners} learners</span>
            <span className="flex items-center gap-1.5 opacity-90"><Star className="h-4 w-4 fill-amber-300 text-amber-300" /> {course.rating} rating</span>
            <span className="flex items-center gap-1.5 opacity-90"><Flame className="h-4 w-4" /> Updated 2026</span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs opacity-75">
              <span>Course Progress</span><span>0%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-0 rounded-full bg-white/80" />
            </div>
          </div>
        </div>

        {/* Accordion body */}
        <div className="flex-1 overflow-y-auto">
          {sections.map(({ id, label, icon: Icon, content }) => (
            <div key={id} className="border-b border-slate-100 last:border-0">
              <button
                onClick={() => setOpenSection(openSection === id ? null : id)}
                className="flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-[#0F4C81]/8 text-[#0F4C81]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-semibold text-slate-800">{label}</span>
                {openSection === id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {openSection === id && (
                  <motion.div
                    key={id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">{content}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal Section Components ─────────────────────────────────────────────────

function IntroSection({ course }: { course: Course }) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-slate-600">{course.detail.introduction}</p>
      <div className="flex flex-wrap gap-2">
        <InfoPill icon={Award} text="Certificate on Completion" />
        <InfoPill icon={PlayCircle} text="Audio / Video Lessons" />
        <InfoPill icon={BookOpen} text="Lifetime Access" />
      </div>
    </div>
  );
}

function ObjectivesSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-2">
      {course.detail.objectives.map((obj, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1E88E5]" />
          {obj}
        </li>
      ))}
    </ul>
  );
}

function NotesSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-3">
      {course.detail.notes.map((note, i) => (
        <li key={i} className="flex items-start gap-2 rounded-xl bg-[#F8FAFC] p-3 text-sm text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F4C81] text-[10px] font-bold text-white">
            {i + 1}
          </span>
          {note}
        </li>
      ))}
    </ul>
  );
}

function ExamplesSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-2">
      {course.detail.practicalExamples.map((ex, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <Mic className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          {ex}
        </li>
      ))}
    </ul>
  );
}

function ScriptsSection({ course }: { course: Course }) {
  return (
    <div className="space-y-3">
      {course.detail.salesScripts.map((script, i) => (
        <div key={i} className="rounded-xl border border-[#1E88E5]/20 bg-[#1E88E5]/5 p-3 font-mono text-xs leading-relaxed text-slate-700">
          {script}
        </div>
      ))}
    </div>
  );
}

function CaseStudiesSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-2">
      {course.detail.caseStudies.map((cs, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0F4C81]" />
          {cs}
        </li>
      ))}
    </ul>
  );
}

function AssignmentsSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-2">
      {course.detail.assignments.map((a, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#0F4C81] text-[10px] font-bold text-[#0F4C81]">
            {i + 1}
          </span>
          {a}
        </li>
      ))}
    </ul>
  );
}

function InterviewSection({ course }: { course: Course }) {
  return (
    <ul className="space-y-2">
      {course.detail.interviewQuestions.map((q, i) => (
        <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
          <UserCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1E88E5]" />
          {q}
        </li>
      ))}
    </ul>
  );
}

function QuizSection({ course }: { course: Course }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <div className="space-y-3">
      {course.detail.quiz.map(({ q, a }, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-sm font-medium text-slate-800">Q{i + 1}: {q}</p>
          {revealed.has(i) ? (
            <p className="mt-2 text-sm text-[#0F4C81]">✓ {a}</p>
          ) : (
            <button
              onClick={() => toggle(i)}
              className="mt-2 text-xs font-semibold text-[#1E88E5] underline underline-offset-2 hover:text-[#0F4C81]"
            >
              Reveal Answer
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function DownloadsSection({ course }: { course: Course }) {
  const files = [
    { name: `${course.title} - Complete Notes.pdf`, size: "2.4 MB" },
    { name: `${course.title} - Sales Scripts.pdf`, size: "0.8 MB" },
    { name: `${course.title} - Practice Exercises.pdf`, size: "1.2 MB" },
    { name: `${course.title} - Study Resources.zip`, size: "4.1 MB" },
  ];
  return (
    <div className="space-y-2">
      {files.map((f) => (
        <div key={f.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <Download className="h-4 w-4 flex-shrink-0 text-[#0F4C81]" />
            <div>
              <p className="text-sm font-medium text-slate-800">{f.name}</p>
              <p className="text-[11px] text-slate-400">{f.size}</p>
            </div>
          </div>
          <button className="rounded-lg bg-[#0F4C81] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1E88E5]">
            Download
          </button>
        </div>
      ))}
    </div>
  );
}

function InfoPill({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
      <Icon className="h-3.5 w-3.5 text-[#1E88E5]" />
      {text}
    </span>
  );
}
