'use client';

import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  pricingModel: string | null;
  hasFreeTier: boolean | null;
  category: {
    name: string;
    slug: string;
  } | null;
}

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const getPricingLabel = () => {
    if (tool.hasFreeTier) return 'Free';
    if (tool.pricingModel === 'open_source') return 'Open Source';
    return tool.pricingModel?.replace('_', ' ') || 'Freemium';
  };

  const getPricingColor = () => {
    switch (tool.pricingModel) {
      case 'free':
      case 'open_source':
        return 'bg-green-100 text-green-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col rounded-lg border bg-card p-4 hover:border-primary hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
          {tool.logoUrl ? (
            <img 
              src={tool.logoUrl} 
              alt={tool.name} 
              className="h-8 w-8 object-contain"
            />
          ) : (
            tool.name.charAt(0)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold group-hover:text-primary truncate">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {tool.category?.name || 'Uncategorized'}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2 flex-1">
        {tool.description || 'No description available.'}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPricingColor()}`}>
          {getPricingLabel()}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>4.5</span>
        </div>
      </div>
    </Link>
  );
}
