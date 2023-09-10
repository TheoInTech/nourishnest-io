'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { WeeklyMeal, WeeklyShopping } from '@/types/meal.type'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import SectionGrocery from './SectionGrocery'
import SectionMeal from './SectionMeal'
import SectionWeekTitle from './SectionWeekTitle'

const HomePage = () => {
  const { profile } = useAuth()
  const searchParams = useSearchParams()
  const week = searchParams.get('week')

  const [selectedWeek, setSelectedWeek] = useState<string>(week || '1')

  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]
  const shoppingPlans = profile?.shopping_plans
    ?.plan as unknown as WeeklyShopping[]

  const mealPlan = mealPlans.find(
    plan => plan?.week === Number(selectedWeek),
  ) as WeeklyMeal
  const shoppingPlan = shoppingPlans.find(
    plan => plan?.week === Number(selectedWeek),
  ) as WeeklyShopping

  return (
    <div className="flex flex-col gap-6 my-4 overflow-auto hide-scrollbar">
      <SectionWeekTitle
        selectedWeek={selectedWeek}
        mealPlans={mealPlans}
        shoppingPlans={shoppingPlans}
        profile={profile}
        setSelectedWeek={setSelectedWeek}
      />
      <SectionMeal plan={mealPlan} />
      <SectionGrocery plan={shoppingPlan} />
    </div>
  )
}

export default HomePage
