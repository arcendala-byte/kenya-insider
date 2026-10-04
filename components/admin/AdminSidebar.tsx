'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  PaperAirplaneIcon,
  MapPinIcon,
  SparklesIcon,
  StarIcon,
  InboxIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'MAIN',
    items: [
      { href: '/admin', label: 'Dashboard', icon: HomeIcon },
    ],
  },
  {
    group: 'MANAGEMENT',
    items: [
      { href: '/admin/users', label: 'Users', icon: UsersIcon },
      { href: '/admin/bookings', label: 'Bookings', icon: CalendarDaysIcon },
      { href: '/admin/trip-requests', label: 'Trip Requests', icon: PaperAirplaneIcon },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { href: '/admin/destinations', label: 'Destinations', icon: MapPinIcon },
      { href: '/admin/experiences', label: 'Experiences', icon: SparklesIcon },
      { href: '/admin/reviews', label: 'Reviews', icon: StarIcon },
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [
      { href: '/admin/inquiries', label: 'Inquiries', icon: InboxIcon },
      { href: '/admin/newsletter', label: 'Newsletter', icon: EnvelopeIcon },
    ],
  },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  return (
    <aside
      className="w-64 h-full flex flex-col bg-darkForest text-white select-none border-r border-forestGreen/40 shadow-xl lg:shadow-none"
      aria-label="Admin sidebar navigation"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-forestGreen/50 bg-forestGreen/20">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-softGold">
            Kenya Insider
          </div>
          <div className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
            Admin Portal
            <span className="text-[10px] font-normal uppercase px-1.5 py-0.2 rounded bg-forestGreen/80 text-sandBeige border border-forestGreen">
              v1.0
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-sandBeige/60">
              {group.group}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onClose && onClose()}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                        isActive
                          ? 'bg-softGold text-darkForest font-semibold shadow-sm'
                          : 'text-white/80 hover:text-white hover:bg-forestGreen/60'
                      }`}
                    >
                      <IconComponent
                        className={`h-4 w-4 flex-shrink-0 ${
                          isActive ? 'text-darkForest' : 'text-sandBeige/80'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Account & Utility */}
      <div className="p-3 border-t border-forestGreen/50 bg-forestGreen/20 space-y-1">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-3 py-1.5 text-xs text-white/70 hover:text-white rounded hover:bg-forestGreen/60 transition"
        >
          <span className="flex items-center gap-2">
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 text-sandBeige/70" />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] text-sandBeige/50">Live</span>
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded transition"
        >
          <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
