'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import UtilityNav from '@/components/navigation/UtilityNav';
import StickyNav from '@/components/navigation/StickyNav';
import SiteFooter from '@/components/site/SiteFooter';
import WhatsAppButton from '@/components/site/WhatsAppButton';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname?.startsWith('/admin/');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-sm">
        <UtilityNav />
        <StickyNav />
      </header>
      {children}
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
