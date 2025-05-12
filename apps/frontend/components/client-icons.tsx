'use client';

import { Home, Folder, LogOut, type LucideProps } from 'lucide-react';

export function HomeIcon(props: LucideProps) {
  return <Home {...props} />;
}

export function FolderIcon(props: LucideProps) {
  return <Folder {...props} />;
}

export function LogOutIcon(props: LucideProps) {
  return <LogOut {...props} />;
}
