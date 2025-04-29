'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string()
    .min(1, { message: 'タイトルは必須項目です' })
    .max(100, { message: 'タイトルは100文字以内で入力してください' }),
  description: z.string()
    .max(500, { message: '説明は500文字以内で入力してください' })
    .optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done'], {
    required_error: 'ステータスを選択してください',
    invalid_type_error: '無効なステータスです',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: '優先度を選択してください',
    invalid_type_error: '無効な優先度です',
  }),
  projectId: z.string({
    required_error: 'プロジェクトを選択してください',
    invalid_type_error: '無効なプロジェクトです',
  }),
  dueDate: z.date({
    required_error: '期限日を選択してください',
    invalid_type_error: '無効な日付です',
  }).optional()
    .refine(date => !date || date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: '期限日は今日以降の日付を選択してください',
    }),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// プロジェクトの型
type Project = {
  id: string;
  name: string;
};

// チームメンバーの型
type TeamMember = {
  id: string;
  name: string;
};

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  initialData?: Partial<TaskFormValues>;
  projects?: Project[];
  teamMembers?: TeamMember[];
  title?: string;
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  projects = [],
  teamMembers = [],
  title = '新規タスク'
}: TaskFormProps) {
  const [tagInput, setTagInput] = useState('');

  const defaultValues: Partial<TaskFormValues> = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    projectId: initialData?.projectId || '',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    assigneeId: initialData?.assigneeId || undefined,
    tags: initialData?.tags || [],
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: 'onChange', // フォーム入力時にバリデーションを実行
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values);
    form.reset();
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;

    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo':
        return '未着手';
      case 'in-progress':
        return '進行中';
      case 'review':
        return 'レビュー中';
      case 'done':
        return '完了';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      default:
        return priority;
    }
  };

  // 日付の表示形式をカスタマイズ
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `今日 (${format(date, 'MM月dd日', { locale: ja })})`;
    }
    return format(date, 'yyyy年MM月dd日 (EEE)', { locale: ja });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            タスク情報を入力してください。<span className="text-destructive">*</span> は必須項目です。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><span className="text-destructive">*</span> タスク名</FormLabel>
                  <FormControl>
                    <Input placeholder="タスク名を入力" {...field} />
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
                      placeholder="タスクの説明を入力"
                      rows={3}
                      className="resize-y min-h-[80px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    タスクの詳細な説明や注意点を記入してください
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {projects.length > 0 && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><span className="text-destructive">*</span> プロジェクト</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="プロジェクトを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      このタスクを関連付けるプロジェクトを選択してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><span className="text-destructive">*</span> ステータス</FormLabel>
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
                        <SelectItem value="todo">{getStatusText('todo')}</SelectItem>
                        <SelectItem value="in-progress">{getStatusText('in-progress')}</SelectItem>
                        <SelectItem value="review">{getStatusText('review')}</SelectItem>
                        <SelectItem value="done">{getStatusText('done')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><span className="text-destructive">*</span> 優先度</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{getPriorityText('low')}</SelectItem>
                        <SelectItem value="medium">{getPriorityText('medium')}</SelectItem>
                        <SelectItem value="high">{getPriorityText('high')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>期限日</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>日付を選択</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={ja}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          weekStartsOn={1} // 月曜始まり
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      タスクの完了期限を設定してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {teamMembers.length > 0 && (
                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>担当者</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="担当者を選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">未割り当て</SelectItem>
                          {teamMembers.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        このタスクを担当するメンバーを選択してください
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タグ</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value?.map((tag) => (
                      <div
                        key={tag}
                        className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-primary hover:text-primary/80"
                          aria-label={`${tag}タグを削除`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(field.value?.length || 0) === 0 && (
                      <div className="text-muted-foreground text-sm">タグがありません</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="タグを入力"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddTag}
                      aria-label="タグを追加"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <FormDescription>
                    Enter キーまたは追加ボタンでタグを追加できます
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}