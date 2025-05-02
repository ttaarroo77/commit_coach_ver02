import { getSupabaseClient } from "./supabase"

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

    if (!data.user) {
      throw new Error("ユーザー情報が取得できませんでした")
    }

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

    return data
  } catch (error) {
    console.error("登録エラー:", error)
    throw error
  }
}

// ログアウト処理
export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 現在のユーザー情報を取得
export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}
