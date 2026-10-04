import type { Metadata } from 'next';
import KenyaWelcomeContent from '@/components/site/KenyaWelcomeContent';

export const metadata: Metadata = { 
  title: 'Kenya Welcome', 
  description: 'Practical arrival support and local orientation for visitors settling into Kenya.' 
};

export default function KenyaWelcomePage() {
  return <KenyaWelcomeContent />;
}

