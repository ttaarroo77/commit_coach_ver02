"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { signIn, signUp, signOut, getCurrentUser } from "@/lib/auth"
import type { User } from "@supabase/supabase-js"
import Cookies from "js-cookie"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

// デフォルト値を提供
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const supabase = getSupabaseClient()

    // デモモードのチェック
    const isDemoMode = Cookies.get("demo_mode") === "true"
    if (isDemoMode) {
      console.log("デモモードが有効です")
      // デモユーザー情報を設定
      const demoUser = {
        id: "demo-user-id",
        email: "demo@example.com",
        user_metadata: { name: "デモユーザー" },
      } as User
      setUser(demoUser)
      setLoading(false)
      return
    }

    // 初期ロード時にユーザー情報を取得
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser || null)
      } catch (err) {
        console.error("ユーザー情報の取得に失敗しました", err)
      } finally {
        setLoading(false)
      }
    }

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    loadUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // 日本語のエラーメッセージマッピング
  const authErrorMessages: Record<string, string> = {
    "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません",
    "Email not confirmed": "メールアドレスが確認されていません。メールをご確認ください",
    "User already registered": "このメールアドレスは既に登録されています",
    "Password should be at least 6 characters": "パスワードは6文字以上である必要があります",
    "Email format is invalid": "メールアドレスの形式が正しくありません",
  }

  // ログイン処理
  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      // デモモードのチェック
      if (email === "demo@example.com" && password === "demopassword") {
        console.log("デモモードでログインします")
        // デモモードをクッキーに保存
        Cookies.set("demo_mode", "true", { expires: 1 }) // 1日間有効

        // デモユーザー情報を設定
        const demoUser = {
          id: "demo-user-id",
          email: "demo@example.com",
          user_metadata: { name: "デモユーザー" },
        } as User

        setUser(demoUser)
        router.push("/dashboard")
        return
      }

      const { user } = await signIn(email, password)
      setUser(user)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("ログインエラー:", err)
      // エラーメッセージを日本語に変換
      const errorMessage = err.message ? authErrorMessages[err.message] || err.message : "ログインに失敗しました"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // 新規登録処理
  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null)
      setLoading(true)
      const { user } = await signUp(email, password, name)
      setUser(user)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("登録エラー:", err)
      // エラーメッセージを日本語に変換
      const errorMessage = err.message ? authErrorMessages[err.message] || err.message : "新規登録に失敗しました"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // ログアウト処理
  const logout = async () => {
    try {
      setLoading(true)

      // デモモードのチェック
      if (Cookies.get("demo_mode") === "true") {
        console.log("デモモードからログアウトします")
        // デモモードのクッキーを削除
        Cookies.remove("demo_mode")
        setUser(null)
        router.push("/")
        return
      }

      await signOut()
      setUser(null)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "ログアウトに失敗しました")
      console.error("ログアウトエラー:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
