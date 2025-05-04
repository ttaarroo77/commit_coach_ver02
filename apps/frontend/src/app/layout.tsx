import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Header } from '@/components/layout/header';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Commit Coach',
  description: 'A project management tool for developers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
} 