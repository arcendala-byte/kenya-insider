import type { Metadata } from 'next';
import FaqPageContent from '@/components/site/FaqPageContent';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common Kenya Insider planning and experience questions.',
};

export default function FaqPage() {
  return <FaqPageContent />;
}
