import { Database } from '@/types/supabase.type'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createPagesBrowserClient<Database>()
