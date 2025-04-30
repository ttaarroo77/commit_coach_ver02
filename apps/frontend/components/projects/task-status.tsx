import { useState } from 'react'
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, CheckCircle, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskStatusProps {
  dueDate: string | null
  completed: boolean
  onUpdateDueDate: (date: string | null) => void
  onUpdateStatus: (completed: boolean) => void
}

export function TaskStatus({
  dueDate,
  completed,
  onUpdateDueDate,
  onUpdateStatus,
}: TaskStatusProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const getStatusInfo = () => {
    if (completed) {
      return { label: '完了', variant: 'default' as const }
    }

    if (!dueDate) {
      return { label: '未設定', variant: 'secondary' as const }
    }

    const dueDateObj = parseISO(dueDate)
    const today = new Date()
    const tomorrow = addDays(today, 1)

    if (isBefore(dueDateObj, today)) {
      return { label: '期限超過', variant: 'destructive' as const }
    }

    if (isBefore(dueDateObj, tomorrow)) {
      return { label: '期限間近', variant: 'warning' as const }
    }

    return { label: '期限内', variant: 'default' as const }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setIsCalendarOpen(false)
    if (date) {
      onUpdateDueDate(date.toISOString())
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="flex items-center gap-2">
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal',
              !dueDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? (
              format(parseISO(dueDate), 'yyyy年M月d日', { locale: ja })
            ) : (
              '期限を設定'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dueDate ? parseISO(dueDate) : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>

      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={() => onUpdateStatus(!completed)}
        aria-label="タスクの完了状態"
      >
        {completed ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </Button>
    </div>
  )
}