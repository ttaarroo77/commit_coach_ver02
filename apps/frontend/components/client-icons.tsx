'use client';

import { Home, Folder, LogOut, User, Settings, type LucideProps } from 'lucide-react';

export function HomeIcon(props: LucideProps) {
  return <Home aria-hidden="true" {...props} />;
}

export function FolderIcon(props: LucideProps) {
  return <Folder aria-hidden="true" {...props} />;
}

export function LogOutIcon(props: LucideProps) {
  return <LogOut aria-hidden="true" {...props} />;
}

export function UserIcon(props: LucideProps) {
  return <User aria-hidden="true" {...props} />;
}

export function SettingsIcon(props: LucideProps) {
  return <Settings aria-hidden="true" {...props} />;
}
