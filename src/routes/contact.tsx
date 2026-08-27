import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  RotateCcw,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageSquare,
  Headphones,
  FileText,
  Users,
  Wrench,
  Handshake,
  Star,
  HelpCircle,
  Briefcase,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — BechnaSeekho" },
      { name: "description", content: "Get in touch with the BechnaSeekho team for career support, resume services, job referrals, and more." },
    ],
  }),
  component: ContactPage,
});

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "general", label: "General Inquiry", icon: HelpCircle },
  { value: "career", label: "Career Support", icon: Briefcase },
  { value: "resume", label: "Resume Services", icon: FileText },
  { value: "referral", label: "Job Referral", icon: Users },
  { value: "technical", label: "Technical Support", icon: Wrench },
  { value: "partnership", label: "Partnership", icon: Handshake },
  { value: "feedback", label: "Feedback", icon: Star },
  { value: "other", label: "Other", icon: MessageSquare },
];

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email Address",
    value: "contact@bechnaseekho.com",
    sub: "We reply within 24–48 hours",
    color: "bg-blue-50 text-blue-600",
    href: "mailto:contact@bechnaseekho.com",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+91 93106 65960",
    sub: "Mon–Sat, 10:00 AM – 6:00 PM IST",
    color: "bg-green-50 text-green-600",
    href: "https://wa.me/919310665960",
  },
  {
    icon: MapPin,
    label: "Office Address",
    value: "Delhi, India",
    sub: "CareerSync by BechnaSeekho",
    color: "bg-rose-50 text-rose-600",
    href: null,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon – Sat: 10:00 AM – 6:00 PM",
    sub: "Indian Standard Time (IST)",
    color: "bg-amber-50 text-amber-600",
    href: null,
  },
];

const FAQS = [
  {
    q: "How quickly will I receive a response?",
    a: "Our team typically responds within 24–48 business hours. For urgent matters, you can reach us directly on WhatsApp at +91 93106 65960.",
  },
  {
    q: "How can I get career support?",
    a: "Select 'Career Support' from the category dropdown in the contact form, describe your query, and our career advisors will reach out with personalized guidance.",
  },
  {
    q: "How do I report a technical issue?",
    a: "Use the 'Technical Support' category in the form and include as much detail as possible — browser, device, and a description of the issue. Screenshots are welcome.",
  },
  {
    q: "Where can I find additional help?",
    a: "Visit our CareerSync platform for resources, FAQs, resume tools, and job listings. You can also chat with our team via the WhatsApp button on the homepage.",
  },
  {
    q: "Can companies partner with BechnaSeekho?",
    a: "Absolutely! Select 'Partnership' from the category and share details about your company. Our partnerships team will get in touch within 2–3 business days.",
  },
];

const SOCIAL = [
  { Icon: Linkedin, href: "https://www.linkedin.com/groups/18017028/", label: "LinkedIn", color: "hover:bg-blue-700 hover:text-white" },
  { Icon: Instagram, href: "https://www.instagram.com/bechnaseekho_", label: "Instagram", color: "hover:bg-pink-500 hover:text-white" },
  { Icon: Facebook, href: "https://www.facebook.com/people/bechnaseekhocom/61560843980655/", label: "Facebook", color: "hover:bg-blue-600 hover:text-white" },
  { Icon: Twitter, href: "https://x.com/bechnaseekho", label: "X (Twitter)", color: "hover:bg-gray-900 hover:text-white" },
  { Icon: Youtube, href: "https://www.youtube.com/@bechnaseekho", label: "YouTube", color: "hover:bg-red-600 hover:text-white" },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", email: "", phone: "", subject: "", category: "", message: "" };

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Full name is required.";
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.phone.trim()) e.phone = "Mobile number is required.";
  else if (!/^[\d\s\-+()]{7,15}$/.test(f.phone)) e.phone = "Enter a valid mobile number.";
  if (!f.subject.trim()) e.subject = "Subject is required.";
  if (!f.category) e.category = "Please select a category.";
  if (!f.message.trim()) e.message = "Message is required.";
  else if (f.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
  return e;
}

function InputField({
  label, name, type = "text", value, error, onChange, required,
}: {
  label: string; name: keyof FormState; type?: string; value: string;
  error?: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-blue-600 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"
          }`}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border bg-white transition-all duration-200 ${open ? "border-blue-200 shadow-md shadow-blue-50" : "border-gray-100 shadow-sm hover:border-gray-200"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-6 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm font-semibold text-gray-900">{q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 shrink-0 ${open ? "rotate-180 text-blue-500" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="border-t border-gray-100 px-6 py-4 pl-[72px] text-sm text-gray-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormState) => (v: string) => {
    setForm((f) => ({ ...f, [field]: v }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  const handleClear = () => { setForm(EMPTY); setErrors({}); setSubmitted(false); };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="BechnaSeekho" className="h-7 w-7 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <span className="text-sm font-bold text-gray-900">Bechna<span className="text-blue-600">Seekho</span></span>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold">
                  <Headphones className="h-3.5 w-3.5" />
                  We're here to help
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in Touch</h1>
                <p className="mt-4 max-w-lg text-blue-100 leading-relaxed">
                  Have questions, need support, or want to connect with our team? We're here to help. Send us a
                  message and we'll get back to you as soon as possible.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {[
                    { icon: Clock, text: "Replies within 24–48 hrs" },
                    { icon: CheckCircle2, text: "Expert career team" },
                    { icon: MessageSquare, text: "WhatsApp support" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold">
                      <Icon className="h-3.5 w-3.5" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative illustration */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="h-64 w-64 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-full bg-white/15 flex items-center justify-center">
                        <MessageSquare className="h-16 w-16 text-white/90" />
                      </div>
                    </div>
                  </div>
                  {[
                    { Icon: Mail, pos: "top-4 right-4", delay: "0s" },
                    { Icon: Phone, pos: "bottom-8 right-2", delay: "0.3s" },
                    { Icon: Headphones, pos: "top-8 left-2", delay: "0.6s" },
                    { Icon: CheckCircle2, pos: "bottom-4 left-8", delay: "0.9s" },
                  ].map(({ Icon, pos, delay }) => (
                    <div
                      key={pos}
                      className={`absolute ${pos} flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm`}
                      style={{ animation: `pulse 2s ${delay} infinite` }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form + Info cards */}
        <section className="px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[1fr_380px]">

            {/* Contact Form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-1 text-2xl font-extrabold text-gray-900">Send a Message</h2>
              <p className="mb-7 text-sm text-gray-500">Fill in the details below and we'll be in touch shortly.</p>

              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="max-w-sm text-sm text-gray-500 leading-relaxed">
                    Thank you for contacting us. Our team will respond to your inquiry as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField label="Full Name" name="name" value={form.name} error={errors.name} onChange={set("name")} required />
                    <InputField label="Email Address" name="email" type="email" value={form.email} error={errors.email} onChange={set("email")} required />
                    <InputField label="Mobile Number" name="phone" type="tel" value={form.phone} error={errors.phone} onChange={set("phone")} required />
                    <InputField label="Subject" name="subject" value={form.subject} error={errors.subject} onChange={set("subject")} required />
                  </div>

                  {/* Category */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category<span className="text-blue-600 ml-0.5">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => set("category")(e.target.value)}
                      className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${errors.category ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value} disabled={c.value === ""}>{c.label}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Message<span className="text-blue-600 ml-0.5">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      placeholder="Describe your inquiry in detail..."
                      className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.message ? (
                        <p className="flex items-center gap-1.5 text-xs text-red-500">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {errors.message}
                        </p>
                      ) : <span />}
                      <span className="text-xs text-gray-400">{form.message.length} chars</span>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Clear Form
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact info + social */}
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-base font-bold text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  {CONTACT_INFO.map(({ icon: Icon, label, value, sub, color, href }) => (
                    <div key={label} className="flex items-start gap-3.5">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</p>
                        {href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors break-all">
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">{value}</p>
                        )}
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-gray-900">Follow Us</h3>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL.map(({ Icon, href, label, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-500 transition-all duration-200 hover:scale-110 hover:shadow-md ${color}`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-400 leading-relaxed">
                  Stay updated with career tips, job openings, and platform news across all our social channels.
                </p>
              </div>

              {/* Quick response badge */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 opacity-80" />
                  <span className="text-sm font-bold">Quick Response</span>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Our team is available Monday to Saturday, 10:00 AM – 6:00 PM IST. We typically respond
                  within 24–48 hours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Google Map placeholder */}
        <section className="px-4 pb-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <div className="border-b border-gray-100 bg-white px-6 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-gray-900">Our Location</h3>
                </div>
              </div>
              <div className="relative h-64 bg-gray-100">
                <iframe
                  title="BechnaSeekho Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224357.6470089219!2d76.82494537631543!3d28.64275599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1690000000000"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-4 pb-14 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Frequently Asked Questions</h2>
              <p className="mt-3 text-sm text-gray-500">Quick answers to common queries from our users.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2">
                <img src="/favicon.png" alt="BechnaSeekho" className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span className="text-base font-bold text-gray-900">Bechna<span className="text-blue-600">Seekho</span></span>
              </div>
              <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
                <Link to="/careersync/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
                <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms &amp; Conditions</Link>
                <Link to="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link>
              </nav>
              <div className="flex gap-2">
                {SOCIAL.map(({ Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all hover:scale-110 ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} CareerSync by BechnaSeekho. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
