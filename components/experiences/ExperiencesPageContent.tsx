'use client';

import Image from 'next/image';
import Link from 'next/link';
import ExperienceExplorer from '@/components/site/ExperienceExplorer';
import Newsletter from '@/components/site/Newsletter';
import { experiences } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function ExperiencesPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].experiencesPage;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-5 py-24 text-white">
        <Image
          src="/images/experiences_hero.jpg"
          alt="Kenyan wilderness"
          fill
          priority
          className="-z-20 object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/55" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-heading text-5xl md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-xl leading-7 text-white/85">
            {t.desc}
          </p>
          <Link
            href="/plan-your-trip"
            className="mt-7 inline-block bg-softGold px-5 py-3 font-semibold text-darkForest hover:bg-white transition"
          >
            {t.planBtn}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <p className="max-w-2xl leading-7 text-charcoal/80">
          {t.seedNotice}
        </p>
        <ExperienceExplorer experiences={experiences} />
      </section>

      <section className="bg-warmIvory px-5 py-16">
        <div className="mx-auto max-w-7xl md:flex md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow">{t.customEyebrow}</p>
            <h2 className="mt-3 font-heading text-4xl text-forestGreen">
              {t.customTitle}
            </h2>
          </div>
          <Link
            href="/plan-your-trip"
            className="mt-6 inline-block bg-forestGreen px-5 py-3 font-semibold text-white hover:bg-darkForest transition"
          >
            {t.customBtn}
          </Link>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
