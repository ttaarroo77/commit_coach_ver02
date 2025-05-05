"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, SubTask } from '@/types/task';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string().min(1, '必須項目です'),
  description: z.string().optional(),
  status: z.string(),
  priority: z.string(),
  dueDate: z.string().optional(),
  project: z.string().optional(),
  subtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, '必須項目です'),
      completed: z.boolean(),
    })
  ),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
}

export function TaskFormModal({ isOpen, onClose, onSubmit, onDelete, task }: TaskFormModalProps) {
  const [subtasks, setSubtasks] = useState<SubTask[]>(task?.subtasks || []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate || '',
      project: task?.project || '',
      subtasks: task?.subtasks || [],
    },
  });

  // タスクが変更されたら、フォームの値をリセット
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        project: task.project || '',
        subtasks: task.subtasks,
      });
      setSubtasks(task.subtasks);
    } else {
      reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        project: '',
        subtasks: [],
      });
      setSubtasks([]);
    }
  }, [task, reset]);

  // サブタスクの追加
  const addSubtask = () => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: '',
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setValue('subtasks', [...subtasks, newSubtask]);
  };

  // サブタスクの削除
  const removeSubtask = (id: string) => {
    const updatedSubtasks = subtasks.filter(subtask => subtask.id !== id);
    setSubtasks(updatedSubtasks);
    setValue('subtasks', updatedSubtasks);
  };

  // サブタスクの更新
  const updateSubtask = (id: string, title: string) => {
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, title } : subtask
    );
    setSubtasks(updatedSubtasks);
    setValue('subtasks', updatedSubtasks);
  };

  // サブタスクの完了状態を切り替え
  const toggleSubtaskCompletion = (id: string) => {
    const updatedSubtasks = subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setSubtasks(updatedSubtasks);
    setValue('subtasks', updatedSubtasks);
  };

  // フォーム送信
  const processSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">
            {task ? 'タスクを編集' : '新しいタスク'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(processSubmit)} className="p-4 space-y-4">
          {/* タイトル */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="タスクのタイトル"
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* 説明 */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              説明
            </label>
            <textarea
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="タスクの詳細説明"
              {...register('description')}
            />
          </div>

          {/* ステータスと優先度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                ステータス
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                {...register('status')}
              >
                <option value="todo">未着手</option>
                <option value="in-progress">進行中</option>
                <option value="completed">完了</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                id="priority"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                {...register('priority')}
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>

          {/* 期限日とプロジェクト */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                期限日
              </label>
              <input
                id="dueDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                {...register('dueDate')}
              />
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                プロジェクト
              </label>
              <input
                id="project"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="プロジェクト名"
                {...register('project')}
              />
            </div>
          </div>

          {/* サブタスク */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                サブタスク
              </label>
              <button
                type="button"
                onClick={addSubtask}
                className="flex items-center text-xs text-primary hover:text-primary/80"
              >
                <Plus className="h-3 w-3 mr-1" />
                追加
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              <AnimatePresence>
                {subtasks.map((subtask, index) => (
                  <motion.div
                    key={subtask.id}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtaskCompletion(subtask.id)}
                      className="h-4 w-4 text-primary border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                      className={`flex-1 px-2 py-1 text-sm border rounded ${
                        subtask.completed ? 'line-through text-gray-400' : ''
                      }`}
                      placeholder="サブタスク"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {subtasks.length === 0 && (
                <p className="text-xs text-gray-500 py-2 text-center">
                  サブタスクはありません
                </p>
              )}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-between pt-2 border-t">
            {/* 削除ボタン - 既存タスクの場合のみ表示 */}
            <div>
              {task && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('このタスクを削除してもよろしいですか？')) {
                      onDelete(task.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-sm bg-destructive text-white rounded-md hover:bg-destructive/90 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  削除
                </button>
              )}
            </div>
            
            {/* キャンセル・保存ボタン */}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? '保存中...' : task ? '更新' : '作成'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
