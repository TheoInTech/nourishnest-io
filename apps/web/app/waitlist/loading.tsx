import { cn } from 'ui/lib/utils'

export default function Loading({
  className,
  ...props
}: {
  className?: string
}) {
  return (
    <div className="flex flex-col gap-4 ">
      <div
        className={cn(
          'rounded-md bg-primary/60 w-[80%] h-5 animate-pulse delay-300',
          className,
        )}
        {...props}
      />
      <div
        className={cn(
          'rounded-md bg-primary/60 animate-pulse w-[50%] h-5',
          className,
        )}
        {...props}
      />
      <div
        className={cn(
          'rounded-md bg-primary/60 w-[70%] h-5 animate-pulse delay-500',
          className,
        )}
        {...props}
      />
      <div
        className={cn(
          'rounded-md bg-primary/60 w-[60%] h-5 animate-pulse delay-200',
          className,
        )}
        {...props}
      />
    </div>
  )
}
