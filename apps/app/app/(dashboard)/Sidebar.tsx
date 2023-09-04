'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { ChevronRight, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Logo from 'public/assets/logo-white.svg'
import { useState } from 'react'
import { Button } from 'ui/components/button'
import { Card, CardContent } from 'ui/components/card'
import { PageLoading } from 'ui/components/page-loading'
import { TypographyH1 } from 'ui/components/typography/h1'
import meta from 'ui/lib/metadata.json'
import { cn } from 'ui/lib/utils'
import getInitials from 'ui/utils/helpers/getInitials'

const ROUTES = [
  { name: '🥑 My plans', path: '/' },
  { name: '🦸🏼 Be a super parent!', path: '#' },
  { name: '⚙️ Settings', path: '#' },
  { name: '📣 Promotions', path: '#' },
]

const Sidebar = () => {
  const router = useRouter()
  const { signOut, profile, setPageLoadingMessage } = useAuth()

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const pathname = usePathname()

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <>
      {isLoggingOut && <PageLoading />}
      <aside
        id="main-sidebar"
        className="col-span-2 p-8 overflow-auto shadow-xl h-fit bg-card rounded-xl"
        aria-label="Sidebar"
      >
        <div className="flex flex-col row-span-5 gap-8 overflow-y-hidden">
          <div className="flex flex-col gap-4 md:flex-row">
            <Logo className="flex-shrink-0 w-10 h-10 p-2 rounded-lg bg-primary" />
            <div className="flex flex-col justify-center gap-2 ">
              <TypographyH1 className="text-xl md:text-xl lg:text-2xl">
                {meta.name}
              </TypographyH1>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-2">
            <div className="relative w-[80px] h-[80px] duration-300 bg-primary/20 flex justify-center items-center rounded-[100%]">
              {profile?.avatar_url ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_IMAGE_URL}${profile.avatar_url}`}
                  alt="Avatar"
                  width={1000}
                  height={1000}
                  className="rounded-[100%] object-cover w-full h-full"
                />
              ) : (
                <div className="text-4xl font-bold uppercase text-primary/50 font-body">
                  {getInitials(profile?.nickname)}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                asChild
                variant={'ghost'}
                className="flex items-center font-bold font-body"
              >
                <Link href="/profile">
                  {/* <Baby className="w-6 h-6 mr-1" /> */}
                  👶 {profile?.nickname}{' '}
                  <ChevronRight className="w-5 h-5 ml-2 text-gray-400" />
                </Link>
              </Button>
              <span className="text-[14px] font-medium text-gray-500">
                {profile?.email ?? ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-primary-foreground">
            <Card className="border border-gray-200">
              <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl font-black text-primary">
                  {profile.generated_weeks}
                </span>
                <span className="text-xs text-primary-foreground">
                  generated
                </span>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-2xl font-black text-primary">
                  {profile.availed_weeks}
                </span>
                <span className="text-xs text-primary-foreground">availed</span>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col w-full h-full gap-2">
            {ROUTES.map(route => (
              <Button
                key={route.name}
                asChild
                variant="ghost"
                className={cn(
                  'w-full flex justify-start gap-4 text-sm',
                  pathname === route.path && 'bg-primary/20',
                )}
              >
                <Link href={route.path}>{route.name}</Link>
              </Button>
            ))}
            <Button
              onClick={handleLogOut}
              variant="ghost"
              className="flex justify-start w-full gap-4 text-sm text-destructive"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
