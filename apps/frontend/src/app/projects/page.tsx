"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import useProjects from "@/hooks/useProjects"
import Link from "next/link"
import { ProjectForm } from "./ProjectForm"

export default function ProjectsPage() {
   const { projects, loading, error, createProject, deleteProject } = useProjects()
   const [newName, setNewName] = useState("")
   const [newDesc, setNewDesc] = useState("")
   const [addLoading, setAddLoading] = useState(false)
   const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
   const [localError, setLocalError] = useState<string | null>(null)

   const handleAdd = async () => {
      if (!newName.trim()) {
         alert('プロジェクト名を入力してください。')
         return
      }
      setAddLoading(true)
      setLocalError(null)
      try {
         await createProject({ name: newName, description: newDesc })
         setNewName("")
         setNewDesc("")
      } catch (error) {
         console.error("Error creating project:", error)
         setLocalError("プロジェクトの作成に失敗しました。もう一度お試しください。")
      } finally {
         setAddLoading(false)
      }
   }

   const handleDelete = async (id: string) => {
      setDeleteLoadingId(id)
      setLocalError(null)
      try {
         await deleteProject(id)
      } catch (error) {
         console.error("Error deleting project:", error)
         setLocalError("プロジェクトの削除に失敗しました。もう一度お試しください。")
      } finally {
         setDeleteLoadingId(null)
      }
   }

   return (
      <div className="p-6 max-w-xl mx-auto">
         <h1 className="text-2xl font-bold mb-4">プロジェクト一覧</h1>
         <ProjectForm
            onAdd={handleAdd}
            loading={addLoading}
            newName={newName}
            setNewName={setNewName}
            newDesc={newDesc}
            setNewDesc={setNewDesc}
         />
         {(error || localError) && <div className="text-red-500 mb-2">{error?.message || localError}</div>}
         <ul className="space-y-2">
            {projects.map(project => (
               <li key={project.id} className="flex items-center justify-between border rounded px-3 py-2">
                  <div>
                     <Link href={`/projects/${project.id}`} className="font-semibold hover:underline">
                        {project.name}
                     </Link>
                     <div className="text-sm text-gray-500">{project.description}</div>
                  </div>
                  <Button
                     variant="destructive"
                     size="sm"
                     onClick={() => handleDelete(project.id)}
                     disabled={!!deleteLoadingId || addLoading}
                     aria-label={`プロジェクト「${project.name}」を削除`}
                  >
                     {deleteLoadingId === project.id ? '削除中...' : '削除'}
                  </Button>
               </li>
            ))}
         </ul>
      </div>
   )
} 