import { getSupabaseClient } from "./supabase"
import Cookies from "js-cookie"

// Cookieの設定
const AUTH_TOKEN_KEY = "auth_token"
const COOKIE_OPTIONS = {
  expires: 7, // 7日間有効
  secure: process.env.NODE_ENV === "production", // 本番環境ではhttpsのみ
  sameSite: "strict" as const,
}

// JWTをCookieに保存
export function saveAuthToken(token: string) {
  Cookies.set(AUTH_TOKEN_KEY, token, COOKIE_OPTIONS)
}

// CookieからJWTを取得
export function getAuthToken(): string | undefined {
  return Cookies.get(AUTH_TOKEN_KEY)
}

// CookieからJWTを削除
export function removeAuthToken() {
  Cookies.remove(AUTH_TOKEN_KEY)
}

// ログイン処理
export async function signIn(email: string, password: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("サインインエラー:", error.message)
      throw error
    }

    if (!data.user || !data.session) {
      throw new Error("ユーザー情報が取得できませんでした")
    }

    // JWTをCookieに保存
    saveAuthToken(data.session.access_token)
    
    return data
  } catch (error) {
    console.error("認証エラー:", error)
    throw error
  }
}

// 新規登録処理
export async function signUp(email: string, password: string, name: string) {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      console.error("サインアップエラー:", error.message)
      throw error
    }

    // セッションが存在する場合はJWTをCookieに保存
    // メール確認が必要な場合はここではセッションがない可能性がある
    if (data.session) {
      saveAuthToken(data.session.access_token)
    }

    return data
  } catch (error) {
    console.error("登録エラー:", error)
    throw error
  }
}

// ログアウト処理
export async function signOut() {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error("ログアウトエラー:", error.message)
      throw error
    }
    
    // CookieからJWTを削除
    removeAuthToken()
    
    return { success: true }
  } catch (error) {
    console.error("ログアウトエラー:", error)
    throw error
  }
}

// 現在のユーザー情報を取得
export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
