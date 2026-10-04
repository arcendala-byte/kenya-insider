import { NextResponse } from 'next/server';
import { notifyContact } from '@/lib/server/email';
import { isRateLimited, isResponse, logServerError, readJsonObject } from '@/lib/server/public-request';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const requiredText = (value: unknown, max: number) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max ? value.trim() : null;
export async function POST(request: Request) {
  if (isRateLimited(request, 'contact')) return NextResponse.json({ error: 'Please wait before sending another message.' }, { status: 429 });
  const body = await readJsonObject(request); if (isResponse(body)) return body;
  if (body.website) return NextResponse.json({ ok: true }, { status: 201 });
  const name = requiredText(body.name, 120); const email = requiredText(body.email, 254); const subject = requiredText(body.subject, 200); const message = requiredText(body.message, 5000);
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !subject || !message) return NextResponse.json({ error: 'Please complete all fields with valid details.' }, { status: 400 });
  const supabase = getSupabaseServerClient(); if (!supabase) return NextResponse.json({ error: 'The contact service is not configured yet.' }, { status: 503 });
  try { const { error } = await supabase.from('contact_messages').insert({ name, email: email.toLowerCase(), subject, message }); if (error) { logServerError('contact_insert_failed', error); return NextResponse.json({ error: 'We could not send your message. Please try again.' }, { status: 500 }); } await notifyContact({ name, email, subject, message }); return NextResponse.json({ ok: true }, { status: 201 }); } catch (error) { logServerError('contact_unexpected_failure', error); return NextResponse.json({ error: 'We could not send your message. Please try again.' }, { status: 500 }); }
}
