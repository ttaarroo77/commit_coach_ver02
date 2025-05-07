import { Button } from "@/components/ui/button"

interface ProjectFormProps {
   onAdd: () => void
   loading: boolean
   newName: string
   setNewName: (v: string) => void
   newDesc: string
   setNewDesc: (v: string) => void
}

export const ProjectForm = ({ onAdd, loading, newName, setNewName, newDesc, setNewDesc }: ProjectFormProps) => (
   <div className="mb-6 flex flex-col sm:flex-row gap-2">
      <input
         className="border rounded px-2 py-1 flex-1"
         placeholder="プロジェクト名"
         value={newName}
         onChange={e => setNewName(e.target.value)}
         aria-label="プロジェクト名"
      />
      <input
         className="border rounded px-2 py-1 flex-1"
         placeholder="説明 (任意)"
         value={newDesc}
         onChange={e => setNewDesc(e.target.value)}
         aria-label="プロジェクト説明"
      />
      <Button onClick={onAdd} disabled={loading || !newName.trim()} aria-label="プロジェクトを追加">
         {loading ? '読み込み中...' : '追加'}
      </Button>
   </div>
) 