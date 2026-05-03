import Link from 'next/link';
import { ToolCard } from '@/components/tool-card';
import { Sparkles, ArrowRight } from 'lucide-react';
import scenesData from '@/content/scenes/scenes.json';
import { getAllTools } from '@/lib/db/queries';

function getToolBySlug(slug: string, allTools: any[]) {
  return allTools.find(t => t.slug === slug);
}

export default async function ScenesPage() {
  const allTools = await getAllTools();
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-6 w-6" />
            IndieTools.ai
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-4">
            <Link href="/tools" className="text-sm font-medium hover:text-primary">
              Tools
            </Link>
            <Link href="/scenes" className="text-sm font-medium text-primary">
              Scenes
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Tool Scenarios</h1>
          <p className="text-muted-foreground mt-2">
            Curated tool stacks for specific use cases — find exactly what you need
          </p>
        </div>
      </section>

      {/* Scenes Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scenesData.map((scene) => {
            const toolCount = scene.tools?.length || 0;
            const highlightedTools = scene.tools?.filter((t: any) => t.isHighlighted) || [];
            const previewTools = highlightedTools.slice(0, 3).map((t: any) => getToolBySlug(t.toolSlug, allTools)).filter(Boolean);
            
            return (
              <Link
                key={scene.slug}
                href={`/scenes/${scene.slug}`}
                className="group rounded-lg border bg-card p-6 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl">
                    {scene.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary">
                      {scene.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {scene.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {toolCount} tools
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
                
                {/* Tool Preview */}
                {previewTools.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {previewTools.map((tool: any) => (
                      <span
                        key={tool.id}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs"
                      >
                        {tool.name}
                      </span>
                    ))}
                    {toolCount > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{toolCount - 3} more
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
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