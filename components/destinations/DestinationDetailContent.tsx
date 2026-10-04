'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Destination, Experience } from '@/lib/catalog';
import { destinationTranslations, experienceTranslations, categoryTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

export default function DestinationDetailContent({
  item,
  related,
}: {
  item: Destination;
  related: Experience[];
}) {
  const { locale } = useLocale();
  const t = copy[locale].destinationDetail;
  const isFr = locale === 'fr';

  const translated = isFr ? destinationTranslations[item.slug] : undefined;
  const displayName = translated?.name ?? item.name;
  const displayRegion = translated?.region ?? item.region;
  const displayDesc = translated?.description ?? item.description;
  const displayBestFor = translated?.bestFor ?? item.bestFor;
  const displayThingsToDo = translated?.thingsToDo ?? item.thingsToDo;
  const displayBestTime = translated?.bestTime ?? item.bestTime;
  const displayIdealDuration = translated?.idealDuration ?? item.idealDuration;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-5 py-24 text-white">
        <Image
          src={item.image}
          alt={displayName}
          fill
          priority
          className="-z-20 object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/55" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-softGold">{displayRegion}</p>
          <h1 className="mt-3 font-heading text-5xl md:text-7xl">{displayName}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-white/85">
            {displayDesc}
          </p>
          <div className="mt-8">
            <Link
              href="/destinations"
              className="inline-block border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-darkForest transition"
            >
              {t.backToDestinations}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t.whyVisitEyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-forestGreen">
            {t.routeTitle}
          </h2>
          <p className="mt-6 leading-7 text-charcoal/85">
            {t.routeDesc} {displayName}.
          </p>
          <h2 className="mt-10 font-heading text-3xl text-forestGreen">
            {t.bestThingsToDo}
          </h2>
          <ul className="mt-5 space-y-3">
            {displayThingsToDo.map((thing) => (
              <li key={thing} className="border-l-2 border-softGold pl-4 text-sm leading-6">
                {thing}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit bg-warmIvory border border-sandBeige p-7 shadow-sm">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-forestGreen">{t.bestFor}</dt>
              <dd className="mt-1 text-charcoal/80">{displayBestFor}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forestGreen">{t.bestTimeToVisit}</dt>
              <dd className="mt-1 text-charcoal/80">{displayBestTime}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forestGreen">{t.idealTripLength}</dt>
              <dd className="mt-1 text-charcoal/80">{displayIdealDuration}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forestGreen">{t.gettingThere}</dt>
              <dd className="mt-1 text-charcoal/80">{t.gettingThereDesc}</dd>
            </div>
          </dl>
          <Link
            href="/plan-your-trip"
            className="mt-7 block bg-forestGreen px-4 py-3 text-center text-sm font-semibold text-white hover:bg-darkForest transition"
          >
            {t.planTripBtn}
          </Link>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-warmIvory px-5 py-16 border-t border-sandBeige">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">{t.relatedExperiences}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {related.map((x) => {
                const expTrans = isFr ? experienceTranslations[x.slug] : undefined;
                const expTitle = expTrans?.title ?? x.title;
                const expCategory = isFr ? categoryTranslations[x.category] ?? expTrans?.category ?? x.category : x.category;
                const expDuration = expTrans?.duration ?? x.duration;
                const expPrice = expTrans?.price ?? safeFormatPrice(x.price);

                return (
                  <Link
                    href={`/experiences/${x.slug}`}
                    key={x.slug}
                    className="group border border-sandBeige bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[.12em] text-softGold">
                      {expCategory}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl text-forestGreen group-hover:text-darkForest transition">
                      {expTitle}
                    </h3>
                    <p className="mt-2 text-sm text-charcoal/70">
                      {expDuration} · {expPrice}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
