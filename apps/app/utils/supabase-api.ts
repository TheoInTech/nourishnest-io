import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import 'server-only'

import type { Database } from '@/types/supabase.type'

export const createClient = () =>
  createRouteHandlerClient<Database>(
    {
      cookies,
    },
    {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    },
  )
