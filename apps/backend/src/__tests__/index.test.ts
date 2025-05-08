import { App } from '../app';
import { config } from '@commit-coach/config';

jest.mock('../app');

describe('Server', () => {
  let mockListen: jest.SpyInstance;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    mockListen = jest.spyOn(App.prototype, 'listen');
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('サーバーが正しいポート番号で起動すること', () => {
    const port = config.port || 3000;
    require('../index');

    expect(App).toHaveBeenCalledWith(port);
    expect(mockListen).toHaveBeenCalled();
  });

  it('環境変数のポート番号が未設定の場合、デフォルトポートを使用すること', () => {
    const originalPort = config.port;
    config.port = undefined;

    require('../index');

    expect(App).toHaveBeenCalledWith(3000);

    config.port = originalPort;
  });

  it('サーバー起動時にログが出力されること', () => {
    require('../index');

    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('サーバーが起動しました')
    );
  });
});
