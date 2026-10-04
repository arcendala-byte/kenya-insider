import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[70vh] bg-forestGreen text-warmIvory flex items-center justify-center">
      {/* Background image */}
      <Image
        src="/images/hero/zebra-kenya.jpg"
        alt="Kenyan landscape"
        fill
        className="object-cover opacity-30"
        priority
      />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-heading mb-4">
          Discover Kenya Like a Local
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Premium travel experiences, wildlife, culture, and adventure curated by local experts.
        </p>
        <a
          href="/plan-your-trip"
          className="inline-block bg-softGold text-forestGreen font-medium py-3 px-6 rounded-md hover:bg-softGold/80 transition"
        >
          Start Your Journey
        </a>
      </div>
    </section>
  );
}
