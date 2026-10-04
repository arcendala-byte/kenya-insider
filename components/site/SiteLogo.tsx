import Image from 'next/image';
import Link from 'next/link';

export default function SiteLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return <Link href="/" className="flex items-center gap-2" aria-label="Kenya Insider home">
    <Image src="/brand-logo.jpg" alt="Kenya Insider" width={compact ? 34 : 42} height={compact ? 34 : 42} className="aspect-square rounded-full object-cover object-top" priority />
    <span className={`font-heading text-xl leading-none sm:text-2xl ${inverse ? 'text-warmIvory' : 'text-forestGreen'}`}>Kenya Insider</span>
  </Link>;
}
