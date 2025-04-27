import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Commit Coach
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            タスク管理と効率的なコミット作成を支援します
          </p>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
