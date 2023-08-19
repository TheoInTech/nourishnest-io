export function TypographyBlockquote({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <blockquote className="pl-6 mt-6 italic border-l-2">{children}</blockquote>
  )
}
