import Link from 'next/link';
import { getAllTools, getAllCategories } from '@/lib/db/queries';
import { ToolCard } from '@/components/tool-card';
import { Search, Filter } from 'lucide-react';
import { PRICING_MODELS } from '@/types';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ToolsPage({ searchParams }: Props) {
  const tools = await getAllTools();
  const categories = await getAllCategories();
  
  // Get selected pricing filters from URL
  const pricingParam = searchParams.pricing;
  const selectedPricing = pricingParam 
    ? Array.isArray(pricingParam) ? pricingParam : [pricingParam]
    : [];
  
  // Filter tools by pricing if any selected
  const filteredTools = selectedPricing.length > 0
    ? tools.filter(tool => selectedPricing.includes(tool.pricingModel))
    : tools;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            IndieTools.ai
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium text-primary">
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
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">All AI Tools</h1>
          <p className="text-muted-foreground mt-2">
            Browse {tools.length} AI tools for indie developers
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </h3>
              <input
                type="text"
                placeholder="Search tools..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </h3>
              <div className="space-y-2">
                <Link 
                  href="/tools" 
                  className="block text-sm text-primary font-medium"
                >
                  All Categories
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tools?category=${category.slug}`}
                    className="block text-sm text-muted-foreground hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pricing Filter */}
            <div>
              <h3 className="font-semibold mb-3">Pricing</h3>
              <div className="space-y-2">
                {PRICING_MODELS.map((pricing) => {
                  const isChecked = selectedPricing.includes(pricing.value);
                  const newPricing = isChecked
                    ? selectedPricing.filter(p => p !== pricing.value)
                    : [...selectedPricing, pricing.value];
                  const pricingQuery = newPricing.length > 0 
                    ? `?pricing=${newPricing.join('&pricing=')}` 
                    : '';
                  
                  return (
                    <Link
                      key={pricing.value}
                      href={`/tools${pricingQuery}`}
                      className="flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        readOnly
                        className="rounded border cursor-pointer" 
                      />
                      {pricing.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Tools Grid */}
          <main className="flex-1">
            {selectedPricing.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                {selectedPricing.map(p => {
                  const label = PRICING_MODELS.find(m => m.value === p)?.label || p;
                  const newPricing = selectedPricing.filter(x => x !== p);
                  const pricingQuery = newPricing.length > 0 
                    ? `?pricing=${newPricing.join('&pricing=')}` 
                    : '';
                  return (
                    <Link
                      key={p}
                      href={`/tools${pricingQuery}`}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                    >
                      {label} ×
                    </Link>
                  );
                })}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No tools found matching the selected filters.
              </div>
            )}
          </main>
        </div>
      </div>

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
