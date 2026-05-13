'use client';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IndieTools.ai',
  url: 'https://indietools.ai',
  logo: 'https://indietools.ai/og-image.png',
  description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
  sameAs: [
    'https://twitter.com/indietoolsai',
    'https://github.com/flybear16/indietools-ai',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'IndieTools.ai',
  url: 'https://indietools.ai',
  description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://indietools.ai/tools?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export function JsonLd() {
  const schemas = [organizationSchema, websiteSchema];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
