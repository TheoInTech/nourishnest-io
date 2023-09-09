'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import React from 'react'
import { Announcement } from 'ui/components/announcement'
import { Card, CardHeader, CardTitle } from 'ui/components/card'
import { PageLoading } from 'ui/components/page-loading'
import SectionFavorites from './SectionFavorites'
import Sidebar from './Sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, profileIsLoading, isPageLoading, pageLoadingMessage } =
    useAuth()

  if (profileIsLoading && !profile) {
    return <PageLoading text={'Fetching your profile...'} />
  }

  return (
    <div className="grid w-full h-full grid-cols-9 p-8 overflow-hidden">
      {(isPageLoading || pageLoadingMessage !== '') && (
        <PageLoading text={pageLoadingMessage} />
      )}
      <Sidebar />
      <div className="h-screen col-span-5 px-6 pb-40 overflow-auto hide-scrollbar">
        <Announcement />
        {children}
      </div>
      <div className="flex flex-col h-screen col-span-2 gap-6">
        <SectionFavorites />
        <Card className="h-full max-h-[25%] flex items-center justify-center">
          <CardHeader>
            <CardTitle>Ad space</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default DashboardLayout
