'use client'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md',
        secondary: 'bg-secondary/80 text-secondary-foreground backdrop-blur-sm border border-border/50',
        success: 'bg-emerald-500/90 text-white shadow-sm hover:shadow-md',
        warning: 'bg-amber-500/90 text-white shadow-sm hover:shadow-md',
        outline: 'border border-input/50 bg-background/50 backdrop-blur-sm text-foreground',
        ghost: 'hover:bg-accent/50 text-muted-foreground',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      animated: {
        true: 'animate-pulse-slow',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', size: 'md', animated: false },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  onClick?: () => void
}

function Badge({ className, variant, size, animated, icon, children, onClick, ...props }: BadgeProps) {
  const Comp = onClick ? motion.button : motion.div
  const commonProps = onClick ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick } : {}
  
  return (
    <Comp
      className={cn(badgeVariants({ variant, size, animated, className }))}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...commonProps}
      {...(onClick ? { type: 'button' } : {})}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </Comp>
  )
}

export { Badge, badgeVariants }
