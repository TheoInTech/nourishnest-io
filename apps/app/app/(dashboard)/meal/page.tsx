'use client'

import BackToDashboard from '@/components/BackToDashboard'
import Reaction from '@/components/Reaction'
import { createMealLookup } from '@/lookups/meal.lookup'
import { useAuth } from '@/providers/supabase-auth-provider'
import { WeeklyMeal } from '@/types/meal.type'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import SectionIngredients from './SectionIngredients'
import SectionMicronutrients from './SectionMicronutrients'
import SectionRecipe from './SectionRecipe'

const MealDetailPage = () => {
  const { profile } = useAuth()
  const searchParams = useSearchParams()
  const week = searchParams.get('week')
  const day = searchParams.get('day')
  const mealType = searchParams.get('type')
  const mealName = searchParams.get('name')
  const key = `${week}-${day}-${mealType}-${mealName}`

  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]
  const mealLookup = useMemo(() => createMealLookup(mealPlans), [mealPlans])
  const meal = useMemo(() => {
    return mealLookup.get(key) || null
  }, [mealLookup, key])

  if (!meal) {
    return (
      <div className="flex flex-col gap-4">
        <BackToDashboard week={week} day={day} />

        <Card>
          <CardContent className="flex items-center justify-center p-4 text-base md:p-16">
            Looks like you don&apos;t have that meal. Head back to the
            dashboard.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <BackToDashboard week={week} day={day} />

      <Card>
        <CardHeader style={{ borderTop: `8px solid ${meal.bgColor}` }}>
          <CardTitle className="flex items-center justify-between">
            <div>{meal.name}</div>
            <Reaction
              week={Number(week)}
              day={Number(day)}
              name={meal.name}
              rating={meal.rating}
            />
          </CardTitle>
        </CardHeader>
      </Card>

      <SectionMicronutrients data={meal.nutrients} />
      <SectionIngredients data={meal.ingredients} />
      <SectionRecipe data={meal.recipe} />
    </div>
  )
}

export default MealDetailPage
