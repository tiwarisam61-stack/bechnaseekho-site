const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadResume } = require('../controllers/resumeController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const uploadsDir = path.resolve(process.cwd(), process.env.UPLOADS_DIR || 'uploads/resumes');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only PDF, DOC, and DOCX files are allowed.'));
    }
    cb(null, true);
  },
});

router.post('/uploadResume', requireAuth, upload.single('resume'), uploadResume);

module.exports = router;
