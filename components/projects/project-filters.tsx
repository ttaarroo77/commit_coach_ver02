'use client';

import { useState } from 'react';
import { ProjectFilterValues } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

interface ProjectFiltersProps {
  filters: ProjectFilterValues;
  onFilterChange: (filters: Partial<ProjectFilterValues>) => void;
  onReset: () => void;
}

export function ProjectFilters({ filters, onFilterChange, onReset }: ProjectFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  return (
    <FadeIn className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="プロジェクトを検索..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => onFilterChange({ search: '' })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ status: value as any })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="active">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
              <SelectItem value="archived">アーカイブ</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={showAdvanced ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          
          {(filters.search || filters.status !== 'all' || filters.sortBy !== 'updated_at' || filters.sortDirection !== 'desc') && (
            <Button variant="ghost" onClick={onReset}>
              リセット
            </Button>
          )}
        </div>
      </div>
      
      {showAdvanced && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex-grow">
            <label className="text-sm font-medium mb-1 block">並び替え</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => onFilterChange({ sortBy: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">名前</SelectItem>
                <SelectItem value="created_at">作成日</SelectItem>
                <SelectItem value="updated_at">更新日</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-grow">
            <label className="text-sm font-medium mb-1 block">順序</label>
            <Select
              value={filters.sortDirection}
              onValueChange={(value) => onFilterChange({ sortDirection: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="順序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">昇順</SelectItem>
                <SelectItem value="desc">降順</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </FadeIn>
  );
}
