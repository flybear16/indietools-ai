import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-6 w-6" />
            IndieTools.ai
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium hover:text-primary">
              Tools
            </Link>
            <Link href="/about" className="text-sm font-medium text-primary">
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

      {/* Content */}
      <main className="container py-12 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About IndieTools.ai</h1>
          
          <div className="prose prose-neutral">
            <p className="text-lg text-muted-foreground mb-6">
              IndieTools.ai is a curated directory of AI-powered tools designed specifically 
              for independent developers and solo founders.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We believe that indie developers deserve access to the best AI tools without 
              the enterprise price tags or complexity. Our mission is to help solo builders 
              find the right tools to ship faster, work smarter, and compete with larger teams.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What We Cover</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✨ AI coding assistants and dev tools</li>
              <li>🎨 Design and prototyping tools</li>
              <li>🚀 Marketing and growth automation</li>
              <li>💰 Monetization and payment solutions</li>
              <li>🤝 Community and customer support</li>
              <li>📊 Analytics and business intelligence</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a suggestion or want to submit your tool?{' '}
              <Link href="/submit" className="text-primary hover:underline">
                Submit it here
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

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
        </div>
      </footer>
    </div>
  );
}
