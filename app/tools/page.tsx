import Link from 'next/link';
import { Suspense } from 'react';
import { getAllTools, getAllCategories } from '@/lib/db/queries';
import { ToolCard } from '@/components/tool-card';
import { SearchInput } from '@/components/search-input';
import { AdvancedFilter } from '@/components/advanced-filter';
import { ToolsLoading } from '@/components/tools-loading';
import { Search, Filter } from 'lucide-react';
import { PRICING_MODELS } from '@/types';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ToolsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const tools = await getAllTools();
  const categories = await getAllCategories();
  
  // Get selected pricing filters from URL
  const pricingParam = resolvedSearchParams.pricing;
  const selectedPricing = pricingParam 
    ? Array.isArray(pricingParam) ? pricingParam : [pricingParam]
    : [];
  
  // Get selected category filter from URL
  const categoryParam = resolvedSearchParams.category;
  const selectedCategory = typeof categoryParam === 'string' ? categoryParam : null;
  
  // Get search query from URL
  const searchQuery = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  
  // Get advanced filters from URL
  const freeTierParam = resolvedSearchParams.freeTier;
  const hasFreeTier = freeTierParam === '1' ? true : null;
  
  const openSourceParam = resolvedSearchParams.openSource;
  const hasOpenSource = openSourceParam === '1' ? true : null;
  
  const hasApiParam = resolvedSearchParams.hasApi;
  const hasApi = hasApiParam === '1' ? true : null;
  
  const techParam = resolvedSearchParams.tech;
  const selectedTechStack = typeof techParam === 'string' 
    ? techParam.split(',').filter(Boolean) 
    : [];
  
  // Find the selected category object
  const selectedCategoryObj = selectedCategory !== null
    ? categories.find(c => c.slug === selectedCategory as string) 
    : null;
  
  // Filter tools by all criteria
  let filteredTools = tools;
  
  // Category filter
  if (selectedCategoryObj) {
    filteredTools = filteredTools.filter(tool => tool.categoryId === selectedCategoryObj.id);
  }
  
  // Pricing filter (multi-select)
  if (selectedPricing.length > 0) {
    filteredTools = filteredTools.filter(tool => 
      selectedPricing.includes(tool.pricingModel as string)
    );
  }
  
  // Free tier filter
  if (hasFreeTier === true) {
    filteredTools = filteredTools.filter(tool => tool.hasFreeTier === true);
  }
  
  // Open source filter
  if (hasOpenSource === true) {
    filteredTools = filteredTools.filter(tool => tool.hasOpenSource === true);
  }
  
  // API support filter
  if (hasApi === true) {
    filteredTools = filteredTools.filter(tool => tool.hasApi === true);
  }
  
  // Tech stack filter (tool matches ANY selected tech)
  if (selectedTechStack.length > 0) {
    filteredTools = filteredTools.filter(tool => {
      const toolTech = tool.techStack || [];
      return selectedTechStack.some(tech => toolTech.includes(tech));
    });
  }
  
  // Search filter (case-insensitive, matches name and description)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredTools = filteredTools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      (tool.description?.toLowerCase().includes(query) ?? false) ||
      (tool.category?.name?.toLowerCase().includes(query) ?? false)
    );
  }

  // Build active filter count
  const activeFilterCount = [
    selectedPricing.length > 0,
    hasFreeTier === true,
    hasOpenSource === true,
    hasApi === true,
    selectedTechStack.length > 0,
    !!selectedCategory,
  ].filter(Boolean).length;

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
            {activeFilterCount > 0
              ? `Showing ${filteredTools.length} of ${tools.length} tools`
              : `Browse ${tools.length} AI tools for indie developers`}
            {selectedCategoryObj && ` in ${selectedCategoryObj.name}`}
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
              <SearchInput />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </h3>
              <div className="space-y-2">
                <Link 
                  href={(selectedPricing.length > 0 
                    ? `/tools?pricing=${selectedPricing.join('&pricing=')}` 
                    : "/tools") as any} 
                  className={`block text-sm rounded-md px-2 py-1 -mx-2 ${!selectedCategory ? 'text-primary font-medium bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
                >
                  All Categories
                </Link>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.slug;
                  // Build URL with both category and pricing filters
                  const pricingQuery = selectedPricing.length > 0 
                    ? `&pricing=${selectedPricing.join('&pricing=')}` 
                    : '';
                  const categoryUrl = `/tools?category=${category.slug}${pricingQuery}`;
                  
                  return (
                    <Link
                      key={category.id}
                      href={categoryUrl as any}
                      className={`block text-sm rounded-md px-2 py-1 -mx-2 transition-colors ${isSelected ? 'text-primary font-medium bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
                    >
                      {category.name}
                    </Link>
                  );
                })}
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
                  
                  // Build URL with both category and pricing filters
                  const categoryQuery = selectedCategory ? `category=${selectedCategory}` : '';
                  const pricingQuery = newPricing.length > 0 
                    ? newPricing.map(p => `pricing=${p}`).join('&') 
                    : '';
                  const fullQuery = [categoryQuery, pricingQuery].filter(Boolean).join('&');
                  const pricingUrl = fullQuery ? `/tools?${fullQuery}` : '/tools';
                  
                  return (
                    <Link
                      key={pricing.value}
                      href={pricingUrl as any}
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

            {/* Advanced Filters */}
            <div className="border-t pt-4">
              <AdvancedFilter 
                hasFreeTier={hasFreeTier}
                hasOpenSource={hasOpenSource}
                hasApi={hasApi}
                techStack={selectedTechStack}
              />
            </div>
          </aside>

          {/* Tools Grid */}
          <main className="flex-1">
            <Suspense fallback={<ToolsLoading />}>
            {/* Active Filters Display */}
            {(selectedPricing.length > 0 || searchQuery || hasFreeTier || hasOpenSource || hasApi || selectedTechStack.length > 0) && (
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Link
                    href={`/tools?${[
                      selectedCategory ? `category=${selectedCategory}` : '',
                      selectedPricing.length > 0 ? selectedPricing.map(p => `pricing=${p}`).join('&') : '',
                      hasFreeTier ? 'freeTier=1' : '',
                      hasOpenSource ? 'openSource=1' : '',
                      hasApi ? 'hasApi=1' : '',
                      selectedTechStack.length > 0 ? `tech=${selectedTechStack.join(',')}` : '',
                    ].filter(Boolean).join('&')}` as any}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    Search: "{searchQuery}" ×
                  </Link>
                )}
                {selectedPricing.map(p => {
                  const label = PRICING_MODELS.find(m => m.value === p)?.label || p;
                  const newPricing = selectedPricing.filter(x => x !== p);
                  const params = [
                    selectedCategory ? `category=${selectedCategory}` : '',
                    searchQuery ? `q=${encodeURIComponent(searchQuery)}` : '',
                    hasFreeTier ? 'freeTier=1' : '',
                    hasOpenSource ? 'openSource=1' : '',
                    hasApi ? 'hasApi=1' : '',
                    selectedTechStack.length > 0 ? `tech=${selectedTechStack.join(',')}` : '',
                    newPricing.length > 0 ? newPricing.map(x => `pricing=${x}`).join('&') : '',
                  ].filter(Boolean).join('&');
                  const url = params ? `/tools?${params}` : '/tools';
                  return (
                    <Link
                      key={p}
                      href={url as any}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                    >
                      {label} ×
                    </Link>
                  );
                })}
                {hasFreeTier && (
                  <Link
                    href={`/tools?${[
                      selectedCategory ? `category=${selectedCategory}` : '',
                      selectedPricing.length > 0 ? selectedPricing.map(p => `pricing=${p}`).join('&') : '',
                      searchQuery ? `q=${encodeURIComponent(searchQuery)}` : '',
                      hasOpenSource ? 'openSource=1' : '',
                      hasApi ? 'hasApi=1' : '',
                      selectedTechStack.length > 0 ? `tech=${selectedTechStack.join(',')}` : '',
                    ].filter(Boolean).join('&')}` as any}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    Free Tier ×
                  </Link>
                )}
                {hasOpenSource && (
                  <Link
                    href={`/tools?${[
                      selectedCategory ? `category=${selectedCategory}` : '',
                      selectedPricing.length > 0 ? selectedPricing.map(p => `pricing=${p}`).join('&') : '',
                      searchQuery ? `q=${encodeURIComponent(searchQuery)}` : '',
                      hasFreeTier ? 'freeTier=1' : '',
                      hasApi ? 'hasApi=1' : '',
                      selectedTechStack.length > 0 ? `tech=${selectedTechStack.join(',')}` : '',
                    ].filter(Boolean).join('&')}` as any}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    Open Source ×
                  </Link>
                )}
                {hasApi && (
                  <Link
                    href={`/tools?${[
                      selectedCategory ? `category=${selectedCategory}` : '',
                      selectedPricing.length > 0 ? selectedPricing.map(p => `pricing=${p}`).join('&') : '',
                      searchQuery ? `q=${encodeURIComponent(searchQuery)}` : '',
                      hasFreeTier ? 'freeTier=1' : '',
                      hasOpenSource ? 'openSource=1' : '',
                      selectedTechStack.length > 0 ? `tech=${selectedTechStack.join(',')}` : '',
                    ].filter(Boolean).join('&')}` as any}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    API Support ×
                  </Link>
                )}
                {selectedTechStack.map(t => (
                  <Link
                    key={t}
                    href={`/tools?${[
                      selectedCategory ? `category=${selectedCategory}` : '',
                      selectedPricing.length > 0 ? selectedPricing.map(p => `pricing=${p}`).join('&') : '',
                      searchQuery ? `q=${encodeURIComponent(searchQuery)}` : '',
                      hasFreeTier ? 'freeTier=1' : '',
                      hasOpenSource ? 'openSource=1' : '',
                      hasApi ? 'hasApi=1' : '',
                      selectedTechStack.filter(x => x !== t).length > 0 ? `tech=${selectedTechStack.filter(x => x !== t).join(',')}` : '',
                    ].filter(Boolean).join('&')}` as any}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                  >
                    {t} ×
                  </Link>
                ))}
                <Link
                  href={`/tools${selectedCategory ? `?category=${selectedCategory}` : ''}` as any}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Clear all
                </Link>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or search query to find what you&apos;re looking for.
                </p>
                <Link 
                  href="/tools"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Clear all filters
                </Link>
              </div>
            )}
            </Suspense>
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