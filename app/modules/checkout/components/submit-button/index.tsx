"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className = "",
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    transparent: "bg-transparent text-slate-700 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant || "primary"]} ${className}`}
      type="submit"
      disabled={pending}
      data-testid={dataTestId}
    >
      {pending && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}
