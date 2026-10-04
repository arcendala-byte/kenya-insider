'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLocale } from '@/components/LocaleProvider';
import { experiences } from '@/lib/catalog';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

// ─── Types ───────────────────────────────────────────────────────────────────

type TripRequest = {
  id: string;
  created_at: string;
  status: 'new' | 'reviewing' | 'contacted' | 'closed';
  arrival: string;
  departure: string;
  travelers: string;
  traveling_with: string | null;
  destinations: string[];
  interests: string[];
  notes: string | null;
  name: string;
};

type Booking = {
  id: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  experience_slug: string;
  start_date: string | null;
  guests: number;
  total_amount: number | null;
  currency: string;
};

type Review = {
  id: string;
  created_at: string;
  experience_slug: string | null;
  rating: number;
  title: string | null;
  body: string;
  is_published: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  new:        { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500',   label: 'New' },
  reviewing:  { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'Under Review' },
  contacted:  { bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500', label: 'Contacted' },
  closed:     { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400',   label: 'Closed' },
  pending:    { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500',  label: 'Pending' },
  confirmed:  { bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-600',  label: 'Confirmed' },
  cancelled:  { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500',    label: 'Cancelled' },
  completed:  { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-500',   label: 'Completed' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`h-4 w-4 ${n <= rating ? 'text-softGold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function experienceTitle(slug: string) {
  return experiences.find((e) => e.slug === slug)?.title ?? slug;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ icon, heading, sub, cta }: { icon: React.ReactNode; heading: string; sub: string; cta: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sandBeige text-forestGreen">{icon}</div>
      <p className="font-heading text-xl text-forestGreen">{heading}</p>
      <p className="max-w-xs text-sm text-charcoal/60">{sub}</p>
      {cta}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'requests' | 'bookings' | 'reviews';

export default function UserDashboard() {
  const router = useRouter();
  const { locale } = useLocale();

  const [profile, setProfile] = useState<{ email: string; full_name: string | null }>({ email: '', full_name: null });
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadData = useCallback(async (email: string) => {
    if (!supabase) return;
    const [reqRes, bookRes, revRes] = await Promise.all([
      supabase.from('trip_requests').select('id,created_at,status,arrival,departure,travelers,traveling_with,destinations,interests,notes,name').eq('email', email).order('created_at', { ascending: false }),
      supabase.from('bookings').select('id,created_at,status,experience_slug,start_date,guests,total_amount,currency').eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').order('created_at', { ascending: false }),
      supabase.from('reviews').select('id,created_at,experience_slug,rating,title,body,is_published').eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').order('created_at', { ascending: false }),
    ]);
    if (reqRes.error) { setError('Could not load your planning requests.'); return; }
    setRequests((reqRes.data ?? []) as TripRequest[]);
    setBookings((bookRes.data ?? []) as Booking[]);
    setReviews((revRes.data ?? []) as Review[]);
  }, []);

  useEffect(() => {
    async function init() {
      if (!supabase) { setError('Authentication is not configured.'); setLoading(false); return; }
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace('/sign-in'); return; }
      const meta = (data.user.user_metadata ?? {}) as Record<string, string>;
      setProfile({ email: data.user.email ?? '', full_name: meta['full_name'] ?? null });
      await loadData(data.user.email ?? '');
      setLoading(false);
    }
    void init();
  }, [router, loadData]);

  async function signOut() {
    await supabase?.auth.signOut();
    router.push('/');
    router.refresh();
  }

  async function cancelRequest(id: string) {
    setCancellingId(id);
    await supabase?.from('trip_requests').update({ status: 'closed' }).eq('id', id);
    await loadData(profile.email);
    setCancellingId(null);
  }

  // ─── Summary counts ───────────────────────────────────────────────────────
  const activeRequests = requests.filter((r) => r.status === 'new' || r.status === 'reviewing' || r.status === 'contacted').length;
  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;

  const initials = profile.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : (profile.email[0] ?? 'U').toUpperCase();

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'requests', label: 'Planning Requests', count: requests.length },
    { id: 'bookings', label: 'Bookings', count: bookings.length },
    { id: 'reviews',  label: 'My Reviews',  count: reviews.length },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-charcoal/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forestGreen border-t-transparent" />
          <p className="text-sm">Loading your dashboard…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="max-w-sm rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">Something went wrong</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button onClick={() => router.refresh()} className="mt-4 bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">Try again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-14">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forestGreen text-xl font-bold text-white shadow-sm">
            {initials}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-softGold">Your Account</p>
            <h1 className="mt-0.5 font-heading text-3xl text-forestGreen">
              {profile.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}` : 'Your Dashboard'}
            </h1>
            <p className="mt-0.5 text-sm text-charcoal/60">{profile.email}</p>
          </div>
        </div>
        <button onClick={signOut} className="border border-forestGreen px-4 py-2 text-sm font-semibold text-forestGreen hover:bg-forestGreen hover:text-white transition">
          Sign out
        </button>
      </div>

      {/* ── Summary Stat Cards ── */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Active Requests', value: activeRequests, note: `${requests.length} total`, color: 'border-blue-200 bg-blue-50' },
          { label: 'Active Bookings', value: activeBookings, note: `${bookings.length} total`, color: 'border-green-200 bg-green-50' },
          { label: 'Reviews Written', value: reviews.length, note: reviews.filter(r => r.is_published).length + ' published', color: 'border-amber-200 bg-amber-50' },
        ].map((card) => (
          <div key={card.label} className={`rounded-lg border p-5 ${card.color}`}>
            <p className="text-3xl font-bold text-forestGreen">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-charcoal">{card.label}</p>
            <p className="text-xs text-charcoal/60">{card.note}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="mt-10 border-b border-sandBeige">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
                tab === t.id
                  ? 'border-forestGreen text-forestGreen'
                  : 'border-transparent text-charcoal/50 hover:text-charcoal'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${tab === t.id ? 'bg-forestGreen text-white' : 'bg-sandBeige text-charcoal'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════ TRIP REQUESTS TAB ══════════════════════ */}
      {tab === 'requests' && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-charcoal/60">{requests.length} planning request{requests.length !== 1 ? 's' : ''}</p>
            <Link href="/plan-your-trip" className="bg-forestGreen px-4 py-2 text-sm font-semibold text-white hover:bg-darkForest transition">
              + New request
            </Link>
          </div>

          {requests.length === 0 ? (
            <EmptyState
              icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" /></svg>}
              heading="No planning requests yet"
              sub="Tell us about your dream Kenya trip and we'll put together something special."
              cta={<Link href="/plan-your-trip" className="bg-forestGreen px-5 py-2.5 text-sm font-semibold text-white hover:bg-darkForest transition">Plan your trip</Link>}
            />
          ) : (
            <div className="mt-4 grid gap-4">
              {requests.map((req) => (
                <article key={req.id} className="overflow-hidden rounded-lg border border-sandBeige bg-white shadow-sm">
                  {/* Card header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sandBeige bg-warmIvory px-5 py-3">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={req.status} />
                      <span className="text-xs text-charcoal/50">Submitted {fmt(req.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {req.status === 'new' && (
                        <button
                          onClick={() => cancelRequest(req.id)}
                          disabled={cancellingId === req.id}
                          className="rounded border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {cancellingId === req.id ? 'Cancelling…' : 'Cancel request'}
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                        className="rounded border border-sandBeige px-3 py-1 text-xs font-semibold text-charcoal hover:bg-sandBeige transition"
                      >
                        {expandedId === req.id ? 'Hide details' : 'View details'}
                      </button>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Travel Dates</p>
                      <p className="mt-1 font-medium">{fmt(req.arrival)} → {fmt(req.departure)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Travelers</p>
                      <p className="mt-1 font-medium">{req.travelers} {req.traveling_with ? `· ${req.traveling_with}` : ''}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Destinations</p>
                      <p className="mt-1 font-medium">{req.destinations?.join(', ') || 'TBD'}</p>
                    </div>
                    {req.interests?.length > 0 && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Interests</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {req.interests.map((i) => (
                            <span key={i} className="rounded-full bg-sandBeige px-2.5 py-0.5 text-xs font-medium text-charcoal">{i}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded notes */}
                  {expandedId === req.id && req.notes && (
                    <div className="border-t border-sandBeige bg-warmIvory px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Additional Notes</p>
                      <p className="mt-1 text-sm leading-6">{req.notes}</p>
                    </div>
                  )}

                  {/* Status explanation */}
                  {(req.status === 'reviewing' || req.status === 'contacted') && (
                    <div className="border-t border-sandBeige bg-forestGreen/5 px-5 py-3">
                      <p className="text-xs text-forestGreen">
                        {req.status === 'reviewing'
                          ? '✦ Our team is reviewing your request and will reach out shortly.'
                          : '✦ We have been in touch. Please check your inbox for our response.'}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════ BOOKINGS TAB ══════════════════════ */}
      {tab === 'bookings' && (
        <section className="mt-6">
          <p className="text-sm text-charcoal/60">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

          {bookings.length === 0 ? (
            <EmptyState
              icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              heading="No bookings yet"
              sub="Browse our experiences and make your first booking."
              cta={<Link href="/experiences" className="bg-forestGreen px-5 py-2.5 text-sm font-semibold text-white hover:bg-darkForest transition">Explore experiences</Link>}
            />
          ) : (
            <div className="mt-4 grid gap-4">
              {bookings.map((b) => {
                const exp = experiences.find((e) => e.slug === b.experience_slug);
                return (
                  <article key={b.id} className="overflow-hidden rounded-lg border border-sandBeige bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sandBeige bg-warmIvory px-5 py-3">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={b.status} />
                        <span className="text-xs text-charcoal/50">Booked {fmt(b.created_at)}</span>
                      </div>
                      {exp && (
                        <Link href={`/experiences/${b.experience_slug}`} className="text-xs font-semibold text-forestGreen underline underline-offset-4 hover:text-darkForest transition">
                          View experience →
                        </Link>
                      )}
                    </div>
                    <div className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="lg:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Experience</p>
                        <p className="mt-1 font-medium text-forestGreen">{experienceTitle(b.experience_slug)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Start Date</p>
                        <p className="mt-1 font-medium">{b.start_date ? fmt(b.start_date) : 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Guests</p>
                        <p className="mt-1 font-medium">{b.guests}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">Amount</p>
                        <p className="mt-1 font-medium text-forestGreen">
                          {b.total_amount
                            ? (exp ? safeFormatPrice(exp.price) : `${b.currency} ${b.total_amount.toLocaleString()}`)
                            : 'To be confirmed'}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════ REVIEWS TAB ══════════════════════ */}
      {tab === 'reviews' && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-charcoal/60">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>

          {reviews.length === 0 ? (
            <EmptyState
              icon={<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
              heading="No reviews yet"
              sub="After your experiences, share your thoughts to help other travellers."
              cta={<Link href="/experiences" className="bg-forestGreen px-5 py-2.5 text-sm font-semibold text-white hover:bg-darkForest transition">Explore experiences</Link>}
            />
          ) : (
            <div className="mt-4 grid gap-4">
              {reviews.map((rev) => (
                <article key={rev.id} className="overflow-hidden rounded-lg border border-sandBeige bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sandBeige bg-warmIvory px-5 py-3">
                    <div className="flex items-center gap-3">
                      <StarRating rating={rev.rating} />
                      <span className="text-xs text-charcoal/50">{fmt(rev.created_at)}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${rev.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {rev.is_published ? 'Published' : 'Pending review'}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    {rev.experience_slug && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-softGold">{experienceTitle(rev.experience_slug)}</p>
                    )}
                    {rev.title && <p className="mt-1 font-semibold text-forestGreen">{rev.title}</p>}
                    <p className="mt-2 text-sm leading-6 text-charcoal/80">{rev.body}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Footer CTA ── */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-sandBeige pt-8">
        <div>
          <p className="font-semibold text-forestGreen">Ready for your next adventure?</p>
          <p className="text-sm text-charcoal/60">Browse Kenya's finest experiences and plan your next trip.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/experiences" className="border border-forestGreen px-4 py-2 text-sm font-semibold text-forestGreen hover:bg-forestGreen hover:text-white transition">Browse experiences</Link>
          <Link href="/plan-your-trip" className="bg-forestGreen px-4 py-2 text-sm font-semibold text-white hover:bg-darkForest transition">Plan your trip</Link>
        </div>
      </div>
    </main>
  );
}
