import { Meal, WeeklyMeal } from '@/types/meal.type'

type MealKey = string // "week-day-type-name"
type MealLookup = Map<MealKey, Meal>

export const createMealLookup = (mealPlans: WeeklyMeal[]): MealLookup => {
  const lookup = new Map<MealKey, Meal>()

  mealPlans.forEach(({ week, days }) => {
    days.forEach(({ day, plan }) => {
      plan.forEach(meal => {
        const key = `${week}-${day}-${meal.type}-${meal.name}`
        lookup.set(key, meal)
      })
    })
  })

  return lookup
}
