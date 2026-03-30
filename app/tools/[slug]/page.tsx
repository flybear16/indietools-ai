import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getToolBySlug, getAllTools } from '@/lib/db/queries';
import { ToolCard } from '@/components/tool-card';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Check, 
  Code, 
  Zap,
  DollarSign,
  Globe
} from 'lucide-react';

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found - IndieTools.ai',
    };
  }

  return {
    title: `${tool.name} - ${tool.category?.name} Tool | IndieTools.ai`,
    description: tool.description || `Learn about ${tool.name}, a ${tool.category?.name} tool for indie developers.`,
    openGraph: {
      title: `${tool.name} - ${tool.category?.name} Tool`,
      description: tool.description || undefined,
      type: 'article',
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Get related tools (same category, excluding current tool)
  const allTools = await getAllTools();
  const relatedTools = allTools
    .filter(t => t.categoryId === tool.categoryId && t.id !== tool.id)
    .slice(0, 3);

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

      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          href="/tools" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
      </div>

      {/* Tool Header */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Logo */}
          <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
            {tool.logoUrl ? (
              <img 
                src={tool.logoUrl} 
                alt={tool.name} 
                className="h-16 w-16 object-contain"
              />
            ) : (
              tool.name.charAt(0)
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              {tool.status === 'approved' && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Verified
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-4">
              {tool.category?.name} • {tool.pricingModel?.replace('_', ' ')}
            </p>
            <p className="text-lg max-w-2xl">
              {tool.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a 
              href={tool.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </a>
            <button className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted gap-2">
              <Star className="h-4 w-4" />
              Add to Favorites
            </button>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Features
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  tool.hasFreeTier && 'Free tier available',
                  tool.hasApi && 'API access',
                  tool.hasOpenSource && 'Open source',
                  'AI-powered',
                  'Indie developer friendly',
                ].filter(Boolean).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            {tool.techStack && tool.techStack.length > 0 && (
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.techStack.map((tech) => (
                    <span 
                      key={tech} 
                      className="rounded-full bg-muted px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {tool.integrations && tool.integrations.length > 0 && (
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Integrations</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((integration) => (
                    <span 
                      key={integration} 
                      className="rounded-full bg-muted px-3 py-1 text-sm"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Pricing Info */}
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium capitalize">
                    {tool.pricingModel?.replace('_', ' ')}
                  </span>
                </div>
                {tool.startingPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Starting from</span>
                    <span className="font-medium">${tool.startingPrice}/mo</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Free tier</span>
                  <span className="font-medium">
                    {tool.hasFreeTier ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="rounded-lg border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Links
              </h3>
              <div className="space-y-2">
                {tool.websiteUrl && (
                  <a 
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Official Website
                  </a>
                )}
              </div>
            </div>

            {/* Affiliate */}
            {tool.affiliateEnabled && tool.affiliateUrl && (
              <div className="rounded-lg border border-dashed border-primary/50 bg-primary/5 p-6">
                <h3 className="font-semibold mb-2">Affiliate Link</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Support us by using this link
                </p>
                <a 
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Get {tool.name}
                </a>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t">
          <h2 className="text-xl font-semibold mb-6">More {tool.category?.name} Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((relatedTool) => (
              <ToolCard key={relatedTool.id} tool={relatedTool} />
            ))}
          </div>
        </section>
      )}

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