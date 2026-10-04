import type { Metadata } from 'next';
import PrivacyPageContent from '@/components/site/PrivacyPageContent';

export const metadata: Metadata = {
  title: 'Privacy & Policies',
  description: 'Privacy information for Kenya Insider website visitors.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPageContent />;
}
