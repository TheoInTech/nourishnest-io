import { cn } from 'ui/lib/utils'

export function TypographyH1({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn('text-3xl md:text-4xl font-black lg:text-5xl', className)}
    >
      {children}
    </h1>
  )
}
