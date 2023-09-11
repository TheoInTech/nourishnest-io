import { useEffect } from 'react'
import { useFormState } from './FormContext'
// import FormReview from './FormReview'
import { useAuth } from '@/providers/supabase-auth-provider'
import { IFormData } from '@/types/form.type'
import { createClient } from '@/utils/supabase-browser'
import secureLocalStorage from 'react-secure-storage'
import FormReview from './FormReview'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const FormStep = () => {
  const supabase = createClient()
  const { user } = useAuth()
  const { step, setStep, setFormData, setHasReachedFinalCheck } = useFormState()

  useEffect(() => {
    if (secureLocalStorage.getItem(`onboarding-${user?.id}`)) {
      const onboarding: IFormData & {
        step: number
        hasReachedFinalCheck: boolean
      } = JSON.parse(
        (secureLocalStorage.getItem(`onboarding-${user?.id}`) as string) ?? '',
      )

      setStep(onboarding.hasReachedFinalCheck ? 4 : onboarding?.step ?? 1)
      setFormData(onboarding)
      setHasReachedFinalCheck(onboarding.hasReachedFinalCheck)
    }
  }, [setFormData, setHasReachedFinalCheck, setStep, user])

  switch (step) {
    case 2:
      return <Step2 />
    case 3:
      return <Step3 />
    case 4:
      return <FormReview />
    case 1:
    default:
      return <Step1 />
  }
}

export default FormStep
