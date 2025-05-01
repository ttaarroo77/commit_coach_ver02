require('@testing-library/jest-dom')

// Popoverのモック
jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }) => children,
  Trigger: ({ children }) => children,
  Content: ({ children }) => children,
  Portal: ({ children }) => children,
})) 