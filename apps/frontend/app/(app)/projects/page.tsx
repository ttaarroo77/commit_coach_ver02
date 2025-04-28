'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectFilters } from '@/components/projects/project-filters';
import { ProjectForm } from '@/components/projects/project-form';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { ProjectFormValues, ProjectWithStats } from '@/types/project';
import { AnimatedList, FadeIn } from '@/components/ui/animations';

export default function ProjectsPage() {
  const { 
    projects, 
    isLoading, 
    error, 
    filters, 
    updateFilters, 
    resetFilters, 
    createProject,
    updateProject,
    deleteProject,
    refreshProjects
  } = useProjects();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCreateProject = async (values: ProjectFormValues) => {
    try {
      await createProject(values);
      alert(`プロジェクト「${values.name}」を作成しました`);
    } catch (err) {
      alert('エラーが発生しました: 作成中に問題が発生しました。もう一度お試しください。');
    }
  };

  const handleUpdateProject = async (values: ProjectFormValues) => {
    if (!selectedProject) return;
    
    try {
      await updateProject(selectedProject.id, values);
      alert(`プロジェクト「${values.name}」を更新しました`);
      setIsEditModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      alert('エラーが発生しました: 更新中に問題が発生しました。もう一度お試しください。');
    }
  };

  const handleEditProject = (project: ProjectWithStats) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('このプロジェクトを削除してもよろしいですか？この操作は元に戻せません。')) {
      return;
    }
    
    try {
      await deleteProject(projectId);
      alert('プロジェクトを削除しました');
    } catch (err) {
      alert('エラーが発生しました: 削除中に問題が発生しました。もう一度お試しください。');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProjects();
    setIsRefreshing(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">プロジェクト</h1>
            <p className="text-gray-600 dark:text-gray-400">
              プロジェクトの作成、管理、追跡を行います
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新規プロジェクト
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
        </div>
        
        <ProjectFilters 
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
            <p>エラーが発生しました: {error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">プロジェクトが見つかりません</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || filters.status !== 'all' 
                ? 'フィルター条件に一致するプロジェクトがありません。条件を変更してみてください。'
                : '最初のプロジェクトを作成しましょう！'}
            </p>
            {(filters.search || filters.status !== 'all') && (
              <Button variant="outline" onClick={resetFilters}>
                フィルターをリセット
              </Button>
            )}
          </div>
        ) : (
          <AnimatedList staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </AnimatedList>
        )}
      </FadeIn>
      
      {/* 作成モーダル */}
      <ProjectForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        title="新規プロジェクト作成"
      />
      
      {/* 編集モーダル */}
      {selectedProject && (
        <ProjectForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
          onSubmit={handleUpdateProject}
          initialValues={selectedProject}
          title={`プロジェクト編集: ${selectedProject.name}`}
        />
      )}
    </div>
  );
}
