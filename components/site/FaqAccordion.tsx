'use client';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export type FaqItem = { question: string; answer: string };
export default function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="divide-y divide-sandBeige border-y border-sandBeige">{items.map((item, index) => <div key={item.question}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-5 py-5 text-left"><span className="font-heading text-xl text-forestGreen">{item.question}</span><ChevronDownIcon className={`h-5 w-5 shrink-0 text-forestGreen transition ${open === index ? 'rotate-180' : ''}`} aria-hidden="true"/></button>{open === index && <p className="max-w-3xl pb-5 leading-7 text-charcoal/80">{item.answer}</p>}</div>)}</div>;
}
