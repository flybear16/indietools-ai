import Link from 'next/link';
import { ExternalLink, Heart } from 'lucide-react';

export const metadata = {
  title: 'Sponsors - IndieTools.ai',
  description: 'Support indie developers by sponsoring IndieTools.ai. Get your brand in front of thousands of solo founders building with AI.',
};

const sponsors = [
  {
    name: 'Vercel',
    description: 'The fastest way to deploy your AI-powered apps. Instant deploys, global edge network, and seamless integration with AI frameworks.',
    url: 'https://vercel.com',
    tier: 'gold',
  },
  {
    name: 'Supabase',
    description: 'The open source Firebase alternative. Build production-grade applications with a Postgres database, authentication, and real-time subscriptions.',
    url: 'https://supabase.com',
    tier: 'gold',
  },
  {
    name: 'Railway',
    description: 'Infrastructure made simple. Deploy your apps in seconds with the most intuitive platform for developers.',
    url: 'https://railway.app',
    tier: 'silver',
  },
  {
    name: 'Lemon Squeezy',
    description: 'The all-in-one platform for software companies to sell globally. Handles checkout, taxes, fraud, and subscriptions.',
    url: 'https://lemonsqueezy.com',
    tier: 'silver',
  },
];

export default function SponsorsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            IndieTools.ai
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium hover:text-primary">
              Tools
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Submit Tool
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Our Sponsors</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These amazing companies make IndieTools.ai possible. Support them and get world-class tools for your indie developer journey.
          </p>
        </div>
      </section>

      {/* Sponsors */}
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 flex-1">
        {/* Gold Sponsors */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-center text-yellow-600">Gold Sponsors</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sponsors.filter(s => s.tier === 'gold').map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border-2 border-yellow-200 bg-yellow-50 p-8 hover:border-yellow-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 rounded-xl bg-white border flex items-center justify-center text-2xl font-bold shadow-sm">
                    {sponsor.name.charAt(0)}
                  </div>
                  <ExternalLink className="h-5 w-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">
                  {sponsor.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sponsor.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div>
          <h2 className="text-lg font-semibold mb-6 text-center text-gray-500">Silver Sponsors</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sponsors.filter(s => s.tier === 'silver').map((sponsor) => (
              <a
                key={sponsor.name}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border bg-card p-6 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xl font-bold">
                    {sponsor.name.charAt(0)}
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                  {sponsor.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {sponsor.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Become a Sponsor */}
        <div className="mt-16 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-12 text-center">
          <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Become a Sponsor</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Get your brand in front of thousands of indie developers and solo founders who are actively evaluating and purchasing tools. Our audience is highly targeted and tech-savvy.
          </p>
          <a
            href="mailto:sponsors@indietools.ai"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get in Touch
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <span className="font-semibold">IndieTools.ai</span>
          <p className="text-sm text-muted-foreground">
            © 2024 IndieTools.ai. Built for indie developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
