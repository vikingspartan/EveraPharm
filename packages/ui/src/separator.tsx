import * as React from 'react'
import { cn } from './utils'

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Separator({ className, ...props }: SeparatorProps) {
  return <div role="separator" className={cn('shrink-0 bg-border h-px w-full', className)} {...props} />
} 