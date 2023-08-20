import { useEffect } from 'react'
import { useFormState } from './FormContext'
// import FormReview from './FormReview'
import { IFormData } from '@/types/form.type'
import { createClient } from '@/utils/supabase-browser'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from 'ui/components/alert'
import Step1 from './Step1'

export function DestructiveAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

const FormStep = () => {
  const supabase = createClient()
  const {
    errorMessage,
    setErrorMessage,
    step,
    setStep,
    setFormData,
    setHasReachedFinalCheck,
  } = useFormState()

  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const { data: fitnessGoals, error: errorFitnessGoals } = await supabase
  //         .from('fitness_goals')
  //         .select('*')

  //       const { data: gymActivities, error: errorGymActivities } =
  //         await supabase.from('gym_activity').select('*')

  //       const { data: dietaryPreference, error: errorDietaryPreference } =
  //         await supabase.from('dietary_preference').select('*')

  //       const { data: experienceLevel, error: errorExperienceLevel } =
  //         await supabase.from('experience_level').select('*')

  //       if (
  //         errorFitnessGoals ||
  //         errorGymActivities ||
  //         errorDietaryPreference ||
  //         errorExperienceLevel
  //       ) {
  //         const errorMessages = {
  //           fitness_goals: errorFitnessGoals?.message ?? errorFitnessGoals,
  //           gym_activity: errorGymActivities?.message ?? errorGymActivities,
  //           dietary_preference:
  //             errorDietaryPreference?.message ?? errorDietaryPreference,
  //         }
  //         throw new Error(
  //           'Failed to fetch data: ' + JSON.stringify(errorMessages, null, 2),
  //         )
  //       } else {
  //         // setFitnessGoals(fitnessGoals)
  //         // setGymActivities(gymActivities)
  //         // setDietaryPreference(dietaryPreference)
  //         // setExperienceLevel(experienceLevel)
  //       }
  //     } catch (error) {
  //       throw new Error(
  //         'Failed to fetch data: ' + JSON.stringify(error, null, 2),
  //       )
  //     }
  //   })()
  // }, [])

  useEffect(() => {
    if (localStorage.getItem('onboarding')) {
      const onboarding: IFormData & {
        step: number
        hasReachedFinalCheck: boolean
      } = JSON.parse(localStorage.getItem('onboarding') ?? '')

      setStep(onboarding?.hasReachedFinalCheck ? 9 : onboarding?.step ?? 1)
      setFormData(onboarding)
      setHasReachedFinalCheck(onboarding?.hasReachedFinalCheck)
    }
  }, [])

  switch (step) {
    // case 2:
    //   return (
    //     <>
    //       <Toast
    //         variant="error"
    //         message={errorMessage}
    //         handleEmptyMessage={() => setErrorMessage('')}
    //       />
    //       <FitnessGoals />
    //     </>
    //   )
    // case 3:
    //   return (
    //     <>
    //       <Toast
    //         variant="error"
    //         message={errorMessage}
    //         handleEmptyMessage={() => setErrorMessage('')}
    //       />
    //       <GymActivity />
    //     </>
    //   )
    // case 4:
    //   return (
    //     <>
    //       <Toast
    //         variant="error"
    //         message={errorMessage}
    //         handleEmptyMessage={() => setErrorMessage('')}
    //       />
    //       <FormReview />
    //     </>
    //   )
    case 1:
    default:
      return (
        <>
          {errorMessage && <DestructiveAlert message={errorMessage} />}
          <Step1 />
        </>
      )
  }
}

export default FormStep
