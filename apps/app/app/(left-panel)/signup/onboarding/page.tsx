'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { FormProvider } from './FormContext'
import FormStep from './FormStep'

export default function Signup() {
  const { signOut, pageLoadingMessage, user, setPageLoadingMessage } = useAuth()

  const handleLogOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <FormProvider>
      <FormStep />
    </FormProvider>
  )
}
