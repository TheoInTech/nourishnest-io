import type { Metadata } from 'next'
import Image from 'next/image'
import Logo from 'public/assets/logo.svg'
import 'server-only'
import { ThemeToggle } from 'ui/components/theme-toggle'
import { TypographyH1 } from 'ui/components/typography/h1'

export const metadata: Metadata = {
  title: 'Waitlist',
}

export default async function WaitlistLayout({
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

        <main className="relative flex items-start justify-center w-full h-screen overflow-auto">
          <div className="flex w-full min-h-screen justify-center overflow-auto md:w-[70%] flex-col p-8 gap-4 md:p-0">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-4 text-primary">
                <Logo className="w-24 h-24" />
                <TypographyH1 className="font-light">Nourish Nest</TypographyH1>
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
