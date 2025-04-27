import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">ログイン</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          アカウント情報を入力してログインしてください
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
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">パスワード</Label>
            <Link 
              href="/password/reset" 
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              パスワードを忘れた場合
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label 
            htmlFor="remember" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ログイン状態を保持する
          </Label>
        </div>
        
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          アカウントをお持ちでない場合は{' '}
        </span>
        <Link 
          href="/register" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          登録
        </Link>
      </div>
    </div>
  );
}
