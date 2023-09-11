import { ICompleteProfile, useAuth } from '@/providers/supabase-auth-provider'
import { Day, Meal, WeeklyMeal, WeeklyShopping } from '@/types/meal.type'
import { createClient } from '@/utils/supabase-browser'
import { format } from 'date-fns'
import { Download, Lock, Unlock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'ui/components/alert-dialog'
import { Button } from 'ui/components/button'
import { Card, CardHeader, CardTitle } from 'ui/components/card'
import { IConfirmModal } from 'ui/components/confirm-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/components/select'
import { toast } from 'ui/components/use-toast'
import birthdayToAge from 'ui/utils/helpers/birthdayToAge'
import { deepCopy } from 'ui/utils/helpers/deepCopy'
import { generateFromOpenAi } from 'ui/utils/helpers/generateFromOpenAi'
import wait from 'ui/utils/helpers/wait'

interface ISectionWeekTitle {
  selectedWeek: string
  mealPlans: WeeklyMeal[]
  shoppingPlans: WeeklyShopping[]
  profile: ICompleteProfile
  setSelectedWeek: (value: string) => void
}

const SectionWeekTitle = ({
  selectedWeek,
  setSelectedWeek,
  mealPlans,
  shoppingPlans,
  profile,
}: ISectionWeekTitle) => {
  const router = useRouter()
  const supabase = createClient()
  const {
    user,
    mutateProfile,
    dietaryPreferences: dietaryPreferencesRefs,
    regions: regionsRefs,
    frequencyOfMeals: frequencyOfMealsRefs,
    setPageLoadingMessage,
  } = useAuth()

  const [modalDetails, setModalDetails] = useState<IConfirmModal>(
    {} as IConfirmModal,
  )
  const [savedMealResponse, setSavedMealResponse] = useState<WeeklyMeal>()
  const [savedShoppingResponse, setSavedShoppingResponse] =
    useState<WeeklyShopping>()

  const unlockable =
    profile.availed_weeks - profile.generated_weeks < 0
      ? 0
      : profile.availed_weeks - profile.generated_weeks

  const handleModalGenerate = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()

    // Close the modal first
    setModalDetails({ isOpen: false })

    const savedDietaryPreferences =
      profile.dietary_preferences?.map(
        pref => dietaryPreferencesRefs?.find(ref => ref.id === pref.id)?.name,
      ) ?? []

    const savedFrequencyOfMeals =
      profile.frequency_of_meals?.map(
        meal => frequencyOfMealsRefs?.find(ref => ref.id === meal.id)?.name,
      ) ?? []

    const region = regionsRefs?.find(ref => ref.id === profile.region_id)?.name
    const age = birthdayToAge(new Date(profile.birthday))

    // 1. Build the prompt
    const prompt = `
    Child details:
    1. Age of child - ${age}
    2. Dietary Preferences - ${savedDietaryPreferences.join(', ')}
    3. Child's Weight - ${profile.weight} ${profile.weight_type}
    4. Allergies - ${profile.allergies.join(', ')}
    5. Region / Location - ${region}
    6. Frequency of Meals - ${savedFrequencyOfMeals.join(', ')}
    7. With teeth? - ${profile.with_teeth ? 'Yes' : 'None'}
    `

    try {
      // 2. Generate the meal plan via API
      let mealResponse
      if (!savedMealResponse) {
        setPageLoadingMessage('Generating your meal plan...')
        mealResponse = (await generateFromOpenAi(
          'meal',
          prompt,
          savedFrequencyOfMeals.join(', '),
          profile.generated_weeks + 1,
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
        )) as unknown as WeeklyShopping
        setSavedShoppingResponse(shoppingResponse)
      } else {
        shoppingResponse = savedShoppingResponse as unknown as WeeklyShopping
      }

      setPageLoadingMessage('Saving your plans...')

      // Meal Plan
      await wait(500)
      const previousToDate = new Date(mealPlans[mealPlans.length - 1].toDate)
      const fromDate = new Date(previousToDate)
      fromDate.setDate(previousToDate.getDate() + 1)
      const toDate = new Date(fromDate)
      toDate.setDate(fromDate.getDate() + 7)

      // Update current meal plan
      const newMealPlan = deepCopy(mealPlans)
      newMealPlan.push({
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
      })
      console.log('newMealPlan', newMealPlan)
      const { error: mealError } = await supabase
        .from('meal_plans')
        .update({
          plan: newMealPlan,
          updated_at: new Date().toISOString(),
        })
        .match({ profile_id: profile?.id })
      if (mealError) throw new Error('Error in saving your meal plan.')

      // Update current shopping plan
      const newShoppingPlan = deepCopy(shoppingPlans)
      newShoppingPlan.push(shoppingResponse)
      console.log('newShoppingPlan', newShoppingPlan)
      const { error: shoppingError } = await supabase
        .from('shopping_plans')
        .update({
          plan: newShoppingPlan,
          updated_at: new Date().toISOString(),
        })
        .match({ profile_id: profile?.id })
      if (shoppingError) throw new Error('Error in saving your grocery list.')

      // Increate generated weeks in profile
      const { error: profileError } = await supabase
        .from('profile')
        .update({
          generated_weeks: profile.generated_weeks + 1,
        })
        .match({ id: profile?.id })
      if (profileError) throw new Error('Error in updating profile.')

      await mutateProfile()
      setSavedMealResponse(undefined)
      setSavedShoppingResponse(undefined)

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your next meal plan and grocery list has been generated.',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || error || 'Something went wrong.',
      })
      console.error(error)
    } finally {
      setPageLoadingMessage('')
    }
  }

  const handleGenerateClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    shouldGenerate: boolean,
  ) => {
    e.preventDefault()

    if (!shouldGenerate) {
      // Redirect to billing
      setModalDetails({
        title: 'Unlock more, be more.',
        description: (
          <>
            You have reached the limit of your plan. Unlock more meal plans by
            becoming <strong>a super parent!</strong>
          </>
        ),
        confirmButton: "Swoosh! Let's go!",
        isOpen: true,
        icon: <Unlock className="w-16 h-16" />,
        onConfirm: () => router.push('/billing'),
      })
    } else {
      // Ask for confirmation of profile
      setModalDetails({
        title: 'Generate meal plans',
        description: (
          <>
            Make sure to check and update your child&apos;s{' '}
            <Link
              href="/settings"
              className="hover:underline text-primary hover:underline-offset-2"
            >
              profile
            </Link>{' '}
            before generating your new meal plans.
          </>
        ),
        confirmButton: 'Generate',
        isOpen: true,
        icon: <Download className="w-16 h-16" />,
        onConfirm: handleModalGenerate,
      })
    }
  }

  return (
    <>
      <AlertDialog open={modalDetails.isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center gap-4 py-4">
            {modalDetails.icon}
            <AlertDialogTitle className="text-3xl">
              {modalDetails.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="px-8 text-lg text-center">
              {modalDetails.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {modalDetails.children}
          <AlertDialogFooter className="flex items-center justify-end w-full gap-2 mt-8 sm:justify-center">
            <AlertDialogCancel
              onClick={() => setModalDetails({ isOpen: false })}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={modalDetails.onConfirm}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            >
              {modalDetails.confirmButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Week {selectedWeek}
            <div className="flex self-end gap-4">
              <Select
                onValueChange={value => setSelectedWeek(value)}
                defaultValue={selectedWeek}
              >
                <SelectTrigger className="w-[16rem] bg-muted font-sans flex justify-center gap-4">
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                  {mealPlans.map(plan => (
                    <SelectItem
                      key={plan.week}
                      value={String(plan.week)}
                      className="flex justify-center"
                    >
                      {format(new Date(plan.fromDate), 'MMM-dd')} to{' '}
                      {format(new Date(plan.toDate), 'MMM-dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="secondary"
                size={'sm'}
                className="font-sans text-sm font-semibold"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  handleGenerateClick(event, unlockable > 0)
                }
              >
                Generate Week {profile.generated_weeks + 1}
                {unlockable > 0 ? (
                  <Unlock className="w-4 h-4 ml-2" />
                ) : (
                  <Lock className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  )
}

export default SectionWeekTitle
