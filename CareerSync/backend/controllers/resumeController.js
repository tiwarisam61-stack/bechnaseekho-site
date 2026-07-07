const { createStorageService } = require('../services/storageService');
const { sendCompanyResumeEmail, sendCandidateConfirmationEmail } = require('../services/emailService');
const { sendWhatsAppNotification } = require('../services/whatsappService');

const allowedTypes = new Set(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
const maxSizeBytes = 5 * 1024 * 1024;

async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const file = req.file;
    if (!allowedTypes.has(file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Only PDF, DOC, and DOCX files are allowed.' });
    }

    if (file.size > maxSizeBytes) {
      return res.status(400).json({ success: false, message: 'File size must be 5 MB or less.' });
    }

    const storage = createStorageService();
    const savedFile = await storage.saveFile(file);

    const candidateName = req.body?.candidateName || req.user?.name || 'Candidate';
    const candidateEmail = req.body?.candidateEmail || req.user?.email || '';
    const candidatePhone = req.body?.candidatePhone || req.user?.phone || '';
    const uploadTime = new Date().toISOString();
    const resumeUrl = savedFile.publicUrl;

    const emailTasks = [];
    emailTasks.push(
      sendCompanyResumeEmail({
        candidateName,
        candidateEmail,
        candidatePhone,
        uploadTime,
        attachmentPath: savedFile.absolutePath,
        filename: savedFile.filename,
      }).then(() => console.log('Company Email Sent')).catch((error) => console.error('Company Email failed:', error.message))
    );

    emailTasks.push(
      sendCandidateConfirmationEmail({ candidateEmail, candidateName }).then(() => console.log('Candidate Email Sent')).catch((error) => console.error('Candidate Email failed:', error.message))
    );

    emailTasks.push(
      sendWhatsAppNotification({ name: candidateName, phone: candidatePhone, email: candidateEmail, resumeUrl, filename: savedFile.filename }).then((result) => {
        if (!result.skipped) {
          console.log('WhatsApp Sent');
        } else {
          console.log('WhatsApp skipped:', result.reason);
        }
      }).catch((error) => console.error('WhatsApp failed:', error.message))
    );

    await Promise.allSettled(emailTasks);
    console.log('Resume Saved', { filename: savedFile.filename, path: savedFile.absolutePath });

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully.',
      filename: savedFile.filename,
      downloadUrl: resumeUrl,
    });
  } catch (error) {
    console.error('Resume upload failed:', error);
    return res.status(500).json({ success: false, message: error.message || 'Unable to upload resume.' });
  }
}

module.exports = { uploadResume };
