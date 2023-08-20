import Image from 'next/image'
import 'server-only'

export default async function LeftPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex w-full h-screen">
      <div className="hidden relative md:flex justify-left overflow-hidden items-center w-full md:w-[50vw] h-full z-50">
        <Image
          src="/assets/onboarding/left-panel.png"
          alt="Left Panel"
          fill={true}
          className="absolute w-full h-full"
        />
      </div>
      <div className="w-full md:w-[50vw] flex justify-center items-center h-full">
        {children}
      </div>
    </div>
  )
}
