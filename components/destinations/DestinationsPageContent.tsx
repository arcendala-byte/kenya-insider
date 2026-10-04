'use client';

import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/site/Newsletter';
import { destinations, destinationTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function DestinationsPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].destinationsPage;
  const isFr = locale === 'fr';

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-5 py-24 text-white">
        <Image
          src="/images/wildlife/experiences_hero.jpg"
          alt="Kenyan landscape"
          fill
          priority
          className="-z-20 object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/50" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 font-heading text-5xl md:text-7xl">{t.title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-white/85">{t.desc}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {destinations.map((item) => {
            const translated = isFr ? destinationTranslations[item.slug] : undefined;
            const displayName = translated?.name ?? item.name;
            const displayRegion = translated?.region ?? item.region;
            const displayDesc = translated?.description ?? item.description;
            const displayBestFor = translated?.bestFor ?? item.bestFor;

            return (
              <article
                key={item.slug}
                className="group overflow-hidden border border-sandBeige bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={displayName}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[.12em] text-softGold">
                    {displayRegion}
                  </p>
                  <h2 className="mt-2 font-heading text-3xl text-forestGreen">{displayName}</h2>
                  <p className="mt-2 text-sm leading-6">{displayDesc}</p>
                  <p className="mt-4 text-sm">
                    <strong>{t.bestForLabel}</strong> {displayBestFor}
                  </p>
                  <Link
                    href={`/destinations/${item.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-forestGreen underline underline-offset-4"
                  >
                    {t.exploreBtn}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <Newsletter />
    </main>
  );
}
