'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface ClearCompareButtonProps {
  className?: string;
}

export function ClearCompareButton({ className = '' }: ClearCompareButtonProps) {
  const router = useRouter();

  const handleClear = () => {
    localStorage.removeItem('compare_tools');
    window.dispatchEvent(new CustomEvent('compareUpdated', { detail: [] }));
    router.push('/tools');
  };

  return (
    <button
      onClick={handleClear}
      className={`text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 ${className}`}
    >
      <Trash2 className="h-4 w-4" />
      Clear compare list
    </button>
  );
}
