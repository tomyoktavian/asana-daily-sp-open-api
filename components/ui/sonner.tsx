"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg",
          description: "group-[.toast]:opacity-90",
          actionButton: "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground",
          cancelButton: "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground",
          success: "group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-800 group-[.toaster]:!border-green-300 dark:group-[.toaster]:!bg-green-900 dark:group-[.toaster]:!text-green-400 dark:group-[.toaster]:!border-green-800",
          error: "group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-800 group-[.toaster]:!border-red-300 dark:group-[.toaster]:!bg-red-900 dark:group-[.toaster]:!text-red-400 dark:group-[.toaster]:!border-red-800",
          warning: "group-[.toaster]:!bg-yellow-50 group-[.toaster]:!text-yellow-800 group-[.toaster]:!border-yellow-300 dark:group-[.toaster]:!bg-yellow-900 dark:group-[.toaster]:!text-yellow-400 dark:group-[.toaster]:!border-yellow-800",
          info: "group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-800 group-[.toaster]:!border-blue-300 dark:group-[.toaster]:!bg-blue-900 dark:group-[.toaster]:!text-blue-400 dark:group-[.toaster]:!border-blue-800",
          loading: "group-[.toaster]:!bg-gray-50 group-[.toaster]:!text-gray-800 group-[.toaster]:!border-gray-300 dark:group-[.toaster]:!bg-gray-900 dark:group-[.toaster]:!text-gray-300 dark:group-[.toaster]:!border-gray-600",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
