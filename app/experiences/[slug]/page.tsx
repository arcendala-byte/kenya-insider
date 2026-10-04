import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { experiences } from '@/lib/catalog';
import ExperienceDetailContent from '@/components/experiences/ExperienceDetailContent';

export function generateStaticParams() {
  return experiences.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = experiences.find((x) => x.slug === params.slug);
  return {
    title: item ? item.title : 'Experience',
    description: item?.description,
  };
}

export default function ExperienceDetail({ params }: { params: { slug: string } }) {
  const item = experiences.find((x) => x.slug === params.slug);
  if (!item) notFound();
  return <ExperienceDetailContent item={item} />;
}
