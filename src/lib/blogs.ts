export type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Fundamentals" | "Interview (Freshers)" | "Interview (Experienced)" | "Sales Mindset";
  readMinutes: number;
  author: string;
  authorRole: string;
  publishedAt: string; // ISO
  cover: string;
  tags: string[];
  content: BlogBlock[];
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "callout"; tone: "tip" | "warn" | "info"; title: string; body: string }
  | { type: "qa"; items: { q: string; a: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string };

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BLOGS: Blog[] = [
  /* ================================ BLOG 1 ================================ */
  {
    slug: "sales-fundamentals-complete-beginners-guide",
    title: "Sales Fundamentals: A Complete Beginner's Guide",
    excerpt:
      "The definitive starter guide to modern sales — what it is, why it matters, and every core skill you need to build a career you love.",
    category: "Fundamentals",
    readMinutes: 14,
    author: "Vashu Tyagi",
    authorRole: "CareerSync",
    publishedAt: "2026-08-01",
    cover: U("photo-1552664730-d307ca884978"),
    tags: ["Sales Basics", "B2B", "B2C", "Cold Calling", "Closing", "Psychology"],
    content: [
      { type: "p", text: "Sales is the engine of every business. No matter how good a product is, someone has to introduce it to the right person, explain why it matters, and help them decide with confidence. That someone is a salesperson — and that skill is one of the most valuable, transferable, and well-paid careers on the planet." },

      { type: "h2", text: "What is Sales?" },
      { type: "p", text: "Sales is the process of helping a customer see how your product or service solves a real problem in their life, and then guiding them through the decision to buy. Great sales is never about pressure — it is about clarity, trust, and honest value." },
      { type: "quote", text: "Sales is not about convincing people to buy. It is about helping people who need your solution feel confident enough to say yes.", by: "Modern sales philosophy" },

      { type: "h2", text: "Why Sales is Important" },
      {
        type: "list", items: [
          "Sales creates revenue — the oxygen every company runs on.",
          "Sales teaches you to understand humans deeply — a superpower in any career.",
          "Sales rewards performance, so hard work translates directly into income.",
          "Sales skills apply everywhere: startups, freelancing, interviews, negotiations, even relationships.",
        ]
      },

      { type: "h2", text: "Types of Sales" },
      {
        type: "steps", items: [
          { title: "Inside Sales", body: "Selling remotely — calls, emails, video demos. Fast cycles, high volume." },
          { title: "Field Sales", body: "In-person meetings with clients. Longer cycles, larger deals, deeper relationships." },
          { title: "Retail Sales", body: "Face-to-face selling in a store. Strong product knowledge and warm presence." },
          { title: "Consultative Sales", body: "You act as an advisor. You diagnose before you prescribe." },
          { title: "Enterprise Sales", body: "Selling complex products to large companies over months, with many decision-makers." },
        ]
      },

      { type: "h2", text: "B2B vs B2C — Two Different Games" },
      { type: "p", text: "Understanding the difference between selling to businesses (B2B) and selling to individual consumers (B2C) helps you pick the right style, tools, and message." },
      {
        type: "steps", items: [
          { title: "B2B — Business to Business", body: "Longer sales cycles (weeks to months). Multiple stakeholders. Decisions are logical: ROI, efficiency, risk. Example: selling a CRM to a company." },
          { title: "B2C — Business to Consumer", body: "Short cycles (minutes to days). One decision-maker. Emotion drives 80% of the sale. Example: selling a smartphone in a retail store." },
        ]
      },
      { type: "callout", tone: "info", title: "Quick rule of thumb", body: "B2B: sell logic, wrap it in emotion. B2C: sell emotion, back it with logic." },

      { type: "h2", text: "The Sales Process (End-to-End)" },
      { type: "p", text: "Every strong sale follows a predictable flow. Learn each step, practise it, and your results become repeatable." },
      {
        type: "steps", items: [
          { title: "1. Prospecting", body: "Find people who might genuinely benefit. Use LinkedIn, referrals, communities, and cold outreach." },
          { title: "2. Lead Qualification", body: "Ask: Do they have the problem? Budget? Authority? Timing? If yes to all — move forward." },
          { title: "3. Discovery", body: "Ask smart questions. Understand their pain, their goals, and their current alternatives." },
          { title: "4. Presentation", body: "Show your solution matched precisely to what they told you. Not a generic pitch — a mirror." },
          { title: "5. Handling Objections", body: "Welcome doubts as buying signals. Answer with proof, examples, and empathy." },
          { title: "6. Closing", body: "Ask for the decision clearly and calmly. Silence after the ask is powerful." },
          { title: "7. Follow-up & Relationship", body: "80% of sales happen after the 4th interaction. Stay useful, not annoying." },
        ]
      },

      { type: "h2", text: "Prospecting: Where It All Starts" },
      { type: "p", text: "You cannot close a deal you never opened. Great salespeople treat prospecting as a daily habit — a fixed time block every morning, non-negotiable. Your pipeline is your income six months from now." },
      {
        type: "list", items: [
          "Define your ideal customer profile (industry, size, role).",
          "Pick 3 outbound channels: LinkedIn, email, and referrals work everywhere.",
          "Personalise every message. Generic templates get generic silence.",
          "Track everything in a CRM (HubSpot, Zoho, even a spreadsheet).",
        ]
      },

      { type: "h2", text: "Cold Calling — Still One of the Highest ROI Skills" },
      { type: "p", text: "A calm, prepared cold call opens doors that emails never will. The goal of a cold call is not to close — it is to earn 60 seconds of curiosity." },
      {
        type: "steps", items: [
          { title: "Open with a pattern break", body: "'Hi Priya, this is Riya — I know I am an interruption, may I have 30 seconds?' Honesty disarms." },
          { title: "State the reason in one line", body: "Tie it to their world: 'I help sales heads at fintechs cut ramp-time for new reps by 40%.'" },
          { title: "Ask one great question", body: "'How are you currently onboarding new reps?' Then listen." },
          { title: "Book, don't sell", body: "The only goal of the call is a 15-minute discovery meeting." },
        ]
      },

      { type: "h2", text: "Follow Up — Where 80% of Deals Are Won" },
      {
        type: "list", items: [
          "48-hour rule: send a recap email within 2 days of every meaningful conversation.",
          "Add value every time — a case study, an article, a quick insight.",
          "Space follow-ups: Day 2, Day 7, Day 14, Day 30, then monthly.",
          "If a prospect goes silent, send a short 'closing your file' note. Response rates jump.",
        ]
      },

      { type: "h2", text: "Closing the Sale" },
      { type: "p", text: "Closing is not a magic trick at the end — it is the natural result of every good step before it. Still, you must ask clearly. Never assume." },
      {
        type: "steps", items: [
          { title: "The Assumptive Close", body: "'Should we start Monday or the following week?'" },
          { title: "The Summary Close", body: "Recap the value they will get, then ask: 'Shall we lock it in?'" },
          { title: "The Alternative Close", body: "'Would the annual plan or the quarterly plan fit better?'" },
        ]
      },

      { type: "h2", text: "Customer Relationship — The Real Long-Term Gold" },
      { type: "p", text: "A signed contract is the start of the relationship, not the end. Happy customers become case studies, referrals, and repeat buyers. Your best deals in Year 3 come from customers you served brilliantly in Year 1." },

      { type: "h2", text: "Sales Psychology You Must Know" },
      {
        type: "list", items: [
          "People buy emotionally and justify logically.",
          "Loss aversion: people fear losing more than they enjoy gaining. Show the cost of doing nothing.",
          "Social proof: 'Companies like yours use us' is more powerful than 'Our features are…'.",
          "Reciprocity: give a free insight, a template, or advice — trust follows.",
          "Anchoring: the first price you mention shapes every price after.",
        ]
      },

      { type: "h2", text: "Active Listening — The Most Under-rated Skill" },
      { type: "p", text: "Weak salespeople talk. Great salespeople ask, then listen, then reflect back what they heard. The customer feels understood, and understood customers buy." },
      { type: "callout", tone: "tip", title: "70/30 rule", body: "In every sales conversation, the customer should talk 70% and you 30%. If it's the opposite, you are pitching, not selling." },

      { type: "h2", text: "Objection Handling — Welcome the Doubts" },
      {
        type: "qa", items: [
          { q: "It is too expensive.", a: "'I hear you. Compared to what?' Then talk about value, ROI, and the cost of doing nothing." },
          { q: "We are already using a competitor.", a: "'That's great — clearly the problem is real. What is one thing you wish they did better?'" },
          { q: "Send me some information.", a: "'Happy to. So I send the most relevant piece, may I ask one quick question?'" },
          { q: "I need to think about it.", a: "'Absolutely. What specifically would you like to think through? Maybe I can help right now.'" },
        ]
      },

      { type: "h2", text: "Communication Skills — The Foundation" },
      {
        type: "list", items: [
          "Speak slowly. Rushed speech feels desperate.",
          "Use the customer's exact words back to them — instant rapport.",
          "Ask open-ended questions ('what', 'how', 'why') more than yes/no ones.",
          "Silence is your friend. Ask the question, then be quiet.",
          "Smile on the phone — the listener hears it.",
        ]
      },

      { type: "h2", text: "Real-World Example — Selling a SaaS Trial" },
      { type: "p", text: "Ankit, a young SDR at a startup, was tasked with signing up small businesses for a free trial. Instead of pitching the software, he called and asked one question: 'What is the number one reporting headache you face every Monday morning?' Owners loved to answer. He listened, matched two exact features to their answers, and asked, 'Would a 14-day free trial help me prove this saves you two hours every Monday?' His conversion rate jumped from 6% to 34% in six weeks. He didn't change the product — he changed the conversation." },

      { type: "h2", text: "Special Section — How to Sell a Pen" },
      { type: "p", text: "The most famous sales interview question in the world. Most candidates make the same mistake — they start describing the pen: 'It writes smoothly, it has a great grip…' That is not selling, that is describing. Real selling starts with the customer, not the product." },
      { type: "h3", text: "The wrong way" },
      { type: "quote", text: "This pen has a fine tip, blue ink, a metallic finish, and a lifetime guarantee. Would you like to buy it?", by: "Every rejected candidate" },
      { type: "p", text: "Why it fails: You have no idea whether the person even needs a pen, uses one, or cares about any of those features." },
      { type: "h3", text: "The right way — the discovery-first approach" },
      {
        type: "steps", items: [
          { title: "Step 1 — Ask, don't tell", body: "'Before I show you this pen, may I ask you a few quick questions?'" },
          { title: "Step 2 — Understand the context", body: "'When was the last time you had to sign something important? What did you use?'" },
          { title: "Step 3 — Uncover the pain", body: "'What did you dislike about that pen? Ran out of ink? Slipped? Looked cheap in a big meeting?'" },
          { title: "Step 4 — Present the fit", body: "'This pen was designed for that exact moment — it never runs dry, feels premium in the hand, and signals seriousness in a client meeting.'" },
          { title: "Step 5 — Ask for the sale", body: "'Would you like to carry it to your next big meeting?'" },
        ]
      },
      { type: "callout", tone: "tip", title: "The lesson", body: "The pen doesn't matter. Your ability to uncover a real problem and offer the pen as a solution is what interviewers are testing." },

      { type: "h2", text: "How to Sell Any Product — Universal Formula" },
      {
        type: "steps", items: [
          { title: "Understand customer needs", body: "Ask about their day, their goals, their biggest frustrations." },
          { title: "Identify pain points", body: "Zero in on the one problem that costs them the most time, money, or peace of mind." },
          { title: "Present value, not features", body: "'You save 3 hours a week' beats '10 GB storage' every single time." },
          { title: "Handle objections calmly", body: "Every objection is a request for more information. Answer with proof and empathy." },
          { title: "Close with a clear next step", body: "Never end a conversation without an agreed action — a demo, a trial, a contract." },
        ]
      },

      { type: "callout", tone: "info", title: "Your first 30 days in sales", body: "Learn your product deeply. Talk to 20 real customers. Practise your pitch out loud. Do not chase perfect — chase reps." },

      { type: "h2", text: "Final Word" },
      { type: "p", text: "Sales is not a talent you are born with. It is a discipline you build, one honest conversation at a time. Master listening, master follow-up, and master helping — the commissions follow on their own." },
    ],
  },

  /* ================================ BLOG 2 ================================ */
  {
    slug: "how-to-crack-sales-interview-freshers-guide",
    title: "How to Crack a Sales Interview — Freshers Guide",
    excerpt:
      "From resume to salary discussion: a complete playbook to walk into your first sales interview calm, prepared, and impressive.",
    category: "Interview (Freshers)",
    readMinutes: 15,
    author: "Vashu Tyagi",
    authorRole: "CareerSync",
    publishedAt: "2026-08-01",
    cover: U("photo-1521737711867-e3b97375f902"),
    tags: ["Interview", "Freshers", "STAR", "Communication", "Body Language"],
    content: [
      { type: "p", text: "A sales interview is itself a sales pitch — you are the product, and you have 30 minutes to make the buyer (the interviewer) confident that hiring you is a low-risk, high-upside decision. This guide walks you through every stage." },

      { type: "h2", text: "Resume Preparation" },
      {
        type: "list", items: [
          "One page. Recruiters scan in 8 seconds — do not test their patience.",
          "Lead with impact, not duties: 'Led college fest sponsorship — closed ₹1.2 L from 6 brands' beats 'Was in sponsorship team'.",
          "Quantify everything you can — numbers, %, ranks, revenue.",
          "Add one line about why sales, right at the top. Recruiters love intent.",
          "Match keywords to the job description — ATS filters are real.",
        ]
      },

      { type: "h2", text: "Common HR Questions" },
      {
        type: "qa", items: [
          { q: "Tell me about yourself.", a: "Use the 3-part structure: Present (who you are today), Past (2-3 experiences that shaped you), Future (why this role). 60-90 seconds, no more." },
          { q: "Why should we hire you?", a: "Match your top 3 strengths to the top 3 needs of the role. End with enthusiasm: 'I am ready to learn fast and out-work the average.'" },
          { q: "Where do you see yourself in 5 years?", a: "Show ambition + realism: 'Mastering this role in year 1, mentoring juniors in year 2-3, leading a team by year 5.'" },
          { q: "Why are you leaving your last job?", a: "Never criticise. 'I learned a lot but I am looking for a role with faster growth and clearer targets.'" },
        ]
      },

      { type: "h2", text: "Sales-Specific Questions" },
      {
        type: "qa", items: [
          { q: "Sell me this pen.", a: "Ask 3 discovery questions first. Match the pen to their answers. Ask for the sale. (Full breakdown in the Sales Fundamentals blog.)" },
          { q: "Describe your sales process.", a: "Give a clean framework: Prospect → Qualify → Discover → Present → Handle objections → Close → Follow up. Then share one real example." },
          { q: "How do you handle rejection?", a: "'I treat every no as data, not defeat. I ask what could have been better and move to the next call within 5 minutes.'" },
          { q: "What do you know about our product?", a: "This is the killer question. Study the product, competitors, and one recent news item. Mention them all." },
          { q: "How would you handle an angry customer?", a: "Listen fully → empathise → ask questions → propose a plan → follow up. Give a real example if you have one." },
        ]
      },

      { type: "h2", text: "Self Introduction — The First 90 Seconds" },
      { type: "p", text: "Your intro is your opening pitch. Structure it, rehearse it, and deliver it with warmth." },
      {
        type: "steps", items: [
          { title: "Hook", body: "Start with one sentence about a defining experience: 'From my first day selling college fest passes, I was hooked on sales.'" },
          { title: "Credentials", body: "Where you studied, key internships or projects — only the ones relevant to sales." },
          { title: "Bridge to the role", body: "End with why this specific company excites you. Name-drop something specific." },
        ]
      },

      { type: "h2", text: "Why Sales?" },
      { type: "p", text: "Interviewers ask this to filter out candidates who see sales as a backup plan. Prepare an honest, personal answer. It should include: love of people, love of problem-solving, love of performance-based rewards, and one small story that proves it." },

      { type: "h2", text: "Strengths and Weaknesses" },
      {
        type: "steps", items: [
          { title: "Strengths (pick 3)", body: "Choose those that match the role — resilience, communication, curiosity, discipline. Back each with a one-line example." },
          { title: "Weaknesses (pick 1)", body: "Real, small, and paired with action: 'I used to over-prepare and lose spontaneity. Now I timebox prep to 20 minutes and trust the conversation.'" },
        ]
      },

      { type: "h2", text: "Communication Tips" },
      {
        type: "list", items: [
          "Speak slower than you feel is natural — clarity beats speed.",
          "Pause after key sentences — pauses signal confidence.",
          "Mirror the interviewer's energy: calm for calm, upbeat for upbeat.",
          "Use their name once or twice — it warms the room.",
        ]
      },

      { type: "h2", text: "Confidence — The Silent Skill" },
      { type: "p", text: "Confidence is not loudness. It is the calm of someone who has prepared. Do three mock interviews, record yourself, watch the tape once. That single exercise will lift your confidence more than any advice." },

      { type: "h2", text: "Mock Interview — Non-Negotiable Prep" },
      {
        type: "steps", items: [
          { title: "Write down 15 likely questions", body: "Mix HR, behavioural, and sales-specific." },
          { title: "Practise answers out loud", body: "Speaking is different from thinking. Do it three times." },
          { title: "Record yourself once", body: "You will spot filler words, low energy, and rushed answers instantly." },
          { title: "Do one live mock", body: "With a friend or a mentor. Ask them to be tough." },
        ]
      },

      { type: "h2", text: "The STAR Method — Your Story Framework" },
      {
        type: "steps", items: [
          { title: "S — Situation", body: "One sentence to set the scene." },
          { title: "T — Task", body: "Your specific responsibility in that situation." },
          { title: "A — Action", body: "What YOU did — not the team. Use 'I', not 'we'." },
          { title: "R — Result", body: "Quantify. '₹1.2 L closed', 'grew 30%', 'saved 4 hours a week'." },
        ]
      },

      { type: "h2", text: "Sample STAR Answer" },
      { type: "quote", text: "During my final year, our college magazine had zero sponsors two weeks before print. I took ownership, listed 40 nearby businesses, called each one, and pitched a low-cost visibility package tailored to student-heavy footfall. In 10 days I closed 6 sponsors worth ₹1.2 lakh — enough to fund the entire print run.", by: "Sample STAR — sponsorship story" },

      { type: "h2", text: "Body Language" },
      {
        type: "list", items: [
          "Sit up straight — signals engagement.",
          "Steady eye contact 70% of the time; break gently to think.",
          "Open palms when explaining — signals honesty.",
          "Nod occasionally when they speak — shows active listening.",
          "Avoid crossed arms, phone glances, and shaky legs.",
        ]
      },

      { type: "h2", text: "Mistakes to Avoid" },
      {
        type: "list", items: [
          "Bad-mouthing a former employer.",
          "Not researching the company or product.",
          "Rambling — keep answers under 90 seconds.",
          "Saying 'I am a people-person' with no proof.",
          "Asking no questions at the end.",
        ]
      },

      { type: "h2", text: "Salary Discussion — Handle With Calm" },
      {
        type: "steps", items: [
          { title: "Research first", body: "Know the standard range for the role in your city — Glassdoor, AmbitionBox, LinkedIn Salary." },
          { title: "Deflect the first time", body: "'I am flexible and open — could you share the range you have budgeted for this role?'" },
          { title: "Give a range, not a number", body: "'Based on the responsibilities and my research, ₹X to ₹Y feels fair.'" },
          { title: "Negotiate on total value", body: "Base + incentives + travel + growth path. Sales roles reward variable pay." },
        ]
      },

      { type: "callout", tone: "tip", title: "End every interview like this", body: "'Based on our conversation, I am even more excited about this role. Is there any concern I can address before you decide?' — this single line has closed thousands of jobs." },

      { type: "h2", text: "Final Checklist" },
      {
        type: "list", items: [
          "Read the JD twice. Highlight the 5 must-haves.",
          "Research the company + one recent news item.",
          "Prepare 6 STAR stories.",
          "Rehearse 'Tell me about yourself' out loud.",
          "Print two copies of your resume.",
          "Reach 15 minutes early. Breathe. Smile. Walk in like you belong.",
        ]
      },
    ],
  },

  /* ================================ BLOG 3 ================================ */
  {
    slug: "sales-interview-preparation-experienced-professionals",
    title: "Sales Interview Preparation for Experienced Professionals",
    excerpt:
      "Leadership, KPIs, negotiation and pipeline strategy — how senior sales candidates win high-stakes interviews.",
    category: "Interview (Experienced)",
    readMinutes: 14,
    author: "Vashu Tyagi",
    authorRole: "CareerSync",
    publishedAt: "2026-08-01",
    cover: U("photo-1600880292203-757bb62b4baf"),
    tags: ["Senior Sales", "Leadership", "Negotiation", "KPIs", "CRM", "Case Study"],
    content: [
      { type: "p", text: "At the senior level, sales interviews go far beyond 'sell me this pen'. Companies want proof that you can build pipeline, lead people, hit numbers under pressure, and make sharp calls with incomplete information. This guide covers the advanced questions and the mindset that gets you hired." },

      { type: "h2", text: "Advanced Sales Questions (With Model Answers)" },
      {
        type: "qa", items: [
          { q: "Walk me through your current pipeline and forecast accuracy.", a: "Give real structure: 'I run a 3x pipeline to quota. Forecast is broken into Commit / Best-Case / Pipeline. My last 4 quarters forecast accuracy is within 8%.' Numbers = credibility." },
          { q: "Tell me about the biggest deal you've won and what unlocked it.", a: "Use STAR. Focus on how you multi-threaded, identified the economic buyer, and mapped internal politics." },
          { q: "Describe a deal you lost — and what you learned.", a: "Honesty wins. Show the miss, the root cause, and the process change you introduced afterwards." },
          { q: "How do you build a territory from scratch?", a: "ICP → segmentation → account tiering → channel mix → outbound cadence → partnerships. Give a 30-60-90 view." },
        ]
      },

      { type: "h2", text: "Leadership Questions" },
      {
        type: "qa", items: [
          { q: "How do you coach an underperforming rep?", a: "Diagnose first: is it skill, will, or role fit? Weekly 1:1 with clear leading indicators, ride-alongs on 5 calls, 30-day improvement plan. Kind, clear, timed." },
          { q: "Tell me about a time you had to let someone go.", a: "Show empathy + accountability. Focus on how you protected the team's morale and gave the person a dignified exit with support." },
          { q: "How do you set quotas?", a: "Top-down (company target) meets bottom-up (rep capacity × conversion). Stretch but achievable — 60-70% of reps should hit." },
          { q: "How do you keep a team motivated during a bad quarter?", a: "Refocus on activity metrics, celebrate small wins publicly, run a short SPIF, and be visible in the trenches — not hiding in reports." },
        ]
      },

      { type: "h2", text: "Negotiation" },
      {
        type: "list", items: [
          "Never discount to win — trade. Always ask for something in return (annual commitment, case study, referral).",
          "Anchor high. The first number frames the entire negotiation.",
          "Silence after a counter — it is the most powerful tool at the table.",
          "Have your BATNA (best alternative) clear before you enter the room.",
          "Sell value in every round. Every rupee you defend is protected margin.",
        ]
      },

      { type: "h2", text: "Team Handling" },
      {
        type: "steps", items: [
          { title: "Weekly 1:1s", body: "30 minutes, rep-driven agenda, no cancellations. This one habit lifts teams more than any tool." },
          { title: "Pipeline reviews", body: "Same day of week, same format. Focus on next-step clarity, not deal narration." },
          { title: "Skill development", body: "Rotate call-listening, roleplays, and objection drills. Skills that are trained get done." },
          { title: "Celebrate loudly", body: "Every closed deal deserves a public shoutout. Recognition compounds motivation." },
        ]
      },

      { type: "h2", text: "Revenue Growth Strategies" },
      {
        type: "list", items: [
          "Expand existing accounts — cheaper and faster than new logos.",
          "Improve win-rates by 5% before chasing 20% more leads.",
          "Shorten sales cycles by removing 1 unnecessary step per stage.",
          "Layer partnerships — one strong channel partner can equal 3 reps.",
        ]
      },

      { type: "h2", text: "Sales KPIs You Must Know Cold" },
      {
        type: "steps", items: [
          { title: "Pipeline coverage", body: "Ideally 3-4x of quota, weighted by stage." },
          { title: "Win rate", body: "Deals won / deals worked. Segment by source, industry, deal size." },
          { title: "Average deal size (ACV)", body: "Trend it monthly — flat or falling is a signal." },
          { title: "Sales cycle length", body: "Track by stage. Where deals stall is where you fix." },
          { title: "Quota attainment", body: "% of team hitting quota. Below 60% = quota or coaching problem." },
          { title: "CAC & LTV", body: "Cost to acquire vs lifetime value. Healthy ratio: 1:3 or better." },
        ]
      },

      { type: "h2", text: "Target Achievement" },
      { type: "p", text: "Show that you have a system, not just hustle. Interviewers want to hear about your weekly planning, activity metrics, and how you self-correct mid-quarter when the math is not working." },

      { type: "h2", text: "CRM Experience" },
      {
        type: "list", items: [
          "Name specific tools: Salesforce, HubSpot, Zoho, Freshsales, Pipedrive.",
          "Talk about hygiene: 'Every call logged within 10 minutes, next-step field mandatory.'",
          "Mention dashboards you built or lived by.",
          "Explain how you used reports to change behaviour, not just observe it.",
        ]
      },

      { type: "h2", text: "Customer Retention" },
      { type: "p", text: "Senior interviewers care about net revenue retention (NRR). Talk about QBRs, adoption tracking, upsell playbooks, and how you tie CS metrics back to sales incentives." },

      { type: "h2", text: "Conflict Handling" },
      {
        type: "qa", items: [
          { q: "Two reps fight over an account.", a: "Go to the rules of engagement, decide fast, document the outcome, coach both privately. Never let ambiguity fester." },
          { q: "A customer escalates to your CEO.", a: "Own it. Call the customer within 4 hours with a plan. Loop your CEO with a clean update — no surprises." },
        ]
      },

      { type: "h2", text: "Real Interview Case Study" },
      { type: "quote", text: "You inherit a team of 8 reps, quota attainment is at 42%, morale is low, and the CEO wants a turnaround in 6 months. What do you do in the first 30, 60, 90 days?", by: "Real Series-B interview prompt" },
      {
        type: "steps", items: [
          { title: "Days 1-30 — Listen", body: "1:1 with every rep. Ride 20 calls. Read 40 lost-deal notes. Map the real blockers." },
          { title: "Days 31-60 — Rewire", body: "Fix the top 3 gaps: ICP clarity, pipeline hygiene, deal reviews. Kill one bad process." },
          { title: "Days 61-90 — Scale", body: "Coaching cadence, incentive tweak, one clear playbook. Publish a scoreboard. Celebrate first wins loudly." },
        ]
      },

      { type: "h2", text: "Presentation Skills" },
      {
        type: "list", items: [
          "Open with the customer's world, not your product.",
          "One slide = one idea. Kill the wall of text.",
          "Tell stories with real numbers. 'A client like you saved 3.4 crore last year.'",
          "Handle Q&A calmly — 'Great question, let me answer that in two parts.'",
        ]
      },

      { type: "h2", text: "Closing Questions to Ask the Interviewer" },
      {
        type: "list", items: [
          "What does success in the first 6 months look like?",
          "What is the biggest blocker the current team faces?",
          "How does leadership define a great year vs a good year?",
          "What is the ramp support (onboarding, enablement, mentor)?",
        ]
      },

      { type: "callout", tone: "tip", title: "Senior candidate power move", body: "Come with a 30-60-90 plan tailored to their company. It signals ownership before day one — and it wins offers." },
    ],
  },

  /* ================================ BLOG 4 ================================ */
  {
    slug: "sales-mindset-for-career-growth",
    title: "Sales Mindset: Build Confidence, Consistency, and Long-Term Career Growth",
    excerpt:
      "A practical guide to developing the mindset top sales professionals use to handle rejection, stay consistent, and grow over decades.",
    category: "Sales Mindset",
    readMinutes: 16,
    author: "Vashu Tyagi",
    authorRole: "CareerSync",
    publishedAt: "2026-08-01",
    cover: U("photo-1454165804606-c3d57bc86b40"),
    tags: ["Sales Mindset", "Growth", "Confidence", "Rejection Handling", "Career Growth"],
    content: [
      { type: "p", text: "Sales strategy matters, but mindset decides whether that strategy survives pressure. Top performers do not avoid rejection, uncertainty, or hard quarters. They train their mind to stay clear, disciplined, and useful to customers even when results are temporarily down." },

      { type: "h2", text: "What is a Sales Mindset?" },
      { type: "p", text: "A sales mindset is a repeatable way of thinking that helps you act with focus, resilience, and integrity. It is not fake positivity. It is the ability to stay objective, learn quickly, and keep momentum through both wins and losses." },

      { type: "h2", text: "Growth Mindset in Sales" },
      {
        type: "list", items: [
          "Treat skills as trainable, not fixed personality traits.",
          "Use each call as feedback, not as a personal verdict.",
          "Review process metrics weekly: outreach, meetings, conversion.",
          "Celebrate progress behaviors, not only final outcomes.",
        ]
      },

      { type: "h2", text: "Handling Rejection Without Losing Energy" },
      {
        type: "steps", items: [
          { title: "Separate identity from outcome", body: "A no means the current offer-context fit was weak, not that your value is low." },
          { title: "Run a 5-minute debrief", body: "Write what went well, what failed, and one improvement for the next attempt." },
          { title: "Reset quickly", body: "Use a short ritual: stand, breathe, drink water, and start the next activity block." },
          { title: "Protect activity quality", body: "Do not let one rejection reduce the quality of your next five conversations." },
        ]
      },

      { type: "h2", text: "Confidence Building That Actually Works" },
      {
        type: "list", items: [
          "Prepare opening questions before every call block.",
          "Record practice pitches and refine weak transitions.",
          "Build proof banks: success stories, results, customer wins.",
          "Use role-play every week for objections and pricing moments.",
        ]
      },

      { type: "h2", text: "Communication and Active Listening" },
      { type: "p", text: "Great sales communication is less about talking and more about discovery. Ask clear questions, pause long enough for meaningful answers, and mirror customer language to show understanding." },
      { type: "callout", tone: "tip", title: "Practical listening rule", body: "In discovery calls, aim for customers speaking 60 to 70 percent of the time." },

      { type: "h2", text: "Emotional Intelligence in Client Conversations" },
      {
        type: "list", items: [
          "Notice emotional signals: impatience, hesitation, urgency.",
          "Name the emotion respectfully: 'It sounds like timing risk is your biggest concern.'",
          "Regulate your tone under pressure; calm tone creates trust.",
          "Never argue with a concern. Clarify it, then address it.",
        ]
      },

      { type: "h2", text: "Consistency Beats Intensity" },
      { type: "p", text: "Many sales professionals work very hard for short bursts and then crash. High performers are boring in the best way: they keep a stable outreach cadence, clean CRM discipline, and regular follow-up routines every week." },

      { type: "h2", text: "Time Management for Sales Professionals" },
      {
        type: "steps", items: [
          { title: "Morning pipeline block", body: "Prioritize top opportunities and define next actions before calls begin." },
          { title: "Prospecting block", body: "Use a fixed 60-90 minute window for outbound activity daily." },
          { title: "Meeting cluster", body: "Batch meetings in defined windows to protect deep work time." },
          { title: "Follow-up hour", body: "Close each day by sending summaries and scheduling next steps." },
        ]
      },

      { type: "h2", text: "Daily Routine of Top Salespeople" },
      {
        type: "list", items: [
          "They start with top priorities, not inbox noise.",
          "They prep before each important call, even for 5 minutes.",
          "They log notes immediately after conversations.",
          "They review numbers weekly and adjust behavior fast.",
        ]
      },

      { type: "h2", text: "Motivation During Tough Quarters" },
      {
        type: "qa", items: [
          { q: "How do I stay motivated after a poor month?", a: "Shift focus from outcomes to controllables: quality outreach, discovery depth, and follow-up discipline. Momentum returns through action." },
          { q: "What if targets feel impossible?", a: "Break the target into weekly leading indicators and negotiate support early with your manager." },
          { q: "How can I avoid burnout?", a: "Use structured breaks, clear boundaries, and weekly recovery. Sustainable output beats heroic sprints." },
        ]
      },

      { type: "h2", text: "Long-Term Career Growth in Sales" },
      {
        type: "steps", items: [
          { title: "Stage 1: Build core execution", body: "Master discovery, objection handling, and closing fundamentals." },
          { title: "Stage 2: Build strategic thinking", body: "Learn account planning, negotiation, and multi-stakeholder deal management." },
          { title: "Stage 3: Build leadership", body: "Coach peers, document playbooks, and own team outcomes." },
          { title: "Stage 4: Build market reputation", body: "Share insights publicly and become known for problem-solving, not pressure tactics." },
        ]
      },

      { type: "h2", text: "Common Mindset Mistakes" },
      {
        type: "list", items: [
          "Taking rejection personally.",
          "Confusing activity volume with activity quality.",
          "Avoiding uncomfortable conversations about budget or timelines.",
          "Ignoring health and recovery, then losing consistency.",
        ]
      },

      { type: "h2", text: "Final Thought" },
      { type: "p", text: "A strong sales mindset is built one day at a time. If you commit to clarity, consistency, and customer-first behavior, your confidence compounds, your conversion improves, and your career becomes more stable year after year." },
    ],
  },
];

export const BLOG_CATEGORIES = [
  "All",
  "Fundamentals",
  "Interview (Freshers)",
  "Interview (Experienced)",
  "Sales Mindset",
] as const;

export function getBlog(slug: string): Blog | undefined {
  return BLOGS.find((b) => b.slug === slug);
}
