import Link from 'next/link';
import { Metadata } from 'next';
import { getToolsWithStats } from '@/lib/db/queries';
import { ArrowLeft, Check, X as XIcon, ExternalLink, Star } from 'lucide-react';
import { ClearCompareButton } from '@/components/clear-compare-button';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return {
    title: 'Compare Tools - IndieTools.ai',
    description: 'Compare AI tools side by side for indie developers',
  };
}

export default async function ComparePage({ searchParams }: Props) {
  const params = await searchParams;
  const idsParam = params.ids;

  if (!idsParam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">No tools selected</h1>
        <p className="text-muted-foreground mb-6">Select tools to compare from the tools page.</p>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Tools
        </Link>
      </div>
    );
  }

  const ids = Array.isArray(idsParam) ? idsParam : idsParam.split(',').filter(Boolean);

  if (ids.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Select at least 2 tools</h1>
        <p className="text-muted-foreground mb-6">You need at least 2 tools to compare.</p>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Tools
        </Link>
      </div>
    );
  }

  const allTools = await getToolsWithStats();
  const compareTools = allTools.filter(t => ids.includes(t.id));

  if (compareTools.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Tools not found</h1>
        <p className="text-muted-foreground mb-6">Some tools could not be found.</p>
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Tools
        </Link>
      </div>
    );
  }

  const features = [
    { key: 'pricingModel', label: 'Pricing Model' },
    { key: 'hasFreeTier', label: 'Free Tier', isBool: true },
    { key: 'hasOpenSource', label: 'Open Source', isBool: true },
    { key: 'hasApi', label: 'API Support', isBool: true },
    { key: 'startingPrice', label: 'Starting Price' },
  ];

  const renderFeatureValue = (tool: typeof compareTools[0], feature: typeof features[0]) => {
    if (feature.isBool) {
      const value = (tool as any)[feature.key];
      return value ? (
        <div className="flex items-center justify-center">
          <Check className="h-5 w-5 text-green-500" />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <XIcon className="h-5 w-5 text-red-300" />
        </div>
      );
    }

    if (feature.key === 'startingPrice') {
      const value = tool.startingPrice;
      return value ? `$${value}/mo` : '-';
    }

    const value = (tool as any)[feature.key];
    if (value === null || value === undefined) return '-';
    if (Array.isArray(value)) return value.join(', ') || '-';
    return String(value).replace('_', ' ');
  };

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

      {/* Compare Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Compare Tools</h1>
          <ClearCompareButton />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b font-semibold bg-muted/50 w-40 sticky left-0 z-10">
                  Feature
                </th>
                {compareTools.map((tool) => (
                  <th key={tool.id} className="p-4 border-b text-center min-w-52">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold">
                        {tool.name.charAt(0)}
                      </div>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="font-semibold hover:text-primary text-center"
                      >
                        {tool.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {tool.category?.name}
                      </span>
                      {/* Rating */}
                      {tool.reviewStats && tool.reviewStats.count > 0 ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{tool.reviewStats.average.toFixed(1)}</span>
                          <span className="text-muted-foreground">({tool.reviewStats.count})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-muted-foreground">No reviews</span>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.key} className="hover:bg-muted/30">
                  <td className="p-4 border-b font-medium text-muted-foreground sticky left-0 bg-background z-10">
                    {feature.label}
                  </td>
                  {compareTools.map((tool) => (
                    <td key={tool.id} className="p-4 border-b text-center">
                      {renderFeatureValue(tool, feature)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Tech Stack Row */}
              <tr className="hover:bg-muted/30">
                <td className="p-4 border-b font-medium text-muted-foreground sticky left-0 bg-background z-10">
                  Tech Stack
                </td>
                {compareTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {tool.techStack && tool.techStack.length > 0 ? (
                        tool.techStack.slice(0, 6).map((tech) => (
                          <span key={tech} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Integrations Row */}
              <tr className="hover:bg-muted/30">
                <td className="p-4 border-b font-medium text-muted-foreground sticky left-0 bg-background z-10">
                  Integrations
                </td>
                {compareTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {tool.integrations && tool.integrations.length > 0 ? (
                        tool.integrations.slice(0, 4).map((int) => (
                          <span key={int} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {int}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Description Row */}
              <tr className="hover:bg-muted/30">
                <td className="p-4 border-b font-medium text-muted-foreground sticky left-0 bg-background z-10">
                  Description
                </td>
                {compareTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center max-w-xs">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {tool.description || '-'}
                    </p>
                  </td>
                ))}
              </tr>
              {/* Website Row */}
              <tr className="hover:bg-muted/30">
                <td className="p-4 border-b font-medium text-muted-foreground sticky left-0 bg-background z-10">
                  Website
                </td>
                {compareTools.map((tool) => (
                  <td key={tool.id} className="p-4 border-b text-center">
                    {tool.websiteUrl ? (
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add More Tools */}
        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="text-sm text-primary hover:underline"
          >
            + Add more tools to compare
          </Link>
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
