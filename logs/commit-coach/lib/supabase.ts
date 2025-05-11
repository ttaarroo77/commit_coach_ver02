import { createClient } from "@supabase/supabase-js"
import Cookies from "js-cookie"

// シングルトンパターンでクライアントを作成（クライアントサイド用）
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  // デモモードのチェック
  let isDemoMode = false
  if (typeof window !== "undefined") {
    isDemoMode = Cookies.get("demo_mode") === "true"
  }

  // デモモードの場合はダミークライアントを返す
  if (isDemoMode) {
    console.log("デモモード: Supabaseダミークライアントを使用します")
    supabaseClient = createClient("https://example.supabase.co", "dummy-key", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return supabaseClient
  }

  // 環境変数を取得
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 環境変数が設定されていない場合のエラーハンドリング
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase環境変数が設定されていません。ダミークライアントを使用します。")

    // ダミークライアントを返す（エラーを投げない）
    supabaseClient = createClient("https://example.supabase.co", "dummy-key", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return supabaseClient
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}

// サーバーサイド用のクライアント
export const createServerSupabaseClient = () => {
  // デモモードのチェック（サーバーサイドでは環境変数を使用）
  const isDemoMode = process.env.DEMO_MODE === "true"

  // デモモードの場合はダミークライアントを返す
  if (isDemoMode) {
    console.log("デモモード: Supabaseダミークライアントを使用します（サーバー）")
    return createClient("https://example.supabase.co", "dummy-key", {
      auth: {
        persistSession: false,
      },
    })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase環境変数が設定されていません。サーバーサイドでダミークライアントを使用します。")

    // ダミークライアントを返す（エラーを投げない）
    return createClient("https://example.supabase.co", "dummy-key", {
      auth: {
        persistSession: false,
      },
    })
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}
