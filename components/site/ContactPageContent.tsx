'use client';

import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function ContactPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].contactPage;

  return (
    <main className="bg-warmIvory px-5 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 font-heading text-5xl text-forestGreen">{t.title}</h1>
        <p className="mt-5 max-w-2xl leading-7 text-charcoal/85">
          {t.desc}
        </p>
        <Link
          href="/plan-your-trip"
          className="mt-8 inline-block bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest transition"
        >
          {t.startPlanningBtn}
        </Link>
        <ContactForm />
      </div>
    </main>
  );
}
