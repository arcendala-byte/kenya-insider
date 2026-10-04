import type { MetadataRoute } from 'next';
const pages = ['/', '/experiences', '/destinations', '/plan-your-trip', '/about', '/faq', '/contact', '/journal', '/services/kenya-welcome', '/privacy-policy', '/terms-and-conditions', '/cancellation'];
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; return pages.map(path => ({ url: new URL(path, base).toString(), lastModified: new Date(), changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : 0.7 })); }
