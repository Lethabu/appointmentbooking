"use client"

import * as React from "react"

export type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  action?: React.ReactNode
}

type ToastState = Toast[]

export type UseToast = {
  toasts: ToastState
  toast: (message: Toast) => void
  dismiss: (toastId?: string) => void
}

const ACTION_TOAST_OFFSET = 335

export function useToast(): UseToast {
  const [toasts, setToasts] = React.useState<ToastState>([])

  const toast = React.useCallback(
    (toast: Toast) => {
      const id = Math.random().toString()

      setToasts((prev) => [...prev, { ...toast, id }])

      // Auto remove toast
      setTimeout(() => {
        dismiss(id)
      }, 5000)
    },
    []
  )

  const dismiss = React.useCallback((toastId?: string) => {
    setToasts((prev) => prev.filter((t) => !(t.id === toastId || toastId === undefined)))
  }, [])

  return { toasts, toast, dismiss }
}