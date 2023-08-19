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

export type { Meal, Day, WeeklyMeal }
