/**
 * @example
 * このファイルはPlaywrightがインストールされた後に使用するためのハイドレーションテスト例です。
 * 実際の使用前にPlaywrightをインストールし、設定ファイルを作成してください。
 *
 * インストール手順:
 * npm init playwright@latest
 */

// @ts-check

/**
 * ハイドレーションエラーを検出するためのテスト
 * 特にブラウザ拡張機能による属性の追加を検証
 */
test('body should not have extension attributes', async ({ page }) => {
  // アプリケーションのルートページに移動
  await page.goto('/');

  // bodyタグに不正な拡張機能属性が無いことを確認
  const hasColorZillaAttribute = await page.evaluate(() => {
    return document.body.hasAttribute('cz-shortcut-listen');
  });

  expect(hasColorZillaAttribute).toBe(false);

  // カスタムデータ属性のチェック
  const hasCustomDataAttribute = await page.evaluate(() => {
    return document.body.hasAttribute('data-redeviation-bs-uid');
  });

  expect(hasCustomDataAttribute).toBe(false);

  // 拡張機能安全ルート要素が存在することを確認
  const extensionSafeRoot = await page.locator('#__extension_safe_root').count();
  expect(extensionSafeRoot).toBe(1);
});

/**
 * ハイドレーション後のHTMLコンテンツが期待通りか確認するテスト
 */
test('hydration should complete successfully', async ({ page }) => {
  // アプリのダッシュボードページに移動（認証が必要な場合は事前にログイン処理を追加）
  await page.goto('/dashboard');

  // ハイドレーションエラーがコンソールに出力されていないことを確認
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('Hydration')) {
      consoleMessages.push(msg.text());
    }
  });

  // ページ操作（例：ボタンクリックなど）を行い、ハイドレーションが完了していることを確認
  await page.click('button:has-text("タスクを追加")');

  // ハイドレーションエラーメッセージがないことを検証
  expect(consoleMessages.length).toBe(0);
});
