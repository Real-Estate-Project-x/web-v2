'use client';

import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onRetry?: () => void
  retryText?: string
  showRetry?: boolean
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  description = "Something went wrong. Please try again.",
//   onRetry,
//   retryText = "Try Again",
//   showRetry = false
}: ErrorDialogProps) {
  const handleRetry = () => {
    //onRetry?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-red-900 dark:text-red-100">{title}</DialogTitle>
          <DialogDescription className="text-red-700 dark:text-red-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ok
          </Button>
          {/* {showRetry && (
            <Button onClick={handleRetry} variant="destructive">
              {retryText}
            </Button>
          )} */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}