import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
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
      <head>
        <Script
          id="remove-extension-attrs"
          strategy="beforeInteractive"
          src="/_scripts/remove-extension-attrs.js"
        />
      </head>
      <body>
        <div id="__extension_safe_root">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  )
}
