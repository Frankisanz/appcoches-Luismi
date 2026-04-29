import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        nuevo: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
        en_contacto: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        visita_programada: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300",
        negociacion: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
        ganado: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
        perdido: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
        disponible: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
        reservado: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        vendido: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        importando: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-current bg-transparent",
        whatsapp: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
