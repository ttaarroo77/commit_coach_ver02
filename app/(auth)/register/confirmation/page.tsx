'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterConfirmationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">登録確認メールを送信しました</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ご登録いただいたメールアドレスに確認メールを送信しました。
          メール内のリンクをクリックして、アカウント登録を完了してください。
        </p>
      </div>
      
      <div className="p-4 rounded-md bg-blue-50 text-blue-700 text-sm">
        <div className="flex items-start">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 mt-0.5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <p className="font-medium">注意事項</p>
            <ul className="mt-1 ml-5 list-disc text-sm">
              <li>確認メールが届かない場合は、迷惑メールフォルダをご確認ください</li>
              <li>メールの有効期限は24時間です</li>
              <li>登録に問題がある場合は、サポートまでお問い合わせください</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <Button asChild variant="outline">
          <Link href="/login">ログインページに戻る</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
