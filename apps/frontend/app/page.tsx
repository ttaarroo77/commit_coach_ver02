import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Commit Coach</h1>
      <p className="text-xl mb-8 text-center">
        AIを活用したプロジェクト管理ツールで、<br />
        より効率的な開発を実現しましょう。
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/signin"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          ログイン
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        >
          新規登録
        </Link>
      </div>
    </div>
  );
}
