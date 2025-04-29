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
import { Task, TaskStatus, TaskPriority } from './task-list';
import { Badge } from '@/components/ui/badge';

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
  dueDate: z.date({
    required_error: '期限日を選択してください',
    invalid_type_error: '無効な日付です',
  }).optional()
    .refine(date => !date || date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: '期限日は今日以降の日付を選択してください',
    }),
  assigneeId: z.string().optional(),
  tags: z.array(z.string())
    .max(10, { message: 'タグは最大10個まで設定できます' })
    .optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// チームメンバーの型
type TeamMember = {
  id: string;
  name: string;
};

// タグの自動提案用の型を追加
type TagSuggestion = {
  id: string;
  name: string;
  count: number;
};

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  initialData?: Task;
  projectId: string;
  teamMembers?: TeamMember[];
  title?: string;
}

// タグの自動提案用のコンポーネントを追加
function TagSuggestions({
  suggestions,
  onSelect,
  onClose,
}: {
  suggestions: TagSuggestion[];
  onSelect: (tag: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg">
      <div className="p-2">
        {suggestions.length > 0 ? (
          <div className="space-y-1">
            {suggestions.map((tag) => (
              <button
                key={tag.id}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center justify-between"
                onClick={() => onSelect(tag.name)}
              >
                <span>{tag.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tag.count}回使用
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
            候補が見つかりません
          </div>
        )}
      </div>
    </div>
  );
}

// チームメンバーの検索結果表示用コンポーネントを追加
function MemberSearchResults({
  members,
  selectedId,
  onSelect,
  onClose,
}: {
  members: TeamMember[];
  selectedId?: string;
  onSelect: (member: TeamMember) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg">
      <div className="p-2">
        {members.length > 0 ? (
          <div className="space-y-1">
            {members.map((member) => (
              <button
                key={member.id}
                className={`w-full text-left px-2 py-1 rounded-md flex items-center gap-2 ${selectedId === member.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                onClick={() => onSelect(member)}
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {member.name.charAt(0)}
                </div>
                <span>{member.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
            該当するメンバーが見つかりません
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  projectId,
  teamMembers = [],
  title = '新規タスク'
}: TaskFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<TagSuggestion[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);

  // 頻繁に使用されるタグの例（実際のアプリケーションではAPIから取得するか、ローカルストレージに保存するなど）
  const popularTags = [
    'バグ修正', '新機能', '改善', '緊急', 'UI', 'バックエンド', 'フロントエンド',
    'ドキュメント', 'リファクタリング', 'テスト', 'デプロイ', 'レビュー待ち'
  ];

  const defaultValues: Partial<TaskFormValues> = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
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

  // タグの自動提案を取得する関数
  const fetchTagSuggestions = async (query: string) => {
    if (query.trim() === '') {
      setTagSuggestions([]);
      return;
    }

    // 実際のアプリケーションではAPIから取得する
    const mockSuggestions: TagSuggestion[] = [
      { id: '1', name: 'フロントエンド', count: 15 },
      { id: '2', name: 'バックエンド', count: 12 },
      { id: '3', name: 'デザイン', count: 8 },
      { id: '4', name: 'テスト', count: 6 },
      { id: '5', name: 'ドキュメント', count: 4 },
    ];

    const filtered = mockSuggestions.filter(
      (tag) =>
        tag.name.toLowerCase().includes(query.toLowerCase()) &&
        !selectedTags.includes(tag.name)
    );

    setTagSuggestions(filtered);
  };

  // タグ入力の変更を処理
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    fetchTagSuggestions(value);
    setShowTagSuggestions(true);
  };

  // タグの選択を処理
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  // タグの削除を処理
  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // タグ入力フィールドのフォーカスを失った時の処理
  const handleTagInputBlur = () => {
    setTimeout(() => {
      setShowTagSuggestions(false);
    }, 200);
  };

  const getStatusText = (status: TaskStatus) => {
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

  const getPriorityText = (priority: TaskPriority) => {
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

  // 担当者検索の処理
  const handleMemberSearch = (query: string) => {
    setMemberSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMembers([]);
      setShowMemberSearch(false);
      return;
    }

    const filtered = teamMembers.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMembers(filtered);
    setShowMemberSearch(true);
  };

  // 担当者の選択を処理
  const handleMemberSelect = (member: TeamMember) => {
    form.setValue('assigneeId', member.id);
    setMemberSearchQuery(member.name);
    setShowMemberSearch(false);
  };

  // 担当者の選択をクリア
  const handleMemberClear = () => {
    form.setValue('assigneeId', '');
    setMemberSearchQuery('');
    setShowMemberSearch(false);
  };

  const getSelectedMemberName = () => {
    const selectedId = form.getValues('assigneeId');
    const selectedMember = teamMembers.find(member => member.id === selectedId);
    return selectedMember ? selectedMember.name : '';
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
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="担当者を検索..."
                            value={memberSearchQuery}
                            onChange={(e) => handleMemberSearch(e.target.value)}
                            onFocus={() => {
                              if (memberSearchQuery.trim()) {
                                setShowMemberSearch(true);
                              }
                            }}
                            onBlur={() => {
                              setTimeout(() => setShowMemberSearch(false), 200);
                            }}
                          />
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={handleMemberClear}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {showMemberSearch && (
                          <MemberSearchResults
                            members={filteredMembers}
                            selectedId={field.value}
                            onSelect={handleMemberSelect}
                            onClose={() => setShowMemberSearch(false)}
                          />
                        )}
                      </div>
                      <FormDescription>
                        タスクの担当者を検索して選択してください
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
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="タグを入力..."
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onBlur={handleTagInputBlur}
                      onFocus={() => setShowTagSuggestions(true)}
                    />
                    {showTagSuggestions && (
                      <TagSuggestions
                        suggestions={tagSuggestions}
                        onSelect={handleTagSelect}
                        onClose={() => setShowTagSuggestions(false)}
                      />
                    )}
                  </div>
                  <FormDescription>
                    タグを入力してEnterキーを押すか、候補から選択してください
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