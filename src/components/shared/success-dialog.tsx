'use client';
import { CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  onConfirm?: () => void
  confirmText?: string
}

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Success!",
  description = "Your action was completed successfully.",
  onConfirm,
  confirmText = "Continue"
}: SuccessDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-green-900 dark:text-green-100">{title}</DialogTitle>
          <DialogDescription className="text-green-700 dark:text-green-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center">
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}