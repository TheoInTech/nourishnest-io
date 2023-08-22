import Image from 'next/image'
import 'server-only'
import { ThemeToggle } from 'ui/components/theme-toggle'

export default async function LeftPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full h-screen">
      <div className="hidden relative md:flex justify-left overflow-hidden items-center w-full md:w-[45vw] h-full z-50">
        <Image
          src="/assets/onboarding/left-panel.png"
          alt="Left Panel"
          fill={true}
          sizes="(max-width: 1500px) 100vw, 1500px"
          className="object-cover object-right w-full h-full"
        />
      </div>
      <div className="relative w-full md:w-[55vw] flex justify-center items-center h-full">
        <ThemeToggle className="absolute z-30 top-5 right-10" />
        {children}
      </div>
    </div>
  )
}
