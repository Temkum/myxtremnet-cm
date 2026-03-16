'use client';

import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function SearchForm({
  searchQuery,
  setSearchQuery,
  onSubmit,
  className,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('relative w-full', className)}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users by name, email, or service ID..."
        className="w-full px-4 py-2 pl-10 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
    </form>
  );
}
