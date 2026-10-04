'use client';

import FaqAccordion from '@/components/site/FaqAccordion';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function FaqPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].faqPage;

  return (
    <main>
      <section className="bg-warmIvory px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 font-heading text-5xl text-forestGreen md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-charcoal/85">
            {t.desc}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-14">
        <FaqAccordion items={t.items} />
      </section>
    </main>
  );
}
