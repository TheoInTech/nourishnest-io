import { Database } from './supabase.type'

export type IDietaryPreferences =
  Database['public']['Tables']['dietary_preferences']['Row']
export type IRegions = Database['public']['Tables']['regions']['Row']
export type IFrequencyOfMeals =
  Database['public']['Tables']['frequency_of_meals']['Row']
export type IWaitlist = Database['public']['Tables']['waitlist']['Row']
