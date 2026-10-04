'use client';
import Link from 'next/link';
import SiteLogo from './SiteLogo';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function SiteFooter() {
  const { locale } = useLocale();
  const t = copy[locale];
  return (
    <footer className="bg-darkForest px-4 sm:px-5 py-12 sm:py-14 text-warmIvory">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <SiteLogo inverse />
          <p className="mt-3 max-w-sm text-sm leading-6 text-warmIvory/75">
            {locale === 'fr'
              ? 'Des expériences kényanes pensées avec soin, guidées par des experts locaux et conçues sur mesure.'
              : 'Thoughtfully planned Kenya experiences, locally informed and designed around you.'}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-softGold">
            {locale === 'fr' ? 'Explorer' : 'Explore'}
          </p>
          <div className="grid gap-2.5 text-sm">
            <Link href="/experiences" className="hover:text-softGold transition-colors">{t.experiences}</Link>
            <Link href="/destinations" className="hover:text-softGold transition-colors">{t.destinations}</Link>
            <Link href="/journal" className="hover:text-softGold transition-colors">{t.journal}</Link>
            <Link href="/about" className="hover:text-softGold transition-colors">{t.about}</Link>
            <Link href="/plan-your-trip" className="hover:text-softGold transition-colors">{t.plan}</Link>
            <Link href="/contact" className="hover:text-softGold transition-colors">{t.contact}</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-softGold">
            {t.goodToKnow}
          </p>
          <div className="grid gap-2.5 text-sm">
            <Link href="/faq" className="hover:text-softGold transition-colors">{t.faq}</Link>
            <Link href="/privacy-policy" className="hover:text-softGold transition-colors">{t.privacy}</Link>
            <Link href="/terms-and-conditions" className="hover:text-softGold transition-colors">{t.terms}</Link>
            <Link href="/cancellation" className="hover:text-softGold transition-colors">{t.cancellation}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-warmIvory/20 pt-5 text-xs text-warmIvory/55">
        © {new Date().getFullYear()} Kenya Insider. {locale === 'fr' ? 'Vivez le Kenya comme un local.' : 'Experience Kenya Like a Local.'}
      </div>
    </footer>
  );
}
