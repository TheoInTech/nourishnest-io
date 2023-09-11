import { Database } from './supabase.type'

export type IDietaryPreferences =
  Database['public']['Tables']['dietary_preferences']['Row']
export type IRegions = Database['public']['Tables']['regions']['Row']
export type IFrequencyOfMeals =
  Database['public']['Tables']['frequency_of_meals']['Row']
export type IWaitlist = Database['public']['Tables']['waitlist']['Row']
export type IMealPlans = Database['public']['Tables']['meal_plans']['Row']
export type IShoppingPlans =
  Database['public']['Tables']['shopping_plans']['Row']
export type ISubscriptions =
  Database['public']['Tables']['subscriptions']['Row']
export type IInvoices = Database['public']['Tables']['invoices']['Row']
export type IProfile = Database['public']['Tables']['profile']['Row']
export type IMicronutrients =
  Database['public']['Tables']['micronutrients']['Row']
