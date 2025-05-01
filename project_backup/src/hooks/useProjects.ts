import { useState, useEffect } from 'react';
import { Project } from '@/types';

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  createProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createProject = async (project: Partial<Project>) => {
    // 実装は後で追加
  };

  const updateProject = async (id: string, project: Partial<Project>) => {
    // 実装は後で追加
  };

  const deleteProject = async (id: string) => {
    // 実装は後で追加
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}

export default useProjects;