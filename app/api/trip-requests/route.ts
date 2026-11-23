import { NextResponse } from 'next/server';
import { notifyTripRequest } from '@/lib/server/email';
import {
  isRateLimited,
  isResponse,
  logServerError,
  readJsonObject,
} from '@/lib/server/public-request';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const emailPattern = /^\S+@\S+\.\S+$/;

const strings = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const result = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  // Every original item must have been a string.
  if (result.length !== value.length) {
    return null;
  }

  // Prevent excessively long values.
  if (result.some((item) => item.length > 100)) {
    return null;
  }

  return result;
};

const nonEmptyStrings = (value: unknown): string[] | null => {
  const result = strings(value);

  if (!result || result.length === 0) {
    return null;
  }

  return result;
};

const parseDate = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})$/);

  if (!match) {
    return null;
  }

  const date = match[1];
  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  // Prevent JavaScript from accepting invalid calendar dates
  // such as 2026-02-31.
  const [year, month, day] = date.split('-').map(Number);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() + 1 !== month ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const text = (value: unknown, max: number): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const result = value.trim();

  if (!result || result.length > max) {
    return null;
  }

  return result;
};

export async function POST(request: Request) {
  // Rate limiting
  if (isRateLimited(request, 'trip-request')) {
    return NextResponse.json(
      {
        error: 'Please wait before submitting another request.',
      },
      { status: 429 }
    );
  }

  // Read and validate JSON body
  const body = await readJsonObject(request);

  if (isResponse(body)) {
    return body;
  }

  // Honeypot protection
  if (body.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  // Basic field validation
  const name = text(body.name, 120);
  const email = text(body.email, 254);
  const arrival = parseDate(body.arrival);
  const departure = parseDate(body.departure);
  const travelers = text(body.travelers, 80);

  // Interests must contain at least one selection.
  const interests = nonEmptyStrings(body.interests);

  // Destinations may contain zero or more selections,
  // but the value itself must be a valid string array.
  const destinations = strings(body.destinations);

  const travelingWith =
    typeof body.travelingWith === 'string'
      ? body.travelingWith.trim().slice(0, 80) || null
      : null;

  const notes =
    typeof body.notes === 'string'
      ? body.notes.trim().slice(0, 3000) || null
      : null;

  // Determine validation failure.
  let failReason: string | null = null;

  if (!name) {
    failReason = 'name';
  } else if (!email) {
    failReason = 'email';
  } else if (!emailPattern.test(email)) {
    failReason = 'email_format';
  } else if (!arrival) {
    failReason = 'arrival';
  } else if (!departure) {
    failReason = 'departure';
  } else if (!travelers) {
    failReason = 'travelers';
  } else if (!interests) {
    failReason = 'interests';
  } else if (destinations === null) {
    failReason = 'destinations';
  } else if (departure < arrival) {
    failReason = 'date_order';
  }

  // Return validation error.
  if (
    failReason ||
    !name ||
    !email ||
    !arrival ||
    !departure ||
    !travelers ||
    !interests ||
    destinations === null
  ) {
    const debug = {
      failField: failReason,
      name: !!name,
      email: !!email,
      arrivalRaw: body.arrival,
      arrival,
      departureRaw: body.departure,
      departure,
      travelers: body.travelers,
      interests,
      destinations,
    };

    console.error('[trip-request 400]', JSON.stringify(debug));

    return NextResponse.json(
      {
        error: 'Please provide valid contact and travel details.',
        field: failReason,
        ...(process.env.NODE_ENV === 'development' ? { debug } : {}),
      },
      { status: 400 }
    );
  }

  // Get Supabase server client.
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error: 'The booking service is not configured yet.',
      },
      { status: 503 }
    );
  }

  try {
    // Save trip request to Supabase.
    const { error } = await supabase.from('trip_requests').insert({
      name,
      email: email!.toLowerCase(),
      arrival,
      departure,
      travelers,
      traveling_with: travelingWith,
      interests,
      destinations,
      notes,
      status: 'new',
    });

    if (error) {
      logServerError('trip_request_insert_failed', error);

      return NextResponse.json(
        {
          error: 'We could not save your request. Please try again.',
        },
        { status: 500 }
      );
    }

    // Send notification email.
    await notifyTripRequest({
      name,
      email,
      arrival,
      departure,
      travelers,
      destinations,
    });

    // Success.
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logServerError('trip_request_unexpected_failure', error);

    return NextResponse.json(
      {
        error: 'We could not save your request. Please try again.',
      },
      { status: 500 }
    );
  }
}
