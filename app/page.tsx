import type { Metadata } from 'next';
import HomePageContent from '@/components/site/HomePageContent';

export const metadata: Metadata = {
  title: 'Experience Kenya Like a Local',
  description: 'Locally informed experiences and personalized Kenya trip planning.',
};

export default function HomePage() {
  return <HomePageContent />;
}
