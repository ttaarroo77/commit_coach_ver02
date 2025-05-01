import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type TaskStatus = 'all' | 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'all' | 'low' | 'medium' | 'high'

interface TaskFiltersProps {
  onFilterChange: (filters: {
    search: string
    status: TaskStatus
    priority: TaskPriority
  }) => void
}

const statusOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'todo', label: '未着手' },
  { value: 'in-progress', label: '進行中' },
  { value: 'done', label: '完了' },
] as const

const priorityOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
] as const

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TaskStatus>('all')
  const [priority, setPriority] = useState<TaskPriority>('all')
  const [openStatus, setOpenStatus] = useState(false)
  const [openPriority, setOpenPriority] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, status, priority })
  }

  const handleStatusChange = (value: TaskStatus) => {
    setStatus(value)
    setOpenStatus(false)
    onFilterChange({ search, status: value, priority })
  }

  const handlePriorityChange = (value: TaskPriority) => {
    setPriority(value)
    setOpenPriority(false)
    onFilterChange({ search, status, priority: value })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 mb-6">
      <div className="flex-1">
        <Input
          placeholder="タスクを検索..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Popover open={openStatus} onOpenChange={setOpenStatus}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStatus}
              className="min-w-[140px] justify-between"
            >
              {statusOptions.find((option) => option.value === status)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-0">
            <Command>
              <CommandInput placeholder="ステータスを検索..." />
              <CommandEmpty>見つかりません</CommandEmpty>
              <CommandGroup>
                {statusOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleStatusChange(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        status === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openPriority} onOpenChange={setOpenPriority}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openPriority}
              className="min-w-[140px] justify-between"
            >
              {priorityOptions.find((option) => option.value === priority)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-0">
            <Command>
              <CommandInput placeholder="優先度を検索..." />
              <CommandEmpty>見つかりません</CommandEmpty>
              <CommandGroup>
                {priorityOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handlePriorityChange(option.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        priority === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        {status !== 'all' && (
          <Badge variant="secondary" className="h-8">
            {statusOptions.find((option) => option.value === status)?.label}
          </Badge>
        )}
        {priority !== 'all' && (
          <Badge variant="secondary" className="h-8">
            優先度: {priorityOptions.find((option) => option.value === priority)?.label}
          </Badge>
        )}
      </div>
    </div>
  )
}