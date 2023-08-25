import { useEffect } from 'react'
import { useFormState } from './FormContext'
// import FormReview from './FormReview'
import { IFormData } from '@/types/form.type'
import { createClient } from '@/utils/supabase-browser'
import secureLocalStorage from 'react-secure-storage'
import FormReview from './FormReview'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const FormStep = () => {
  const supabase = createClient()
  const {
    step,
    setStep,
    setFormData,
    setHasReachedFinalCheck,
    setFrequencyOfMealsRefs,
    setDietaryPreferencesRefs,
    setRegionsRefs,
  } = useFormState()

  useEffect(() => {
    ;(async () => {
      try {
        const { data: frequencyOfMeals, error: errorFrequencyOfMeals } =
          await supabase.from('frequency_of_meals').select('*')

        const { data: regions, error: errorRegions } = await supabase
          .from('regions')
          .select('*')

        const { data: dietaryPreferences, error: errorDietaryPreferences } =
          await supabase.from('dietary_preferences').select('*')

        if (errorFrequencyOfMeals || errorRegions || errorDietaryPreferences) {
          const errorMessages = {
            frequency_of_meals:
              errorFrequencyOfMeals?.message ?? frequencyOfMeals,
            regions: errorRegions?.message ?? errorRegions,
            dietary_preferences:
              errorDietaryPreferences?.message ?? errorDietaryPreferences,
          }
          throw new Error(
            'Failed to fetch data: ' + JSON.stringify(errorMessages, null, 2),
          )
        } else {
          setFrequencyOfMealsRefs(frequencyOfMeals)
          setRegionsRefs(regions)
          setDietaryPreferencesRefs(dietaryPreferences)
        }
      } catch (error) {
        throw new Error(
          'Failed to fetch data: ' + JSON.stringify(error, null, 2),
        )
      }
    })()
  }, [
    setDietaryPreferencesRefs,
    setFrequencyOfMealsRefs,
    setRegionsRefs,
    supabase,
  ])

  useEffect(() => {
    if (secureLocalStorage.getItem('onboarding')) {
      const onboarding: IFormData & {
        step: number
        hasReachedFinalCheck: boolean
      } = JSON.parse((secureLocalStorage.getItem('onboarding') as string) ?? '')

      setStep(onboarding.hasReachedFinalCheck ? 4 : onboarding?.step ?? 1)
      setFormData(onboarding)
      setHasReachedFinalCheck(onboarding.hasReachedFinalCheck)
    }
  }, [setFormData, setHasReachedFinalCheck, setStep])

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
