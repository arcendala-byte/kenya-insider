'use client';

import Image from 'next/image';
import TripPlanner from '@/components/site/TripPlanner';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

export default function PlanYourTripContent() {
  const { locale } = useLocale();
  const t = copy[locale].planYourTripPage;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-darkForest px-5 py-24 text-white">
        <Image
          src="/images/wildlife/home_hero.jpg"
          alt="Kenyan journey landscape"
          fill
          priority
          className="-z-20 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 -z-10 bg-darkForest/60" />
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-softGold">{t.eyebrow}</p>
          <h1 className="mt-3 font-heading text-5xl md:text-7xl">{t.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-7 text-white/85">
            {t.desc}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <p className="eyebrow">{t.thoughtfulStartEyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-forestGreen">
            {t.conversationTitle}
          </h2>
          <p className="mt-5 leading-7 text-charcoal/85">
            {t.conversationDesc}
          </p>
          <div className="mt-8 space-y-5">
            <div>
              <h3 className="font-heading text-2xl text-forestGreen">
                {t.designedTitle}
              </h3>
              <p className="mt-1 text-sm leading-6 text-charcoal/75">
                {t.designedDesc}
              </p>
            </div>
            <div>
              <h3 className="font-heading text-2xl text-forestGreen">
                {t.clearNextStepsTitle}
              </h3>
              <p className="mt-1 text-sm leading-6 text-charcoal/75">
                {t.clearNextStepsDesc}
              </p>
            </div>
          </div>
        </div>
        <TripPlanner />
      </section>
    </main>
  );
}
