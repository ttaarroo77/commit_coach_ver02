import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/context/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "コミットコーチ - AIタスク管理アプリ",
  description: "AIコーチングでタスク管理を次のレベルへ",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
