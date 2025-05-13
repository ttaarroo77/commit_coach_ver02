'use client';

import {
  Home,
  Folder,
  LogOut,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Braces,
  Plus,
  Clock,
  Send,
  X,
  MoreHorizontal,
  type LucideProps
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 共通のアイコンラッパー
function IconWrapper(props: LucideProps & { icon: React.ElementType }) {
  const { icon: Icon, className, ...rest } = props;
  return <Icon className={cn('h-4 w-4', className)} {...rest} />;
}

export function HomeIcon(props: LucideProps) {
  return <IconWrapper icon={Home} {...props} />;
}

export function FolderIcon(props: LucideProps) {
  return <IconWrapper icon={Folder} {...props} />;
}

export function LogOutIcon(props: LucideProps) {
  return <IconWrapper icon={LogOut} {...props} />;
}

export function UserIcon(props: LucideProps) {
  return <IconWrapper icon={User} {...props} />;
}

export function SettingsIcon(props: LucideProps) {
  return <IconWrapper icon={Settings} {...props} />;
}

export function ChevronDownIcon(props: LucideProps) {
  return <IconWrapper icon={ChevronDown} {...props} />;
}

export function ChevronRightIcon(props: LucideProps) {
  return <IconWrapper icon={ChevronRight} {...props} />;
}

export function ChevronLeftIcon(props: LucideProps) {
  return <IconWrapper icon={ChevronLeft} {...props} />;
}

export function TrashIcon(props: LucideProps) {
  return <IconWrapper icon={Trash2} {...props} />;
}

export function BracesIcon(props: LucideProps) {
  return <IconWrapper icon={Braces} {...props} />;
}

export function PlusIcon(props: LucideProps) {
  return <IconWrapper icon={Plus} {...props} />;
}

export function ClockIcon(props: LucideProps) {
  return <IconWrapper icon={Clock} {...props} />;
}

export function SendIcon(props: LucideProps) {
  return <IconWrapper icon={Send} {...props} />;
}

export function XIcon(props: LucideProps) {
  return <IconWrapper icon={X} {...props} />;
}

export function MoreHorizontalIcon(props: LucideProps) {
  return <IconWrapper icon={MoreHorizontal} {...props} />;
}
