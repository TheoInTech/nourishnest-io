import { Database } from './supabase.type'

export type IDietaryPreferences =
  Database['public']['Tables']['dietary_preferences']['Row']
export type IRegions = Database['public']['Tables']['regions']['Row']
