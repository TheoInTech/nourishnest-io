import { createClient } from '@/utils/supabase-browser'
import axios from 'axios'
import { format } from 'date-fns'
import { EditIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Badge } from 'ui/components/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'ui/components/card'
import { TypographyP } from 'ui/components/typography/p'
import birthdayToAge from 'ui/utils/helpers/birthdayToAge'
import isValidJSON from 'ui/utils/helpers/isValidJSON'
import updateLocalStorage from 'ui/utils/helpers/updateLocalStorage'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const FormReview = () => {
  const router = useRouter()
  const {
    formData,
    dietaryPreferencesRefs,
    regionsRefs,
    frequencyOfMealsRefs,
    setStep,
    setHasReachedFinalCheck,
    hasReachedFinalCheck,
    setPageLoadingMessage,
    setErrorMessage,
  } = useFormState()
  const supabase = createClient()

  async function generateFromOpenAi(
    plan: string,
    prompt: string = '',
    frequencyOfMeals: string = '',
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST_URL}/api/free/generate-${plan}`,
          {
            prompt,
            frequencyOfMeals,
          },
        )
        const stringify = JSON.stringify(response)
        if (!isValidJSON(stringify))
          reject('Invalid plan generated. Please try again.')

        const parsedResponse = JSON.parse(stringify)

        if (plan === 'meal' && parsedResponse?.data?.[0]?.days.length < 7) {
          reject('Generated meal plan is less than expected. Please try again.')
        }

        resolve(parsedResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onSubmit = async () => {
    const dietaryPreferences = formData.dietaryPreferences.map(
      pref => dietaryPreferencesRefs.find(ref => ref.id === pref)?.name,
    )

    const frequencyOfMeals = formData.frequencyOfMeals.map(
      meal => frequencyOfMealsRefs.find(ref => ref.id === meal)?.name,
    )

    // 1. Build the prompt
    const prompt = `
    Child details:
    1. Age of child - ${birthdayToAge(new Date(formData.birthday))}
    2. Dietary Preferences - ${dietaryPreferences.join(', ')}
    3. Child's Weight - ${formData.weight} ${formData.weightType}
    4. Allergies - ${formData.allergies.join(', ')}
    5. Region / Location - ${
      regionsRefs.find(ref => ref.id === formData.region)?.name
    }
    6. Frequency of Meals - ${frequencyOfMeals.join(', ')}
    7. With teeth? - ${formData.withTeeth ? 'Yes' : 'None'}
    `

    try {
      // 2. Generate the meal plan via API
      setPageLoadingMessage('Generating your meal plan...')
      const mealResponse: any = await generateFromOpenAi(
        'meal',
        prompt,
        frequencyOfMeals.join(', '),
      )

      // 3. Generate the grocery list via API
      // setPageLoadingMessage('Generating your shopping list...')
      // const shoppingResponse: any = await generateFromOpenAi('shopping', prompt)

      if (
        // shoppingResponse?.data?.length === 0 ||
        mealResponse?.data?.length === 0
      ) {
        setErrorMessage(
          'There was a problem generating your meal plan. Please try again.',
        )
        setPageLoadingMessage('')
        return
      }

      // 4a. (Temporary) Display the meal plans
      await updateLocalStorage('meal-plan', JSON.stringify(mealResponse?.data))
      router.push('/')

      // 4b. (Real) Save the plans to the database
    } catch (error) {
      setErrorMessage(`${error ?? 'Something went wrong.'}`)
      console.error(error)
      setPageLoadingMessage('')
    }
  }

  useEffect(() => {
    if (!hasReachedFinalCheck) {
      setHasReachedFinalCheck(true)

      updateLocalStorage('onboarding', {
        hasReachedFinalCheck: true,
      })
    }
  }, [hasReachedFinalCheck, setHasReachedFinalCheck])

  return (
    <FormLayout title="You're one step away!">
      <TypographyP>
        Review your child&apos;s information and submit to generate your plan.
      </TypographyP>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Child&apos;s Nickname</CardDescription>
            <CardTitle className="font-sans text-xl">
              {formData?.nickName}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Birthday</CardDescription>
            <CardTitle className="font-sans text-xl">
              {format(new Date(formData.birthday), 'PPP')}
              <br />
              <span className="text-sm font-normal">
                {birthdayToAge(new Date(formData.birthday))}
              </span>
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Weight</CardDescription>
            <CardTitle className="font-sans text-xl">
              {formData?.weight} {formData?.weightType}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Does your child have teeth yet?</CardDescription>
            <CardTitle className="font-sans text-xl">
              {formData?.withTeeth ? 'Yes' : 'None'}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(2)}
        >
          <CardHeader>
            <CardDescription>Region</CardDescription>
            <CardTitle className="font-sans text-xl">
              {regionsRefs.find(ref => ref.id === formData?.region)?.name}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(2)}
        >
          <CardHeader>
            <CardDescription>
              Which meals should we help you with?
            </CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-xl">
              {formData?.frequencyOfMeals.map(meal => (
                <Badge key={meal} className="capitalize" variant={'outline'}>
                  {frequencyOfMealsRefs.find(ref => ref.id === meal)?.name}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(3)}
        >
          <CardHeader>
            <CardDescription>
              Do you have any meal preferences for your child?
            </CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-xl">
              {formData?.dietaryPreferences.map(pref => (
                <Badge key={pref} className="capitalize" variant={'outline'}>
                  {dietaryPreferencesRefs.find(ref => ref.id === pref)?.name}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow"
          onClick={() => setStep(3)}
        >
          <CardHeader>
            <CardDescription>Allergies</CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-xl">
              {formData?.allergies.map(allergy => (
                <Badge key={allergy} className="capitalize" variant={'outline'}>
                  {allergy}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>
      </div>

      <NextAndBack handleSubmit={onSubmit} variant="both" nextText="Submit" />
    </FormLayout>
  )
}

export default FormReview
