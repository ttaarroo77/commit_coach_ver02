'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from './task-group';

interface DragContextType {
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  sourceGroupId: string | null;
  setSourceGroupId: (groupId: string | null) => void;
}

const DragContext = createContext<DragContextType | undefined>(undefined);

export function useDragContext() {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDragContext must be used within a DragProvider');
  }
  return context;
}

interface DragProviderProps {
  children: ReactNode;
}

export function DragProvider({ children }: DragProviderProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [sourceGroupId, setSourceGroupId] = useState<string | null>(null);

  const value = {
    activeTask,
    setActiveTask,
    sourceGroupId,
    setSourceGroupId
  };

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  );
}
