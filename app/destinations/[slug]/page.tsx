import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { destinations, experiences } from '@/lib/catalog';
import DestinationDetailContent from '@/components/destinations/DestinationDetailContent';

export function generateStaticParams() {
  return destinations.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = destinations.find((x) => x.slug === params.slug);
  return {
    title: item ? item.name : 'Destination',
    description: item?.description,
  };
}

export default function DestinationDetail({ params }: { params: { slug: string } }) {
  const item = destinations.find((x) => x.slug === params.slug);
  if (!item) notFound();
  const related = experiences.filter((x) => x.destination === item.name);
  return <DestinationDetailContent item={item} related={related} />;
}
