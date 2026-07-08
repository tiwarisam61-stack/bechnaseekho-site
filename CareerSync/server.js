const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const compression = require('compression');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Server: SocketIOServer } = require('socket.io');
const { rateLimit } = require('express-rate-limit');

require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const rootDir = __dirname;
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'uploads');
const applicationsPath = path.join(dataDir, 'applications.json');
const jobsPath = path.join(dataDir, 'jobs.json');
const jobsBackupPath = path.join(dataDir, 'jobs.backup.json');
const usersPath = path.join(dataDir, 'users.json');
const auditLogPath = path.join(dataDir, 'audit.log');
const jsonReadEncoding = 'utf8';

let applicationsWriteQueue = Promise.resolve();
let jobsWriteQueue = Promise.resolve();
let usersWriteQueue = Promise.resolve();

const requiredEnvKeys = [
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'HR_TEST_EMAIL',
    'HR_TEST_PASSWORD',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'ADMIN_PHONE',
    'ADMIN_WHATSAPP'
];

const missingEnvKeys = requiredEnvKeys.filter(key => !String(process.env[key] || '').trim());
if (missingEnvKeys.length) {
    console.warn(`Missing .env values: ${missingEnvKeys.join(', ')}`);
}

const jwtSecret = String(process.env.JWT_SECRET || '').trim() || `careersync-dev-${Date.now()}`;
if (!String(process.env.JWT_SECRET || '').trim()) {
    console.warn('JWT_SECRET is not configured. Using an ephemeral dev secret.');
}

function safeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function slugify(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'job-posting';
}

function isValidJobsArray(value) {
    return Array.isArray(value);
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

async function ensureBaseFiles() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    if (!fs.existsSync(applicationsPath)) fs.writeFileSync(applicationsPath, '[]');
    if (!fs.existsSync(jobsPath)) fs.writeFileSync(jobsPath, '[]');
    if (!fs.existsSync(jobsBackupPath)) fs.writeFileSync(jobsBackupPath, '[]');
    if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, '[]');
    if (!fs.existsSync(auditLogPath)) fs.writeFileSync(auditLogPath, '');
}

async function readJson(filePath, fallback) {
    try {
        const raw = await fs.promises.readFile(filePath, jsonReadEncoding);
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

async function readJsonStrict(filePath) {
    const raw = await fs.promises.readFile(filePath, jsonReadEncoding);
    return JSON.parse(raw);
}

async function writeJsonAtomic(filePath, value) {
    const dir = path.dirname(filePath);
    const tempPath = path.join(dir, `${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`);
    const payload = JSON.stringify(value, null, 2);
    await fs.promises.writeFile(tempPath, payload, jsonReadEncoding);
    await fs.promises.rename(tempPath, filePath);
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

function withUsersWriteLock(task) {
    const next = usersWriteQueue.then(() => task());
    usersWriteQueue = next.catch(() => undefined);
    return next;
}

async function appendAuditLog(event, details = {}) {
    const line = JSON.stringify({ at: new Date().toISOString(), event, ...details });
    await fs.promises.appendFile(auditLogPath, `${line}\n`, jsonReadEncoding);
}

async function readUsersStrict() {
    const users = await readJsonStrict(usersPath);
    if (!Array.isArray(users)) throw new Error('users.json root must be an array');
    return users;
}

function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
}

async function seedDefaultUsers() {
    await withUsersWriteLock(async () => {
        const users = await readJson(usersPath, []);
        const seedCandidates = [
            {
                name: 'Admin',
                email: safeEmail(process.env.ADMIN_EMAIL),
                password: String(process.env.ADMIN_PASSWORD || ''),
                role: 'admin'
            },
            {
                name: 'HR Tester',
                email: safeEmail(process.env.HR_TEST_EMAIL),
                password: String(process.env.HR_TEST_PASSWORD || ''),
                role: 'hr'
            }
        ].filter(item => item.email && item.password);

        let changed = false;
        for (const candidate of seedCandidates) {
            const existing = users.find(user => safeEmail(user.email) === candidate.email);
            if (existing) continue;
            const passwordHash = await bcrypt.hash(candidate.password, 12);
            users.push({
                id: `usr_${slugify(candidate.role)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                name: candidate.name,
                email: candidate.email,
                passwordHash,
                role: candidate.role,
                createdAt: new Date().toISOString()
            });
            changed = true;
        }

        if (changed) {
            await writeJsonAtomic(usersPath, users);
            await appendAuditLog('auth.seed.default-users', { count: users.length });
        }
    });
}

async function recoverJobsFromBackup(reason) {
    let backupJobs;
    try {
        backupJobs = await readJsonStrict(jobsBackupPath);
    } catch (error) {
        throw new Error(`${reason}; backup read failed: ${error.message}`);
    }

    if (!isValidJobsArray(backupJobs) || backupJobs.length === 0) {
        throw new Error(`${reason}; backup unavailable or empty`);
    }

    await writeJsonAtomic(jobsPath, backupJobs);
    console.log('Recovered jobs.json from backup.');
    return backupJobs;
}

async function loadJobsWithRecovery() {
    try {
        const jobs = await readJsonStrict(jobsPath);
        if (!isValidJobsArray(jobs)) throw new Error('jobs.json root must be an array.');
        if (jobs.length === 0) throw new Error('jobs.json is empty.');
        return jobs;
    } catch (error) {
        return recoverJobsFromBackup(`jobs.json unavailable or invalid: ${error.message}`);
    }
}

async function findJob(jobId) {
    const jobs = await loadJobsWithRecovery();
    return jobs.find(job => job.jobId === jobId);
}

const mailerEnabled =
    String(process.env.SMTP_HOST || '').trim() &&
    String(process.env.SMTP_PORT || '').trim() &&
    String(process.env.SMTP_USER || '').trim() &&
    String(process.env.SMTP_PASS || '').trim() &&
    String(process.env.SMTP_FROM || '').trim();

const mailTransporter = mailerEnabled
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })
    : null;

async function sendMailSafe(message, auditEvent) {
    if (!mailTransporter) {
        await appendAuditLog(`${auditEvent}.skipped`, { reason: 'smtp_not_configured' });
        return;
    }

    try {
        await mailTransporter.sendMail(message);
        await appendAuditLog(`${auditEvent}.sent`, { to: message.to, cc: message.cc || '' });
    } catch (error) {
        await appendAuditLog(`${auditEvent}.failed`, { error: String(error?.message || error) });
        console.error(`${auditEvent} failed:`, error?.message || error);
    }
}

function buildPostedJobEmailHtml(job) {
    return `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937;">
            <h2 style="margin-bottom:8px;">New Job Posted Successfully - CareerSync</h2>
            <p>Your job has been posted successfully with the details below:</p>
            <table style="border-collapse:collapse;width:100%;max-width:700px;">
                <tr><td style="padding:6px 8px;font-weight:700;">Job Title</td><td style="padding:6px 8px;">${job.title}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Company</td><td style="padding:6px 8px;">${job.company}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Location</td><td style="padding:6px 8px;">${job.location}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Salary</td><td style="padding:6px 8px;">${job.salary}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Experience</td><td style="padding:6px 8px;">${job.experience}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Employment Type</td><td style="padding:6px 8px;">${job.employmentType}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Description</td><td style="padding:6px 8px;">${job.description}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">HR Email</td><td style="padding:6px 8px;">${job.recruiterEmail}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Posting Date</td><td style="padding:6px 8px;">${job.createdAt}</td></tr>
            </table>
            <p style="margin-top:14px;">Thank you for posting your job on CareerSync.</p>
            <p>If you need any modification, contact the administrator.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;"/>
            <p><strong>Admin Email:</strong> ${process.env.ADMIN_EMAIL || 'Not configured'}</p>
            <p><strong>Company Phone:</strong> ${process.env.ADMIN_PHONE || 'Not configured'}</p>
            <p><strong>Company WhatsApp:</strong> ${process.env.ADMIN_WHATSAPP || 'Not configured'}</p>
        </div>`;
}

function buildDeleteEmailHtml(job, actor) {
    return `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1f2937;">
            <h2>Job Deleted - CareerSync</h2>
            <p>An admin deleted a job posting.</p>
            <table style="border-collapse:collapse;width:100%;max-width:700px;">
                <tr><td style="padding:6px 8px;font-weight:700;">Job Title</td><td style="padding:6px 8px;">${job.title}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Company</td><td style="padding:6px 8px;">${job.company}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Location</td><td style="padding:6px 8px;">${job.location}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Description</td><td style="padding:6px 8px;">${job.description}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Salary</td><td style="padding:6px 8px;">${job.salary}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Experience</td><td style="padding:6px 8px;">${job.experience}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">HR Email</td><td style="padding:6px 8px;">${job.recruiterEmail}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Deleted By</td><td style="padding:6px 8px;">${actor.email}</td></tr>
                <tr><td style="padding:6px 8px;font-weight:700;">Deleted At</td><td style="padding:6px 8px;">${new Date().toISOString()}</td></tr>
            </table>
        </div>`;
}

function signUserToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        jwtSecret,
        { expiresIn: '8h' }
    );
}

function parseBearerToken(req) {
    const authHeader = String(req.headers.authorization || '').trim();
    if (!authHeader.startsWith('Bearer ')) return '';
    return authHeader.slice('Bearer '.length).trim();
}

function requireAuth(req, res, next) {
    const token = parseBearerToken(req);
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        };
        return next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

function optionalAuth(req, _res, next) {
    const token = parseBearerToken(req);
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        };
    } catch {
        req.user = null;
    }
    return next();
}

function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'You are not allowed to perform this action.' });
        }
        return next();
    };
}

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

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please wait and retry.' }
});

app.use('/api', apiLimiter);
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(rootDir, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
        const normalized = filePath.toLowerCase();
        if (normalized.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            return;
        }
        if (/\.(?:css|js|mjs|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/.test(normalized)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

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
    return cb(null, true);
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
    return cb(null, true);
}

const logoUpload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

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
    let jobs;
    try {
        jobs = await loadJobsWithRecovery();
    } catch {
        jobs = null;
    }
    const applications = await readJson(applicationsPath, []);
    const users = await readJson(usersPath, []);
    const ready = Array.isArray(jobs) && Array.isArray(applications) && Array.isArray(users);
    if (!ready) {
        return res.status(503).json({ success: false, status: 'not-ready' });
    }
    return res.json({ success: true, status: 'ready' });
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    const email = safeEmail(req.body?.email);
    const password = String(req.body?.password || '');

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await readJson(usersPath, []);
    const user = users.find(item => safeEmail(item.email) === email);
    if (!user) {
        await appendAuditLog('auth.login.failed', { email, reason: 'user_not_found' });
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, String(user.passwordHash || ''));
    if (!ok) {
        await appendAuditLog('auth.login.failed', { email, reason: 'password_mismatch' });
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signUserToken(user);
    await appendAuditLog('auth.login.success', { userId: user.id, email: user.email, role: user.role });
    return res.json({ success: true, token, user: publicUser(user) });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
    return res.json({ success: true, user: req.user });
});

app.get('/api/jobs', optionalAuth, async (_req, res) => {
    try {
        const jobs = await loadJobsWithRecovery();
        return res.json({ success: true, jobs });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Unable to load jobs data: ${error.message}`
        });
    }
});

app.get('/api/jobs/:jobId', async (req, res) => {
    try {
        const job = await findJob(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
        return res.json({ success: true, job });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Unable to read job: ${error.message}` });
    }
});

app.post('/api/jobs', requireAuth, requireRole(['admin', 'hr']), logoUpload.single('companyLogo'), async (req, res) => {
    try {
        const payload = req.body || {};
        const companyName = String(payload.companyName || '').trim();
        const jobTitle = String(payload.jobTitle || '').trim();
        const jobDescription = String(payload.jobDescription || '').trim();

        const missingFields = [];
        if (!companyName) missingFields.push('companyName');
        if (!jobTitle) missingFields.push('jobTitle');
        if (!jobDescription) missingFields.push('jobDescription');
        if (missingFields.length) {
            return res.status(400).json({ success: false, message: `Validation failed: Missing ${missingFields.join(', ')}` });
        }

        const now = new Date();
        const jobId = `${slugify(companyName)}-${slugify(jobTitle)}-${now.getTime()}`;
        const salary = [payload.salaryCurrency, payload.salaryMin, payload.salaryMax].filter(Boolean).join(' ');
        const location = [payload.city, payload.state, payload.country].filter(Boolean).join(', ');
        const requiredSkills = String(payload.requiredSkills || '')
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        const benefits = Array.isArray(payload.benefits) ? payload.benefits : [payload.benefits].filter(Boolean);

        const ownerEmail = req.user.email;
        const recruiterName = req.user.role === 'hr'
            ? req.user.name
            : String(payload.recruiterName || '').trim() || req.user.name;

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
            responsibilities: String(payload.responsibilities || '')
                .split(/\n|\./)
                .map(item => item.trim())
                .filter(Boolean),
            officeAddress: [payload.officeAddress, payload.city, payload.state, payload.country, payload.pinCode]
                .filter(Boolean)
                .join(', '),
            companyOverview: payload.companyDescription || `Hiring for ${jobTitle} at ${companyName}.`,
            companyWebsite: payload.companyWebsite || '',
            recruiterName,
            recruiterEmail: ownerEmail,
            recruiterPhone: payload.recruiterPhone || '',
            recruiterDesignation: payload.recruiterDesignation || '',
            applicationDeadline: payload.applicationDeadline || '',
            jobPostedDate: now.toISOString().slice(0, 10),
            lastUpdated: now.toISOString().slice(0, 10),
            postedBy: recruiterName,
            ownerEmail,
            ownerRole: req.user.role,
            createdAt: now.toISOString()
        };

        const result = await withJobsWriteLock(async () => {
            const existingJobs = await loadJobsWithRecovery();
            await writeJsonAtomic(jobsBackupPath, existingJobs);

            const nextJobs = [job, ...existingJobs.filter(item => item?.jobId !== job.jobId)];
            await writeJsonAtomic(jobsPath, nextJobs);

            const verifiedJobs = await readJsonStrict(jobsPath);
            if (!isValidJobsArray(verifiedJobs)) {
                throw new Error('jobs.json verification failed: root is not an array.');
            }

            const inserted = verifiedJobs.find(item => item?.jobId === job.jobId);
            if (!inserted) {
                throw new Error('jobs.json verification failed: published job missing after write.');
            }

            await writeJsonAtomic(jobsBackupPath, verifiedJobs);
            return inserted;
        });

        await appendAuditLog('job.created', { jobId: result.jobId, actor: req.user.email, role: req.user.role });

        const adminEmail = String(process.env.ADMIN_EMAIL || '').trim();
        await sendMailSafe({
            from: process.env.SMTP_FROM,
            to: result.recruiterEmail,
            cc: adminEmail || undefined,
            subject: 'New Job Posted Successfully - CareerSync',
            html: buildPostedJobEmailHtml(result)
        }, 'email.job-posted');

        io.emit('jobs:changed', { action: 'created', jobId: result.jobId, at: new Date().toISOString() });

        return res.status(201).json({ success: true, message: 'Job published successfully.', job: result });
    } catch (error) {
        console.error('POST /api/jobs failed:', error);
        return res.status(500).json({
            success: false,
            message: error?.message ? `jobs.json write failed: ${error.message}` : 'jobs.json write failed.'
        });
    }
});

app.patch('/api/jobs/:jobId', requireAuth, requireRole(['admin', 'hr']), async (req, res) => {
    try {
        const payload = req.body || {};
        const result = await withJobsWriteLock(async () => {
            const jobs = await loadJobsWithRecovery();
            const idx = jobs.findIndex(item => item.jobId === req.params.jobId);
            if (idx === -1) return { notFound: true };

            const existing = jobs[idx];
            if (req.user.role === 'hr' && safeEmail(existing.ownerEmail) !== safeEmail(req.user.email)) {
                return { forbidden: true };
            }

            const updated = { ...existing };
            const editable = [
                'company',
                'title',
                'salary',
                'location',
                'experience',
                'employmentType',
                'workplaceType',
                'openPositions',
                'industry',
                'benefits',
                'requiredSkills',
                'preferredSkills',
                'description',
                'responsibilities',
                'officeAddress',
                'companyOverview',
                'companyWebsite',
                'recruiterPhone',
                'recruiterDesignation',
                'applicationDeadline'
            ];
            editable.forEach(key => {
                if (payload[key] !== undefined) updated[key] = payload[key];
            });

            updated.recruiterEmail = existing.recruiterEmail;
            updated.ownerEmail = existing.ownerEmail;
            updated.ownerRole = existing.ownerRole;
            updated.lastUpdated = new Date().toISOString().slice(0, 10);

            await writeJsonAtomic(jobsBackupPath, jobs);
            jobs[idx] = updated;
            await writeJsonAtomic(jobsPath, jobs);

            const verified = await readJsonStrict(jobsPath);
            if (!Array.isArray(verified)) throw new Error('jobs.json verification failed: root is not an array.');
            const saved = verified.find(item => item.jobId === updated.jobId);
            if (!saved) throw new Error('jobs.json verification failed: updated job missing after write.');
            await writeJsonAtomic(jobsBackupPath, verified);
            return { job: saved };
        });

        if (result.notFound) return res.status(404).json({ success: false, message: 'Job not found.' });
        if (result.forbidden) return res.status(403).json({ success: false, message: 'You can edit only your own jobs.' });

        await appendAuditLog('job.updated', { jobId: req.params.jobId, actor: req.user.email, role: req.user.role });
        io.emit('jobs:changed', { action: 'updated', jobId: req.params.jobId, at: new Date().toISOString() });

        return res.json({ success: true, message: 'Job updated successfully.', job: result.job });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to update job: ${error.message}` });
    }
});

app.delete('/api/jobs/:jobId', requireAuth, requireRole(['admin']), async (req, res) => {
    try {
        const result = await withJobsWriteLock(async () => {
            const jobs = await loadJobsWithRecovery();
            const idx = jobs.findIndex(item => item.jobId === req.params.jobId);
            if (idx === -1) return { notFound: true };

            const deletedJob = jobs[idx];
            await writeJsonAtomic(jobsBackupPath, jobs);
            jobs.splice(idx, 1);
            await writeJsonAtomic(jobsPath, jobs);

            const verified = await readJsonStrict(jobsPath);
            if (!Array.isArray(verified)) throw new Error('jobs.json verification failed: root is not an array.');
            const stillExists = verified.some(item => item.jobId === deletedJob.jobId);
            if (stillExists) throw new Error('jobs.json verification failed: deleted job still exists after write.');
            await writeJsonAtomic(jobsBackupPath, verified);

            return { deletedJob };
        });

        if (result.notFound) return res.status(404).json({ success: false, message: 'Job not found.' });

        await appendAuditLog('job.deleted', { jobId: req.params.jobId, actor: req.user.email, role: req.user.role });

        const adminEmail = String(process.env.ADMIN_EMAIL || '').trim();
        if (adminEmail) {
            await sendMailSafe({
                from: process.env.SMTP_FROM,
                to: adminEmail,
                subject: 'Job Deleted - CareerSync',
                html: buildDeleteEmailHtml(result.deletedJob, req.user)
            }, 'email.job-deleted');
        }

        io.emit('jobs:changed', { action: 'deleted', jobId: req.params.jobId, at: new Date().toISOString() });
        return res.json({ success: true, message: 'Job deleted successfully.', job: result.deletedJob });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Failed to delete job: ${error.message}` });
    }
});

app.post('/api/applications', applyLimiter, upload.single('resume'), async (req, res) => {
    const {
        fullName,
        email,
        phone,
        currentCity,
        highestQualification,
        totalExperience,
        relevantExperience,
        currentCompany,
        currentSalary,
        expectedSalary,
        noticePeriod,
        linkedInUrl,
        portfolioUrl,
        coverLetter,
        agreeTerms,
        jobId,
        source
    } = req.body;

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
        if (duplicate) return { duplicate };

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
        await writeJsonAtomic(applicationsPath, applications);
        return { application, applicationId };
    });

    if (result.duplicate) {
        return res.status(409).json({
            success: false,
            duplicate: true,
            message: 'You have already applied for this position.',
            applicationId: result.duplicate.applicationId
        });
    }

    return res.json({
        success: true,
        message: 'Application submitted successfully.',
        applicationId: result.applicationId,
        application: result.application
    });
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

    return res.json({ success: true, applications });
});

app.get('/api/applications/check-duplicate', async (req, res) => {
    const { email, jobId } = req.query;
    if (!email || !jobId) return res.json({ success: true, duplicate: false });

    const applications = await readJson(applicationsPath, []);
    const found = applications.find(item => normalize(item.email) === normalize(email) && item.jobId === jobId);
    return res.json({ success: true, duplicate: Boolean(found), applicationId: found?.applicationId || '' });
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
        await writeJsonAtomic(applicationsPath, applications);
        return { application: applications[idx] };
    });

    if (result.notFound) return res.status(404).json({ success: false, message: 'Application not found.' });
    return res.json({ success: true, application: result.application });
});

app.delete('/api/applications/:applicationId', async (req, res) => {
    const result = await withApplicationsWriteLock(async () => {
        const applications = await readJson(applicationsPath, []);
        const idx = applications.findIndex(item => item.applicationId === req.params.applicationId);
        if (idx === -1) return { notFound: true };

        const appToDelete = applications[idx];
        applications.splice(idx, 1);
        await writeJsonAtomic(applicationsPath, applications);
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

    return res.json({ success: true, message: 'Application deleted.' });
});

app.get('/api/applications/export.csv', async (_req, res) => {
    const applications = await readJson(applicationsPath, []);
    const headers = [
        'Application ID',
        'Candidate Name',
        'Email',
        'Phone',
        'Applied Company',
        'Applied Position',
        'Application Date',
        'Status',
        'Resume Filename',
        'Resume Path',
        'Source'
    ];
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
    return res.send(csv);
});

app.get('/api/applications/export.json', async (_req, res) => {
    const applications = await readJson(applicationsPath, []);
    res.setHeader('Content-Disposition', 'attachment; filename="applications.json"');
    return res.json(applications);
});

app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Validation failed: Uploaded file exceeds size limit.' });
        }
        return res.status(400).json({ success: false, message: `Upload failed: ${err.message}` });
    }
    if (err) {
        console.error('Unhandled request error:', err);
        return res.status(400).json({ success: false, message: err.message || 'Request failed.' });
    }
    return res.status(500).json({ success: false, message: 'Unexpected server error.' });
});

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
});

io.on('connection', socket => {
    socket.emit('jobs:hello', { ok: true, ts: Date.now() });
});

async function bootstrap() {
    await ensureBaseFiles();
    await seedDefaultUsers();

    httpServer.listen(PORT, () => {
        console.log(`CareerSync server running at http://localhost:${PORT}`);
    });

    httpServer.keepAliveTimeout = 65000;
    httpServer.headersTimeout = 66000;
}

bootstrap().catch(error => {
    console.error('Failed to bootstrap server:', error);
    process.exit(1);
});

function shutdown(signal) {
    console.log(`Received ${signal}, shutting down gracefully...`);
    httpServer.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
