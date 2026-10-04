'use client';

import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/site/Newsletter';
import { categories, destinations, experiences, experienceTranslations, destinationTranslations, categoryTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils/formatPrice';

const categoryImages = [
  '/images/categories/wildlife/A-herd-of-elephants-in-Amboseli-NP-209601368201897.jpg',
  '/images/categories/nature/aerial-view-the-sands-at-chale-island-kenya-timbuktu-travel.webp',
  '/images/categories/adventure/Acacia-trees-Taita-Hills-Kenya.webp',
  '/images/categories/food/Enchanting-Travels-Africa-safaris-Breakfast-with-a-view-at-Siwandus-elevated-restaurant_0.avif',
  '/images/categories/culture/63.jpg',
  '/images/categories/photography/images (1).jpeg',
  '/images/categories/beach/bofa-beach-kenya-scaled.webp',
  '/images/categories/city/city.avif',
  '/images/categories/luxury/capricorn kilimani.avif',
  '/images/categories/weekend-escapes/central-eating-area.jpg',
];

export default function HomePageContent() {
  const { locale } = useLocale();
  const t = copy[locale].homePage;
  const isFr = locale === 'fr';

  return (
    <main>
      {/* Hero Section */}
      <section className="relative isolate flex min-h-[500px] items-end overflow-hidden bg-darkForest text-white sm:min-h-[580px] md:min-h-[700px]">
        <Image
          src="/images/home_hero.jpg"
          alt="Golden light over a Kenyan landscape"
          fill
          priority
          className="-z-20 object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-darkForest via-darkForest/55 to-darkForest/15" />
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-5 pb-12 pt-28 sm:pb-16 md:pb-24">
          <p className="eyebrow text-softGold">{t.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.04] sm:text-5xl md:text-7xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-7 text-white/85">
            {t.heroDesc}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/experiences"
              className="bg-softGold px-5 py-3 font-semibold text-darkForest hover:bg-white transition"
            >
              {t.exploreBtn}
            </Link>
            <Link
              href="/plan-your-trip"
              className="border border-white/70 px-5 py-3 font-semibold hover:bg-white hover:text-darkForest transition"
            >
              {t.planBtn}
            </Link>
          </div>
          <p className="mt-8 text-xs font-semibold tracking-[0.14em] text-white/75 leading-5">
            {t.badge}
          </p>
        </div>
      </section>

      {/* The Wider Story */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-14 sm:py-20 md:grid md:grid-cols-[.8fr_1.2fr] md:gap-20">
        <p className="eyebrow mb-3 md:mb-0">{t.storyEyebrow}</p>
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl text-forestGreen md:text-5xl">
            {t.storyTitle}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 leading-7">
            <p>{t.storyP1}</p>
            <p>{t.storyP2}</p>
          </div>
          <Link
            href="/destinations"
            className="mt-7 inline-block font-semibold text-forestGreen underline underline-offset-4"
          >
            {t.storyLink}
          </Link>
        </div>
      </section>

      {/* Choose Your Rhythm */}
      <section className="bg-warmIvory px-4 sm:px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.rhythmEyebrow}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-xl font-heading text-3xl sm:text-4xl text-forestGreen md:text-5xl">
              {t.rhythmTitle}
            </h2>
            <Link href="/experiences" className="font-semibold text-forestGreen underline underline-offset-4">
              {t.allExperiences}
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
            {categories.map((category, index) => {
              const displayCategory = isFr ? categoryTranslations[category] ?? category : category;
              return (
                <Link
                  href="/experiences"
                  key={category}
                  className="group relative aspect-[4/5] overflow-hidden bg-darkForest"
                >
                  <Image
                    src={categoryImages[index]}
                    alt={displayCategory}
                    fill
                    className="object-cover opacity-70 transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-darkForest p-4 text-white">
                    <h3 className="font-heading text-xl">{displayCategory}</h3>
                    <p className="mt-1 hidden text-xs leading-5 text-white/80 md:block">
                      {t.categoryTagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curated for the Curious */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-14 sm:py-20">
        <p className="eyebrow">{t.curatedEyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-forestGreen md:text-5xl">
          {t.curatedTitle}
        </h2>
        <p className="mt-4 max-w-2xl leading-7">{t.curatedDesc}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {experiences.slice(0, 4).map((item) => {
            const translated = isFr ? experienceTranslations[item.slug] : undefined;
            const displayTitle = translated?.title ?? item.title;
            const displayCat = isFr ? categoryTranslations[item.category] ?? translated?.category ?? item.category : item.category;
            const displayDesc = translated?.description ?? item.description;
            const displayDuration = translated?.duration ?? item.duration;
            const displayPrice = translated?.price ?? (typeof item.price === 'object' ? formatPrice(item.price) : item.price);

            return (
              <article key={item.slug} className="overflow-hidden border border-sandBeige bg-white">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[.12em] text-softGold">
                    {displayCat} · {item.destination}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl text-forestGreen">{displayTitle}</h3>
                  <p className="mt-2 text-sm leading-6">{displayDesc}</p>
                  <div className="mt-4 flex justify-between border-t border-sandBeige pt-3 text-sm">
                    <span>{displayDuration}</span>
                    <strong>{displayPrice}</strong>
                  </div>
                  <Link
                    href={`/experiences/${item.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-forestGreen underline underline-offset-4"
                  >
                    {isFr ? 'Découvrir l’expérience' : 'Explore experience'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Destination Explorer */}
      <section className="bg-forestGreen px-4 sm:px-5 py-14 sm:py-20 text-warmIvory">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.destEyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl">{t.destTitle}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.slice(0, 8).map((item) => {
              const translated = isFr ? destinationTranslations[item.slug] : undefined;
              const displayName = translated?.name ?? item.name;
              const displayRegion = translated?.region ?? item.region;
              const displayBestFor = translated?.bestFor ?? item.bestFor;

              return (
                <Link
                  href={`/destinations/${item.slug}`}
                  key={item.slug}
                  className="group border border-white/15 p-5 transition hover:bg-white hover:text-forestGreen"
                >
                  <p className="text-xs uppercase tracking-[.12em] text-softGold">{displayRegion}</p>
                  <h3 className="mt-2 font-heading text-3xl">{displayName}</h3>
                  <p className="mt-3 text-sm leading-6 opacity-80">{displayBestFor}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Kenya Insider */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 py-14 sm:py-20 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t.whyEyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-forestGreen">{t.whyTitle}</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {t.whyItems.map((item) => (
            <div key={item.title}>
              <h3 className="font-heading text-2xl text-forestGreen">{item.title}</h3>
              <p className="mt-2 text-sm leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Arriving in Kenya? */}
      <section className="bg-warmIvory px-4 sm:px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div className="relative min-h-[260px] sm:min-h-[340px] md:min-h-[360px]">
            <Image
              src="/images/wildlife/home_2.jpg"
              alt="Kenyan landscape at golden hour"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="self-center">
            <p className="eyebrow">{t.arrivingEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-forestGreen">{t.arrivingTitle}</h2>
            <p className="mt-5 leading-7">{t.arrivingDesc}</p>
            <p className="mt-4 text-sm text-charcoal/70">{t.arrivingNote}</p>
            <Link
              href="/services/kenya-welcome"
              className="mt-6 inline-block font-semibold text-forestGreen underline underline-offset-4"
            >
              {t.arrivingLink}
            </Link>
          </div>
        </div>
      </section>

      {/* Your Trip, Simplified */}
      <section className="mx-auto max-w-7xl px-4 sm:px-5 py-14 sm:py-20">
        <p className="eyebrow">{t.simplifiedEyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-forestGreen">{t.simplifiedTitle}</h2>
        <div className="mt-8 grid gap-5 grid-cols-2 md:grid-cols-4">
          {t.simplifiedSteps.map((step) => (
            <div key={step.number} className="border-t-2 border-softGold pt-4">
              <p className="text-sm font-semibold text-softGold">{step.number}</p>
              <h3 className="mt-2 font-heading text-2xl text-forestGreen">{step.title}</h3>
            </div>
          ))}
        </div>
        <Link
          href="/plan-your-trip"
          className="mt-10 inline-block bg-forestGreen px-5 py-3 font-semibold text-white hover:bg-darkForest transition"
        >
          {t.planBtn}
        </Link>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-darkForest px-4 sm:px-5 py-16 sm:py-24 text-white">
        <Image
          src="/images/wildlife/home_feature2.jpg"
          alt="Kenyan travel landscape"
          fill
          className="-z-20 object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/60" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{t.ctaEyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl">{t.ctaTitle}</h2>
          <p className="mt-5 leading-7 text-white/85">{t.ctaDesc}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/plan-your-trip" className="bg-softGold px-5 py-3 font-semibold text-darkForest hover:bg-white transition">
              {t.planBtn}
            </Link>
            <Link href="/experiences" className="border border-white/70 px-5 py-3 font-semibold hover:bg-white hover:text-darkForest transition">
              {t.exploreBtn}
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
