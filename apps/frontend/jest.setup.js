require('@testing-library/jest-dom');

// モックの設定
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  })),
}));

// グローバルな設定
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// モックの設定
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    query: {},
    pathname: '/',
  }),
}));

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// モックの設定
jest.mock('@/hooks/useTask', () => ({
  __esModule: true,
  default: () => ({
    tasks: [],
    loading: false,
    error: null,
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

// モックの設定
jest.mock('@/hooks/useProjectTasks', () => ({
  __esModule: true,
  default: () => ({
    tasks: [],
    loading: false,
    error: null,
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  }),
}));

// モックのリセット
beforeEach(() => {
  jest.clearAllMocks();
});

// テスト後のクリーンアップ
afterEach(() => {
  jest.clearAllMocks();
}); 