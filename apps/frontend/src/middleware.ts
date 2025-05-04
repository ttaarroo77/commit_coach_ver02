import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthToken } from './lib/auth';

// 認証が必要なパス
const protectedPaths = [
  '/dashboard',
  '/projects',
  '/settings',
  '/profile',
];

// 認証不要のパス
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 静的ファイルやAPIルートはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // ファイル拡張子を持つリクエスト
  ) {
    return NextResponse.next();
  }

  // Cookieからトークンを取得
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!token;

  // 認証が必要なパスへのアクセスで、認証されていない場合
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedPath && !isAuthenticated) {
    // ログインページにリダイレクト
    const redirectUrl = new URL('/login', request.url);
    // 元のURLをリダイレクト後に使用するために保存
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 認証済みユーザーが認証ページにアクセスした場合
  const isAuthPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isAuthPath && isAuthenticated && pathname !== '/') {
    // ダッシュボードにリダイレクト
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    /*
     * 以下を除外:
     * - 静的ファイル (画像、フォントなど)
     * - API ルート
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
