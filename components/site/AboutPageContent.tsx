'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function AboutPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].aboutPage;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-5 py-24 text-white">
        <Image
          src="/images/categories/nature/aerial-view-the-sands-at-chale-island-kenya-timbuktu-travel.webp"
          alt="Kenyan coast"
          fill
          priority
          className="-z-20 object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/60" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-softGold">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-heading text-5xl md:text-7xl">
            {t.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[.8fr_1.2fr]">
        <p className="eyebrow">{t.purposeEyebrow}</p>
        <div>
          <h2 className="font-heading text-4xl text-forestGreen">
            {t.purposeTitle}
          </h2>
          <p className="mt-6 leading-7 text-charcoal/85">{t.purposeP1}</p>
          <p className="mt-4 leading-7 text-charcoal/85">{t.purposeP2}</p>
        </div>
      </section>

      <section className="bg-warmIvory px-5 py-20 border-y border-sandBeige">
        <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-3">
          {t.pillars.map((pillar) => (
            <div key={pillar.title} className="bg-white border border-sandBeige p-6 shadow-sm">
              <h2 className="font-heading text-3xl text-forestGreen">{pillar.title}</h2>
              <p className="mt-3 leading-7 text-charcoal/80">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="eyebrow">{t.expectEyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-heading text-4xl text-forestGreen">
          {t.expectTitle}
        </h2>
        <p className="mt-5 max-w-2xl leading-7 text-charcoal/85">
          {t.expectDesc}
        </p>
        <Link
          href="/plan-your-trip"
          className="mt-8 inline-block bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest transition"
        >
          {t.planBtn}
        </Link>
      </section>
    </main>
  );
}
