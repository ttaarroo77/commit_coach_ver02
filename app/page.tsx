import Link from 'next/link';
import { Button } from "../components/ui/button"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-4xl font-bold">Commit Coach</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">タスク管理と効率的なコミット作成を支援するAIツール</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
          Commit Coachはタスク管理からコミットメッセージ作成まで、開発ワークフローを効率化します。
          AIが適切なコミットメッセージを提案し、プロジェクト管理をサポートします。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg">
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">新規登録</Link>
          </Button>
        </div>
        <div className="mt-4">
          <Button asChild variant="link">
            <Link href="/dashboard">ダッシュボードへ</Link>
          </Button>
          <p className="text-xs text-gray-500 mt-2">※ログインが必要です</p>
        </div>
      </div>
    </div>
  )
}
