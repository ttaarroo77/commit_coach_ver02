import { Skeleton } from "@/components/ui/skeleton"

export function ProjectSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* ヘッダースケルトン */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex gap-4">
        {/* ボードスケルトン */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-full" />
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* メトリクススケルトン */}
        <div className="w-80 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    </div>
  )
} 