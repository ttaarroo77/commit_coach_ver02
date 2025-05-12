"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Project } from "@/types/project"
import { ProjectList } from "@/components/projects/project-list"

export default function ProjectsPage() {
   const [projects, setProjects] = useState<Project[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<Error | null>(null)

   const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            const { data, error } = await supabase
               .from('projects')
               .select('*')
               .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
         } catch (err) {
            setError(err as Error)
         } finally {
            setLoading(false)
         }
      }

      fetchProjects()
   }, [])

   if (loading) {
      return <div className="container mx-auto py-8">読み込み中...</div>
   }

   if (error) {
      return <div className="container mx-auto py-8">エラーが発生しました: {error.message}</div>
   }

   return (
      <div className="container mx-auto py-8">
         <ProjectList projects={projects} />
      </div>
   )
}
