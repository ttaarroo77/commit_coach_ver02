import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PasswordResetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">パスワードリセット</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          アカウントに登録したメールアドレスを入力してください。
          パスワードリセット用のリンクをお送りします。
        </p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            aria-required="true"
          />
        </div>
        
        <Button type="submit" className="w-full">
          リセットリンクを送信
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <Link 
          href="/login" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ログインページに戻る
        </Link>
      </div>
    </div>
  );
}
