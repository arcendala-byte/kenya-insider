import type { Metadata } from 'next';
import JournalPageContent from '@/components/site/JournalPageContent';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Locally informed notes, guides and travel inspiration from Kenya Insider.',
};

export default function JournalPage() {
  return <JournalPageContent />;
}
