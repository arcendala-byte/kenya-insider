// app/layout.tsx
import './globals.css';
import type { Metadata } from "next";
import { LocaleProvider } from '@/components/LocaleProvider';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: {
    default: "Kenya Insider – Experience Kenya Like a Local",
    template: "%s | Kenya Insider",
  },
  description:
    "Premium travel experiences in Kenya. Discover wildlife, culture, adventure, and more with local experts.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Kenya Insider",
    description:
      "Premium travel experiences in Kenya. Discover wildlife, culture, adventure, and more with local experts.",
    url: "/",
    siteName: "Kenya Insider",
    images: [
      {
        url: "/images/home_hero.jpg",
        width: 1200,
        height: 630,
        alt: "Kenya Insider",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Insider",
    description:
      "Premium travel experiences in Kenya. Discover wildlife, culture, adventure, and more with local experts.",
    images: ["/images/home_hero.jpg"],
  },
  alternates: { canonical: '/' },
  icons: { icon: '/brand-logo.jpg' },
};

function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body bg-warmIvory text-charcoal min-h-screen flex flex-col">
        <LocaleProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </LocaleProvider>
      </body>
    </html>
  );
}

export default RootLayout;

