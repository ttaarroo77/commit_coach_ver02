'use client';

import { useState, useEffect } from 'react';
import { ProjectList, Project } from '@/components/projects/project-list';
import { ProjectForm } from '@/components/projects/project-form';
import { ProjectDetail } from '@/components/projects/project-detail';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

// モックデータ
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ウェブアプリの開発',
    description: 'Next.jsとSupabaseを使用したモダンなウェブアプリケーションの開発プロジェクト。認証機能、データベース連携、リアルタイム更新機能などを実装する。',
    status: 'active',
    progress: 35,
    members: 5,
    tasks: 24,
    dueDate: '2025-06-15',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-04-25T14:30:00Z',
    tags: ['Next.js', 'Supabase', 'React'],
    isFavorite: true
  },
  {
    id: '2',
    name: 'モバイルアプリのリデザイン',
    description: '既存のモバイルアプリケーションのUIとUXの刷新。最新のデザイントレンドを取り入れ、使いやすさを向上させる。',
    status: 'active',
    progress: 60,
    members: 3,
    tasks: 18,
    dueDate: '2025-05-20',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-04-20T11:45:00Z',
    tags: ['UI/UX', 'React Native', 'モバイル'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'APIサーバーの構築',
    description: 'RESTful APIを提供するバックエンドサーバーの構築。Node.jsとExpressを使用し、データベースへの接続とクエリ処理、認証、キャッシュなどを実装する。',
    status: 'active',
    progress: 80,
    members: 2,
    tasks: 15,
    dueDate: '2025-05-05',
    createdAt: '2025-03-01T08:30:00Z',
    updatedAt: '2025-04-28T09:15:00Z',
    tags: ['Node.js', 'Express', 'API'],
    isFavorite: false
  },
  {
    id: '4',
    name: 'データ分析ダッシュボード',
    description: 'ユーザー行動や売上データを分析・可視化するためのダッシュボードの開発。グラフやチャートを用いてデータを効果的に表示する。',
    status: 'completed',
    progress: 100,
    members: 4,
    tasks: 20,
    dueDate: '2025-04-10',
    createdAt: '2025-02-20T14:00:00Z',
    updatedAt: '2025-04-10T16:20:00Z',
    tags: ['データ分析', 'ダッシュボード', 'D3.js'],
    isFavorite: true
  },
  {
    id: '5',
    name: 'レガシーシステムの移行',
    description: '古いPHPベースのシステムを最新のReactとLaravelを使用したシステムに移行するプロジェクト。',
    status: 'archived',
    progress: 100,
    members: 6,
    tasks: 40,
    dueDate: '2025-03-30',
    createdAt: '2024-12-05T11:00:00Z',
    updatedAt: '2025-03-30T15:45:00Z',
    tags: ['移行', 'レガシー', 'モダナイゼーション'],
    isFavorite: false
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    filterProjects();
  }, [searchQuery, statusFilter, projects]);

  const filterProjects = () => {
    let filtered = [...projects];

    // 検索クエリによるフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // ステータスによるフィルタリング
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  };

  const handleCreateProject = (values: any) => {
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      name: values.name,
      description: values.description,
      status: values.status,
      progress: 0,
      members: 1,
      tasks: 0,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: values.tags || [],
      isFavorite: false
    };

    setProjects([newProject, ...projects]);
    setShowProjectForm(false);
  };

  const handleEditProject = (values: any) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          name: values.name,
          description: values.description,
          status: values.status,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
          tags: values.tags || [],
          updatedAt: new Date().toISOString()
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setSelectedProject(null);
    setShowProjectForm(false);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('このプロジェクトを削除してもよろしいですか？')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
    }
  };

  const handleToggleFavorite = (projectId: string, isFavorite: boolean) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          isFavorite
        };
      }
      return project;
    });

    setProjects(updatedProjects);

    // 詳細表示中の場合は選択中のプロジェクトも更新
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        isFavorite
      });
    }
  };

  const handleViewProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setCurrentView('detail');
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setCurrentView('list');
  };

  const handleEditSelectedProject = () => {
    setShowProjectForm(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-0">
      {currentView === 'list' ? (
        <FadeIn>
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">プロジェクト</h1>
            <p className="text-gray-500 dark:text-gray-400">
              プロジェクトを管理して、開発を効率化しましょう
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  placeholder="プロジェクトを検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="すべてのステータス" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのステータス</SelectItem>
                    <SelectItem value="active">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                    <SelectItem value="archived">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setShowProjectForm(true)}
                className="flex-shrink-0 flex items-center gap-1"
              >
                <Plus size={16} />
                <span>新規作成</span>
              </Button>
            </div>
          </div>

          <ProjectList
            projects={filteredProjects}
            onEdit={(project) => {
              setSelectedProject(project);
              setShowProjectForm(true);
            }}
            onDelete={handleDeleteProject}
            onView={handleViewProject}
            onFavorite={handleToggleFavorite}
            onCreate={() => setShowProjectForm(true)}
          />
        </FadeIn>
      ) : (
        selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onEdit={handleEditSelectedProject}
            onBack={handleBackToList}
            onFavorite={(isFavorite) => handleToggleFavorite(selectedProject.id, isFavorite)}
          />
        )
      )}

      {showProjectForm && (
        <ProjectForm
          isOpen={showProjectForm}
          onClose={() => {
            setShowProjectForm(false);
            if (currentView === 'list') {
              setSelectedProject(null);
            }
          }}
          onSubmit={selectedProject ? handleEditProject : handleCreateProject}
          initialData={selectedProject || undefined}
          title={selectedProject ? 'プロジェクトを編集' : '新規プロジェクト'}
        />
      )}
    </div>
  );
}
