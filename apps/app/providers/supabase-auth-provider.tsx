'use client'

import {
  IDietaryPreferences,
  IFrequencyOfMeals,
  IInvoices,
  IMealPlans,
  IProfile,
  IRegions,
  IShoppingPlans,
  ISubscriptions,
} from '@/types/collections.type'
import {
  AuthError,
  AuthTokenResponse,
  Session,
  User,
  UserResponse,
} from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { useSupabase } from './supabase-provider'

export interface ISubscriptionInvoices extends ISubscriptions {
  invoices: IInvoices[]
}

export interface ICompleteProfile extends IProfile {
  subscriptions: ISubscriptionInvoices[] | null | undefined
  meal_plans: IMealPlans | null | undefined
  shopping_plans: IShoppingPlans | null | undefined
  dietary_preferences: IDietaryPreferences[] | undefined
  frequency_of_meals: IFrequencyOfMeals[] | undefined
  regions: IRegions | undefined
}

interface ContextI {
  /**** User ****/
  user: User | null
  profile: ICompleteProfile
  error: any
  profileIsLoading: boolean
  mutateProfile: any

  /**** References ****/
  regions: IRegions[] | undefined
  regionsIsLoading: boolean
  frequencyOfMeals: IFrequencyOfMeals[] | undefined
  frequencyOfMealsIsLoading: boolean
  dietaryPreferences: IDietaryPreferences[] | undefined
  dietaryPreferencesIsLoading: boolean

  /**** Supabase Functions ****/
  signOut: () => Promise<void>
  forgotPassword: (emailAddress: string) => Promise<
    | {
        data: {}
        error: null
      }
    | { data: null; error: AuthError }
  >
  resetPassword: (password: string) => Promise<UserResponse>
  signInWithPassword: (
    email: string,
    password: string,
  ) => Promise<AuthTokenResponse>
  isPageLoading: boolean
  setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>
  pageLoadingMessage: string
  setPageLoadingMessage: React.Dispatch<React.SetStateAction<string>>
}
const Context = createContext<ContextI>({
  /**** User ****/
  user: null,
  profile: {} as ICompleteProfile,
  error: null,
  profileIsLoading: true,
  mutateProfile: null,

  /**** References ****/
  regions: [],
  regionsIsLoading: true,
  frequencyOfMeals: [],
  frequencyOfMealsIsLoading: true,
  dietaryPreferences: [],
  dietaryPreferencesIsLoading: true,

  /**** Supabase Functions ****/
  signOut: async () => {},
  forgotPassword: async (emailAddress: string) => {
    return {
      data: {},
      error: null,
    }
  },
  resetPassword: async (password: string) => ({} as UserResponse),
  signInWithPassword: async (email: string, password: string) =>
    ({} as AuthTokenResponse),
  isPageLoading: false,
  setIsPageLoading: () => {},
  pageLoadingMessage: '',
  setPageLoadingMessage: () => {},
})

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null
  children: React.ReactNode
}) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [pageLoadingMessage, setPageLoadingMessage] = useState<string>('')

  /**** USER ****/

  // Get Profile
  const getProfile = async () => {
    if (serverSession) {
      const { data: profile, error } = (await supabase
        .from('profile_view')
        .select('*')
        .eq('user_id', serverSession?.user?.id)
        .maybeSingle()) as any

      if (error) {
        console.error(error)
        return null
      }

      return profile
    }
    return null
  }

  const {
    data: profile,
    error,
    isLoading: profileIsLoading,
    mutate: mutateProfile,
  } = useSWR(serverSession ? 'profile-context' : null, getProfile)

  /**** REFERENCES ****/

  // Get Regions
  const getRegions = async () => {
    const { data: regions, error } = await supabase.from('regions').select('*')

    if (error) {
      console.error(error)
      return []
    }

    return regions
  }

  const { data: regions, isLoading: regionsIsLoading } = useSWR(
    'regions-context',
    getRegions,
  )

  // Get Frequency of Meals
  const getFrequencyOfMeals = async () => {
    const { data: frequencyOfMeals, error } = await supabase
      .from('frequency_of_meals')
      .select('*')

    if (error) {
      console.error(error)
      return [] as IFrequencyOfMeals[]
    }

    return frequencyOfMeals
  }

  const { data: frequencyOfMeals, isLoading: frequencyOfMealsIsLoading } =
    useSWR('frequency-of-meals-context', getFrequencyOfMeals)

  // Get Dietary Preferences
  const getDietaryPreferences = async () => {
    const { data: dietaryPreferences, error } = await supabase
      .from('dietary_preferences')
      .select('*')

    if (error) {
      console.error(error)
      return []
    }

    return dietaryPreferences
  }

  const { data: dietaryPreferences, isLoading: dietaryPreferencesIsLoading } =
    useSWR('dietary-preferences-context', getDietaryPreferences)

  /**** SUPABASE FUNCTIONS ****/

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    await router.push('/login')
  }

  // Sign-In with Email
  const signInWithPassword = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return response
  }

  // Forgot Password
  const forgotPassword = async (email: string) => {
    const response = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_HOST_URL}/reset-password`,
    })

    return response
  }

  // Reset Password
  const resetPassword = async (password: string) => {
    const response = await supabase.auth.updateUser({ password: password })

    return response
  }

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription: serverSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh()
      }
    })

    return () => {
      serverSubscription.unsubscribe()
    }
  }, [router, supabase, serverSession?.access_token])

  const exposed: ContextI = {
    /**** User ****/
    user: serverSession?.user ?? null,
    profile,
    error,
    profileIsLoading,
    mutateProfile,

    /**** References ****/
    regions,
    regionsIsLoading,
    frequencyOfMeals,
    frequencyOfMealsIsLoading,
    dietaryPreferences,
    dietaryPreferencesIsLoading,

    /**** Supabase Functions ****/
    signOut,
    forgotPassword,
    resetPassword,
    signInWithPassword,
    isPageLoading,
    setIsPageLoading,
    pageLoadingMessage,
    setPageLoadingMessage,
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useAuth = () => {
  let context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used inside SupabaseAuthProvider')
  } else {
    return context
  }
}
