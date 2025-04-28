import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createMiddlewareClient({ req, res });
  
  // セッションの取得
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;
  
  // 一時的に認証チェックをバイパス
  console.log('ミドルウェア実行中:', { path, hasSession: !!session });
  
  // 認証済みユーザーがログインページなどにアクセスした場合、ダッシュボードへリダイレクト
  if (authRoutes.some(route => path.startsWith(route)) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // 他の全てのルートは認証なしでアクセス可能
  // デバッグ用に一時的に認証チェックを無効化
  
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
