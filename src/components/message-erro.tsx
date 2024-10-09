import { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface ErrorProps extends ComponentProps<'p'> {}
export function MessageError({ className, ...props }: ErrorProps) {
  return (
    <p
      className={cn('self-start text-left text-xs text-red-400', className)}
      {...props}
    />
  )
}
