interface Meal {
  type: string
  name: string
  ingredients: string[]
  recipe: string[]
  nutrients: string[]
}

interface Day {
  day: number
  plan: Meal[]
}

interface WeeklyMeal {
  week: number
  days: Day[]
}

function isValidMealPlan(raw: any): raw is WeeklyMeal {
  const data = { ...raw }

  if (typeof data !== 'object' || data === null) {
    return false
  }

  if (!data.hasOwnProperty('week') || typeof data.week !== 'number') {
    return false
  }

  if (!Array.isArray(data.days)) {
    return false
  }

  if (data.days.length !== 7) {
    return false
  }

  for (const dayPlan of data.days) {
    if (typeof dayPlan !== 'object' || dayPlan === null) {
      return false
    }

    if (!dayPlan.hasOwnProperty('day') || typeof dayPlan.day !== 'number') {
      return false
    }

    if (!Array.isArray(dayPlan.plan)) {
      return false
    }

    for (const meal of dayPlan.plan) {
      if (typeof meal !== 'object' || meal === null) {
        return false
      }

      const requiredKeys: Array<keyof Meal> = [
        'type',
        'name',
        'ingredients',
        'recipe',
        'nutrients',
      ]
      for (const key of requiredKeys) {
        if (!meal.hasOwnProperty(key)) {
          return false
        }
      }

      if (
        !Array.isArray(meal.ingredients) ||
        !Array.isArray(meal.recipe) ||
        !Array.isArray(meal.nutrients)
      ) {
        return false
      }
    }
  }

  return true
}

export default isValidMealPlan
