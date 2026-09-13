import type { Blog } from "@/lib/blogs";
import type { Course } from "@/lib/academy-courses";
import type { DemoJobRecord } from "@/lib/careersync-demo";

export const SITE_URL = "https://bechnaseekho.com";
export const SITE_NAME = "BechnaSeekho";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue | undefined };

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function canonicalLink(path: string) {
  return [{ rel: "canonical", href: absoluteUrl(path) }];
}

export function jsonLdScript(id: string, schema: JsonLdValue) {
  return [
    {
      id,
      type: "application/ld+json",
      children: JSON.stringify(schema),
    },
  ];
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.png"),
    sameAs: [
      "https://www.linkedin.com/company/bechnaseekho",
      "https://www.instagram.com/bechnaseekho",
      "https://www.youtube.com/@bechnaseekho",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@bechnaseekho.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/careersync/jobs?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function splitLocation(location?: string | null) {
  if (!location) return {};
  const [addressLocality, addressRegion] = location.split(",").map((part) => part.trim());
  return { addressLocality, addressRegion };
}

function employmentType(type?: string | null) {
  if (!type) return "FULL_TIME";
  const normalized = type.toUpperCase();
  if (normalized.includes("PART")) return "PART_TIME";
  if (normalized.includes("CONTRACT")) return "CONTRACTOR";
  if (normalized.includes("REMOTE")) return "FULL_TIME";
  if (normalized.includes("INTERN")) return "INTERN";
  return "FULL_TIME";
}

export function jobPostingSchema(job: DemoJobRecord) {
  const address = splitLocation(job.location);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.role,
    description: job.description || `${job.role} opening at ${job.company}.`,
    datePosted: job.created_at,
    validThrough: job.application_deadline || undefined,
    employmentType: employmentType(job.employment_type),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.company_website || undefined,
    },
    jobLocation:
      job.location && !/remote/i.test(job.location)
        ? {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: address.addressLocality,
              addressRegion: address.addressRegion,
              addressCountry: "IN",
            },
          }
        : undefined,
    applicantLocationRequirements: /remote/i.test(job.location || "")
      ? { "@type": "Country", name: "India" }
      : undefined,
    jobLocationType: /remote/i.test(job.location || "") ? "TELECOMMUTE" : undefined,
    qualifications: [...(job.required_skills || []), ...(job.preferred_skills || [])].join(", ") || undefined,
    responsibilities: job.responsibilities?.join(" "),
    industry: job.industry || undefined,
    totalJobOpenings: job.open_positions || undefined,
    directApply: true,
    url: absoluteUrl(`/careersync/jobs?query=${encodeURIComponent(job.role)}`),
  };
}

export function jobCollectionSchema(jobs: DemoJobRecord[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Open Jobs - CareerSync by BechnaSeekho",
    url: absoluteUrl("/careersync/jobs"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: jobs.map((job, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: jobPostingSchema(job),
      })),
    },
  };
}

export function blogArticleSchema(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover,
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      "@type": "Person",
      name: blog.author,
      jobTitle: blog.authorRole,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(`/careersync/blogs/${blog.slug}`),
    keywords: blog.tags.join(", "),
    articleSection: blog.category,
  };
}

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description || course.tagline,
    url: absoluteUrl(`/careersync-academy/courses/${course.id}`),
    provider: { "@id": `${SITE_URL}/#organization` },
    educationalLevel: course.level,
    coursePrerequisites: course.level === "Beginner" ? "No prior experience required" : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      ratingCount: Math.max(course.students, 1),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: course.duration,
      instructor: {
        "@type": "Person",
        name: course.instructor.name,
        jobTitle: course.instructor.role,
      },
    },
  };
}
