'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-stone-950 font-body text-charcoal dark:text-gray-100">
      {/* Mobile Sidebar Overlay / Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Mobile drawer + Desktop fixed column */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main Administrative Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        {/* Admin Top Bar */}
        <AdminHeader onMenuClick={() => setMobileOpen(true)} />

        {/* Page Content Container - Aligned top-left with consistent padding */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Subtle Admin Footer */}
        <footer className="py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          Kenya Insider Administration &middot; &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
