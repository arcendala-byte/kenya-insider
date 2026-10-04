import type { Metadata } from 'next';
import CancellationPageContent from '@/components/site/CancellationPageContent';

export const metadata: Metadata = {
  title: 'Cancellation Policy',
  description: 'Cancellation and amendment information for Kenya Insider travel requests.',
};

export default function CancellationPage() {
  return <CancellationPageContent />;
}
