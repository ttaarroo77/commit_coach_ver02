import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 開発環境でのみ実行
  if (process.env.NODE_ENV === 'development') {
    const response = NextResponse.next()

    // レスポンスヘッダーにContent-Security-Policyを追加
    // これによりColorZillaなどの拡張機能のコンテンツスクリプトの実行を制限
    response.headers.set(
      'Content-Security-Policy',
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
    )

    // レスポンスヘッダーにX-Extension-Disableを追加
    // カスタムヘッダーでColorZillaなど特定の拡張機能に無効化を示唆
    response.headers.set('X-Extension-Disable', 'true')

    return response
  }

  return NextResponse.next()
}

// 全てのリクエストに対してmiddlewareを適用
export const config = {
  matcher: '/:path*',
}
