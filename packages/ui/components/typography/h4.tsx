import { cn } from 'ui/lib/utils'

export function TypographyH4({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h4 className={cn('text-xl font-semibold', className)}>{children}</h4>
}
