interface Meal {
  type: string
  name: string
  ingredients: string[]
  recipe: string[]
  nutrients: string[]
  bgColor: string
  textColor: string
}

interface Day {
  day: number
  plan: Meal[]
}

interface WeeklyMeal {
  week: number
  days: Day[]
}

interface ShoppingItem {
  name: string
  qty: string
}

interface Shopping {
  category: string
  items: ShoppingItem[]
}

interface WeeklyShopping {
  week: number
  shopping: Shopping[]
}

export type { Day, Meal, Shopping, ShoppingItem, WeeklyMeal, WeeklyShopping }
