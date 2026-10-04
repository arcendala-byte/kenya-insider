'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminStats from '@/components/admin/AdminStats';
import { destinations as catalogDestinations, experiences as catalogExperiences } from '@/lib/catalog';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

type Request = {
  id: string;
  created_at: string;
  status: string;
  arrival: string;
  departure: string;
  travelers: string;
  destinations: string[];
  interests: string[];
  notes: string | null;
  name?: string;
  email?: string;
};

type Booking = {
  id: string;
  created_at: string;
  experience_slug: string;
  start_date: string | null;
  guests: number;
  total_amount: number | null;
  currency: string;
  status: string;
};

type ContactMessage = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
};

type NewsletterSubscriber = {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
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

const TAB_CONFIG: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    description: 'Real-time overview of bookings, requests, customer inquiries, and system activity.',
  },
  requests: {
    title: 'Trip Requests',
    description: 'Review custom safari and travel itinerary requests submitted by travelers.',
  },
  users: {
    title: 'Users Management',
    description: 'Manage registered user accounts and administrative roles across the platform.',
  },
  bookings: {
    title: 'Bookings',
    description: 'Manage customer bookings, trip dates, and their current reservation statuses.',
  },
  destinations: {
    title: 'Destinations',
    description: 'Curated travel destinations across Kenya currently published in the catalog.',
  },
  experiences: {
    title: 'Experiences',
    description: 'Guided tours, wildlife safaris, and day experiences available for booking.',
  },
  reviews: {
    title: 'Customer Reviews',
    description: 'Moderation of verified traveler reviews, star ratings, and publication status.',
  },
  contacts: {
    title: 'Inquiries & Messages',
    description: 'Direct inquiries and questions sent through the website contact forms.',
  },
  newsletter: {
    title: 'Newsletter Subscribers',
    description: 'List of subscribers receiving Kenya Insider travel guides and updates.',
  },
};

export default function AdminDashboard({ initialTab }: { initialTab?: string }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = (copy[locale] as any)?.adminPage || {};

  const effectiveInitialTab = initialTab || 'dashboard';
  const [activeTab, setActiveTab] = useState<string>(effectiveInitialTab);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Search and status filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Database collections
  const [requests, setRequests] = useState<Request[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Update active tab if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Auth guard
  useEffect(() => {
    async function guard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/sign-in');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!profile || profile.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
    void guard();
  }, [router]);

  // Reset filters when changing tab
  useEffect(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, [activeTab]);

  // Data fetching
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'dashboard') {
        const [reqRes, bookRes, revRes] = await Promise.all([
          supabase.from('trip_requests').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(5),
        ]);
        if (reqRes.data) setRequests(reqRes.data as Request[]);
        if (bookRes.data) setBookings(bookRes.data as Booking[]);
        if (revRes.data) setReviews(revRes.data as Review[]);
      } else if (activeTab === 'requests') {
        const { data, error } = await supabase
          .from('trip_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setRequests(data as Request[]);
      } else if (activeTab === 'bookings') {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setBookings(data as Booking[]);
      } else if (activeTab === 'contacts') {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setContacts(data as ContactMessage[]);
      } else if (activeTab === 'newsletter') {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false });
        if (error) throw error;
        setSubscribers(data as NewsletterSubscriber[]);
      } else if (activeTab === 'reviews') {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setReviews(data as Review[]);
      }
    } catch (e: any) {
      setError(e.message ?? 'Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab !== 'users' && activeTab !== 'destinations' && activeTab !== 'experiences') {
      void loadData();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  const handleStatusChange = async (table: string, id: string, newStatus: any) => {
    const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id);
    if (error) alert('Failed to update status: ' + error.message);
    else void loadData();
  };

  const handleToggleReviewPublish = async (id: string, currentPublished: boolean) => {
    const { error } = await supabase.from('reviews').update({ is_published: !currentPublished }).eq('id', id);
    if (error) alert('Failed to update review status: ' + error.message);
    else void loadData();
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record permanently?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert('Failed to delete: ' + error.message);
    else void loadData();
  };

  // Status badge styling helper
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    let badgeClass = 'bg-gray-100 text-gray-700 dark:bg-stone-800 dark:text-gray-300';
    if (['confirmed', 'published', 'replied', 'closed'].includes(s)) {
      badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    } else if (['pending', 'reviewing', 'read'].includes(s)) {
      badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    } else if (['cancelled', 'draft'].includes(s)) {
      badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
    } else if (['new'].includes(s)) {
      badgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${badgeClass}`}>
        {status}
      </span>
    );
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.destinations && r.destinations.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.experience_slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && rev.is_published) ||
        (statusFilter === 'draft' && !rev.is_published);
      const matchesSearch =
        searchQuery === '' ||
        (rev.title && rev.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rev.body && rev.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (rev.experience_slug && rev.experience_slug.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [reviews, statusFilter, searchQuery]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.subject && c.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [contacts, statusFilter, searchQuery]);

  // Filtered subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      return searchQuery === '' || s.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [subscribers, searchQuery]);

  // Filtered destinations
  const filteredDestinations = useMemo(() => {
    return catalogDestinations.filter((d) => {
      const matchesRegion = statusFilter === 'all' || d.region.toLowerCase().includes(statusFilter.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return catalogExperiences.filter((e) => {
      const matchesCategory = statusFilter === 'all' || e.category.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  // Render Table Filter Bar
  const renderFilterBar = (
    filterOptions: { value: string; label: string }[],
    searchPlaceholder = 'Search records...'
  ) => {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {filterOptions.length > 0 && (
          <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-stone-800 text-xs font-medium overflow-x-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                  statusFilter === opt.value
                    ? 'bg-white dark:bg-stone-900 text-forestGreen dark:text-sandBeige shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <div className="relative w-full sm:w-64">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-charcoal dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forestGreen"
          />
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {t.loading || 'Loading administrative data...'}
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm">
          {error}
        </div>
      );
    }

    // MAIN DASHBOARD TAB
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6">
          <AdminStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Trip Requests card */}
            <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-stone-800 mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Recent Trip Requests
                </h3>
                <Link
                  href="/admin/trip-requests"
                  className="text-xs font-semibold text-forestGreen dark:text-sandBeige hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>
              {requests.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No recent requests.</p>
              ) : (
                <div className="space-y-2">
                  {requests.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded bg-gray-50 dark:bg-stone-800/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {r.name || r.email || `Request #${r.id.slice(0, 6)}`}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          {r.travelers} travelers &middot; {r.arrival} to {r.departure}
                        </div>
                      </div>
                      <div>{renderStatusBadge(r.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings card */}
            <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-stone-800 mb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Recent Experience Bookings
                </h3>
                <Link
                  href="/admin/bookings"
                  className="text-xs font-semibold text-forestGreen dark:text-sandBeige hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>
              {bookings.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">No recent bookings.</p>
              ) : (
                <div className="space-y-2">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b.id}
                      className="p-2.5 rounded bg-gray-50 dark:bg-stone-800/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {b.experience_slug.replace(/-/g, ' ')}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          {b.guests} guests &middot; {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'Date TBD'}
                        </div>
                      </div>
                      <div>{renderStatusBadge(b.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // USERS MANAGEMENT
    if (activeTab === 'users') {
      return <AdminUsersTable />;
    }

    // TRIP REQUESTS
    if (activeTab === 'requests') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${requests.length})` },
            { value: 'new', label: `New (${requests.filter((r) => r.status === 'new').length})` },
            { value: 'reviewing', label: `Reviewing (${requests.filter((r) => r.status === 'reviewing').length})` },
            { value: 'contacted', label: `Contacted (${requests.filter((r) => r.status === 'contacted').length})` },
            { value: 'closed', label: `Closed (${requests.filter((r) => r.status === 'closed').length})` },
          ], 'Search by email, name or destination...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Traveler
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-500">
                      No trip requests match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {r.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {r.name || 'Anonymous Traveler'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{r.email}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">
                        {r.arrival} &rarr; {r.departure}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">
                        {r.travelers} travelers
                      </td>
                      <td className="px-4 py-2.5">{renderStatusBadge(r.status)}</td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                          onClick={() =>
                            handleStatusChange('trip_requests', r.id, r.status === 'new' ? 'reviewing' : r.status === 'reviewing' ? 'contacted' : 'closed')
                          }
                        >
                          Advance Status
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={() => handleDelete('trip_requests', r.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // BOOKINGS
    if (activeTab === 'bookings') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${bookings.length})` },
            { value: 'pending', label: `Pending (${bookings.filter((b) => b.status === 'pending').length})` },
            { value: 'confirmed', label: `Confirmed (${bookings.filter((b) => b.status === 'confirmed').length})` },
            { value: 'completed', label: `Completed (${bookings.filter((b) => b.status === 'completed').length})` },
            { value: 'cancelled', label: `Cancelled (${bookings.filter((b) => b.status === 'cancelled').length})` },
          ], 'Search experience or booking ID...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-500">
                      No bookings found for the selected status.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-mono text-gray-500 dark:text-gray-400">
                        {b.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {b.experience_slug.replace(/-/g, ' ')}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">
                        {b.start_date ? new Date(b.start_date).toLocaleDateString() : 'TBD'}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">
                        {b.guests}
                      </td>
                      <td className="px-4 py-2.5">{renderStatusBadge(b.status)}</td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                          onClick={() =>
                            handleStatusChange('bookings', b.id, b.status === 'pending' ? 'confirmed' : 'pending')
                          }
                        >
                          {b.status === 'pending' ? 'Confirm' : 'Set Pending'}
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={() => handleDelete('bookings', b.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // DESTINATIONS (CATALOG)
    if (activeTab === 'destinations') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${catalogDestinations.length})` },
            { value: 'Central', label: 'Central Kenya' },
            { value: 'Coast', label: 'Coast' },
            { value: 'Rift', label: 'Rift Valley' },
            { value: 'Southern', label: 'Southern Kenya' },
          ], 'Search destinations...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Ideal Duration
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredDestinations.map((d) => (
                  <tr key={d.slug} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{d.name}</div>
                      <div className="text-xs text-gray-500 font-mono">/destinations/{d.slug}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">{d.region}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">{d.idealDuration}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Published
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <Link
                        href={`/destinations/${d.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                      >
                        <span>View</span>
                        <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // EXPERIENCES (CATALOG)
    if (activeTab === 'experiences') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${catalogExperiences.length})` },
            { value: 'Wildlife', label: 'Wildlife' },
            { value: 'City', label: 'City' },
            { value: 'Beach', label: 'Beach' },
            { value: 'Adventure', label: 'Adventure' },
            { value: 'Nature', label: 'Nature' },
          ], 'Search experiences...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredExperiences.map((e) => (
                  <tr key={e.slug} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{e.title}</div>
                      <div className="text-xs text-gray-500 font-mono">/experiences/{e.slug}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">{e.category}</td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300">{e.destination}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-gray-100">{safeFormatPrice(e.price)}</td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <Link
                        href={`/experiences/${e.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                      >
                        <span>View</span>
                        <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // REVIEWS
    if (activeTab === 'reviews') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${reviews.length})` },
            { value: 'published', label: `Published (${reviews.filter((r) => r.is_published).length})` },
            { value: 'draft', label: `Drafts (${reviews.filter((r) => !r.is_published).length})` },
          ], 'Search review body or experience...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Experience / Title
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Review Content
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500">
                      No customer reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {rev.title || 'Review'}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {rev.experience_slug ? rev.experience_slug.replace(/-/g, ' ') : 'General Trip'}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-amber-500 font-semibold text-xs whitespace-nowrap">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)} ({rev.rating}/5)
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {rev.body}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            rev.is_published
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {rev.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                          onClick={() => handleToggleReviewPublish(rev.id, rev.is_published)}
                        >
                          {rev.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={() => handleDelete('reviews', rev.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // INQUIRIES / CONTACT MESSAGES
    if (activeTab === 'contacts') {
      return (
        <div>
          {renderFilterBar([
            { value: 'all', label: `All (${contacts.length})` },
            { value: 'new', label: `New (${contacts.filter((c) => c.status === 'new').length})` },
            { value: 'read', label: `Read (${contacts.filter((c) => c.status === 'read').length})` },
            { value: 'replied', label: `Replied (${contacts.filter((c) => c.status === 'replied').length})` },
          ], 'Search by sender, email or message...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {c.subject || '—'}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {c.message}
                      </td>
                      <td className="px-4 py-2.5">{renderStatusBadge(c.status)}</td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-stone-700 transition"
                          onClick={() =>
                            handleStatusChange('contact_messages', c.id, c.status === 'new' ? 'read' : 'replied')
                          }
                        >
                          Mark {c.status === 'new' ? 'Read' : 'Replied'}
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={() => handleDelete('contact_messages', c.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // NEWSLETTER SUBSCRIBERS
    if (activeTab === 'newsletter') {
      return (
        <div>
          {renderFilterBar([], 'Search subscriber email...')}

          <div className="rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-stone-800 text-left">
              <thead className="bg-gray-50 dark:bg-stone-800/60">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Subscriber Email
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-stone-800 text-sm">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-xs text-gray-500">
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-stone-800/30 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-100">{s.email}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">
                        {new Date(s.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs font-medium rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          onClick={() => handleDelete('newsletter_subscribers', s.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  const meta = TAB_CONFIG[activeTab] || {
    title: 'Admin Management',
    description: 'Overview of platform performance and operations.',
  };

  return (
    <div className="space-y-5 text-left">
      {/* Top-left aligned Page Title and Description */}
      <div className="pb-4 border-b border-gray-200/80 dark:border-stone-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {meta.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-3xl">
          {meta.description}
        </p>
      </div>

      {/* Render Selected View */}
      {renderContent()}
    </div>
  );
}
