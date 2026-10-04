import type { Metadata } from 'next';
import TermsPageContent from '@/components/site/TermsPageContent';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using the Kenya Insider website.',
};

export default function TermsPage() {
  return <TermsPageContent />;
}
