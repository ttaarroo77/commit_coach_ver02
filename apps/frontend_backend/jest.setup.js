import '@testing-library/jest-dom';

// Popoverのモック
jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }) => children,
  Trigger: ({ children }) => children,
  Content: ({ children }) => children,
  Portal: ({ children }) => children,
}));

// Dialogのモック
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }) => children,
  Trigger: ({ children }) => children,
  Content: ({ children }) => children,
  Portal: ({ children }) => children,
}));

// Tooltipのモック
jest.mock('@radix-ui/react-tooltip', () => ({
  Root: ({ children }) => children,
  Trigger: ({ children }) => children,
  Content: ({ children }) => children,
  Portal: ({ children }) => children,
}));

// グローバルなマウスイベントのモック
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}; 