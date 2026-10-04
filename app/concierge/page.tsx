import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Concierge Service',
  description: 'Personalized travel assistance and bespoke arrangements across Kenya.',
};

export default function ConciergePage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-20">
      <p className="eyebrow">Personalized Support</p>
      <h1 className="mt-2 font-heading text-4xl text-forestGreen">Kenya Concierge</h1>
      <p className="mt-4 text-charcoal/80 leading-7">
        Our concierge service is dedicated to crafting bespoke travel moments, private transport, and tailored reservations across Kenya.
      </p>
      <div className="mt-8">
        <Link
          href="/contact"
          className="inline-block bg-forestGreen px-6 py-3 font-semibold text-white hover:bg-darkForest transition"
        >
          Contact our concierge
        </Link>
      </div>
    </main>
  );
}
