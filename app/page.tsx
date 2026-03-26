import Link from 'next/link';
import { PHASES } from '@/types';
import { Search, ArrowRight, Sparkles, Users, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-6 w-6" />
            IndieTools.ai
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium hover:text-primary">
              Tools
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

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-6 pb-8 pt-16 md:pt-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI Tools for{' '}
            <span className="text-primary">Indie Developers</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Curated collection of AI-powered tools to help solo developers build, launch, and grow.
            From ideation to monetization.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full rounded-lg border bg-background px-9 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>50+ AI Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>6 Phases</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Curated</span>
          </div>
        </div>
      </section>

      {/* Phases Section */}
      <section className="container py-12">
        <h2 className="text-center text-2xl font-bold mb-8">Browse by Phase</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((phase) => (
            <Link
              key={phase.value}
              href={`/tools?phase=${phase.value}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 hover:border-primary"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {/* Icon placeholder - will use actual icons */}
                  <span className="text-xl">{phase.icon.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary">{phase.label}</h3>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Tools */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Tools</h2>
          <Link href="/tools" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tool Cards - Placeholder */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="flex-1">
                  <h3 className="font-semibold">Tool Name</h3>
                  <p className="text-xs text-muted-foreground">Category</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Short description of the tool goes here...
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  Freemium
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12">
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Have a tool to share?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Help fellow indie developers discover great AI tools. Submit your tool to our curated directory.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Submit a Tool
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">IndieTools.ai</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 IndieTools.ai. Built for indie developers.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
