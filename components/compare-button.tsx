'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, GitCompare, Plus } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  slug: string;
  pricingModel: string | null;
  hasFreeTier: boolean | null;
  hasOpenSource: boolean | null;
  hasApi: boolean | null;
  techStack: string[] | null;
  category: { name: string } | null;
}

const MAX_COMPARE = 4;

interface CompareButtonProps {
  tool: Tool;
  isInCompare?: boolean;
}

export function CompareButton({ tool, isInCompare = false }: CompareButtonProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const stored = localStorage.getItem('compare_tools');
    if (stored) {
      try {
        const tools = JSON.parse(stored);
        setCount(tools.length);
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleCompare = () => {
    const stored = localStorage.getItem('compare_tools');
    let tools: Tool[] = [];
    
    if (stored) {
      try {
        tools = JSON.parse(stored);
      } catch {
        tools = [];
      }
    }

    const existingIndex = tools.findIndex(t => t.id === tool.id);
    
    if (existingIndex >= 0) {
      tools.splice(existingIndex, 1);
    } else if (tools.length < MAX_COMPARE) {
      tools.push(tool);
    }

    localStorage.setItem('compare_tools', JSON.stringify(tools));
    setCount(tools.length);
    
    // Dispatch event to update compare bar
    window.dispatchEvent(new CustomEvent('compareUpdated', { detail: tools }));
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare();
      }}
      className={`text-xs px-2 py-1 rounded border transition-colors ${
        isInCompare
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-muted hover:border-primary hover:text-primary'
      }`}
      title={isInCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <span className="flex items-center gap-1">
        <GitCompare className="h-3 w-3" />
        {isInCompare ? 'Added' : 'Compare'}
      </span>
    </button>
  );
}

export function CompareBar() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('compare_tools');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTools(parsed);
        setIsVisible(parsed.length >= 2);
      } catch {
        // ignore
      }
    }

    const handleUpdate = (e: CustomEvent<Tool[]>) => {
      setTools(e.detail);
      setIsVisible(e.detail.length >= 2);
    };

    window.addEventListener('compareUpdated', handleUpdate as EventListener);
    return () => window.removeEventListener('compareUpdated', handleUpdate as EventListener);
  }, []);

  const clearAll = () => {
    localStorage.removeItem('compare_tools');
    setTools([]);
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent('compareUpdated', { detail: [] }));
  };

  const removeTool = (id: string) => {
    const updated = tools.filter(t => t.id !== id);
    localStorage.setItem('compare_tools', JSON.stringify(updated));
    setTools(updated);
    setIsVisible(updated.length >= 2);
    window.dispatchEvent(new CustomEvent('compareUpdated', { detail: updated }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              Compare ({tools.length}/{MAX_COMPARE})
            </span>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                className="flex items-center gap-1 bg-muted rounded-full pl-2 pr-1 py-1 text-sm"
              >
                <span className="truncate max-w-24">{tool.name}</span>
                <button
                  onClick={() => removeTool(tool.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
            <Link
              href={`/tools/compare?ids=${tools.map(t => t.id).join(',')}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 gap-1"
            >
              <Plus className="h-4 w-4" />
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}