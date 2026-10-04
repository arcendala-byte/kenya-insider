import type { Metadata } from 'next';
import ContactPageContent from '@/components/site/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Kenya Insider about your Kenya travel plans.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
