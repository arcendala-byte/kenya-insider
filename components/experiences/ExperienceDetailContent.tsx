'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Experience } from '@/lib/catalog';
import { experienceTranslations, categoryTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

export default function ExperienceDetailContent({ item }: { item: Experience }) {
  const { locale } = useLocale();
  const t = copy[locale].experienceDetail;
  const isFr = locale === 'fr';

  const translated = isFr ? experienceTranslations[item.slug] : undefined;
  const displayTitle = translated?.title ?? item.title;
  const displayCat = isFr ? categoryTranslations[item.category] ?? translated?.category ?? item.category : item.category;
  const displayDesc = translated?.description ?? item.description;
  const displayDuration = translated?.duration ?? item.duration;
  const displayPrice = translated?.price ?? safeFormatPrice(item.price);

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-4 sm:px-5 py-20 sm:py-24 text-white">
        <Image
          src={item.image}
          alt={displayTitle}
          fill
          priority
          className="-z-20 object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/55" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-softGold">
            {displayCat} · {item.destination}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl sm:text-5xl md:text-7xl">
            {displayTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-white/85">
            {displayDesc}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6 text-sm">
            <span className="rounded bg-white/10 px-3 py-1 backdrop-blur-sm">{displayDuration}</span>
            <strong className="text-softGold text-base">
              {t.from} {displayPrice}
            </strong>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/plan-your-trip"
              className="inline-block bg-softGold px-6 py-3 font-semibold text-darkForest hover:bg-white transition"
            >
              {t.requestBtn}
            </Link>
            <Link
              href="/experiences"
              className="inline-block border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-darkForest transition"
            >
              {t.backToExperiences}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 py-12 sm:py-16 md:grid-cols-[1.3fr_.7fr]">
        <div>
          <p className="eyebrow">{t.overviewEyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-forestGreen">
            {t.overviewTitle}
          </h2>
          <p className="mt-6 leading-7 text-charcoal/85">
            {t.overviewDesc}
          </p>

          <h2 className="mt-12 font-heading text-3xl text-forestGreen">
            {t.whatYoullExperience}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {item.highlights.map((highlight) => (
              <div key={highlight} className="border-l-2 border-softGold bg-warmIvory p-4 text-sm leading-6">
                {highlight}
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-heading text-3xl text-forestGreen">
            {t.importantInfo}
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-6">
            <p>
              <strong>{t.durationLabel}</strong> {displayDuration}
            </p>
            <p>
              <strong>{t.meetingPointLabel}</strong> {t.meetingPointDesc}
            </p>
            <p>
              <strong>{t.customisationLabel}</strong> {t.customisationDesc}
            </p>
            <p>
              <strong>{t.whatHappensNextLabel}</strong> {t.whatHappensNextDesc}
            </p>
          </div>
        </div>

        <aside className="h-fit border border-sandBeige bg-warmIvory p-6 shadow-sm">
          <p className="eyebrow">{t.includedEyebrow}</p>
          <ul className="mt-4 space-y-3 text-sm">
            {item.included.map((thing) => (
              <li key={thing} className="flex items-start gap-2">
                <span className="text-forestGreen font-bold">•</span>
                <span>{thing}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-sandBeige pt-4 text-xs leading-5 text-charcoal/70">
            {t.excludedNotice}
          </p>
          <Link
            href="/plan-your-trip"
            className="mt-7 block bg-forestGreen px-4 py-3 text-center text-sm font-semibold text-white hover:bg-darkForest transition"
          >
            {t.planCustomBtn}
          </Link>
        </aside>
      </section>
    </main>
  );
}
