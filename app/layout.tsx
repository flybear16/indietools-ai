import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IndieTools.ai - AI Tools for Indie Developers',
  description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
  keywords: ['AI tools', 'indie developers', 'solo developers', 'startup tools', 'SaaS tools'],
  authors: [{ name: 'IndieTools.ai' }],
  openGraph: {
    title: 'IndieTools.ai - AI Tools for Indie Developers',
    description: 'Curated collection of AI-powered tools to help solo developers build, launch, and grow.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
