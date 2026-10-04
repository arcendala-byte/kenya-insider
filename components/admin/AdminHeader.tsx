'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

type AdminHeaderProps = {
  onMenuClick: () => void;
};

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Dashboard',
    subtitle: 'System overview and performance metrics',
  },
  '/admin/users': {
    title: 'Users Management',
    subtitle: 'Registered user accounts, roles, and administrative access',
  },
  '/admin/bookings': {
    title: 'Bookings',
    subtitle: 'Customer experience reservations and payment status',
  },
  '/admin/trip-requests': {
    title: 'Trip Requests',
    subtitle: 'Custom safari and holiday itinerary requests',
  },
  '/admin/destinations': {
    title: 'Destinations',
    subtitle: 'Curated Kenya travel locations and regions',
  },
  '/admin/experiences': {
    title: 'Experiences',
    subtitle: 'Guided tours, wildlife safaris, and activities',
  },
  '/admin/reviews': {
    title: 'Customer Reviews',
    subtitle: 'Verified traveler feedback and ratings moderation',
  },
  '/admin/inquiries': {
    title: 'Inquiries',
    subtitle: 'Customer messages and contact inquiries',
  },
  '/admin/newsletter': {
    title: 'Newsletter Subscribers',
    subtitle: 'Audience mailing list and subscriber records',
  },
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentMeta = TITLE_MAP[pathname] || {
    title: 'Administration',
    subtitle: 'Kenya Insider Management Portal',
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-white dark:bg-stone-900 border-b border-gray-200 dark:border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile trigger & Page context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-forestGreen transition"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {currentMeta.title}
          </h1>
          <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Profile, and Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-stone-800 hover:bg-gray-100 rounded-md border border-gray-200 dark:border-stone-700 transition"
        >
          <span>Live Site</span>
          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
        </Link>

        {/* Admin profile pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-forestGreen/10 dark:bg-forestGreen/30 text-forestGreen dark:text-sandBeige rounded-full border border-forestGreen/20">
          <ShieldCheckIcon className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">Admin</span>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out of Admin"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md border border-transparent hover:border-rose-200 transition"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
