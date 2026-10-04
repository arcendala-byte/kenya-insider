import type { Metadata } from 'next';
import PlanYourTripContent from '@/components/site/PlanYourTripContent';

export const metadata: Metadata = {
  title: 'Plan Your Trip',
  description: 'Tell Kenya Insider what you want to experience and start shaping your trip.',
};

export default function PlanYourTripPage() {
  return <PlanYourTripContent />;
}
