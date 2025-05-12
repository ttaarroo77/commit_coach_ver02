"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const formSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

type FormValues = z.infer<typeof formSchema>;

export function PasswordResetForm() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(values.email);
      setIsSubmitted(true);
      toast.success('パスワードリセットのメールを送信しました');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error?.message || 'パスワードリセットに失敗しました。もう一度お試しください。');
      toast.error('パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>パスワードリセット</CardTitle>
        <CardDescription>
          登録したメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted && <ErrorMessage message={error || null} dismissible />}
        {isSubmitted ? (
          <div className="text-center py-4">
            <p className="mb-4">
              パスワードリセット用のメールを送信しました。メールに記載されたリンクからパスワードを再設定してください。
            </p>
            <p className="text-sm text-muted-foreground">
              メールが届かない場合は、迷惑メールフォルダをご確認いただくか、再度お試しください。
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    送信中...
                  </>
                ) : (
                  'リセットリンクを送信'
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="text-primary hover:underline">
            ログインページに戻る
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
