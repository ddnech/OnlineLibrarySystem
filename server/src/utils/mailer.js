const nodemailer = require("nodemailer");
const { mail } = require("../config/env");

let transporter = null;
if (mail.host) {
  transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.port === 465,
    auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
  });
}

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Sends a simple branded email. If SMTP isn't configured it just logs and moves on,
 * so a missing mail server never breaks sign up.
 */
async function sendEmail({ to, subject, name, message }) {
  if (!transporter) {
    console.log(`[mail] SMTP not configured, skipped "${subject}" to ${to}`);
    return false;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;background:#f2f4f3;font-family:Helvetica,Arial,sans-serif;color:#1d2a3a">
  <div style="max-width:520px;margin:32px auto;background:#ffffff;border:1px solid #dce1de;border-radius:8px;padding:28px">
    <p style="margin:0 0 20px;font-size:18px;font-weight:700;color:#2f5d50">Online Library</p>
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px;line-height:1.6">${escapeHtml(message)}</p>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({ from: mail.from, to, subject, html });
    return true;
  } catch (error) {
    console.error(`[mail] Could not send "${subject}" to ${to}:`, error.message);
    return false;
  }
}

module.exports = { sendEmail };
