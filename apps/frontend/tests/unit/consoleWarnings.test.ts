/**
 * コンソール警告とエラーを検出するテスト
 *
 * このテストは以下を検出します：
 * 1. React Hydrationエラー
 * 2. 重複キーエラー
 * 3. react-beautiful-dndのisDropDisabledエラー
 */

import { jest } from '@jest/globals';

describe('Console warnings and errors', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    // コンソールのエラーと警告をスパイ
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // テスト後にスパイをリセット
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('should not have hydration errors', () => {
    // Hydrationエラーをシミュレート
    console.error('Warning: Text content did not match. Server: "foo" Client: "bar"');
    console.error('Warning: An error occurred during hydration');

    // 特定のHydrationエラーパターンを検出
    const hydrationErrors = consoleErrorSpy.mock.calls.filter(args =>
      args.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('hydration') ||
         arg.includes('did not match') ||
         arg.includes('Hydration failed'))
      )
    );

    expect(hydrationErrors).toHaveLength(0);
  });

  test('should not have duplicate key warnings', () => {
    // 重複キーエラーをシミュレート
    console.error('Warning: Encountered two children with the same key');

    // 重複キーのパターンを検出
    const duplicateKeyErrors = consoleErrorSpy.mock.calls.filter(args =>
      args.some(arg =>
        typeof arg === 'string' &&
        arg.includes('same key')
      )
    );

    expect(duplicateKeyErrors).toHaveLength(0);
  });

  test('should not have react-beautiful-dnd invariant errors', () => {
    // react-beautiful-dndのエラーをシミュレート
    console.error('Invariant failed: isDropDisabled must be a boolean');

    // isDropDisabledエラーを検出
    const dndErrors = consoleErrorSpy.mock.calls.filter(args =>
      args.some(arg =>
        typeof arg === 'string' &&
        (arg.includes('isDropDisabled must be a boolean') ||
         arg.includes('Invariant failed'))
      )
    );

    expect(dndErrors).toHaveLength(0);
  });
});
