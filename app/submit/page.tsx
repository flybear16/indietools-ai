'use client';

import Link from 'next/link';
import { Sparkles, Send } from 'lucide-react';
import { useState } from 'react';

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
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
              <Link href="/about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
              <Link 
                href="/submit" 
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Submit Tool
              </Link>
            </nav>
          </div>
        </header>

        <main className="container py-12 flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Submission Received!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for submitting your tool. We&apos;ll review it and get back to you soon.
            </p>
            <Link 
              href="/tools" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse Tools
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link 
              href="/submit" 
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Submit Tool
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="container py-12 flex-1">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Submit a Tool</h1>
          <p className="text-muted-foreground mb-8">
            Share your AI tool with the indie developer community.
          </p>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div>
              <label className="block text-sm font-medium mb-2">Tool Name *</label>
              <input 
                type="text" 
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="e.g., CodeWizard AI"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website URL *</label>
              <input 
                type="url" 
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Select a category</option>
                <option value="coding">AI Coding</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="productivity">Productivity</option>
                <option value="monetization">Monetization</option>
                <option value="community">Community</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea 
                required
                rows={4}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="What does your tool do? Who is it for?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pricing Model *</label>
              <select className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                <option value="">Select pricing</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="open_source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Email *</label>
              <input 
                type="email" 
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <button 
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Tool
            </button>
          </form>
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
