'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Experience } from '@/lib/catalog';
import { experienceImages, experienceTranslations, categoryTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

export default function ExperienceExplorer({ experiences: sourceExperiences }: { experiences: Experience[] }) {
  const { locale } = useLocale();
  const t = copy[locale];
  const isFr = locale === 'fr';

  const experiences = sourceExperiences.map((item) => ({
    ...item,
    image: experienceImages[item.slug] ?? item.image,
  }));

  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const rawCategories = ['All', ...Array.from(new Set(experiences.map((item) => item.category)))];

  const shown = useMemo(() => {
    const list = experiences.filter((item) => category === 'All' || item.category === category);
    return sort === 'A-Z'
      ? [...list].sort((a, b) => {
          const titleA = isFr ? experienceTranslations[a.slug]?.title ?? a.title : a.title;
          const titleB = isFr ? experienceTranslations[b.slug]?.title ?? b.title : b.title;
          return titleA.localeCompare(titleB);
        })
      : list;
  }, [category, sort, experiences, isFr]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-sandBeige py-5">
        <div className="flex flex-wrap gap-2" aria-label="Experience category filters">
          {rawCategories.map((item) => {
            const label = item === 'All' ? t.all : isFr ? categoryTranslations[item] ?? item : item;
            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`border px-3 py-2 text-sm transition ${
                  category === item
                    ? 'border-forestGreen bg-forestGreen text-white'
                    : 'border-sandBeige bg-white text-charcoal hover:border-forestGreen'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <label className="text-sm">
          {t.sort}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-2 border border-sandBeige bg-white px-3 py-2 text-sm outline-none focus:border-forestGreen"
          >
            <option value="Featured">{t.featured}</option>
            <option value="A-Z">A-Z</option>
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm text-charcoal/70">
        {shown.length} {t.count}
      </p>

      {shown.length === 0 ? (
        <div className="my-12 text-center p-8 border border-sandBeige bg-white">
          <p className="text-lg font-heading text-forestGreen">{t.emptyState.noResults}</p>
          <p className="mt-2 text-sm text-charcoal/70">{t.emptyState.tryAdjusting}</p>
          <button
            onClick={() => setCategory('All')}
            className="mt-4 inline-block bg-forestGreen px-4 py-2 text-sm font-semibold text-white"
          >
            {t.emptyState.clearFilters}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((item) => {
            const translated = isFr ? experienceTranslations[item.slug] : undefined;
            const displayTitle = translated?.title ?? item.title;
            const displayCategory = isFr ? categoryTranslations[item.category] ?? translated?.category ?? item.category : item.category;
            const displayDesc = translated?.description ?? item.description;
            const displayDuration = translated?.duration ?? item.duration;
            const displayPrice = translated?.price ?? safeFormatPrice(item.price);

            return (
              <article
                key={item.slug}
                className="group overflow-hidden border border-sandBeige bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={displayTitle}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-softGold">
                    {displayCategory} · {item.destination}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl text-forestGreen">{displayTitle}</h2>
                  <p className="mt-2 text-sm leading-6">{displayDesc}</p>
                  <div className="mt-4 flex justify-between border-t border-sandBeige pt-3 text-sm">
                    <span>{displayDuration}</span>
                    <strong>{displayPrice}</strong>
                  </div>
                  <Link
                    className="mt-5 inline-block text-sm font-semibold text-forestGreen underline underline-offset-4"
                    href={`/experiences/${item.slug}`}
                  >
                    {t.explore}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
