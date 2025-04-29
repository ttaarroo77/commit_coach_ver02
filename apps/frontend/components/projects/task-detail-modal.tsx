import { SubtaskList } from "./subtask-list"

<div>
  <h3 className="font-medium mb-2">サブタスク</h3>
  <SubtaskList
    subtasks={task.subtasks || []}
    onUpdate={(updatedSubtasks) => {
      onUpdate(task.id, { subtasks: updatedSubtasks })
    }}
    onAdd={(title) => {
      const newSubtask = {
        id: `new-${Date.now()}`,
        title,
        completed: false
      }
      onUpdate(task.id, {
        subtasks: [...(task.subtasks || []), newSubtask]
      })
    }}
  />
</div> 