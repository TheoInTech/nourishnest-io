import { cn } from 'ui/lib/utils'

export function TypographyP({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn('leading-7', className)} {...props}>
      {children}
    </p>
  )
}
