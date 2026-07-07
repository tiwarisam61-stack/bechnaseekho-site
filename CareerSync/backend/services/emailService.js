const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verifyTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { configured: false, reason: 'SMTP credentials not configured' };
  }
  await transporter.verify();
  return { configured: true };
}

async function sendCompanyResumeEmail({ candidateName, candidateEmail, candidatePhone, uploadTime, attachmentPath, filename }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.COMPANY_EMAIL || process.env.SMTP_USER;
  const cc = process.env.COMPANY_CC_EMAIL || process.env.SMTP_CC || process.env.SMTP_USER;

  const mailOptions = {
    from,
    to,
    cc,
    subject: 'New Resume Uploaded - CareerSync',
    text: `A new candidate uploaded a resume.\nCandidate Name: ${candidateName}\nEmail: ${candidateEmail}\nPhone: ${candidatePhone}\nUpload Time: ${uploadTime}\nResume is attached.`,
    attachments: [{ filename, path: attachmentPath }],
  };

  return transporter.sendMail(mailOptions);
}

async function sendCandidateConfirmationEmail({ candidateEmail, candidateName }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const mailOptions = {
    from,
    to: candidateEmail,
    subject: 'Resume Uploaded Successfully',
    text: `Hello ${candidateName}\nYour resume has been uploaded successfully.\nOur team will review your profile.\nThank you for using CareerSync.\nRegards,\nCareerSync Team`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendCompanyResumeEmail, sendCandidateConfirmationEmail, verifyTransport };
