import { useAuth } from '@/providers/supabase-auth-provider'
import { Day, Meal, WeeklyMeal, WeeklyShopping } from '@/types/meal.type'
import { Json } from '@/types/supabase.type'
import { createClient } from '@/utils/supabase-browser'
import { format } from 'date-fns'
import { EditIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { Badge } from 'ui/components/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'ui/components/card'
import { TypographyP } from 'ui/components/typography/p'
import { useToast } from 'ui/components/use-toast'
import birthdayToAge from 'ui/utils/helpers/birthdayToAge'
import { generateFromOpenAi } from 'ui/utils/helpers/generateFromOpenAi'
import updateLocalStorage from 'ui/utils/helpers/updateLocalStorage'
import wait from 'ui/utils/helpers/wait'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const FormReview = () => {
  const router = useRouter()
  const { toast } = useToast()
  const {
    formData,
    setStep,
    setHasReachedFinalCheck,
    hasReachedFinalCheck,
    setPageLoadingMessage,
  } = useFormState()
  const {
    user,
    mutateProfile,
    dietaryPreferences: dietaryPreferencesRefs,
    regions: regionsRefs,
    frequencyOfMeals: frequencyOfMealsRefs,
  } = useAuth()
  const supabase = createClient()
  const [savedMealResponse, setSavedMealResponse] = useState<WeeklyMeal>()
  const [savedShoppingResponse, setSavedShoppingResponse] =
    useState<WeeklyShopping>()

  const onSubmit = async () => {
    const dietaryPreferences = formData.dietaryPreferences?.map(
      pref => dietaryPreferencesRefs?.find(ref => ref.id === pref)?.name,
    )

    const frequencyOfMeals = formData.frequencyOfMeals?.map(
      meal => frequencyOfMealsRefs?.find(ref => ref.id === meal)?.name,
    )

    const region = regionsRefs?.find(ref => ref.id === formData.region)?.name
    const age = birthdayToAge(new Date(formData.birthday))

    // 1. Build the prompt
    const prompt = `
    Child details:
    1. Age of child - ${age}
    2. Dietary Preferences - ${dietaryPreferences.join(', ')}
    3. Child's Weight - ${formData.weight} ${formData.weightType}
    4. Allergies - ${formData.allergies.join(', ')}
    5. Region / Location - ${region}
    6. Frequency of Meals - ${frequencyOfMeals.join(', ')}
    7. With teeth? - ${formData.withTeeth ? 'Yes' : 'None'}
    `

    try {
      // 2. Generate the meal plan via API
      let mealResponse
      if (!savedMealResponse) {
        setPageLoadingMessage('Generating your meal plan...')
        mealResponse = (await generateFromOpenAi(
          'meal',
          prompt,
          frequencyOfMeals.join(', '),
        )) as unknown as WeeklyMeal

        setSavedMealResponse(mealResponse)
      } else {
        mealResponse = savedMealResponse as unknown as WeeklyMeal
      }

      // 3. Generate the grocery list via API
      let shoppingResponse
      if (!savedShoppingResponse) {
        setPageLoadingMessage('Generating your grocery list...')
        shoppingResponse = (await generateFromOpenAi(
          'shopping',
          JSON.stringify(mealResponse),
        )) as unknown as WeeklyShopping & Json
        setSavedShoppingResponse(shoppingResponse)
      } else {
        shoppingResponse = savedShoppingResponse as unknown as WeeklyShopping &
          Json
      }

      setPageLoadingMessage('Finalizing your profile...')

      // Profile
      const { data, error } = await supabase
        .from('profile')
        .insert({
          user_id: user?.id ?? '',
          nickname: formData?.nickName,
          email: user?.email ?? '',
          birthday: new Date(formData?.birthday).toISOString(),
          weight: formData?.weight,
          weight_type: formData?.weightType,
          with_teeth: formData?.withTeeth,
          allergies: formData?.allergies,
          region_id: formData?.region,
          generated_weeks: 1,
          availed_weeks: 0,
          tags: ['beta'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was a problem creating your profile.',
        })
        console.error('error:', error)
        setPageLoadingMessage('')
        return
      }

      await mutateProfile()
      const profile = { ...data }

      if (profile) {
        await wait(500)
        const dietaryPreferences = await formData?.dietaryPreferences?.map(
          diet => ({
            dietary_preferences_id: diet,
            user_id: user?.id ?? '',
            profile_id: profile?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        )
        const { error: dietError } = await supabase
          .from('profile_dietary_preferences')
          .insert(dietaryPreferences)
          .select()
        if (dietError)
          throw new Error('Error in saving your dietary preferences.')

        const frequencyOfMeals = await formData?.frequencyOfMeals?.map(fom => ({
          frequency_of_meals_id: fom,
          user_id: user?.id ?? '',
          profile_id: profile?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
        const { error: fomError } = await supabase
          .from('profile_frequency_of_meals')
          .insert(frequencyOfMeals)
          .select()
        if (fomError)
          throw new Error('Error in saving the frequency of your meals.')

        // Meal Plan
        await wait(500)
        const fromDate = new Date()
        const toDate = new Date(fromDate)
        toDate.setDate(fromDate.getDate() + 7)
        const { error: mealError } = await supabase
          .from('meal_plans')
          .insert({
            plan: [
              {
                ...mealResponse,
                days: mealResponse.days.map((day: Day) => ({
                  ...day,
                  plan: day.plan.map((meal: Meal) => ({
                    ...meal,
                    rating: null,
                  })),
                })),
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
              },
            ],
            user_id: user?.id ?? '',
            profile_id: profile?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
        if (mealError) throw new Error('Error in saving your meal plan.')

        const { error: shoppingError } = await supabase
          .from('shopping_plans')
          .insert([
            {
              plan: [shoppingResponse],
              user_id: user?.id ?? '',
              profile_id: profile?.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
        if (shoppingError) throw new Error('Error in saving your grocery list.')

        await mutateProfile()
        await secureLocalStorage?.removeItem(`onboarding-${user?.id}`)
        await router.push('/')
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || error || 'Something went wrong.',
      })
      console.error(error)
      setPageLoadingMessage('')
    }
  }

  useEffect(() => {
    if (!hasReachedFinalCheck) {
      setHasReachedFinalCheck(true)

      updateLocalStorage(`onboarding-${user?.id}`, {
        hasReachedFinalCheck: true,
      })
    }
  }, [hasReachedFinalCheck, setHasReachedFinalCheck, user?.id])

  return (
    <FormLayout title="You're one step away!">
      <TypographyP>
        Review your child&apos;s information and submit to generate your plan.
      </TypographyP>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Child&apos;s Nickname</CardDescription>
            <CardTitle className="font-sans text-lg">
              {formData?.nickName}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Birthday</CardDescription>
            <CardTitle className="font-sans text-lg">
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
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Weight</CardDescription>
            <CardTitle className="font-sans text-lg">
              {formData?.weight} {formData?.weightType}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(1)}
        >
          <CardHeader>
            <CardDescription>Does your child have teeth yet?</CardDescription>
            <CardTitle className="font-sans text-lg">
              {formData?.withTeeth ? 'Yes' : 'None'}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(2)}
        >
          <CardHeader>
            <CardDescription>Region</CardDescription>
            <CardTitle className="font-sans text-lg">
              {regionsRefs?.find(ref => ref.id === formData?.region)?.name}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(2)}
        >
          <CardHeader>
            <CardDescription>
              Which meals should we help you with?
            </CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-lg">
              {formData?.frequencyOfMeals?.map(meal => (
                <Badge key={meal} className="capitalize" variant={'outline'}>
                  {frequencyOfMealsRefs?.find(ref => ref.id === meal)?.name}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(3)}
        >
          <CardHeader>
            <CardDescription>
              Do you have any meal preferences for your child?
            </CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-lg">
              {formData?.dietaryPreferences?.map(pref => (
                <Badge key={pref} className="capitalize" variant={'outline'}>
                  {dietaryPreferencesRefs?.find(ref => ref.id === pref)?.name}
                </Badge>
              ))}
            </CardTitle>
          </CardHeader>
          <EditIcon className="absolute w-4 h-4 top-2 right-2" />
        </Card>

        <Card
          className="relative w-full cursor-pointer hover:bg-accent-yellow dark:hover:bg-accent-blue"
          onClick={() => setStep(3)}
        >
          <CardHeader>
            <CardDescription>Allergies</CardDescription>
            <CardTitle className="flex flex-wrap gap-2 pt-2 font-sans text-lg">
              {formData?.allergies?.length > 0
                ? formData?.allergies?.map(allergy => (
                    <Badge
                      key={allergy}
                      className="capitalize"
                      variant={'outline'}
                    >
                      {allergy}
                    </Badge>
                  ))
                : 'None'}
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
