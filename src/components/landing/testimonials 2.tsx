import { motion } from "framer-motion";
import { Quote, Star, BadgeCheck } from "lucide-react";
import { SectionTitle } from "./section-title";

const testimonials = [
  {
    quote:
      "BechnaSeekho gave me the confidence and skills to crack my first job in just one month. The structured learning is amazing.",
    name: "Vashu Tyagi",
    role: "Software Engineer",
    company: "1+ Month · Hapur",
    tint: "from-brand to-brand-2",
    avatar: "VashuTyagi26",
  },
  {
    quote:
      "The resume builder and mock interviews were a game changer. I received three offers within a month of joining.",
    name: "Anushka",
    role: "HR Recruiter",
    company: "1+ Month · Delhi",
    tint: "from-cyan to-brand",
    avatar: "Anushka26",
  },
  {
    quote:
      "I loved how personalised the recommendations felt. Every job I applied to actually matched my skills and goals.",
    name: "Nandini Pal",
    role: "HR Recruiter",
    company: "2+ Month · Delhi",
    tint: "from-brand-2 to-amber",
    avatar: "NandiniPal26",
  },
  {
    quote:
      "The career roadmap gave me real clarity. Clear skills, verified jobs, and mentors who actually reply — it just works.",
    name: "Hemant Sharma",
    role: "HR Recruiter",
    company: "1+ Month · Rajasthan",
    tint: "from-emerald to-cyan",
    avatar: "HemantSharma26",
  },
  {
    quote:
      "As a fresher, BechnaSeekho made the entire hiring process less intimidating. The mock interviews boosted my confidence.",
    name: "Priya Singh",
    role: "Business Analyst",
    company: "Accenture",
    tint: "from-brand to-cyan",
    avatar: "PriyaSingh26",
  },
  {
    quote:
      "Great platform for anyone serious about their career. The mentorship and structured learning paths are top-notch.",
    name: "Arjun Kapoor",
    role: "Marketing Associate",
    company: "Flipkart",
    tint: "from-amber to-brand-2",
    avatar: "ArjunKapoor26",
  },
];

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function Testimonials() {
  return (
    <section className="relative py-7 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Loved by professionals"
          title={<>Stories from careers we've <span className="text-gradient-brand">helped shape.</span></>}
          subtitle="Real voices from candidates, recruiters, and founders across India."
        />

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col rounded-3xl bg-white/70 p-6 ring-1 ring-line backdrop-blur-xl transition-shadow hover:shadow-[0_30px_60px_-25px_rgba(37,99,235,0.3)] hover:ring-brand/30"
            >
              <Quote className="h-6 w-6 text-brand/30" />
              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 shrink-0">
                  <div className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${t.tint} font-display text-sm font-bold text-white shadow-md ring-2 ring-white`}>
                    {t.avatar ? (
                      <img
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${t.avatar}&backgroundColor=transparent`}
                        alt=""
                        aria-hidden
                        className="absolute -top-[5%] left-1/2 h-[140%] w-[140%] -translate-x-1/2 object-contain"
                        loading="lazy"
                        draggable={false}
                      />
                    ) : initials(t.name)}
                  </div>
                  <span className="absolute bottom-0 right-0 translate-x-[18%] translate-y-[18%] rounded-full bg-white p-[1px]">
                    <BadgeCheck className="h-4 w-4 text-brand" />
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {t.role} · <span className="font-medium text-ink/70">{t.company}</span>
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
