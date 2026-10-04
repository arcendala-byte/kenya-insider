'use client';

import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/components/site/Newsletter';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function JournalPageContent() {
  const { locale } = useLocale();
  const t = copy[locale].journalPage;

  const [featured, ...rest] = t.articles;

  return (
    <main>
      <section className="bg-warmIvory px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-heading text-5xl text-forestGreen md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-charcoal/85">
            {t.desc}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <article className="grid overflow-hidden bg-darkForest text-white md:grid-cols-2">
          <div className="relative min-h-[300px]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="p-8 md:p-12">
            <p className="eyebrow text-softGold">
              {locale === 'fr' ? 'À la une' : 'Featured'} · {featured.category}
            </p>
            <h2 className="mt-3 font-heading text-4xl">{featured.title}</h2>
            <p className="mt-5 leading-7 text-white/80">{featured.text}</p>
            <Link
              href="/plan-your-trip"
              className="mt-7 inline-block font-semibold text-softGold underline underline-offset-4 hover:text-white transition"
            >
              {t.planAroundBtn}
            </Link>
          </div>
        </article>

        <div className="mt-14 flex flex-wrap gap-2" aria-label="Journal categories">
          {t.categories.map((category) => (
            <span key={category} className="border border-sandBeige bg-white px-3 py-2 text-sm text-charcoal">
              {category}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((article) => (
            <article key={article.title} className="overflow-hidden border border-sandBeige bg-white">
              <div className="relative aspect-[4/3]">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[.14em] text-softGold">
                  {article.category} · {article.date}
                </p>
                <h2 className="mt-2 font-heading text-2xl text-forestGreen">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-charcoal/80">{article.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
