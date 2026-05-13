'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, Lock } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const TECH_STACK_OPTIONS = [
  'ai', 'nlp', 'search', 'productivity', 'docs', 'whiteboard', 'collaboration',
  'vscode', 'ide', 'editor', 'nextjs', 'react', 'deployment', 'postgresql',
  'backend', 'database', 'design', 'ui', 'prototyping', 'launch', 'community',
  'payments', 'saas'
].sort();

const FEATURE_OPTIONS = [
  { key: 'hasFreeTier', label: 'Free Tier' },
  { key: 'hasOpenSource', label: 'Open Source' },
  { key: 'hasApi', label: 'API Support' },
] as const;

interface AdvancedFilterProps {
  hasFreeTier?: boolean | null;
  hasOpenSource?: boolean | null;
  hasApi?: boolean | null;
  techStack?: string[];
}

export function AdvancedFilter({ hasFreeTier, hasOpenSource, hasApi, techStack = [] }: AdvancedFilterProps) {
  const { data: session } = useSession();
  const isPro = (session?.user as any)?.subscriptionStatus === 'active' || (session?.user as any)?.role === 'pro';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string[]>(techStack);
  const [showTechLock, setShowTechLock] = useState(false);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/tools?${params.toString()}`, { scroll: false });
  };

  const toggleTechStack = (tech: string) => {
    if (!isPro) {
      setShowTechLock(true);
      setTimeout(() => setShowTechLock(false), 3000);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const current = searchParams.get('tech')?.split(',').filter(Boolean) || [];

    if (current.includes(tech)) {
      const updated = current.filter(t => t !== tech);
      if (updated.length > 0) {
        params.set('tech', updated.join(','));
      } else {
        params.delete('tech');
      }
    } else {
      current.push(tech);
      params.set('tech', current.join(','));
    }

    router.push(`/tools?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push('/tools', { scroll: false });
  };

  const hasAdvancedFilters = hasFreeTier || hasOpenSource || hasApi || techStack.length > 0;

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
          {hasAdvancedFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {[hasFreeTier, hasOpenSource, hasApi, techStack.length > 0].filter(Boolean).length}
            </span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="space-y-6 pl-0">
          {/* Feature Toggles - Available to all */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Features</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFreeTier === true}
                  onChange={() => updateFilter('freeTier', hasFreeTier === true ? null : '1')}
                  className="rounded border cursor-pointer"
                />
                Free Tier Available
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasOpenSource === true}
                  onChange={() => updateFilter('openSource', hasOpenSource === true ? null : '1')}
                  className="rounded border cursor-pointer"
                />
                Open Source
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasApi === true}
                  onChange={() => updateFilter('hasApi', hasApi === true ? null : '1')}
                  className="rounded border cursor-pointer"
                />
                API Support
              </label>
            </div>
          </div>

          {/* Tech Stack Multi-select - Pro only */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-muted-foreground">Tech Stack</h4>
              {!isPro && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <Link href="/subscription" className="underline text-primary">Pro</Link>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TECH_STACK_OPTIONS.map((tech) => {
                const isSelected = selectedTech.includes(tech);
                const isLocked = !isPro;
                return (
                  <button
                    key={tech}
                    onClick={() => {
                      if (isLocked) {
                        setShowTechLock(true);
                        setTimeout(() => setShowTechLock(false), 3000);
                      } else {
                        toggleTechStack(tech);
                      }
                    }}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : isLocked
                        ? 'border-muted text-muted-foreground cursor-not-allowed opacity-60'
                        : 'border-muted hover:border-primary hover:text-primary cursor-pointer'
                    }`}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            {showTechLock && (
              <p className="mt-2 text-xs text-red-500 animate-pulse">
                <Link href="/subscription" className="underline">Upgrade to Pro</Link> to filter by tech stack
              </p>
            )}
          </div>

          {/* Clear All */}
          {hasAdvancedFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}