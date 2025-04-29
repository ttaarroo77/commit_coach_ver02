import { Suspense } from "react"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectBoard } from "@/components/projects/project-board"
import { ProjectSidebar } from "@/components/projects/project-sidebar"
import { ProjectMetrics } from "@/components/projects/project-metrics"
import { ProjectSkeleton } from "@/components/projects/project-skeleton"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* サイドバー */}
      <ProjectSidebar projectId={params.id} />

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ProjectSkeleton />}>
          {/* プロジェクトヘッダー */}
          <ProjectHeader projectId={params.id} />

          <div className="flex gap-4 p-4">
            {/* プロジェクトボード */}
            <div className="flex-1">
              <ProjectBoard projectId={params.id} />
            </div>

            {/* プロジェクトメトリクス */}
            <div className="w-80">
              <ProjectMetrics projectId={params.id} />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
} 