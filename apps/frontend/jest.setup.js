import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock @dnd-kit/core
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  DndContext: ({ children }) => children,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: jest.fn(),
    isOver: false,
  }),
}));

// Mock @dnd-kit/sortable
jest.mock('@dnd-kit/sortable', () => ({
  ...jest.requireActual('@dnd-kit/sortable'),
  SortableContext: ({ children }) => children,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() { }
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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

// モックの設定
jest.mock('@hello-pangea/dnd', () => ({
  DndContext: ({ children }) => children,
  DragOverlay: ({ children }) => children,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
  }),
  useDroppable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
  }),
}));

// モックの設定
jest.mock('cmdk', () => ({
  Command: ({ children }) => children,
  CommandInput: ({ children }) => children,
  CommandList: ({ children }) => children,
  CommandEmpty: ({ children }) => children,
  CommandGroup: ({ children }) => children,
  CommandItem: ({ children }) => children,
  CommandSeparator: ({ children }) => children,
}));

// モックの設定
jest.mock('class-variance-authority', () => ({
  cva: () => () => '',
}));

// モックの設定
jest.mock('clsx', () => ({
  clsx: () => '',
}));

// モックの設定
jest.mock('tailwind-merge', () => ({
  twMerge: () => '',
}));

// モックのリセット
beforeEach(() => {
  jest.clearAllMocks();
});

// テスト後のクリーンアップ
afterEach(() => {
  jest.clearAllMocks();
}); 