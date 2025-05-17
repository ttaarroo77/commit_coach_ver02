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
  console.log("[DEBUG:Layout] RootLayoutレンダリング開始");

  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <head>
        {/* 拡張機能属性除去スクリプト - 即時実行かつDOMの変更を監視 */}
        <Script strategy="beforeInteractive" id="remove-extension-attrs">
          {`
            (function() {
              console.log("[DEBUG:Script] 拡張機能属性除去スクリプト実行開始");

              // DOM変更を監視して拡張機能属性を即時除去
              const removeExtensionAttributes = () => {
                const elements = document.querySelectorAll('[data-redeviation-bs-uid],[cz-shortcut-listen]');
                console.log("[DEBUG:Script] 拡張機能属性を持つ要素数:", elements.length);
                elements.forEach(el => {
                  console.log("[DEBUG:Script] 属性除去対象:", el.tagName, el.getAttribute('data-redeviation-bs-uid'), el.getAttribute('cz-shortcut-listen'));
                  el.removeAttribute('data-redeviation-bs-uid');
                  el.removeAttribute('cz-shortcut-listen');
                });
              };

              // 即時実行
              removeExtensionAttributes();

              // DOM変更を監視
              if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver((mutations) => {
                  removeExtensionAttributes();
                });

                // documentが存在する場合は監視を開始
                if (document && document.documentElement) {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true
                  });
                  console.log("[DEBUG:Script] MutationObserver設定完了");
                } else {
                  console.log("[DEBUG:Script] document未ロード - DOMContentLoadedで再試行");
                  document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.documentElement, {
                      attributes: true,
                      childList: true,
                      subtree: true
                    });
                    console.log("[DEBUG:Script] DOMContentLoaded後にMutationObserver設定完了");
                  });
                }
              } else {
                console.log("[DEBUG:Script] MutationObserver未対応 - フォールバック使用");
                document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
              }
            })();
          `}
        </Script>
      </head>
      <body>
        <div id="__extension_safe_root" suppressHydrationWarning={true}>
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  )
}
