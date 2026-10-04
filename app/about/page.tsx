import type { Metadata } from 'next';
import AboutPageContent from '@/components/site/AboutPageContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Kenya Insider and our locally informed approach to travel planning.',
};

export default function AboutPage() {
  return <AboutPageContent />;
}
