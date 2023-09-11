import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { cn } from 'ui/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans rounded-3xl px-6 py-6 text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-white dark:bg-foreground hover:bg-accent-yellow hover:text-accent-yellow-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        tertiary:
          'bg-accent-blue text-accent-blue-foreground hover:bg-accent-blue/80 text-accent-blue-foreground',
        ghost: 'hover:bg-gray-100 hover:bg-gray-200',
        link: 'text-primary underline-offset-4 hover:underline',
        yellow:
          'bg-accent-yellow text-accent-yellow-foreground hover:bg-accent-yellow/60 text-accent-yellow-foreground',
      },
      size: {
        default: 'h-10 rounded-3xl px-6 py-6',
        sm: 'h-9 rounded-3xl px-4',
        lg: 'h-11 rounded-2xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
