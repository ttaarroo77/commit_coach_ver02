'use client';

import { BellIcon, UserCircleIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">ダッシュボード</h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">ユーザー名</span>
        </div>
      </div>
    </header>
  );
} 