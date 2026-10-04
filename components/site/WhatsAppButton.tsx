import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

export default function WhatsAppButton() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '');
  if (!rawNumber) return null;
  return <a href={`https://wa.me/${rawNumber}?text=${encodeURIComponent('Hello Kenya Insider, I would like to plan a Kenya experience.')}`} target="_blank" rel="noreferrer" aria-label="Chat with Kenya Insider on WhatsApp" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-[#073B2A] shadow-lg transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"><ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" aria-hidden="true"/><span className="hidden sm:inline">WhatsApp</span></a>;
}
