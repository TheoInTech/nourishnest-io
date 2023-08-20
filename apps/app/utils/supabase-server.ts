import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import 'server-only'

import type { Database } from '@/types/supabase.type'

export const createClient = () =>
  createServerComponentClient<Database>({
    cookies,
  })
