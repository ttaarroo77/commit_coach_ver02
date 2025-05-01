import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthProvider';
import '@testing-library/jest-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// testPathの設定
if (!globalThis.testPath) {
  Object.defineProperty(globalThis, 'testPath', {
    value: '',
    writable: true,
    configurable: true,
  });
}

export * from '@testing-library/react';
export { customRender as render };