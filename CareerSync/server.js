const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
const applicationsPath = path.join(dataDir, 'applications.json');
const jobsPath = path.join(dataDir, 'jobs.json');
const jsonReadEncoding = 'utf8';

let applicationsWriteQueue = Promise.resolve();
let jobsWriteQueue = Promise.resolve();

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(applicationsPath)) fs.writeFileSync(applicationsPath, '[]');

app.set('trust proxy', 1);

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again shortly.' }
});

const applyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many application attempts, please retry after a few minutes.' }
});

app.use('/api', apiLimiter);
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(rootDir, { maxAge: '1h' }));

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeBase = path.basename(file.originalname || 'resume', ext).replace(/[^a-zA-Z0-9-_]/g, '_');
        cb(null, `${Date.now()}_${safeBase}${ext}`);
    }
});

function resumeFilter(_req, file, cb) {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error('Only PDF, DOC and DOCX files are allowed.'));
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter: resumeFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

function imageFilter(_req, file, cb) {
    const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowed.includes(ext)) {
        return cb(new Error('Only image files are allowed for company logos.'));
    }
    cb(null, true);
}

const logoUpload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

async function readJson(filePath, fallback) {
    try {
        const raw = await fs.promises.readFile(filePath, jsonReadEncoding);
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

async function writeJson(filePath, value) {
    await fs.promises.writeFile(filePath, JSON.stringify(value, null, 2), jsonReadEncoding);
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function nextApplicationId(applications) {
    const next = applications.length + 1;
    return `AR-${String(next).padStart(6, '0')}`;
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) return String(forwarded).split(',')[0].trim();
    return req.socket.remoteAddress || '';
}

function withApplicationsWriteLock(task) {
    const next = applicationsWriteQueue.then(() => task());
    applicationsWriteQueue = next.catch(() => undefined);
    return next;
}

function withJobsWriteLock(task) {
    const next = jobsWriteQueue.then(() => task());
    jobsWriteQueue = next.catch(() => undefined);
    return next;
}

function slugify(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'job-posting';
}

async function findJob(jobId) {
    const jobs = await readJson(jobsPath, []);
    return jobs.find(job => job.jobId === jobId);
}

app.get('/jobs/:jobId', (_req, res) => {
    res.sendFile(path.join(rootDir, 'job-details.html'));
});

app.get('/my-applications', (_req, res) => {
    res.sendFile(path.join(rootDir, 'my-applications.html'));
});

app.get('/admin/applications', (_req, res) => {
    res.sendFile(path.join(rootDir, 'admin-applications.html'));
});

app.get('/healthz', (_req, res) => {
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

app.get('/readyz', async (_req, res) => {
    const jobs = await readJson(jobsPath, []);
    const applications = await readJson(applicationsPath, []);
    const ready = Array.isArray(jobs) && Array.isArray(applications);
    if (!ready) {
        return res.status(503).json({ success: false, status: 'not-ready' });
    }
    return res.json({ success: true, status: 'ready' });
});

app.get('/api/jobs', async (_req, res) => {
    const jobs = await readJson(jobsPath, []);
    res.json({ success: true, jobs });
});

app.get('/api/jobs/:jobId', async (req, res) => {
    const job = await findJob(req.params.jobId);
    if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
    }
    res.json({ success: true, job });
});

app.post('/api/jobs', logoUpload.single('companyLogo'), async (req, res) => {
    try {
        const payload = req.body || {};
        const companyName = String(payload.companyName || '').trim();
        const jobTitle = String(payload.jobTitle || '').trim();
        const recruiterName = String(payload.recruiterName || '').trim();
        const recruiterEmail = String(payload.recruiterEmail || '').trim();
        const jobDescription = String(payload.jobDescription || '').trim();

        if (!companyName || !jobTitle || !recruiterName || !recruiterEmail || !jobDescription) {
            return res.status(400).json({ success: false, message: 'Please complete the required company and job details.' });
        }

        const now = new Date();
        const jobId = `${slugify(companyName)}-${slugify(jobTitle)}-${now.getTime()}`;
        const salary = [payload.salaryCurrency, payload.salaryMin, payload.salaryMax].filter(Boolean).join(' ');
        const location = [payload.city, payload.state, payload.country].filter(Boolean).join(', ');
        const requiredSkills = String(payload.requiredSkills || '').split(',').map(item => item.trim()).filter(Boolean);
        const benefits = Array.isArray(req.body?.benefits) ? req.body.benefits : [req.body?.benefits].filter(Boolean);
        const job = {
            jobId,
            company: companyName,
            companyLogo: req.file ? `/uploads/${req.file.filename}` : '',
            title: jobTitle,
            salary: salary || 'To be disclosed',
            location: location || payload.officeAddress || 'Remote',
            experience: payload.experienceRequired || 'Flexible',
            employmentType: payload.employmentType || 'Full-Time',
            workplaceType: payload.workplaceType || 'Hybrid',
            openPositions: Number(payload.openings || 1),
            industry: payload.industry || 'Others',
            benefits,
            requiredSkills,
            preferredSkills: requiredSkills,
            description: jobDescription,
            responsibilities: String(payload.responsibilities || '').split(/\n|\./).map(item => item.trim()).filter(Boolean),
            officeAddress: [payload.officeAddress, payload.city, payload.state, payload.country, payload.pinCode].filter(Boolean).join(', '),
            companyOverview: payload.companyDescription || `Hiring for ${jobTitle} at ${companyName}.`,
            companyWebsite: payload.companyWebsite || '',
            recruiterName,
            recruiterEmail,
            recruiterPhone: payload.recruiterPhone || '',
            recruiterDesignation: payload.recruiterDesignation || '',
            applicationDeadline: payload.applicationDeadline || '',
            jobPostedDate: now.toISOString().slice(0, 10),
            lastUpdated: now.toISOString().slice(0, 10),
            postedBy: recruiterName,
            createdAt: now.toISOString()
        };

        const result = await withJobsWriteLock(async () => {
            const jobs = await readJson(jobsPath, []);
            jobs.unshift(job);
            await writeJson(jobsPath, jobs);
            return job;
        });

        return res.json({ success: true, message: 'Job published successfully.', job: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Unable to publish job.' });
    }
});

app.post('/api/applications', applyLimiter, upload.single('resume'), async (req, res) => {
    const { fullName, email, phone, currentCity, highestQualification, totalExperience, relevantExperience, currentCompany, currentSalary, expectedSalary, noticePeriod, linkedInUrl, portfolioUrl, coverLetter, agreeTerms, jobId, source } = req.body;
    const experienceValue = String(totalExperience || relevantExperience || '').trim();

    const job = await findJob(jobId);
    if (!jobId || !job) return res.status(400).json({ success: false, message: 'Invalid job selected.' });
    if (!fullName || !email || !phone || !currentCity || !highestQualification || !experienceValue || !currentCompany || !noticePeriod) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }
    if (String(agreeTerms) !== 'true') {
        return res.status(400).json({ success: false, message: 'Please accept the terms to continue.' });
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Resume is required.' });
    }

    const result = await withApplicationsWriteLock(async () => {
        const applications = await readJson(applicationsPath, []);
        const duplicate = applications.find(item => normalize(item.email) === normalize(email) && item.jobId === jobId);
        if (duplicate) {
            return { duplicate };
        }

        const applicationId = nextApplicationId(applications);
        const now = new Date().toISOString();

        const application = {
            applicationId,
            jobId,
            candidateName: fullName,
            email,
            phone,
            currentCity,
            highestQualification,
            totalExperience: experienceValue,
            relevantExperience: experienceValue,
            currentCompany: currentCompany || '',
            currentSalary: currentSalary || '',
            expectedSalary: expectedSalary || '',
            noticePeriod,
            linkedInUrl: linkedInUrl || '',
            portfolioUrl: portfolioUrl || '',
            coverLetter: coverLetter || '',
            resume: {
                filename: req.file.originalname,
                path: `/uploads/${req.file.filename}`,
                metadata: {
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                    uploadedAt: now
                }
            },
            appliedCompany: job.company,
            appliedPosition: job.title,
            applicationDate: now,
            status: 'Applied',
            source: source || 'CareerSync Web',
            ip: getClientIp(req),
            termsAccepted: true
        };

        applications.push(application);
        await writeJson(applicationsPath, applications);
        return { application, applicationId };
    });

    if (result.duplicate) {
        return res.status(409).json({ success: false, duplicate: true, message: 'You have already applied for this position.', applicationId: result.duplicate.applicationId });
    }

    return res.json({ success: true, message: 'Application submitted successfully.', applicationId: result.applicationId, application: result.application });
});

app.get('/api/applications', async (req, res) => {
    const { email, status, q, jobId } = req.query;
    let applications = await readJson(applicationsPath, []);

    if (email) applications = applications.filter(item => normalize(item.email) === normalize(email));
    if (status) applications = applications.filter(item => normalize(item.status) === normalize(status));
    if (jobId) applications = applications.filter(item => item.jobId === jobId);
    if (q) {
        const key = normalize(q);
        applications = applications.filter(item => {
            return [
                item.applicationId,
                item.candidateName,
                item.email,
                item.phone,
                item.appliedCompany,
                item.appliedPosition,
                item.status
            ].some(v => normalize(v).includes(key));
        });
    }

    res.json({ success: true, applications });
});

app.get('/api/applications/check-duplicate', async (req, res) => {
    const { email, jobId } = req.query;
    if (!email || !jobId) return res.json({ success: true, duplicate: false });
    const applications = await readJson(applicationsPath, []);
    const found = applications.find(item => normalize(item.email) === normalize(email) && item.jobId === jobId);
    res.json({ success: true, duplicate: Boolean(found), applicationId: found?.applicationId || '' });
});

app.patch('/api/applications/:applicationId/status', async (req, res) => {
    const { status } = req.body;
    const allowed = ['Applied', 'Under Review', 'Interview Scheduled', 'Selected', 'Rejected'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const result = await withApplicationsWriteLock(async () => {
        const applications = await readJson(applicationsPath, []);
        const idx = applications.findIndex(item => item.applicationId === req.params.applicationId);
        if (idx === -1) return { notFound: true };

        applications[idx].status = status;
        applications[idx].lastUpdated = new Date().toISOString();
        await writeJson(applicationsPath, applications);
        return { application: applications[idx] };
    });

    if (result.notFound) return res.status(404).json({ success: false, message: 'Application not found.' });
    res.json({ success: true, application: result.application });
});

app.delete('/api/applications/:applicationId', async (req, res) => {
    const result = await withApplicationsWriteLock(async () => {
        const applications = await readJson(applicationsPath, []);
        const idx = applications.findIndex(item => item.applicationId === req.params.applicationId);
        if (idx === -1) return { notFound: true };

        const appToDelete = applications[idx];
        applications.splice(idx, 1);
        await writeJson(applicationsPath, applications);
        return { appToDelete };
    });

    if (result.notFound) return res.status(404).json({ success: false, message: 'Application not found.' });

    if (result.appToDelete?.resume?.path) {
        const absoluteResumePath = path.join(rootDir, result.appToDelete.resume.path.replace(/^\//, ''));
        try {
            await fs.promises.unlink(absoluteResumePath);
        } catch {
            // Ignore missing file errors.
        }
    }

    res.json({ success: true, message: 'Application deleted.' });
});

app.get('/api/applications/export.csv', async (_req, res) => {
    const applications = await readJson(applicationsPath, []);
    const headers = ['Application ID', 'Candidate Name', 'Email', 'Phone', 'Applied Company', 'Applied Position', 'Application Date', 'Status', 'Resume Filename', 'Resume Path', 'Source'];
    const escape = value => `"${String(value || '').replace(/"/g, '""')}"`;

    const rows = applications.map(item => [
        item.applicationId,
        item.candidateName,
        item.email,
        item.phone,
        item.appliedCompany,
        item.appliedPosition,
        item.applicationDate,
        item.status,
        item.resume?.filename || '',
        item.resume?.path || '',
        item.source || ''
    ].map(escape).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
});

app.get('/api/applications/export.json', async (_req, res) => {
    const applications = await readJson(applicationsPath, []);
    res.setHeader('Content-Disposition', 'attachment; filename="applications.json"');
    res.json(applications);
});

app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Resume file must be 5 MB or less.' });
    }
    if (err) return res.status(400).json({ success: false, message: err.message || 'Request failed.' });
    return res.status(500).json({ success: false, message: 'Unexpected server error.' });
});

const server = app.listen(PORT, () => {
    console.log(`CareerSync server running at http://localhost:${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;

function shutdown(signal) {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
