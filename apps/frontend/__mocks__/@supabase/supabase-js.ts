export const createClient = vi.fn(() => ({
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    refreshSession: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn((callback) => {
      // コールバックを保持
      mockSupabaseClient.auth.__triggerAuthState = (event: string, session: any) => {
        callback(event, session)
      }
      return { data: { subscription: { unsubscribe: vi.fn() } } }
    }),
    __triggerAuthState: vi.fn(),
  },
  storage: {
    from: vi.fn(),
  },
})) 