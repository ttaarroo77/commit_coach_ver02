import Link from 'next/link';
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Commit Coach</h1>
        <p className="text-gray-600 dark:text-gray-400">タスク管理と効率的なコミット作成を支援します</p>
        <div className="flex gap-4 mt-4">
          <Button asChild>
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">新規登録</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
