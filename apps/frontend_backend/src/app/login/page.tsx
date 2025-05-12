"use client";

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mounted, setMounted] = useState(false)

  // 常にフックを呼び出す（条件付きで呼び出さない）
  const auth = useAuth()

  // デモモードを使用する関数
  const useDemoMode = useCallback(() => {
    setEmail("demo@example.com")
    setPassword("demopassword")
  }, [])

  // クライアントサイドでのみ実行される処理
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // マウント済みの場合のみログイン処理を実行
    if (mounted) {
      await auth.login(email, password)
    }
  }

  // クライアントサイドでのみレンダリング
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">読み込み中...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#31A9B8] text-white">C</div>
            <span className="text-xl font-semibold">コミットコーチ</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">ログイン</CardTitle>
            <CardDescription className="text-center">アカウント情報を入力してログインしてください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mounted && auth.error && (
                <Alert variant="destructive">
                  <AlertDescription>{auth.error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">パスワード</Label>
                  <Link href="/forgot-password" className="text-sm text-[#31A9B8] hover:underline">
                    パスワードをお忘れですか？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100"
                />
              </div>
              <Button type="submit" className="w-full bg-[#31A9B8] hover:bg-[#2a8f9c] text-white" disabled={mounted && auth.loading}>
                {mounted && auth.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ログイン中...
                  </>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600 font-medium">デモモード</p>
              <p className="text-xs text-gray-500 mt-1">
                アカウント登録なしでアプリを試すには、デモモードをご利用ください。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full text-[#31A9B8] border-[#31A9B8] hover:bg-[#31A9B8]/10"
                onClick={useDemoMode}
              >
                デモモードを使用
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は
              <Link href="/register" className="text-[#31A9B8] hover:underline ml-1">
                新規登録
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}