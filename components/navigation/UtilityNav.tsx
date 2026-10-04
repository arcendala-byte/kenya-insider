'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.48 2.78 1.34-.04 2.57-.89 3.01-2.14.21-.57.26-1.2.26-1.81V.02Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: 'Instagram',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/kenyainsider',
    Icon: InstagramIcon,
  },
  {
    name: 'Facebook',
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/kenyainsider',
    Icon: FacebookIcon,
  },
  {
    name: 'TikTok',
    href: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@kenyainsider',
    Icon: TikTokIcon,
  },
];

export default function UtilityNav() {
  return (
    <div className="bg-darkForest px-4 sm:px-5 py-1.5 text-warmIvory border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs">
        <span className="text-[11px] uppercase tracking-wider text-warmIvory/60 sm:hidden shrink-0">Kenya Insider</span>
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {socialLinks.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full text-warmIvory/90 transition-colors duration-200 hover:bg-white/15 hover:text-softGold"
            >
              <Icon />
            </a>
          ))}

          <span className="mx-1 h-3.5 w-px bg-white/25" aria-hidden="true" />

          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}