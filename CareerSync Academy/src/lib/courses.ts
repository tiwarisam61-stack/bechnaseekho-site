export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Concept = { name: string; desc: string };

export type ChapterDef = {
  title: string;
  focus: string;
  concepts: Concept[];
  example: string;
  caseStudy: string;
  tips: string[];
  quiz: { q: string; options: string[]; a: number };
};

export type Course = {
  id: string;
  title: string;
  icon: string;
  category: string;
  tagline: string;
  description: string;
  level: Level;
  duration: string;
  students: number;
  rating: number;
  updated: string;
  instructor: { name: string; role: string; initials: string };
  objectives: string[];
  chapters: ChapterDef[];
};

const q = (question: string, options: string[], a: number) => ({ q: question, options, a });

function chapter(
  title: string,
  focus: string,
  concepts: [string, string][],
  example: string,
  caseStudy: string,
  tips: string[],
  quiz: { q: string; options: string[]; a: number },
): ChapterDef {
  return {
    title,
    focus,
    concepts: concepts.map(([name, desc]) => ({ name, desc })),
    example,
    caseStudy,
    tips,
    quiz,
  };
}

export const courses: Course[] = [
  {
    id: "sales-fundamentals",
    title: "Sales Fundamentals",
    icon: "TrendingUp",
    category: "Sales",
    tagline: "Master the core habits and process behind every successful sales career.",
    description:
      "A complete grounding in modern professional selling — from understanding buyer psychology to running a disciplined pipeline. You will learn the full sales cycle, how to qualify properly, how to present value instead of features, and how to build a repeatable daily routine that produces predictable results.",
    level: "Beginner",
    duration: "6h 30m",
    students: 18420,
    rating: 4.8,
    updated: "March 2026",
    instructor: {
      name: "Instructor Placeholder",
      role: "Senior Sales Trainer, CareerSync",
      initials: "CS",
    },
    objectives: [
      "Explain the seven stages of the modern sales cycle",
      "Qualify prospects using a structured framework",
      "Translate product features into customer value",
      "Handle everyday objections with confidence",
      "Build a daily activity routine that fills the pipeline",
    ],
    chapters: [
      chapter(
        "The Modern Sales Mindset",
        "Why selling is a service profession, not a persuasion trick.",
        [
          ["Buyer-First Thinking", "Starting every conversation from the customer's problem, not your product."],
          ["Consultative Selling", "Acting as an advisor who diagnoses before prescribing a solution."],
          ["Activity Discipline", "Consistent daily prospecting effort that compounds into results."],
        ],
        "A retail advisor asks a walk-in customer what they will use the product for before quoting any price, and ends up recommending a cheaper model — winning three referrals that month.",
        "A regional team replaced monthly targets with weekly activity goals (calls, meetings, follow-ups). Within one quarter conversion rose from 11% to 19% without adding headcount.",
        [
          "Open with a question, never with a pitch.",
          "Track effort you control, not only outcomes you don't.",
          "Write one sentence of notes after every conversation.",
        ],
        q("A customer describes a problem your premium product does not solve well. The buyer-first response is to:", [
          "Recommend the cheaper option that actually fits and stay in touch",
          "Push the premium product because the margin is higher",
          "End the conversation immediately",
          "Offer a discount to close the deal today",
        ], 0),
      ),
      chapter(
        "The Sales Cycle End to End",
        "The seven stages every deal passes through and what 'done' looks like at each.",
        [
          ["Prospecting", "Finding and reaching people who plausibly have the problem you solve."],
          ["Discovery", "A structured conversation that uncovers need, urgency and budget."],
          ["Closing & Handover", "Confirming the decision and setting up a smooth first experience."],
        ],
        "A rep books a 20-minute discovery call before sending any proposal, and the proposal is accepted without a single price negotiation because it mirrors the customer's own words.",
        "A team that sent quotes before discovery had a 6% win rate. After enforcing a discovery-first rule, win rate tripled and quote volume halved.",
        [
          "Never quote before you can state the customer's problem back to them.",
          "Define an exit criterion for each stage of your pipeline.",
          "Keep the next step booked in the calendar before the call ends.",
        ],
        q("The correct exit criterion for the discovery stage is:", [
          "You can state the customer's problem, urgency and decision process",
          "The customer has your brochure",
          "You have quoted a price",
          "The customer said 'sounds interesting'",
        ], 0),
      ),
      chapter(
        "Qualifying With a Framework",
        "Spending your time on deals that can actually close.",
        [
          ["Need", "A real, articulated problem the buyer is motivated to fix."],
          ["Authority", "Knowing who signs, who influences and who can block."],
          ["Timeline", "A dated event that forces the decision to happen."],
        ],
        "Instead of chasing a 'maybe' for four months, a rep asks 'what happens if you do nothing until next year?' and learns the decision is genuinely six months out — freeing time for closer deals.",
        "An insurance branch scored every lead 1-3 on need, authority and timeline. Reps worked only 7+ scores; revenue per rep rose 34% with fewer leads.",
        [
          "Disqualify early and kindly — it is a gift to both sides.",
          "Always ask who else is involved in the decision.",
          "A deal without a date is not a deal.",
        ],
        q("Which signal most reliably indicates a qualified opportunity?", [
          "A dated business event that forces a decision",
          "The prospect was very friendly",
          "The prospect asked for a brochure",
          "The company is large",
        ], 0),
      ),
      chapter(
        "Value, Not Features",
        "Turning specifications into outcomes the buyer cares about.",
        [
          ["Feature", "A factual attribute of the product or service."],
          ["Benefit", "What that attribute allows the customer to do."],
          ["Impact", "The measurable business or personal result of that benefit."],
        ],
        "'The plan settles claims in 48 hours' becomes 'your family gets money in two days instead of two months, so nobody has to borrow during a crisis.'",
        "A B2B software rep replaced a 40-slide feature deck with a one-page impact summary in the buyer's own numbers. The average sales cycle dropped from 90 to 52 days.",
        [
          "Finish every feature sentence with 'which means that...'.",
          "Use the customer's numbers, not your marketing numbers.",
          "Three strong value points beat fifteen weak ones.",
        ],
        q("'Which means that…' is a technique used to:", [
          "Convert a feature into a customer benefit and impact",
          "Close the deal faster",
          "Avoid answering a hard question",
          "Introduce a discount",
        ], 0),
      ),
      chapter(
        "Pipeline, Follow-Up and Consistency",
        "The unglamorous routine that separates top performers from the rest.",
        [
          ["Pipeline Coverage", "Holding 3-4x your target in qualified value at all times."],
          ["Follow-Up Cadence", "A planned sequence of touches with new value in each one."],
          ["Review Rhythm", "A weekly self-review of activity, conversion and lost reasons."],
        ],
        "A rep sends five follow-ups over three weeks — each one adding a case study, a calculator or an answer — instead of five 'just checking in' messages. Reply rate doubles.",
        "A rental sales team logged every lost deal reason for a quarter. 41% were 'no follow-up after week one'. A simple three-touch rule recovered 18% of them.",
        [
          "Never end a touch without giving something new.",
          "Book the next step during the current step.",
          "Review your lost deals monthly — they are your syllabus.",
        ],
        q("Healthy pipeline coverage for a monthly target is generally:", [
          "3-4x the target in qualified value",
          "Exactly 1x the target",
          "10x the target regardless of quality",
          "Coverage does not matter if you work hard",
        ], 0),
      ),
    ],
  },
  {
    id: "insurance-sales",
    title: "Insurance Sales",
    icon: "ShieldCheck",
    category: "Insurance",
    tagline: "Sell protection ethically with needs analysis, trust and clean compliance.",
    description:
      "Learn how professional insurance advisors build lifetime client relationships: understanding products, running an honest needs analysis, explaining premiums and exclusions clearly, handling trust objections, and servicing renewals and claims so referrals follow naturally.",
    level: "Intermediate",
    duration: "7h 10m",
    students: 12980,
    rating: 4.7,
    updated: "February 2026",
    instructor: { name: "Instructor Placeholder", role: "Insurance Practice Lead", initials: "CS" },
    objectives: [
      "Differentiate the main categories of personal and commercial cover",
      "Run a structured needs analysis and calculate a protection gap",
      "Explain premium, exclusions and claim process in plain language",
      "Handle trust, price and 'I'll think about it' objections",
      "Build a renewal and referral engine from your existing book",
    ],
    chapters: [
      chapter(
        "Understanding the Products",
        "What each policy actually protects and who it is right for.",
        [
          ["Term Life", "Pure protection for a fixed period at the lowest premium per unit of cover."],
          ["Health & Indemnity", "Cover that reimburses or cashlessly settles medical expenses."],
          ["General & Liability", "Protection for assets and third-party responsibilities."],
        ],
        "A 32-year-old with two dependants is shown term cover of 10x income instead of a savings-linked plan — three times the protection for a third of the premium.",
        "An advisor audited 50 existing clients and found 60% were over-insured on savings plans and under-insured on health. Restructuring raised client retention to 94%.",
        [
          "Match the product to the risk, never to the commission.",
          "Explain what is NOT covered before the client asks.",
          "Keep a one-page comparison for every product family.",
        ],
        q("Term life insurance is best described as:", [
          "Maximum protection for a fixed period at the lowest cost",
          "A guaranteed investment product",
          "A short-term savings account",
          "Cover for medical bills only",
        ], 0),
      ),
      chapter(
        "The Needs Analysis Conversation",
        "Quantifying the protection gap before recommending anything.",
        [
          ["Income Replacement", "How many years of income the family would need if income stopped."],
          ["Liability Mapping", "Loans and obligations that would transfer to the family."],
          ["Protection Gap", "Required cover minus existing cover and liquid assets."],
        ],
        "An advisor sketches the client's numbers on one sheet: 12 years of income, a home loan, minus existing group cover — the gap is visible in two minutes and sells itself.",
        "A branch introduced a mandatory one-page gap worksheet. Average cover per policy rose 45% while complaints dropped, because clients understood what they bought.",
        [
          "Let the client hold the pen while you calculate.",
          "Always subtract existing employer cover — honesty builds trust.",
          "A number on paper is more persuasive than any adjective.",
        ],
        q("The protection gap equals:", [
          "Required cover minus existing cover and liquid assets",
          "Annual income times the premium rate",
          "The commission on the policy",
          "The sum of all premiums paid",
        ], 0),
      ),
      chapter(
        "Explaining Premium, Terms and Exclusions",
        "Transparent explanation as a competitive advantage.",
        [
          ["Premium Drivers", "Age, health, cover amount and term determine the price."],
          ["Waiting Periods", "Time-bound conditions before certain benefits become claimable."],
          ["Disclosure Duty", "The client's obligation to declare material facts accurately."],
        ],
        "Before signing, the advisor reads the three main exclusions aloud and has the client repeat them back — eliminating the most common cause of claim disputes.",
        "A team that added a two-minute 'exclusions read-back' to every sale saw claim-stage complaints fall by 70% and referrals rise sharply.",
        [
          "Never let a client discover an exclusion at claim time.",
          "Explain waiting periods with a calendar date, not a duration.",
          "Document every disclosure in writing.",
        ],
        q("Reading exclusions aloud before signing primarily:", [
          "Prevents claim-time disputes and builds long-term trust",
          "Slows the sale down for no benefit",
          "Is only required for health policies",
          "Reduces the premium",
        ], 0),
      ),
      chapter(
        "Objection Handling and Trust",
        "Answering scepticism about insurance with evidence and empathy.",
        [
          ["Trust Objection", "Doubt about whether claims are actually paid."],
          ["Affordability Objection", "The premium feels large relative to perceived risk."],
          ["Delay Objection", "'I'll think about it' — usually an unresolved concern."],
        ],
        "To 'do they even pay claims?', the advisor shares the insurer's published claim settlement ratio and a two-line anonymised story of a settled claim.",
        "An advisor kept a folder of five settled-claim stories. Conversion on first meetings improved from 22% to 38% with no change in product or price.",
        [
          "Answer the trust objection with data, not adjectives.",
          "Reframe affordability as cost per day.",
          "Behind 'I'll think about it' is always a specific unspoken worry — ask for it.",
        ],
        q("The most effective response to 'do insurers actually pay claims?' is:", [
          "Published settlement data plus a real settled-claim story",
          "Assuring them your company is the best",
          "Offering a discount",
          "Changing the subject to features",
        ], 0),
      ),
      chapter(
        "Renewals, Service and Referrals",
        "Turning one policy into a twenty-year relationship.",
        [
          ["Renewal Discipline", "Contacting clients well before lapse with a review, not a reminder."],
          ["Claim Advocacy", "Guiding the client personally through the claim process."],
          ["Referral Moment", "Asking for introductions right after a service win."],
        ],
        "After helping a client settle a hospital claim, the advisor asks: 'who else in your family should I run a five-minute check for?' — two policies follow.",
        "An advisor with a 400-client book scheduled annual reviews for every client. Renewal persistency reached 96% and half of new business came from referrals.",
        [
          "Call before renewal with a review, not an invoice.",
          "Be present during claims — that is when loyalty is made.",
          "Ask for referrals after service, never during the sale.",
        ],
        q("The best moment to ask for a referral is:", [
          "Straight after a service win such as a settled claim",
          "During the first sales pitch",
          "When the client is negotiating price",
          "Never — referrals should be spontaneous",
        ], 0),
      ),
    ],
  },
  {
    id: "b2b-sales",
    title: "B2B Sales",
    icon: "Building2",
    category: "Business",
    tagline: "Win complex, multi-stakeholder deals with structure and business cases.",
    description:
      "A practitioner's guide to business-to-business selling: mapping buying committees, running executive discovery, building a defensible business case, navigating procurement and managing long cycles without losing momentum.",
    level: "Advanced",
    duration: "8h 15m",
    students: 9640,
    rating: 4.9,
    updated: "March 2026",
    instructor: { name: "Instructor Placeholder", role: "Enterprise Sales Coach", initials: "CS" },
    objectives: [
      "Map a buying committee and identify the economic buyer",
      "Run discovery that surfaces measurable business pain",
      "Build an ROI-backed business case",
      "Navigate procurement, legal and security reviews",
      "Manage multi-month cycles with mutual action plans",
    ],
    chapters: [
      chapter(
        "The Buying Committee",
        "Who really decides, and how to reach each of them.",
        [
          ["Economic Buyer", "The person who owns the budget and can say yes alone."],
          ["Champion", "An internal advocate who sells on your behalf when you are absent."],
          ["Blocker", "A stakeholder whose risk or workload increases if you win."],
        ],
        "A rep discovers the IT security lead — never invited to calls — can veto the purchase, and proactively sends a security pack in week one.",
        "An enterprise deal stalled twice at 'final approval'. Mapping revealed a finance stakeholder nobody had met. One 30-minute call unblocked a nine-month cycle.",
        [
          "Draw the org chart in week one and keep it updated.",
          "Never rely on a single contact, however friendly.",
          "Find the blocker early and give them a reason to say yes.",
        ],
        q("In a B2B deal, the champion is best defined as:", [
          "An internal advocate who advances the deal when you are not in the room",
          "The person who signs the contract",
          "The procurement manager",
          "Your own sales manager",
        ], 0),
      ),
      chapter(
        "Executive Discovery",
        "Asking questions that a CFO would find worth their time.",
        [
          ["Business Pain", "A problem with a cost that appears in a report someone owns."],
          ["Metric Anchoring", "Tying the conversation to a KPI the executive is measured on."],
          ["Cost of Inaction", "What continuing the status quo costs per month."],
        ],
        "Rather than asking 'what are your challenges?', the rep asks 'what does an hour of unplanned downtime cost you?' — and gets a number that frames the whole deal.",
        "A vendor quantified a client's manual reconciliation cost at 1,400 hours a year. The business case wrote itself and the deal closed at full list price.",
        [
          "Turn every pain into a number before you propose.",
          "Ask what the executive is measured on this year.",
          "Cost of inaction is your strongest competitor-neutral argument.",
        ],
        q("Which discovery question is most executive-ready?", [
          "What does an hour of unplanned downtime cost you?",
          "What are your biggest challenges?",
          "Do you like our product?",
          "Who is your current vendor?",
        ], 0),
      ),
      chapter(
        "Building the Business Case",
        "Turning discovery into a document that survives without you.",
        [
          ["ROI Model", "A conservative calculation of gain versus total cost of ownership."],
          ["Payback Period", "The time until cumulative benefit exceeds investment."],
          ["Risk Mitigation", "Explicitly naming and neutralising the buyer's downside."],
        ],
        "A one-page case shows a 7-month payback using the client's own conservative numbers, with a pilot clause that caps their risk.",
        "Two vendors were shortlisted at similar prices. The one that supplied an editable ROI model the champion could present internally won the deal.",
        [
          "Always use the buyer's numbers and round them down.",
          "Give the champion a document they can forward unedited.",
          "Name the risks yourself before procurement does.",
        ],
        q("The strongest business case is one that:", [
          "Uses the buyer's own conservative numbers and can be forwarded internally",
          "Uses your best-case marketing figures",
          "Contains as many slides as possible",
          "Avoids mentioning any risk",
        ], 0),
      ),
      chapter(
        "Procurement, Legal and Security",
        "Getting through the gauntlet without giving away margin.",
        [
          ["Procurement Playbook", "The standard tactics used to extract discount and terms."],
          ["Trade, Don't Give", "Every concession is exchanged for something of value."],
          ["Paper Process", "Security reviews, MSAs and redlines that consume calendar time."],
        ],
        "Asked for 20% off, the rep offers 8% in exchange for a two-year term and a case study — protecting price per year and gaining a reference.",
        "A team that started security questionnaires at proposal stage instead of contract stage shortened cycles by an average of 23 days.",
        [
          "Never discount without receiving something in return.",
          "Start compliance paperwork before you need it.",
          "Keep the champion engaged during procurement — deals die in silence.",
        ],
        q("When procurement demands a discount, the professional response is to:", [
          "Trade the concession for term length, volume or a reference",
          "Agree immediately to avoid losing the deal",
          "Refuse to discuss commercials",
          "Escalate to the CEO",
        ], 0),
      ),
      chapter(
        "Managing Long Cycles",
        "Keeping momentum across months and stakeholder changes.",
        [
          ["Mutual Action Plan", "A shared dated plan of steps owned by both sides."],
          ["Momentum Signals", "Observable buyer actions that prove real progress."],
          ["Deal Hygiene", "Accurate CRM stages, next steps and close dates."],
        ],
        "A shared plan lists eleven steps with owners and dates. When the champion leaves, the successor inherits the plan and the deal survives.",
        "A quarter-end review showed 60% of slipped deals had no scheduled next step. Enforcing a booked next step at every stage cut slippage in half.",
        [
          "A deal without a booked next meeting is at risk today.",
          "Trust buyer actions, not buyer enthusiasm.",
          "Re-qualify every deal older than one cycle length.",
        ],
        q("The most reliable indicator of real deal momentum is:", [
          "Buyer actions such as scheduled reviews and completed steps",
          "How positive the buyer sounds on calls",
          "The number of emails exchanged",
          "How much you like the champion",
        ], 0),
      ),
    ],
  },
  {
    id: "rental-sales",
    title: "Rental Sales",
    icon: "Home",
    category: "Sales",
    tagline: "Convert enquiries into signed rentals with fast, trustworthy service.",
    description:
      "Built for property, equipment and vehicle rental professionals: qualifying enquiries in minutes, running site visits that convert, presenting pricing and deposits clearly, closing the agreement and keeping occupancy high through renewals.",
    level: "Beginner",
    duration: "5h 45m",
    students: 7310,
    rating: 4.6,
    updated: "January 2026",
    instructor: { name: "Instructor Placeholder", role: "Rental Operations Trainer", initials: "CS" },
    objectives: [
      "Qualify a rental enquiry in under five minutes",
      "Run a site visit or demo that creates preference",
      "Present pricing, deposit and terms without friction",
      "Close the agreement and complete documentation cleanly",
      "Increase renewals and reduce vacancy or idle time",
    ],
    chapters: [
      chapter(
        "Qualifying the Enquiry Fast",
        "Speed and the right five questions decide who wins the rental.",
        [
          ["Response Speed", "Replying within minutes while intent is still high."],
          ["Fit Criteria", "Budget, dates, duration and non-negotiable requirements."],
          ["Urgency Read", "How soon the customer must have the asset in use."],
        ],
        "A five-minute call establishes move-in date, budget band and parking need — allowing the agent to shortlist two units instead of showing seven.",
        "An agency that answered every enquiry within 10 minutes converted 2.4x better than competitors who replied the next day with identical inventory.",
        [
          "Speed of first response beats depth of first response.",
          "Confirm dates and budget before scheduling anything.",
          "Never show more than three options.",
        ],
        q("The single biggest driver of rental enquiry conversion is usually:", [
          "Speed of first response",
          "The length of the brochure",
          "Offering the lowest price",
          "Number of options shown",
        ], 0),
      ),
      chapter(
        "The Site Visit or Demo",
        "Choreographing the viewing so the customer imagines using it.",
        [
          ["Visit Sequence", "Ordering what you show so the strongest feature lands last."],
          ["Ownership Language", "Helping the customer picture themselves using the asset."],
          ["Objection Pre-empting", "Naming a known drawback before the customer finds it."],
        ],
        "The agent mentions the noisy road up front, then ends the tour on the balcony view — the drawback loses weight and the highlight is remembered.",
        "Two agents showed the same unit. The one who pre-empted the drawback and closed on the best feature converted; the other lost the client to distrust.",
        [
          "End every viewing on the strongest feature.",
          "Say the flaw before they spot it — credibility rises.",
          "Ask 'how would you use this space?' during the visit.",
        ],
        q("Pre-empting a known drawback during a viewing tends to:", [
          "Increase credibility and reduce its perceived weight",
          "Lose the deal immediately",
          "Only work for luxury properties",
          "Reduce the rent achievable",
        ], 0),
      ),
      chapter(
        "Pricing, Deposits and Terms",
        "Presenting the full cost with zero surprises.",
        [
          ["Total Cost Clarity", "Rent plus deposit, maintenance and fees stated together."],
          ["Deposit Rationale", "Explaining what the deposit protects and how it returns."],
          ["Term Flexibility", "Using duration and start date as negotiation levers."],
        ],
        "Instead of quoting rent alone, the agent presents a simple monthly total table — the customer signs without the usual late-stage haggling.",
        "A rental firm introduced a one-page all-inclusive cost sheet. Cancellation after agreement fell from 14% to 4%.",
        [
          "Quote the total, never just the headline rent.",
          "Explain deposit return conditions in writing.",
          "Trade a lower rate for a longer term.",
        ],
        q("Presenting an all-inclusive cost sheet primarily reduces:", [
          "Late-stage cancellations caused by surprise charges",
          "The rent you can charge",
          "The need for a site visit",
          "The deposit amount",
        ], 0),
      ),
      chapter(
        "Closing the Agreement",
        "Moving from 'we like it' to a signed, documented rental.",
        [
          ["Assumptive Next Step", "Proposing the documentation step as the natural continuation."],
          ["Verification", "Collecting identity, references and payment reliably."],
          ["Handover Checklist", "A recorded condition check that protects both parties."],
        ],
        "'Shall I hold this for you and start the paperwork today?' converts interest into commitment before the customer sees another unit.",
        "Adding photo-documented handover checklists cut deposit disputes by 80% and increased positive reviews.",
        [
          "Ask for the booking — most agents never do.",
          "Photograph condition at handover, always.",
          "Make signing the easiest step of the journey.",
        ],
        q("A handover condition checklist with photos mainly protects against:", [
          "Deposit and damage disputes at exit",
          "Late rent payments",
          "Low occupancy",
          "Competitor pricing",
        ], 0),
      ),
      chapter(
        "Renewals and Occupancy",
        "Keeping assets earning and customers returning.",
        [
          ["Renewal Window", "Starting the renewal conversation 60-90 days before expiry."],
          ["Idle Cost", "The revenue lost for every day an asset sits unused."],
          ["Relationship Service", "Small proactive service acts that make renewal automatic."],
        ],
        "A proactive maintenance visit two months before expiry turns a price-sensitive tenant into an easy renewal at a 5% uplift.",
        "A fleet business that called customers 45 days before contract end lifted renewal rates from 51% to 78% within two quarters.",
        [
          "Renewal is won three months before it is due.",
          "Every idle day is priced — know your number.",
          "Fix small issues fast; they decide renewals.",
        ],
        q("Renewal conversations should ideally begin:", [
          "60-90 days before the contract expires",
          "On the day of expiry",
          "After the customer gives notice",
          "Only if the customer asks",
        ], 0),
      ),
    ],
  },
  {
    id: "cold-calling",
    title: "Cold Calling",
    icon: "PhoneCall",
    category: "Sales",
    tagline: "Earn attention in the first ten seconds and book more meetings.",
    description:
      "A practical system for outbound calling: building a focused list, writing an opener that survives the first ten seconds, handling brush-offs, gatekeepers and voicemail, and running a call block that produces meetings every single day.",
    level: "Intermediate",
    duration: "5h 20m",
    students: 15250,
    rating: 4.7,
    updated: "March 2026",
    instructor: { name: "Instructor Placeholder", role: "Outbound Coach", initials: "CS" },
    objectives: [
      "Build a tight, research-backed calling list",
      "Deliver a ten-second opener that earns permission",
      "Handle brush-offs and gatekeepers professionally",
      "Leave voicemails that get returned",
      "Run a disciplined daily call block",
    ],
    chapters: [
      chapter(
        "Preparation and List Quality",
        "Ninety percent of call results are decided before you dial.",
        [
          ["Ideal Profile", "The narrow segment where your solution obviously fits."],
          ["Trigger Event", "A recent change that makes the call timely and relevant."],
          ["Pre-Call Research", "Two facts about the company that shape your opener."],
        ],
        "Seeing a company announce a new branch, the caller opens with 'I saw you're opening in the north zone — most teams hit a hiring bottleneck at that stage.'",
        "A team cut its calling list by 70% and researched each account for two minutes. Connect-to-meeting rate rose from 4% to 13%.",
        [
          "A smaller researched list beats a huge cold list.",
          "One relevant trigger changes the whole call.",
          "Never dial without knowing why them, why now.",
        ],
        q("A trigger event is valuable because it:", [
          "Makes the call timely and relevant to something happening now",
          "Gives you the prospect's phone number",
          "Guarantees a sale",
          "Replaces the need for a pitch",
        ], 0),
      ),
      chapter(
        "The Ten-Second Opener",
        "Earning permission instead of demanding attention.",
        [
          ["Pattern Interrupt", "An honest, unusual opening that avoids the salesperson script."],
          ["Permission Ask", "Explicitly requesting 30 seconds and honouring it."],
          ["Relevance Statement", "One sentence that names their likely problem."],
        ],
        "'Hi Ravi, this is a cold call — can I have 30 seconds to tell you why, and you decide if it's worth continuing?' Most people say yes.",
        "Reps who asked permission in the opener had 2.1x longer average call duration and significantly fewer hostile hang-ups.",
        [
          "Honesty disarms — say it is a cold call.",
          "Ask for a specific, small amount of time.",
          "Never open with 'how are you today?'",
        ],
        q("Asking 'can I have 30 seconds?' at the start of a cold call works because it:", [
          "Gives the prospect control and lowers resistance",
          "Hides your intent",
          "Shortens the sales cycle automatically",
          "Avoids the need for research",
        ], 0),
      ),
      chapter(
        "Brush-Offs and Gatekeepers",
        "Staying in the conversation without being pushy.",
        [
          ["Brush-Off vs Objection", "A reflex to end the call versus a genuine concern."],
          ["Acknowledge & Redirect", "Validating the reflex, then offering one relevant reason to continue."],
          ["Gatekeeper Respect", "Treating the assistant as a decision-influencer, not an obstacle."],
        ],
        "To 'send me an email', the caller replies 'happy to — so I send the right one, are you handling this yourself or is it someone else's area?'",
        "A caller who asked gatekeepers for advice ('who should I speak to about fleet costs?') reached decision-makers 3x more often than one who used tricks.",
        [
          "'Not interested' in the first ten seconds is a reflex, not a decision.",
          "Never deceive a gatekeeper — ask for help instead.",
          "Earn one more sentence, not the whole meeting.",
        ],
        q("'Send me an email' early in a cold call is usually:", [
          "A brush-off reflex you can politely redirect with one question",
          "A firm purchase decision",
          "A signal to end all contact",
          "A request for a discount",
        ], 0),
      ),
      chapter(
        "Voicemail and Multi-Channel Follow-Up",
        "Making the 80% of calls that go unanswered still count.",
        [
          ["Callback Voicemail", "A 20-second message with name, reason and a specific next action."],
          ["Channel Stack", "Combining call, email and social touches in one sequence."],
          ["Touch Spacing", "Timing touches so persistence never becomes pestering."],
        ],
        "A 20-second voicemail is followed by an email with the same subject line — reply rate roughly triples compared to either alone.",
        "A sequence of six touches across three channels over twelve days generated 74% of one team's meetings; most came from touches four to six.",
        [
          "Keep voicemails under 25 seconds.",
          "Reference the voicemail in your email subject line.",
          "Most meetings come after the third touch — plan for it.",
        ],
        q("An effective cold-call voicemail should:", [
          "Be under 25 seconds with a clear reason and next action",
          "Explain the full product",
          "Be repeated daily",
          "Avoid leaving your name",
        ], 0),
      ),
      chapter(
        "Call Blocks and Resilience",
        "Protecting energy and consistency over months, not days.",
        [
          ["Call Block", "A protected, distraction-free window dedicated only to dialling."],
          ["Rejection Framing", "Treating a no as a statistic, not a personal verdict."],
          ["Self-Review", "Listening back to calls weekly to fix one specific habit."],
        ],
        "Ninety minutes, phone-only, notifications off, 45 dials — one focused block outperforms a whole scattered day.",
        "A rep tracked dials-per-meeting at 28. Knowing the ratio turned every rejection into measurable progress toward the next meeting.",
        [
          "Batch your calls; context switching kills output.",
          "Know your dials-per-meeting number.",
          "Improve one habit per week, not everything at once.",
        ],
        q("Knowing your dials-per-meeting ratio helps mainly by:", [
          "Reframing rejection as measurable progress",
          "Reducing the number of calls needed to zero",
          "Removing the need for research",
          "Guaranteeing a higher close rate",
        ], 0),
      ),
    ],
  },
  {
    id: "communication-skills",
    title: "Communication Skills",
    icon: "MessagesSquare",
    category: "Communication",
    tagline: "Be clear, credible and persuasive in every professional conversation.",
    description:
      "Develop the communication toolkit that underpins every sales and career skill: active listening, structured speaking, confident body language and tone, written clarity, and difficult conversations handled with composure.",
    level: "Beginner",
    duration: "6h 00m",
    students: 21870,
    rating: 4.9,
    updated: "February 2026",
    instructor: { name: "Instructor Placeholder", role: "Communication Faculty", initials: "CS" },
    objectives: [
      "Practise active listening that makes people feel understood",
      "Structure any message in under 60 seconds",
      "Use voice, pace and body language deliberately",
      "Write emails and messages that get replies",
      "Stay composed in difficult conversations",
    ],
    chapters: [
      chapter(
        "Active Listening",
        "The skill that makes every other communication skill work.",
        [
          ["Full Attention", "Listening to understand rather than to reply."],
          ["Paraphrasing", "Restating the speaker's point in your own words for confirmation."],
          ["Silence Tolerance", "Allowing pauses so the other person can complete their thought."],
        ],
        "'So if I've understood, the real issue is the delay at handover, not the price?' — the customer relaxes and reveals the true blocker.",
        "A support team trained in paraphrasing reduced escalations by 32% without changing a single policy.",
        [
          "Pause two seconds before responding.",
          "Paraphrase before you disagree.",
          "Take notes — it visibly signals attention.",
        ],
        q("Paraphrasing during a conversation mainly serves to:", [
          "Confirm understanding and make the speaker feel heard",
          "Fill silence",
          "Show off your vocabulary",
          "Speed up the conversation",
        ], 0),
      ),
      chapter(
        "Structured Speaking",
        "Getting to the point without losing the point.",
        [
          ["Point-First", "Leading with the conclusion, then the reasons."],
          ["Rule of Three", "Grouping supporting ideas into three memorable parts."],
          ["Signposting", "Telling the listener where you are going before you go there."],
        ],
        "'I recommend option B. Three reasons: cost, speed, and risk.' The room follows effortlessly and decides in minutes.",
        "A manager who switched from chronological updates to point-first summaries cut meeting length by 40% and got faster approvals.",
        [
          "State your conclusion in the first sentence.",
          "Three reasons — no more.",
          "Signpost: 'I'll cover two things...'",
        ],
        q("Point-first communication means:", [
          "Leading with your conclusion, then giving the reasons",
          "Telling the story in chronological order",
          "Saving the recommendation for the end",
          "Speaking as briefly as possible regardless of clarity",
        ], 0),
      ),
      chapter(
        "Voice, Tone and Body Language",
        "How you say it decides whether it is believed.",
        [
          ["Pace Control", "Slowing down at important points to signal weight."],
          ["Vocal Warmth", "A tone that conveys interest and respect."],
          ["Open Posture", "Body language that signals confidence and receptiveness."],
        ],
        "A nervous presenter slows their pace by 20% and pauses after each key point — audience rating of 'confidence' rises sharply with identical content.",
        "In recorded sales calls, reps who spoke slightly slower than their prospect had measurably higher meeting-conversion rates.",
        [
          "Pause instead of saying 'um'.",
          "Match your customer's pace, then slow slightly.",
          "Smile on the phone — it is audible.",
        ],
        q("Deliberately slowing your pace at key moments:", [
          "Signals importance and increases perceived confidence",
          "Makes you sound unsure",
          "Should be avoided on calls",
          "Only matters in presentations",
        ], 0),
      ),
      chapter(
        "Professional Writing",
        "Emails and messages that respect the reader's time.",
        [
          ["Subject Clarity", "A subject line that states the ask or outcome."],
          ["One Ask Rule", "Each message carries a single, obvious action."],
          ["Scannable Format", "Short paragraphs, bullets and bolded decisions."],
        ],
        "A five-line email with a bolded question and two bullets gets a reply in an hour; the previous three-paragraph version was ignored for a week.",
        "A team rewrote its proposal emails to one screen with one call to action. Response rate went from 21% to 49%.",
        [
          "One email, one ask.",
          "Put the question in the first two lines.",
          "If it needs scrolling, it needs cutting.",
        ],
        q("The 'one ask rule' means each message should:", [
          "Contain a single clear action for the reader",
          "Be under ten words",
          "Never include attachments",
          "Ask for a meeting every time",
        ], 0),
      ),
      chapter(
        "Difficult Conversations",
        "Staying calm, fair and effective under pressure.",
        [
          ["Emotional Regulation", "Managing your own reaction before responding."],
          ["Fact-Feeling-Ask", "A three-part structure for raising a hard issue."],
          ["Repair Statement", "Language that preserves the relationship after conflict."],
        ],
        "'The delivery slipped twice (fact), that put my commitment at risk (feeling), can we agree a fixed date today (ask)?' — conflict becomes a plan.",
        "A service manager who used fact-feeling-ask in escalations retained 9 of 11 at-risk accounts in a single quarter.",
        [
          "Breathe once before responding to provocation.",
          "Attack the problem, never the person.",
          "End every hard conversation with an agreed next step.",
        ],
        q("The fact-feeling-ask structure is used to:", [
          "Raise a difficult issue clearly without damaging the relationship",
          "Win an argument",
          "Avoid conflict entirely",
          "Deliver good news",
        ], 0),
      ),
    ],
  },
  {
    id: "closing-techniques",
    title: "Closing Techniques",
    icon: "Handshake",
    category: "Sales",
    tagline: "Ask for the decision with confidence, ethics and timing.",
    description:
      "Closing is the natural end of a well-run process. Learn to read buying signals, choose the right closing question, resolve final objections, create honest urgency and secure commitment without pressure tactics.",
    level: "Intermediate",
    duration: "5h 30m",
    students: 14110,
    rating: 4.8,
    updated: "March 2026",
    instructor: { name: "Instructor Placeholder", role: "Closing Skills Trainer", initials: "CS" },
    objectives: [
      "Recognise verbal and behavioural buying signals",
      "Select the appropriate closing technique for the situation",
      "Resolve last-minute objections without discounting",
      "Create urgency that is honest and credible",
      "Confirm commitment and prevent post-decision regret",
    ],
    chapters: [
      chapter(
        "Reading Buying Signals",
        "Knowing the exact moment to ask.",
        [
          ["Verbal Signal", "Questions about delivery, onboarding, payment or 'we'."],
          ["Behavioural Signal", "Involving colleagues, requesting documents, re-reading terms."],
          ["Premature Close", "Asking before value is established, which creates resistance."],
        ],
        "The buyer asks 'how quickly could you install it?' — the rep stops presenting and asks for the decision.",
        "Call analysis showed top performers stopped presenting on average 4 minutes after the first buying signal; average performers kept pitching for 11.",
        [
          "When they talk about 'after', it is time to close.",
          "Stop selling the moment they start buying.",
          "Silence after your close is the buyer thinking — let it work.",
        ],
        q("Which is the clearest buying signal?", [
          "The buyer asks how quickly implementation could start",
          "The buyer asks for a brochure",
          "The buyer is friendly",
          "The buyer asks who your competitors are",
        ], 0),
      ),
      chapter(
        "Core Closing Techniques",
        "A toolkit of honest closes and when to use each.",
        [
          ["Summary Close", "Recapping agreed value, then asking for the decision."],
          ["Alternative Close", "Offering two acceptable paths forward rather than yes/no."],
          ["Assumptive Close", "Proceeding to the next practical step naturally."],
        ],
        "'We agreed on the three outcomes and the 12-month term — shall we start on the 1st or the 15th?'",
        "A team standardised the summary close for proposals over a threshold. Win rate on those deals improved 12 points in one quarter.",
        [
          "Summarise in the customer's own words.",
          "Two good options beat one ultimatum.",
          "Ask once, then stop talking.",
        ],
        q("The alternative close works by:", [
          "Offering two acceptable ways forward instead of a yes/no choice",
          "Forcing a discount decision",
          "Threatening to withdraw the offer",
          "Repeating all product features",
        ], 0),
      ),
      chapter(
        "Handling Final Objections",
        "The last worry is rarely about price.",
        [
          ["Isolate", "Confirming this is the only remaining barrier."],
          ["Root Cause", "Finding the real concern hidden behind the stated one."],
          ["Value Re-anchor", "Returning to the agreed impact before discussing price."],
        ],
        "'If we solved the training concern today, is there anything else stopping us?' — the real blocker surfaces and gets solved.",
        "A rep facing a 'too expensive' objection re-anchored on a 9-month payback and closed at full price; the objection had been about internal approval risk.",
        [
          "Isolate before you answer.",
          "Never discount to solve a non-price objection.",
          "Ask 'what would need to be true for this to be a yes?'",
        ],
        q("Isolating an objection means:", [
          "Confirming it is the only remaining barrier before solving it",
          "Ignoring it until the contract stage",
          "Offering a discount straight away",
          "Escalating to a manager",
        ], 0),
      ),
      chapter(
        "Honest Urgency",
        "Time pressure that is real, or none at all.",
        [
          ["Real Deadline", "A genuine constraint such as capacity, pricing cycle or the buyer's own event."],
          ["Cost of Delay", "Quantifying what waiting costs the buyer each month."],
          ["Manufactured Pressure", "Fake scarcity that destroys trust and invites churn."],
        ],
        "'Your renewal is on the 30th — if we don't start by the 12th you'll pay double for a month.' The urgency belongs to the buyer, not the seller.",
        "A company banned fake discount deadlines. Short-term closes dipped for a month, then referrals and renewal rates rose to record levels.",
        [
          "Urgency should come from the buyer's calendar.",
          "Quantify the monthly cost of waiting.",
          "Never invent scarcity.",
        ],
        q("Honest urgency is best built on:", [
          "A real constraint in the buyer's own calendar or costs",
          "An invented limited-time discount",
          "Telling the buyer stock is nearly gone",
          "Repeating the offer daily",
        ], 0),
      ),
      chapter(
        "Confirming Commitment",
        "Making the yes stick after the meeting ends.",
        [
          ["Decision Recap", "Written confirmation of what was agreed and why."],
          ["Buyer's Remorse", "Post-decision doubt that arrives within 48 hours."],
          ["Onboarding Bridge", "Immediately connecting the buyer to their first success step."],
        ],
        "Within an hour of the yes, the buyer receives a short recap, a start date and an introduction to their onboarding contact — cancellations stop.",
        "Adding a 24-hour 'welcome and reassure' call reduced first-month cancellations by 60% across a 200-person sales floor.",
        [
          "Send the recap the same day.",
          "Call within 48 hours to reassure.",
          "The first success moment should be scheduled at closing.",
        ],
        q("Post-decision reassurance within 48 hours mainly reduces:", [
          "Buyer's remorse and early cancellation",
          "The contract value",
          "Onboarding workload",
          "The need for a recap email",
        ], 0),
      ),
    ],
  },
  {
    id: "customer-handling",
    title: "Customer Handling",
    icon: "HeartHandshake",
    category: "Communication",
    tagline: "Turn complaints and everyday service into loyalty and referrals.",
    description:
      "Service excellence as a revenue skill: understanding customer expectations, handling angry customers with a proven recovery framework, managing escalations, and creating advocates through proactive follow-up.",
    level: "Beginner",
    duration: "5h 10m",
    students: 16740,
    rating: 4.7,
    updated: "January 2026",
    instructor: { name: "Instructor Placeholder", role: "Customer Experience Lead", initials: "CS" },
    objectives: [
      "Map customer expectations and moments of truth",
      "Apply a five-step service recovery framework",
      "De-escalate angry customers calmly",
      "Set and manage expectations proactively",
      "Convert resolved issues into referrals",
    ],
    chapters: [
      chapter(
        "Expectations and Moments of Truth",
        "Satisfaction is expectation minus experience.",
        [
          ["Moment of Truth", "An interaction that disproportionately shapes the customer's opinion."],
          ["Expectation Setting", "Promising accurately, then delivering slightly better."],
          ["Effort Score", "How hard the customer had to work to get what they needed."],
        ],
        "Promising delivery in five days and arriving in three creates delight; promising two and arriving in three creates a complaint — same day, opposite outcome.",
        "A bank mapped its top five moments of truth and fixed only the onboarding call. NPS rose 18 points across the whole journey.",
        [
          "Under-promise on time, over-deliver on care.",
          "Reduce customer effort before adding perks.",
          "Know your three moments of truth.",
        ],
        q("Delivering in three days after promising five feels better than promising two because:", [
          "Satisfaction is driven by experience relative to expectation",
          "Customers prefer longer waits",
          "Three days is objectively fast",
          "Promises do not affect perception",
        ], 0),
      ),
      chapter(
        "Service Recovery Framework",
        "A repeatable five-step response to any failure.",
        [
          ["Acknowledge", "Naming the problem and its impact without defensiveness."],
          ["Own and Act", "Taking responsibility and stating exactly what you will do."],
          ["Follow Through", "Closing the loop personally after the fix."],
        ],
        "'You were promised a callback yesterday and didn't get one. That's on us. I'll fix the booking now and call you at 4 to confirm.'",
        "A telecom team using acknowledge-own-act-follow retained 71% of customers who had threatened to leave, versus 38% before.",
        [
          "Apologise for the impact, not just the inconvenience.",
          "Give a specific time, then beat it.",
          "The follow-up call is what creates loyalty.",
        ],
        q("The step most often skipped in service recovery — and most responsible for loyalty — is:", [
          "Following through personally after the fix",
          "Apologising",
          "Logging the ticket",
          "Escalating to a manager",
        ], 0),
      ),
      chapter(
        "De-escalating Angry Customers",
        "Lowering the temperature before solving the problem.",
        [
          ["Emotion First", "Addressing the feeling before the facts."],
          ["Neutral Language", "Word choices that avoid blame and defensiveness."],
          ["Control Transfer", "Giving the customer a choice to restore their sense of control."],
        ],
        "'I can hear how frustrating this has been. Would you like me to fix it now on this call, or call you back within the hour with a full answer?'",
        "Contact-centre data showed calls where the agent named the emotion in the first 30 seconds were 44% shorter and rated far higher.",
        [
          "Never match their volume — lower yours.",
          "Name the emotion, then move to facts.",
          "Offer a choice; control calms people.",
        ],
        q("When a customer is angry, the most effective first move is to:", [
          "Acknowledge the emotion before addressing the facts",
          "Explain the company policy",
          "Transfer the call",
          "Defend your colleague",
        ], 0),
      ),
      chapter(
        "Escalations and Boundaries",
        "Handling demands you cannot meet, professionally.",
        [
          ["Positive No", "Declining a request while offering a viable alternative."],
          ["Escalation Path", "Knowing when and how to involve a higher authority."],
          ["Documentation", "Recording facts so the next person needs no repetition."],
        ],
        "'I can't refund the deposit under the terms, but I can waive the change fee and move your booking free of charge.'",
        "A hotel empowered staff with a small discretionary budget and clear boundaries; complaint escalations to management fell 55%.",
        [
          "Never say only 'no' — always add what you can do.",
          "Escalate early rather than after a promise fails.",
          "Document facts, not opinions.",
        ],
        q("A 'positive no' means:", [
          "Declining the request while offering a workable alternative",
          "Saying yes to avoid conflict",
          "Escalating without explanation",
          "Repeating the policy verbatim",
        ], 0),
      ),
      chapter(
        "Building Advocates",
        "The follow-up that turns a resolved complaint into growth.",
        [
          ["Recovery Paradox", "A well-handled failure can create stronger loyalty than no failure."],
          ["Proactive Check-in", "Contacting the customer before they contact you."],
          ["Referral Ask", "Requesting an introduction or review at the moment of relief."],
        ],
        "A week after a resolved issue, the agent calls to confirm all is well — the customer leaves a five-star review unprompted.",
        "A service firm added a 7-day post-resolution call. Review volume tripled and 12% of calls produced a referral.",
        [
          "Follow up seven days later, always.",
          "Ask for the review when relief is fresh.",
          "A recovered customer is your best salesperson.",
        ],
        q("The recovery paradox states that:", [
          "A well-handled failure can produce stronger loyalty than no failure at all",
          "Complaints always reduce loyalty",
          "Refunds are the only real fix",
          "Customers forget failures quickly",
        ], 0),
      ),
    ],
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    icon: "UserCheck",
    category: "Interview",
    tagline: "Walk in prepared, answer with structure, and follow up like a professional.",
    description:
      "Everything needed to convert interviews into offers: research and positioning, a story bank built with the STAR method, confident answers to common and behavioural questions, salary discussions and professional follow-up.",
    level: "Beginner",
    duration: "5h 40m",
    students: 24310,
    rating: 4.9,
    updated: "March 2026",
    instructor: { name: "Instructor Placeholder", role: "Career Coach, CareerSync", initials: "CS" },
    objectives: [
      "Research a company and role like a consultant",
      "Build a story bank using the STAR method",
      "Answer common and behavioural questions with structure",
      "Discuss salary and expectations confidently",
      "Follow up in a way that keeps you memorable",
    ],
    chapters: [
      chapter(
        "Research and Positioning",
        "Preparation that makes you sound like an insider.",
        [
          ["Role Decoding", "Translating the job description into the top three problems to solve."],
          ["Company Insight", "Recent news, products and priorities that shape your answers."],
          ["Positioning Statement", "A 30-second summary of why you fit this specific role."],
        ],
        "'You're expanding into two new cities — I've onboarded three new territories, which is exactly the problem this role solves.'",
        "A candidate who studied the company's quarterly announcements referenced one metric in the interview and was told it was the deciding factor.",
        [
          "Reduce the job description to three problems.",
          "Prepare one insight nobody else will mention.",
          "Rehearse your positioning statement aloud.",
        ],
        q("Decoding a job description means identifying:", [
          "The top three problems the role exists to solve",
          "Every keyword to repeat verbatim",
          "The salary range",
          "The interviewer's name",
        ], 0),
      ),
      chapter(
        "The STAR Story Bank",
        "Six stories that answer forty questions.",
        [
          ["Situation & Task", "Concise context and the responsibility you held."],
          ["Action", "The specific steps you personally took."],
          ["Result", "The measurable outcome and what you learned."],
        ],
        "'Our renewals were slipping (S). I owned retention for 60 accounts (T). I built a 90-day review call (A). Retention went from 68% to 84% (R).'",
        "A candidate prepared six STAR stories covering conflict, failure, leadership, targets, learning and teamwork — and reused them across nine interview questions.",
        [
          "Quantify every result, even approximately.",
          "Keep each story under 90 seconds.",
          "Say 'I' more than 'we' when describing actions.",
        ],
        q("In the STAR method, the most commonly under-developed element is:", [
          "A measurable result with a number",
          "The situation description",
          "The interviewer's reaction",
          "The company background",
        ], 0),
      ),
      chapter(
        "Common and Behavioural Questions",
        "Structured answers to the questions you will definitely get.",
        [
          ["Tell Me About Yourself", "A 90-second present-past-future narrative aimed at the role."],
          ["Weakness Question", "A real weakness plus the concrete system you use to manage it."],
          ["Failure Question", "An honest failure with the lesson applied afterwards."],
        ],
        "'I'm currently a rental consultant (present), I moved from retail where I learned volume selling (past), and I want to specialise in B2B accounts (future).'",
        "Interviewers rated candidates who gave a genuine weakness with a mitigation system higher than those who used 'I'm a perfectionist'.",
        [
          "Present-past-future for 'tell me about yourself'.",
          "Never use a fake weakness.",
          "Always end a failure story with the lesson applied.",
        ],
        q("The strongest structure for 'tell me about yourself' is:", [
          "Present, past, future — aimed at this role",
          "Full chronological life history",
          "Your hobbies and interests",
          "A list of every job you have held",
        ], 0),
      ),
      chapter(
        "Salary and Expectations",
        "Discussing money without losing leverage or goodwill.",
        [
          ["Market Range", "A researched band for the role, level and location."],
          ["Deferral Language", "Politely postponing numbers until value is established."],
          ["Total Package", "Base, incentive, benefits and growth considered together."],
        ],
        "'Based on my research the range is X to Y and I'm comfortable in that band — I'd like to understand the targets before fixing a number.'",
        "A candidate who deferred the salary question until after the technical round received an offer 14% above the initial budget.",
        [
          "Never give the first number without research.",
          "Talk in ranges, not points.",
          "Evaluate the whole package, not just base pay.",
        ],
        q("Deferring the salary question early in the process helps because:", [
          "It lets you establish value before a number anchors the discussion",
          "It hides your expectations permanently",
          "Companies dislike candidates who answer",
          "Salary is not negotiable anyway",
        ], 0),
      ),
      chapter(
        "Follow-Up and Offer Stage",
        "The 24 hours that separate finalists.",
        [
          ["Thank-You Note", "A short note adding one useful idea, sent within a day."],
          ["Objection Recovery", "Addressing a concern you sensed during the interview."],
          ["Offer Evaluation", "Comparing offers against role, growth, manager and package."],
        ],
        "The candidate sends a four-line note answering the one question they fumbled — and is told it turned a maybe into an offer.",
        "Of finalists in one hiring round, 80% of those who sent a substantive follow-up within 24 hours advanced; only 30% of the rest did.",
        [
          "Send the note within 24 hours.",
          "Add value, don't just say thanks.",
          "Judge the manager as much as the salary.",
        ],
        q("An effective post-interview follow-up note:", [
          "Is short, timely and adds one useful idea or clarification",
          "Repeats your entire CV",
          "Asks about salary immediately",
          "Should be sent two weeks later",
        ], 0),
      ),
    ],
  },
  {
    id: "negotiation-skills",
    title: "Negotiation Skills",
    icon: "Scale",
    category: "Negotiation",
    tagline: "Create value first, claim it second — and protect the relationship.",
    description:
      "A structured negotiation method for sales and career situations: preparation and BATNA, anchoring, trading concessions, handling hardball tactics, and closing agreements both sides will honour.",
    level: "Advanced",
    duration: "6h 45m",
    students: 11290,
    rating: 4.8,
    updated: "February 2026",
    instructor: { name: "Instructor Placeholder", role: "Negotiation Faculty", initials: "CS" },
    objectives: [
      "Prepare with BATNA, reservation point and target",
      "Anchor effectively and respond to extreme anchors",
      "Trade concessions instead of conceding",
      "Expand the pie before dividing it",
      "Neutralise hardball tactics calmly",
    ],
    chapters: [
      chapter(
        "Preparation and BATNA",
        "The strongest negotiator is usually the best prepared.",
        [
          ["BATNA", "Your best alternative if this negotiation fails."],
          ["Reservation Point", "The worst deal you would still rationally accept."],
          ["Target Point", "The ambitious but justifiable outcome you aim for."],
        ],
        "Before the meeting the rep secures a second interested buyer — the pressure to accept poor terms disappears immediately.",
        "In a supplier renegotiation, the party that had documented alternatives captured 78% of the value gap; the other side conceded within two rounds.",
        [
          "Improve your BATNA before you negotiate.",
          "Write your reservation point down and never move it verbally.",
          "Ambitious targets, justified by data.",
        ],
        q("Your BATNA is:", [
          "Your best alternative if this negotiation fails",
          "The lowest price you will accept",
          "The opening offer you make",
          "The other side's budget",
        ], 0),
      ),
      chapter(
        "Anchoring and Framing",
        "The first credible number shapes the whole range.",
        [
          ["Anchor", "An initial number that pulls the final outcome toward it."],
          ["Justified Anchor", "An ambitious opening supported by visible reasoning."],
          ["Re-anchoring", "Neutralising an extreme anchor by resetting with data."],
        ],
        "Faced with an absurdly low offer, the negotiator responds: 'that's outside any realistic range — here's how the market prices this' and presents comparables.",
        "In controlled studies, the side that made the first justified offer captured a significantly larger share of the bargaining zone.",
        [
          "Anchor first when you know the market.",
          "Always attach a reason to your number.",
          "Never counter an extreme anchor with a small adjustment.",
        ],
        q("The correct response to an extreme low anchor is to:", [
          "Reject the range and re-anchor with justified data",
          "Split the difference immediately",
          "Make a slightly higher counter-offer",
          "Walk out without explanation",
        ], 0),
      ),
      chapter(
        "Trading Concessions",
        "Nothing is given away for free.",
        [
          ["Conditional Trade", "'If you can do X, then I can do Y' — never one without the other."],
          ["Concession Pattern", "Shrinking concession sizes that signal you are near your limit."],
          ["Cheap Gives", "Items of low cost to you and high value to them."],
        ],
        "'I can hold this rate if we sign for 24 months and you act as a reference' — price protected, value exchanged.",
        "A vendor that never conceded without a trade maintained average discount at 6% while competitors averaged 19% on comparable deals.",
        [
          "Every 'if' needs a 'then'.",
          "Make concessions smaller each round.",
          "List your cheap gives before the meeting.",
        ],
        q("A conditional trade always includes:", [
          "An 'if' from them paired with a 'then' from you",
          "An unconditional discount",
          "A final deadline",
          "A written contract",
        ], 0),
      ),
      chapter(
        "Expanding the Pie",
        "Finding value that costs one side little and helps the other a lot.",
        [
          ["Interests vs Positions", "The underlying need behind the stated demand."],
          ["Variable Set", "All negotiable dimensions: timing, volume, scope, terms, support."],
          ["Integrative Deal", "An agreement that makes both sides genuinely better off."],
        ],
        "The buyer 'needs' a 15% discount; their real interest is a lower first-year cash outflow. A deferred payment schedule solves it at full price.",
        "A stalled contract closed when both sides listed priorities separately and discovered the timeline mattered more to one and price to the other.",
        [
          "Ask 'why is that important?' to find the interest.",
          "Never negotiate a single variable.",
          "Trade across differently valued items.",
        ],
        q("Distinguishing interests from positions allows you to:", [
          "Solve the underlying need in a way that costs you less",
          "Avoid negotiating at all",
          "Always win on price",
          "Skip preparation",
        ], 0),
      ),
      chapter(
        "Hardball Tactics and Closure",
        "Staying composed and locking in a durable agreement.",
        [
          ["Common Tactics", "Good cop/bad cop, deadline pressure, nibbling at the end."],
          ["Name the Tactic", "Calmly describing what is happening to defuse it."],
          ["Agreement Recap", "A written summary that prevents later disputes."],
        ],
        "At signature the buyer asks for one more free add-on. The reply: 'I can include it if we move the start date forward' — the nibble is neutralised.",
        "A negotiation team that issued a same-day written recap of every agreement eliminated post-deal disputes across an entire year of contracts.",
        [
          "Name the tactic politely instead of reacting.",
          "Never accept a last-minute nibble for free.",
          "Recap in writing the same day.",
        ],
        q("A last-minute 'nibble' should be handled by:", [
          "Trading it for something of equal value",
          "Accepting it to protect the deal",
          "Ignoring the request",
          "Reopening the entire negotiation",
        ], 0),
      ),
    ],
  },
];

/* ---------------- Unit model ---------------- */

export type QuizQuestion = {
  id: string;
  type: "mcq" | "scenario" | "blank" | "match";
  prompt: string;
  options: string[];
  answer: number;
};

export type LessonContent = {
  readingTime: string;
  focus: string;
  notes: string[];
  concepts: Concept[];
  importantPoints: string[];
  example: string;
  caseStudy: string;
  tips: string[];
  summary: string[];
  practice: QuizQuestion[];
};

export type Unit =
  | { id: string; kind: "lesson"; label: string; title: string; lesson: LessonContent }
  | {
      id: string;
      kind: "exercise";
      label: string;
      title: string;
      intro: string;
      questions: QuizQuestion[];
      activities: { title: string; body: string }[];
    }
  | {
      id: string;
      kind: "test";
      label: string;
      title: string;
      intro: string;
      minutes: number;
      passMark: number;
      questions: QuizQuestion[];
      final?: boolean;
    }
  | { id: string; kind: "completion"; label: string; title: string };

const shuffleSeeded = <T,>(arr: T[], seed: number): T[] => {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

function conceptQuestions(course: Course, ci: number): QuizQuestion[] {
  const ch = course.chapters[ci]!;
  const others = course.chapters
    .filter((_, i) => i !== ci)
    .flatMap((c) => c.concepts.map((x) => x.desc));
  return ch.concepts.map((c, idx) => {
    const distractors = shuffleSeeded(others, ci * 7 + idx * 13 + 5).slice(0, 3);
    const opts = shuffleSeeded([c.desc, ...distractors], ci * 3 + idx + 1);
    return {
      id: `c${ci}-q${idx}`,
      type: "mcq" as const,
      prompt: `Which statement best describes "${c.name}"?`,
      options: opts,
      answer: opts.indexOf(c.desc),
    };
  });
}

function blankQuestion(course: Course, ci: number): QuizQuestion {
  const ch = course.chapters[ci]!;
  const c = ch.concepts[0]!;
  const names = course.chapters.flatMap((x) => x.concepts.map((y) => y.name)).filter((n) => n !== c.name);
  const opts = shuffleSeeded([c.name, ...shuffleSeeded(names, ci + 21).slice(0, 3)], ci + 4);
  return {
    id: `c${ci}-blank`,
    type: "blank",
    prompt: `Fill in the blank: "________ means ${c.desc.charAt(0).toLowerCase()}${c.desc.slice(1)}"`,
    options: opts,
    answer: opts.indexOf(c.name),
  };
}

function matchQuestion(course: Course, ci: number): QuizQuestion {
  const ch = course.chapters[ci]!;
  const c = ch.concepts[ch.concepts.length - 1]!;
  const others = course.chapters.flatMap((x) => x.concepts.map((y) => y.desc)).filter((d) => d !== c.desc);
  const opts = shuffleSeeded([c.desc, ...shuffleSeeded(others, ci * 5 + 9).slice(0, 3)], ci * 2 + 6);
  return {
    id: `c${ci}-match`,
    type: "match",
    prompt: `Match the term to its definition — "${c.name}" pairs with:`,
    options: opts,
    answer: opts.indexOf(c.desc),
  };
}

function scenarioQuestion(course: Course, ci: number): QuizQuestion {
  const ch = course.chapters[ci]!;
  const opts = shuffleSeeded(ch.quiz.options, ci + 31);
  return {
    id: `c${ci}-scenario`,
    type: "scenario",
    prompt: ch.quiz.q,
    options: opts,
    answer: opts.indexOf(ch.quiz.options[ch.quiz.a]!),
  };
}

function lessonFor(course: Course, ci: number): Unit {
  const ch = course.chapters[ci]!;
  return {
    id: `chapter-${ci + 1}`,
    kind: "lesson",
    label: `Chapter ${ci + 1}`,
    title: ch.title,
    lesson: {
      readingTime: `${9 + ci} min read`,
      focus: ch.focus,
      notes: [
        `${ch.title} is a core building block of ${course.title.toLowerCase()}. ${ch.focus} Professionals who master this chapter consistently outperform peers because they apply it as a habit rather than as an occasional technique.`,
        `Work through each key concept below and connect it to a real situation from your own week. The concepts are deliberately few — depth beats breadth, and three well-practised behaviours will change your results faster than twenty memorised rules.`,
        `As you read, keep one live opportunity in mind. At the end of the lesson you will be asked to apply the ideas to that opportunity, which is what converts reading into skill.`,
      ],
      concepts: ch.concepts,
      importantPoints: [
        `${ch.concepts[0]!.name} is the foundation — without it the rest of the chapter cannot work.`,
        `${ch.concepts[1]!.name} is where most professionals lose ground; it requires preparation, not talent.`,
        `${ch.concepts[2]!.name} is what makes the result repeatable instead of accidental.`,
      ],
      example: ch.example,
      caseStudy: ch.caseStudy,
      tips: ch.tips,
      summary: [
        ch.focus,
        `Remember the three concepts: ${ch.concepts.map((c) => c.name).join(", ")}.`,
        `Apply one of the tips to a real conversation within the next 24 hours.`,
      ],
      practice: [scenarioQuestion(course, ci), ...conceptQuestions(course, ci).slice(0, 2)],
    },
  };
}

export function buildUnits(course: Course): Unit[] {
  const units: Unit[] = [];

  units.push({
    id: "introduction",
    kind: "lesson",
    label: "Introduction",
    title: `Welcome to ${course.title}`,
    lesson: {
      readingTime: "6 min read",
      focus: course.tagline,
      notes: [
        course.description,
        `This course is built for practitioners. Every chapter follows the same rhythm: professional notes, key concepts, a real-life example, a case study, tips and a quick summary — followed by practice you must complete before the next chapter unlocks.`,
        `Set aside ${course.duration} in total. Short, frequent sessions work better than one long sitting: complete one chapter, apply it the same day, then return.`,
      ],
      concepts: course.chapters.slice(0, 3).map((c) => ({ name: c.title, desc: c.focus })),
      importantPoints: course.objectives,
      example: `A learner who completed this course applied one technique per chapter to live opportunities and reported measurable improvement within a single month.`,
      caseStudy: `CareerSync learners who completed all exercises and the practice test scored on average 27% higher in the final assessment than those who skipped straight to the test.`,
      tips: [
        "Complete one chapter per session, then apply it immediately.",
        "Do not skip the practice exercises — they are the unlock mechanism.",
        "Keep notes in your own words; recall beats re-reading.",
      ],
      summary: [
        `You will cover ${course.chapters.length} chapters, practice exercises, a practice test and a final assessment.`,
        `The certificate unlocks only at 100% completion.`,
        `Level: ${course.level} · Duration: ${course.duration} · Updated ${course.updated}.`,
      ],
      practice: [
        {
          id: "intro-q1",
          type: "mcq",
          prompt: "What must be completed before the final assessment unlocks?",
          options: [
            "Every lesson, practice exercise and the practice test",
            "Only the introduction",
            "Only the practice test",
            "Nothing — it is always available",
          ],
          answer: 0,
        },
      ],
    },
  });

  course.chapters.forEach((_, i) => units.push(lessonFor(course, i)));

  units.push({
    id: "practice-exercise",
    kind: "exercise",
    label: "Practice Exercise",
    title: "Applied Practice Exercise",
    intro:
      "Apply everything from the five chapters. This exercise mixes multiple choice, scenario questions, fill in the blanks and match the following. You must score at least 70% to unlock the practice test.",
    questions: [
      ...course.chapters.flatMap((_, i) => (i % 2 === 0 ? [scenarioQuestion(course, i)] : [])),
      ...course.chapters.map((_, i) => blankQuestion(course, i)).slice(0, 3),
      ...course.chapters.map((_, i) => matchQuestion(course, i)).slice(0, 3),
      ...conceptQuestions(course, 1).slice(0, 2),
    ],
    activities: [
      {
        title: "Sales Case Study",
        body: `${course.chapters[2]!.caseStudy} Write down the three decisions you would have made differently, and which chapter concept supports each one.`,
      },
      {
        title: "Communication Activity",
        body: `Record yourself for 90 seconds explaining ${course.chapters[3]!.concepts[0]!.name} to a colleague who has never heard of it. Listen back and mark every filler word.`,
      },
      {
        title: "Role Play Exercise",
        body: `Pair up. One person plays a sceptical customer, the other applies ${course.chapters[1]!.title}. Swap after five minutes and give one specific piece of feedback each.`,
      },
      {
        title: "Interactive Task",
        body: `Pick one live opportunity from your own pipeline and write a three-step action plan using the tips from Chapter 5. Schedule step one in your calendar today.`,
      },
    ],
  });

  const testPool: QuizQuestion[] = [
    ...course.chapters.flatMap((_, i) => conceptQuestions(course, i)),
    ...course.chapters.map((_, i) => scenarioQuestion(course, i)),
  ];

  units.push({
    id: "practice-test",
    kind: "test",
    label: "Practice Test",
    title: "Practice Test",
    intro:
      "20 questions covering all five chapters. There is a suggested timer, instant scoring, a full answer review and a performance analysis with recommendations. Score 70% or higher to unlock the final assessment.",
    minutes: 25,
    passMark: 70,
    questions: shuffleSeeded(testPool, 77).slice(0, 20),
  });

  units.push({
    id: "final-assessment",
    kind: "test",
    label: "Final Assessment",
    title: "Final Assessment",
    intro:
      "The graded assessment for the course. 20 questions, 30 minutes suggested, 70% to pass. Your score, strength areas and improvement areas are shown immediately.",
    minutes: 30,
    passMark: 70,
    final: true,
    questions: shuffleSeeded(testPool, 131).slice(0, 20),
  });

  units.push({
    id: "course-completion",
    kind: "completion",
    label: "Course Completion",
    title: "Course Completion",
  });

  return units;
}

export const getCourse = (id: string) => courses.find((c) => c.id === id);

export const categories = [
  "All",
  "Sales",
  "Communication",
  "Interview",
  "Negotiation",
  "Insurance",
  "Business",
];
