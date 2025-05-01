'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskForm } from './task-form';

interface AddTaskButtonProps {
  groupId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onAddTask: (groupId: string, taskData: any) => void;
}

export function AddTaskButton({ 
  groupId, 
  variant = 'default', 
  size = 'default',
  onAddTask 
}: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (values: any) => {
    onAddTask(groupId, values);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setOpen(true)}
        className="flex items-center"
      >
        <Plus className="h-4 w-4 mr-1" />
        タスク追加
      </Button>

      <TaskForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        isEditing={false}
      />
    </>
  );
}
