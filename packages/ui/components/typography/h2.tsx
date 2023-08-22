import { cn } from 'ui/lib/utils'

export function TypographyH2({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'pb-2 text-3xl font-bold transition-colors scroll-m-20 first:mt-0',
        className,
      )}
    >
      {children}
    </h2>
  )
}
