import { cn } from 'ui/lib/utils'

export function TypographyList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ul className={cn('ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>
  )
}
