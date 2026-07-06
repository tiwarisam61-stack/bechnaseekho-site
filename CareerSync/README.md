# CareerSync Web App

CareerSync is a static-first job platform with an Express backend for job/application APIs.

## Quick Start

1. Install dependencies:
   - `npm install`
2. Start server:
   - `npm start`
3. Open in browser:
   - `http://localhost:3000`

## Main Files

- `index.html` - Main website UI and interactions.
- `job-details.html` - Job detail and apply page.
- `my-applications.html` - Candidate application tracking page.
- `admin-dashboard.html` - Admin dashboard UI.
- `admin-applications.html` - Admin applications management page.
- `server.js` - API and static hosting server.

## Folder Structure

- `assets/company-logos/` - Company SVG logos.
- `assets/images/branding/` - Brand identity images.
- `assets/images/tools/` - Career Tools and Resources dropdown icon images.
- `assets/images/resources/` - Resource section card images.
- `data/` - JSON data files (`jobs.json`, `applications.json`).
- `uploads/` - Uploaded resumes.
- `docs/requirements/` - Project requirements and structure notes.

## Maintenance Notes

- Keep all new images inside `assets/images/` with clear kebab-case names.
- Avoid adding root-level image files.
- Keep `data/jobs.json` as the source of truth for listed jobs.
- If you add new pages, update route handling in `server.js` if direct server routing is needed.
