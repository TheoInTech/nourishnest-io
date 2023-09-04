export const PageLoading = ({ text }: { text?: string }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col gap-4 items-center backdrop-blur-sm justify-center w-full h-full bg-opacity-95 bg-muted z-[99999] overflow-hidden">
      <span className="relative flex w-12 h-12">
        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
        <span className="relative inline-flex w-12 h-12 rounded-full bg-primary"></span>
      </span>
      <p className="px-8 text-lg font-medium text-center lg:px-0">
        {text} <br /> Please don&apos;t refresh your browser...
      </p>
    </div>
  )
}
