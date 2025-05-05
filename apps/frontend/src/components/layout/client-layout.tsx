"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      {/* LPページの場合のみヘッダーを表示 */}
      {isLandingPage && <Header />}
      {children}
    </>
  );
} 