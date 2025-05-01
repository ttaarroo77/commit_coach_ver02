// リスナーを保持する配列
let listeners: Array<(e: string, s: any) => void> = []

export const createClient = vi.fn(() => {
  const client = {
    auth: {
      // イベント登録
      onAuthStateChange: vi.fn((cb) => {
        listeners.push(cb)
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners = listeners.filter(l => l !== cb)
              }
            }
          }
        }
      }),
      // その他メソッド
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      refreshSession: vi.fn(),
      getSession: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
  }

    // テスト用ヘルパーを追加
    ; (client as any).auth.__triggerAuthState = (event: string, session: any) => {
      listeners.forEach((cb) => cb(event, session))
    }

  return client
})