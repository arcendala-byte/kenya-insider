'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  UsersIcon,
  CalendarDaysIcon,
  ClockIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

type StatItem = {
  label: string;
  count: number | null;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

export default function AdminStats() {
  const [counts, setCounts] = useState<{
    users: number | null;
    bookings: number | null;
    pendingBookings: number | null;
    requests: number | null;
    pendingRequests: number | null;
    reviews: number | null;
  }>({
    users: null,
    bookings: null,
    pendingBookings: null,
    requests: null,
    pendingRequests: null,
    reviews: null,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [
          { count: usersCount },
          { count: bookingsCount },
          { count: pendingBookings },
          { count: requestsCount },
          { count: pendingRequests },
          { count: reviewsCount },
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('bookings').select('id', { count: 'exact', head: true }),
          supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('trip_requests').select('id', { count: 'exact', head: true }),
          supabase.from('trip_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('reviews').select('id', { count: 'exact', head: true }),
        ]);

        setCounts({
          users: usersCount ?? 0,
          bookings: bookingsCount ?? 0,
          pendingBookings: pendingBookings ?? 0,
          requests: requestsCount ?? 0,
          pendingRequests: pendingRequests ?? 0,
          reviews: reviewsCount ?? 0,
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      }
    }
    void fetchCounts();
  }, []);

  const stats: StatItem[] = [
    {
      label: 'Total Users',
      count: counts.users,
      icon: UsersIcon,
      accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Total Bookings',
      count: counts.bookings,
      icon: CalendarDaysIcon,
      accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      label: 'Pending Bookings',
      count: counts.pendingBookings,
      icon: ClockIcon,
      accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: 'Trip Requests',
      count: counts.requests,
      icon: PaperAirplaneIcon,
      accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      label: 'New Requests',
      count: counts.pendingRequests,
      icon: SparklesIcon,
      accent: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40',
    },
    {
      label: 'Reviews',
      count: counts.reviews,
      icon: StarIcon,
      accent: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((s, idx) => {
        const IconComponent = s.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-gray-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
                {s.label}
              </span>
              <div className={`p-1.5 rounded-md ${s.accent}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {s.count === null ? (
                <span className="text-xs text-gray-400 font-normal">Loading...</span>
              ) : (
                s.count
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
