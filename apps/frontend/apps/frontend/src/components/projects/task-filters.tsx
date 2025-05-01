import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  onSearch,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="タスクを検索..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={onSearch} size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
} 