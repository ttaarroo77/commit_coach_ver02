import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">ページが見つかりません</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
