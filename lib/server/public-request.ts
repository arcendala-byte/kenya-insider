import { NextResponse } from 'next/server';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const recentRequests = new Map<string, number[]>();
const MAX_BODY_BYTES = 12_000;

export function clientAddress(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export function isRateLimited(request: Request, scope: string) {
  if (process.env.NODE_ENV === 'development') return false;
  const key = `${scope}:${clientAddress(request)}`;
  const now = Date.now();
  const timestamps = (recentRequests.get(key) || []).filter(time => now - time < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) return true;
  timestamps.push(now);
  recentRequests.set(key, timestamps);
  return false;
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | NextResponse> {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid JSON object');
    return value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Please send a valid request.' }, { status: 400 });
  }
}

export function isResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

export function logServerError(event: string, error: unknown, context: Record<string, unknown> = {}) {
  console.error(JSON.stringify({ level: 'error', event, ...context, error: error instanceof Error ? error.message : 'unknown', timestamp: new Date().toISOString() }));
}
