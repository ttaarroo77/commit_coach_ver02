'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProjectFormValues, ProjectStatus, Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FadeIn } from '@/components/ui/animations';

// バリデーションスキーマ
const projectFormSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内にしてください'),
  description: z.string().max(500, '説明は500文字以内にしてください').optional(),
  status: z.enum(['active', 'completed', 'archived'])
});

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  initialValues?: Partial<Project>;
  title?: string;
}

export function ProjectForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialValues = { name: '', description: '', status: 'active' as ProjectStatus }, 
  title = 'プロジェクトを作成'
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
      status: initialValues.status || 'active'
    }
  });

  const handleSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error('プロジェクトの保存中にエラーが発生しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <FadeIn>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              プロジェクトの詳細を入力してください。作成後はタスクを追加できます。
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクト名</FormLabel>
                    <FormControl>
                      <Input placeholder="プロジェクト名を入力" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="プロジェクトの説明を入力" 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      プロジェクトの目的や目標を簡潔に記述してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">進行中</SelectItem>
                        <SelectItem value="completed">完了</SelectItem>
                        <SelectItem value="archived">アーカイブ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '保存中...' : '保存'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </FadeIn>
      </DialogContent>
    </Dialog>
  );
}
