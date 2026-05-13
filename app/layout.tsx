import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/json-ld';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'IndieTools.ai - AI Tools for Indie Developers',
    template: '%s | IndieTools.ai',
  },
  description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
  keywords: ['AI tools', 'indie developers', 'solo developers', 'startup tools', 'SaaS tools'],
  authors: [{ name: 'IndieTools.ai' }],
  openGraph: {
    title: 'IndieTools.ai - AI Tools for Indie Developers',
    description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
    type: 'website',
    locale: 'en_US',
    url: 'https://indietools.ai',
    siteName: 'IndieTools.ai',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IndieTools.ai - AI Tools for Indie Developers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IndieTools.ai - AI Tools for Indie Developers',
    description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <JsonLd />
      </body>
    </html>
  );
}
