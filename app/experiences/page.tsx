import type { Metadata } from 'next';
import ExperiencesPageContent from '@/components/experiences/ExperiencesPageContent';

export const metadata: Metadata = {
  title: 'Experiences',
  description: 'Explore locally informed Kenya experiences across wildlife, food, culture, adventure and coast.',
};

export default function ExperiencesPage() {
  return <ExperiencesPageContent />;
}
