"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ErrorMessageProps {
  title?: string;
  message: string | null;
  className?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  dismissible?: boolean;
  autoHideDuration?: number;
}

export function ErrorMessage({
  title,
  message,
  className,
  variant = "destructive",
  icon = <AlertCircle className="h-4 w-4" />,
  dismissible = false,
  autoHideDuration = 0,
}: ErrorMessageProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);

    if (message && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [message, autoHideDuration]);

  if (!message || !visible) return null;

  return (
    <Alert
      variant={variant}
      className={cn("relative", dismissible && "pr-8", className)}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
      {dismissible && (
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-background/20"
          onClick={() => setVisible(false)}
          aria-label="閉じる"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
}

interface FormErrorProps {
  error?: string | null;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className={cn("text-sm font-medium text-destructive mt-2", className)}>
      {error}
    </div>
  );
}
