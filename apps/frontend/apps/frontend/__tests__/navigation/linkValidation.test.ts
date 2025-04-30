import { getAllLinks } from '@/lib/utils/linkValidation';

describe('Navigation Link Validation', () => {
  beforeEach(() => {
    // テスト前にDOMをクリア
    document.body.innerHTML = '';
  });

  describe('Dashboard Links', () => {
    it('should have valid links in dashboard', async () => {
      // ダッシュボードのリンクを追加
      document.body.innerHTML = `
        <div>
          <a href="/dashboard">ダッシュボード</a>
          <a href="/projects">プロジェクト一覧</a>
          <a href="/settings">設定</a>
        </div>
      `;

      const links = getAllLinks();
      const dashboardLinks = links.filter(link => link.href.startsWith('/dashboard'));

      for (const link of dashboardLinks) {
        const response = await fetch(link.href, { method: 'HEAD' });
        expect(response.ok).toBe(true);
      }
    });
  });

  describe('Project Links', () => {
    it('should have valid links in project pages', async () => {
      // プロジェクトのリンクを追加
      document.body.innerHTML = `
        <div>
          <a href="/projects/1">プロジェクト1</a>
          <a href="/projects/2">プロジェクト2</a>
          <a href="/projects/3">プロジェクト3</a>
        </div>
      `;

      const links = getAllLinks();
      const projectLinks = links.filter(link => link.href.startsWith('/projects'));

      for (const link of projectLinks) {
        const response = await fetch(link.href, { method: 'HEAD' });
        expect(response.ok).toBe(true);
      }
    });
  });
}); 