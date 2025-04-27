import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">アカウント登録</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          必要情報を入力して新規アカウントを作成してください
        </p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            type="text"
            placeholder="山田 太郎"
            required
            aria-required="true"
          />
        </div>
        
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
        
        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            required
            aria-required="true"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            8文字以上、大文字・小文字・数字を含める必要があります
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">パスワード（確認）</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            aria-required="true"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <Label 
            htmlFor="terms" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <span>
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                利用規約
              </Link>
              と
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                プライバシーポリシー
              </Link>
              に同意します
            </span>
          </Label>
        </div>
        
        <Button type="submit" className="w-full">
          アカウント作成
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          すでにアカウントをお持ちの場合は{' '}
        </span>
        <Link 
          href="/login" 
          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ログイン
        </Link>
      </div>
    </div>
  );
}
