"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SiteLogo from '@/components/site/SiteLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { copy } from '@/lib/i18n';
import { useLocale } from '@/components/LocaleProvider';

export default function StickyNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();
  const t = copy[locale];
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    [t.home, '/'],
    [t.experiences, '/experiences'],
    [t.destinations, '/destinations'],
    [t.plan, '/plan-your-trip'],
    [t.journal, '/journal'],
    [t.about, '/about'],
  ];

  return (
    <nav className="border-b border-sandBeige/80 bg-warmIvory/95 backdrop-blur-md relative">
      <div className="mx-auto flex h-[60px] sm:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-5">
        <div className="flex-shrink-0">
          <SiteLogo compact />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 text-sm lg:gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="font-medium transition-colors hover:text-forestGreen whitespace-nowrap">
              {label}
            </Link>
          ))}
          <div className="ml-2 flex items-center gap-3">
            <Link href="/sign-in" className="font-semibold transition-colors hover:text-forestGreen whitespace-nowrap">
              {t.signIn}
            </Link>
            <Link
              href="/register"
              className="border border-forestGreen px-3 py-1.5 font-semibold text-forestGreen transition hover:bg-forestGreen hover:text-white whitespace-nowrap"
            >
              {t.register}
            </Link>
            <Link
              href="/plan-your-trip"
              className="bg-forestGreen px-4 py-2 font-semibold text-white transition hover:bg-darkForest whitespace-nowrap"
            >
              {t.book}
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-charcoal rounded hover:bg-sandBeige/40 focus:outline-none focus:ring-2 focus:ring-forestGreen"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown — positioned absolutely within the sticky header stack */}
      {isOpen && (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full z-50 max-h-[calc(100svh-108px)] overflow-y-auto border-b border-sandBeige bg-warmIvory shadow-2xl md:hidden"
        >
          <div className="px-5 py-5 grid gap-0 text-base divide-y divide-sandBeige/60">
            <div className="grid gap-1 pb-4">
              {links.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 font-medium hover:text-forestGreen transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="grid gap-1 py-4">
              <Link href="/services/kenya-welcome" onClick={() => setIsOpen(false)} className="py-2.5 hover:text-forestGreen transition-colors">
                {t.welcome}
              </Link>
              <Link href="/concierge" onClick={() => setIsOpen(false)} className="py-2.5 hover:text-forestGreen transition-colors">
                {t.concierge}
              </Link>
              <Link href="/faq" onClick={() => setIsOpen(false)} className="py-2.5 hover:text-forestGreen transition-colors">
                {t.faq}
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="py-2.5 hover:text-forestGreen transition-colors">
                {t.contact}
              </Link>
            </div>
            <div className="pt-4 grid gap-3">
              <div className="flex gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-forestGreen px-4 py-3 text-center text-sm font-semibold text-forestGreen"
                >
                  {t.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-forestGreen px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {t.register}
                </Link>
              </div>
              <Link
                href="/plan-your-trip"
                onClick={() => setIsOpen(false)}
                className="bg-softGold px-4 py-3 text-center text-sm font-semibold text-darkForest"
              >
                {t.plan}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

