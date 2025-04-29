import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// 認証が必要なルート
const protectedRoutes = [
  '/dashboard',
  '/dashboard/tasks',
  '/dashboard/projects',
  '/dashboard/ai-coach',
  '/dashboard/settings',
];

// 認証済みユーザーがアクセスできないルート（ログイン済みならダッシュボードへ）
const authRoutes = [
  '/login',
  '/register',
  '/password/reset',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // セッションの取得
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // 一時的に認証チェックをバイパス
  console.log('ミドルウェア実行中:', { path, hasSession: !!session });

  // 認証済みユーザーがログインページなどにアクセスした場合、ダッシュボードへリダイレクト
  if (authRoutes.some(route => path.startsWith(route)) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// ミドルウェアを適用するパス
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/password/reset',
    '/password/update',
  ],
};
