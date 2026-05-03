import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllTools, getToolBySlug } from '@/lib/db/queries';
import { ToolCard } from '@/components/tool-card';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import scenesData from '@/content/scenes/scenes.json';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scene = scenesData.find(s => s.slug === slug);
  
  if (!scene) {
    return { title: 'Scene Not Found - IndieTools.ai' };
  }
  
  return {
    title: `${scene.name} - Tool Stack | IndieTools.ai`,
    description: scene.description || `Curated tools for ${scene.name}`,
  };
}

function getToolBySlugFromAll(slug: string, allTools: any[]) {
  return allTools.find(t => t.slug === slug);
}

export default async function ScenePage({ params }: Props) {
  const { slug } = await params;
  const scene = scenesData.find(s => s.slug === slug);
  
  if (!scene) {
    notFound();
  }
  
  const allTools = await getAllTools();
  
  // Sort tools: highlighted first, then by sortOrder
  const sortedToolRefs = [...(scene.tools || [])].sort((a: any, b: any) => {
    if (a.isHighlighted && !b.isHighlighted) return -1;
    if (!a.isHighlighted && b.isHighlighted) return 1;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  
  const highlightedTools = sortedToolRefs.filter((t: any) => t.isHighlighted);
  
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

      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link 
          href="/scenes" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          All Scenarios
        </Link>
      </div>

      {/* Scene Header */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary">
            {scene.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{scene.name}</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {scene.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              {scene.tools?.length || 0} curated tools
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t">
        {sortedToolRefs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools in this scene yet</p>
          </div>
        ) : (
          <>
            {/* Highlighted Section */}
            {highlightedTools.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Recommended
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {highlightedTools.map((toolRef: any) => {
                    const tool = getToolBySlugFromAll(toolRef.toolSlug, allTools);
                    if (!tool) return null;
                    return (
                      <div key={toolRef.toolSlug} className="relative">
                        <ToolCard tool={tool} />
                        {toolRef.notes && (
                          <p className="mt-2 text-sm text-muted-foreground px-1">
                            {toolRef.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* All Tools */}
            <div>
              <h2 className="text-lg font-semibold mb-4">All Tools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sortedToolRefs.map((toolRef: any) => {
                  const tool = getToolBySlugFromAll(toolRef.toolSlug, allTools);
                  if (!tool) return null;
                  return (
                    <div key={toolRef.toolSlug}>
                      <ToolCard tool={tool} />
                      {toolRef.notes && (
                        <p className="mt-2 text-sm text-muted-foreground px-1">
                          {toolRef.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

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