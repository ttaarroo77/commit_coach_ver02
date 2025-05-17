import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/auth-context"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Commit Coach",
  description: "AI駆動のタスク管理アプリケーション",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* ★ ページに何より先に実行させる拡張機能属性除去スクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('[data-redeviation-bs-uid],[cz-shortcut-listen]')
                  .forEach(el => {
                    el.removeAttribute('data-redeviation-bs-uid');
                    el.removeAttribute('cz-shortcut-listen');
                  });
              });
            `,
          }}
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
