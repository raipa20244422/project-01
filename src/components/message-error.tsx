import { ComponentProps, forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface MessageProps extends ComponentProps<'p'> {}

export const MessageError = forwardRef<HTMLParagraphElement, MessageProps>(
  function MessageError({ className, ...props }, ref) {
    return (
      <p
        className={cn('ml-2 flex self-start text-sm font-medium', className)}
        ref={ref}
        {...props}
      />
    )
  },
)
