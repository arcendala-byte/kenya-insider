'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function KenyaWelcomeContent() {
  const { locale } = useLocale();
  const t = copy[locale].kenyaWelcomePage;

  return (
    <main>
      <section className="bg-darkForest px-5 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-softGold">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-heading text-5xl md:text-7xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            {t.desc}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">{t.whatItIsEyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-forestGreen">
            {t.whatItIsTitle}
          </h2>
        </div>
        <div className="space-y-4 leading-7 text-charcoal/85">
          <p>{t.whatItIsP1}</p>
          <p>{t.whatItIsP2}</p>
        </div>
      </section>

      <section className="bg-warmIvory px-5 py-16 border-y border-sandBeige">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">{t.howWeHelpEyebrow}</p>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {t.pillars.map((item) => (
              <article key={item.title} className="border border-sandBeige bg-white p-6 shadow-sm">
                <h2 className="font-heading text-3xl text-forestGreen">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-charcoal/80">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <p className="eyebrow">{t.importantEyebrow}</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="bg-warmIvory border border-sandBeige p-6">
            <h2 className="font-heading text-3xl text-forestGreen">{t.includedTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-charcoal/85">
              {t.includedList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-warmIvory border border-sandBeige p-6">
            <h2 className="font-heading text-3xl text-forestGreen">{t.notIncludedTitle}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-charcoal/85">
              {t.notIncludedList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-3xl leading-7 text-charcoal/80">
          {t.availabilityNotice}
        </p>
        <Link
          href="/plan-your-trip"
          className="mt-7 inline-block bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest transition"
        >
          {t.askBtn}
        </Link>
      </section>
    </main>
  );
}
