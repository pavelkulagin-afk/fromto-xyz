'use client'
// src/components/ui/card.tsx
'use client'  // ← ОБЯЗАТЕЛЬНО: framer-motion работает только на клиенте

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }>(
  ({ className, hover = true, children, ...props }, ref) => {
    const Comp = hover ? motion.div : 'div'
    const commonProps = hover
      ? {
          whileHover: { y: -4, transition: { duration: 0.2 } },
          className: cn('group relative overflow-hidden rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 hover:border-accent/50 transition-all duration-300', className)
        }
      : { className: cn('rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl', className) }
    
    return (
      <Comp ref={ref} {...commonProps} {...(hover ? {} : props)}>
        {hover && <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
        {!hover && <div {...props} className={cn('p-6', className)}>{children}</div>}
        {hover && children}
      </Comp>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6 pb-3', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
