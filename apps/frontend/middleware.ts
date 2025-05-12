import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// 認証が必要なパス
const protectedPaths = ["/dashboard", "/projects", "/settings", "/mypage"]

// 認証不要のパス（認証済みユーザーはダッシュボードにリダイレクト）
const authPaths = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // デモモードを常に有効にする
  const isDemoMode = true

  // Supabaseクライアントを作成
  const supabase = createServerSupabaseClient()

  // 現在のセッションを取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 認証済みかどうか（デモモードが常に有効なので常にtrue）
  const isAuthenticated = true

  // デバッグ情報をコンソールに出力
  console.log(`デモモード: Supabaseダミークライアントを使用します（サーバー）`)
  console.log(`Path: ${pathname}, isDemoMode: ${isDemoMode}, isAuthenticated: ${isAuthenticated}`)

  // 保護されたパスへのアクセスで未認証の場合
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !isAuthenticated) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 認証パスへのアクセスで認証済みの場合
  if (authPaths.some((path) => pathname === path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
