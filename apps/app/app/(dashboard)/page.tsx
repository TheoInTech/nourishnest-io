'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { Rating, WeeklyMeal, WeeklyShopping } from '@/types/meal.type'
import { Json } from '@/types/supabase.type'
import { createClient } from '@/utils/supabase-browser'
import { useState } from 'react'
import { Card, CardHeader, CardTitle } from 'ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/components/select'
import { useToast } from 'ui/components/use-toast'
import { deepCopy } from 'ui/utils/helpers/deepCopy'
import SectionGrocery from './SectionGrocery'
import SectionMeal from './SectionMeal'

const HomePage = () => {
  const { profile, mutateProfile } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()

  const [selectedWeek, setSelectedWeek] = useState<string>('1')

  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]
  const groceryPlans = profile?.shopping_plans
    ?.plan as unknown as WeeklyShopping[]

  const mealPlan = mealPlans.find(
    plan => plan?.week === Number(selectedWeek),
  ) as WeeklyMeal
  const groceryPlan = groceryPlans.find(
    plan => plan?.week === Number(selectedWeek),
  ) as WeeklyShopping

  const handleFavoriteSelect = async (
    e: React.MouseEvent<HTMLButtonElement>,
    targetWeek: number,
    targetDay: number,
    targetMealName: string,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const mealPlansCopy = deepCopy(mealPlans) as WeeklyMeal[]
      const targetPlan = mealPlansCopy.find(plan => plan.week === targetWeek)

      if (targetPlan) {
        const targetDayPlan = targetPlan.days.find(day => day.day === targetDay)

        if (targetDayPlan) {
          const targetMeal = targetDayPlan.plan.find(
            meal => meal.name === targetMealName,
          )

          if (targetMeal) {
            targetMeal.rating = Rating.Love
          }
        }
      }

      const { error } = await supabase
        .from('meal_plans')
        .update({
          plan: mealPlansCopy as unknown as Json[],
        })
        .match({ profile_id: profile?.id })

      if (error) throw new Error(error?.message)

      await mutateProfile()

      toast({
        variant: 'success',
        title: "Oh you love it! I've added it to your favorites.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || error || 'Something went wrong.',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 my-4 overflow-auto hide-scrollbar">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Week {mealPlan?.week}
            <Select
              onValueChange={value => setSelectedWeek(value)}
              defaultValue={selectedWeek}
            >
              <SelectTrigger className="w-[15rem] bg-muted">
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent>
                {mealPlans.map(plan => (
                  <SelectItem key={plan.week} value={String(plan.week)}>
                    {new Date(plan.fromDate).toLocaleDateString()} -{' '}
                    {new Date(plan.toDate).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
      </Card>

      <SectionMeal plan={mealPlan} onFavorite={handleFavoriteSelect} />
      <SectionGrocery plan={groceryPlan} />
    </div>
  )
}

export default HomePage
