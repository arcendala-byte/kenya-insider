import { NextResponse } from 'next/server';
import { isRateLimited, isResponse, logServerError, readJsonObject } from '@/lib/server/public-request';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  if (isRateLimited(request, 'newsletter')) return NextResponse.json({ error: 'Please wait before subscribing again.' }, { status: 429 });
  const body = await readJsonObject(request); if (isResponse(body)) return body;
  if (body.website) return NextResponse.json({ ok: true }, { status: 201 });
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  const supabase = getSupabaseServerClient(); if (!supabase) return NextResponse.json({ error: 'The subscription service is not configured yet.' }, { status: 503 });
  try { const { error } = await supabase.from('newsletter_subscribers').upsert({ email, subscribed_at: new Date().toISOString(), unsubscribed_at: null }, { onConflict: 'email' }); if (error) { logServerError('newsletter_insert_failed', error); return NextResponse.json({ error: 'We could not subscribe you just now. Please try again.' }, { status: 500 }); } return NextResponse.json({ ok: true }, { status: 201 }); } catch (error) { logServerError('newsletter_unexpected_failure', error); return NextResponse.json({ error: 'We could not subscribe you just now. Please try again.' }, { status: 500 }); }
}
