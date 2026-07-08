# CareerSync Web App

CareerSync is a static-first job platform with an Express backend for job/application APIs.

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Fill all required values (admin/hr seed users, JWT, SMTP, contact info)
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

## Auth and Roles

- `POST /api/auth/login` returns JWT + user profile.
- `GET /api/auth/me` validates active JWT.
- Roles:
   - `admin`: can create/edit/delete all jobs.
   - `hr`: can create jobs and edit only own jobs.

## Real-Time Job Updates

- Job create/edit/delete emits `jobs:changed` via Socket.IO.
- Homepage listens and refreshes job cards without full page reload.

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
