# Project Structure Guide

This project is organized so new developers can quickly find, replace, and test assets without breaking pages.

## Core folders

- `assets/company-logos/`
  - Company SVG logos used in jobs and company cards.
- `assets/images/branding/`
  - Brand images such as navbar logo.
- `assets/images/tools/`
  - Navbar dropdown tool icons (Career Tools + Resources menu icons).
- `assets/images/resources/`
  - Resource section card images.
- `data/`
  - JSON data sources (`jobs.json`, `applications.json`).
- `uploads/`
  - Candidate-uploaded files.
- `docs/requirements/`
  - Requirements and project organization notes.

## Page files

- `index.html` - Main landing page and most UI logic.
- `job-details.html` - Job details and apply flow page.
- `my-applications.html` - Candidate application history.
- `admin-dashboard.html` - Admin dashboard.
- `admin-applications.html` - Admin applications view.
- `server.js` - Express backend and route handling.

## Image replacement rules

- Keep brand logo replacements in `assets/images/branding/`.
- Keep tool icon replacements in `assets/images/tools/`.
- Keep resource card image replacements in `assets/images/resources/`.
- Prefer lowercase kebab-case file names (example: `ai-job-matcher.png`).

## Current image map

- Brand logo: `assets/images/branding/nav-logo.png`
- Tool icons:
  - `assets/images/tools/ai-job-matcher.png`
  - `assets/images/tools/resume-builder.png`
  - `assets/images/tools/ats-score-checker.png`
  - `assets/images/tools/mock-interview.png`
  - `assets/images/tools/ai-career-coach.png`
  - `assets/images/tools/salary-guide.png`
  - `assets/images/tools/career-blog.png`
  - `assets/images/tools/interview-questions.png`
  - `assets/images/tools/salary-calculator.png`
  - `assets/images/tools/career-tips.png`
- Resource images:
  - `assets/images/resources/interview-prep.png`
  - `assets/images/resources/career-blog.png`
  - `assets/images/resources/salary-guide.png`
  - `assets/images/resources/ai-tools.png`
  - `assets/images/resources/career-tips.png`

## Notes

- Existing page behavior is preserved. Only file locations and references were reorganized.
- External social-media image URLs remain unchanged.
