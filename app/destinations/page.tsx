import type { Metadata } from 'next';
import DestinationsPageContent from '@/components/destinations/DestinationsPageContent';

export const metadata: Metadata = {
  title: 'Destinations',
  description: 'Discover Kenya from vibrant cities to wildlife reserves and the Indian Ocean coast.',
};

export default function DestinationsPage() {
  return <DestinationsPageContent />;
}
