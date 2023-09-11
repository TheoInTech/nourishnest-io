import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import 'server-only'

import type { Database } from '@/types/supabase.type'
import { cache } from 'react'

export const createClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    {
      cookies: () => cookieStore,
    },
    {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    },
  )
})
