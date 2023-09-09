'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { WeeklyMeal, WeeklyShopping } from '@/types/meal.type'
import { useState } from 'react'
import { Card, CardHeader, CardTitle } from 'ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/components/select'
import SectionGrocery from './SectionGrocery'
import SectionMeal from './SectionMeal'

const HomePage = () => {
  const { profile } = useAuth()

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

      <SectionMeal plan={mealPlan} />
      <SectionGrocery plan={groceryPlan} />
    </div>
  )
}

export default HomePage
