import { cn } from 'ui/lib/utils'

export function TypographyH3({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('text-xl md:text-2xl font-semibold', className)}>
      {children}
    </h3>
  )
}
