'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function CancellationPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].cancellationPage;

  return (
    <main className="mx-auto max-w-4xl px-5 py-20">
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="mt-3 font-heading text-5xl text-forestGreen">{t.title}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-charcoal/85">
        {t.desc}
      </p>
      <div className="mt-12 space-y-10">
        {t.sections.map((section) => (
          <section key={section.title} className="border-b border-sandBeige pb-8">
            <h2 className="font-heading text-3xl text-forestGreen">{section.title}</h2>
            <p className="mt-3 leading-7 text-charcoal/80">{section.text}</p>
          </section>
        ))}
      </div>
      <Link
        href="/contact"
        className="mt-12 inline-block bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest transition"
      >
        {t.contactSupportBtn}
      </Link>
    </main>
  );
}
