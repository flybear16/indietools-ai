'use client';

import { getToolBySlug } from '@/lib/db/queries';

interface ToolJsonLdProps {
  slug: string;
}

export async function ToolJsonLd({ slug }: ToolJsonLdProps) {
  const tool = await getToolBySlug(slug);
  if (!tool) return null;

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description || undefined,
    url: tool.websiteUrl || undefined,
    applicationCategory: tool.category?.name || 'SoftwareApplication',
    offers: tool.startingPrice
      ? {
          '@type': 'Offer',
          price: tool.startingPrice,
          priceCurrency: 'USD',
        }
      : {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
    aggregateRating: undefined, // Will be set if we have reviews
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
    />
  );
}
