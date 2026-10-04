import 'server-only';
import { logServerError } from './public-request';

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]!));

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return false;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to, subject, html }) });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
  return true;
}

export async function notifyTripRequest(input: { name: string; email: string; arrival: string; departure: string; travelers: string; destinations: string[] }) {
  const details = `<p><strong>Guest:</strong> ${escapeHtml(input.name)} (${escapeHtml(input.email)})</p><p><strong>Dates:</strong> ${escapeHtml(input.arrival)} to ${escapeHtml(input.departure)}</p><p><strong>Travellers:</strong> ${escapeHtml(input.travelers)}</p><p><strong>Destinations:</strong> ${input.destinations.map(escapeHtml).join(', ') || 'Not specified'}</p>`;
  const jobs = [sendEmail(input.email, 'We received your Kenya Insider trip request', `<h1>Thank you, ${escapeHtml(input.name)}</h1><p>Your Kenya trip request is safely with our team. We will review your plans and be in touch with helpful next steps.</p>` )];
  if (process.env.RESEND_TO_EMAIL) jobs.push(sendEmail(process.env.RESEND_TO_EMAIL, `New trip request from ${input.name}`, `<h1>New Kenya Insider trip request</h1>${details}`));
  const results = await Promise.allSettled(jobs);
  if (results.some(result => result.status === 'rejected')) logServerError('trip_request_email_failed', new Error('One or more email notifications failed'));
}

export async function notifyContact(input: { name: string; email: string; subject: string; message: string }) {
  const jobs = [sendEmail(input.email, 'We received your message', `<h1>Thank you, ${escapeHtml(input.name)}</h1><p>We received your message and will be in touch soon.</p>` )];
  if (process.env.RESEND_TO_EMAIL) jobs.push(sendEmail(process.env.RESEND_TO_EMAIL, `New contact message: ${input.subject}`, `<p><strong>${escapeHtml(input.name)}</strong> (${escapeHtml(input.email)})</p><p>${escapeHtml(input.message)}</p>`));
  const results = await Promise.allSettled(jobs);
  if (results.some(result => result.status === 'rejected')) logServerError('contact_email_failed', new Error('One or more email notifications failed'));
}
