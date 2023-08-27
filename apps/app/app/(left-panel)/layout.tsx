import Image from 'next/image'
import Logo from 'public/assets/logo-white.svg'
import 'server-only'
import { ThemeToggle } from 'ui/components/theme-toggle'
import { TypographyH1 } from 'ui/components/typography/h1'
import { TypographyH2 } from 'ui/components/typography/h2'

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

        <main className="relative flex items-start justify-center w-full h-screen overflow-auto">
          <div className="flex w-full min-h-screen justify-center overflow-auto md:w-[60%] p-8 flex-col gap-4 md:px-2 md:py-8 lg:py-16">
            <div className="flex flex-col gap-4 md:flex-row">
              <Logo className="flex-shrink-0 p-2 rounded-lg w-28 h-28 bg-primary" />
              <div className="flex flex-col justify-center gap-2 ">
                <TypographyH1 className="font-light text-primary">
                  Nourish Nest
                </TypographyH1>
                <TypographyH2 className="font-sans text-sm font-normal md:text-lg">
                  Your trusted companion in nourishing and nurturing your child.
                </TypographyH2>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
