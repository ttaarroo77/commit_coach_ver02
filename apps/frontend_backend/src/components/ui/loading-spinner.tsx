import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn(`animate-spin ${sizeMap[size]}`, className)} />
  );
}

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = 'ロード中...', className }: LoadingOverlayProps) {
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50", className)}>
      <LoadingSpinner size="lg" className="text-primary" />
      <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingButton({ loading, loadingText = 'ロード中...', children, className }: LoadingButtonProps) {
  return (
    <div className={cn("relative", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
        </div>
      )}
      <div className={cn(loading ? "opacity-0" : "opacity-100")}>
        {loading ? loadingText : children}
      </div>
    </div>
  );
}
