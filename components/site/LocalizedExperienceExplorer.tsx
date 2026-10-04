'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { experienceImages, experiences, experienceTranslations } from '@/lib/catalog';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';
import { safeFormatPrice } from '@/lib/utils/formatPrice';

export default function LocalizedExperienceExplorer() {
  const { locale } = useLocale();
  const t = copy[locale];
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');

  const categories = ['All', ...Array.from(new Set(experiences.map((x) => x.category)))];

  const shown = useMemo(() => {
    const list = experiences.filter((x) => category === 'All' || x.category === category);
    return sort === 'A-Z' ? [...list].sort((a, b) => a.title.localeCompare(b.title)) : list;
  }, [category, sort]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-sandBeige py-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((x) => (
            <button
              key={x}
              onClick={() => setCategory(x)}
              className={`border px-3 py-2 text-sm ${
                category === x
                  ? 'border-forestGreen bg-forestGreen text-white'
                  : 'border-sandBeige bg-white'
              }`}
            >
              {x === 'All' ? t.all : x}
            </button>
          ))}
        </div>
        <label className="text-sm">
          {t.sort}{' '}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-2 border border-sandBeige bg-white px-3 py-2"
          >
            <option value="Featured">{t.featured}</option>
            <option value="A-Z">A-Z</option>
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm text-charcoal/70">
        {shown.length} {t.count}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((item) => {
          const translated = locale === 'fr' ? experienceTranslations[item.slug] : undefined;
          const displayPrice = translated?.price ?? safeFormatPrice(item.price);

          return (
            <article
              key={item.slug}
              className="group overflow-hidden border border-sandBeige bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={experienceImages[item.slug] ?? item.image}
                  alt={translated?.title ?? item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-softGold">
                  {translated?.category ?? item.category} · {item.destination}
                </p>
                <h2 className="mt-2 font-heading text-2xl text-forestGreen">
                  {translated?.title ?? item.title}
                </h2>
                <p className="mt-2 text-sm leading-6">
                  {translated?.description ?? item.description}
                </p>
                <div className="mt-4 flex justify-between border-t border-sandBeige pt-3 text-sm">
                  <span>{translated?.duration ?? item.duration}</span>
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
    </>
  );
}
