'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MainNav } from './main-nav';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { Bell, User, LogOut } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

export function Header() {
  const [user, setUser] = useState<{ id: string; email: string; name: string | null } | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // ユーザー情報を取得
        const { data } = await supabase
          .from('users')
          .select('id, email, name')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUser(data);
        } else {
          // 開発環境用のモックデータ
          setUser({
            id: user.id,
            email: user.email || 'user@example.com',
            name: 'テストユーザー'
          });
        }
      }
    };
    
    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <FadeIn>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white dark:bg-gray-950">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/logo.svg"
                  alt="Commit Coach"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                Commit Coach
              </span>
            </Link>
            
            <MainNav />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="ログアウト">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    </FadeIn>
  );
}
