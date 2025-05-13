import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // シンプルな処理に置き換え
  return NextResponse.next()
}

// matcher設定を修正
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)']
}
