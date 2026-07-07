const axios = require('axios');

async function sendWhatsAppNotification({ name, phone, email, resumeUrl, filename }) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;
  const to = process.env.COMPANY_WHATSAPP_NUMBER || process.env.WHATSAPP_TO || '+919310665960';

  if (!phoneNumberId || !token) {
    return { skipped: true, reason: 'WhatsApp credentials not configured' };
  }

  const message = `New Resume Uploaded\nCandidate Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nResume: ${resumeUrl || filename}`;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { skipped: false, response: response.data };
  } catch (error) {
    console.error('WhatsApp notification failed:', error.response?.data || error.message);
    return { skipped: false, error: error.message };
  }
}

module.exports = { sendWhatsAppNotification };
