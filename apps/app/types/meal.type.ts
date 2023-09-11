enum Rating {
  Bad = 0,
  Good = 1,
  Love = 2,
}

type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'morning snack'
  | 'afternoon snack'

interface Meal {
  type: MealType
  name: string
  ingredients: string[]
  recipe: string[]
  nutrients: string[]
  bgColor: string
  textColor: string
  rating: Rating | null
}

interface Day {
  day: number
  plan: Meal[]
}

interface WeeklyMeal {
  week: number
  days: Day[]
  fromDate: string
  toDate: string
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

const MealTypeColor = {
  breakfast: '#FFF5A5',
  lunch: '#89CDFF',
  dinner: '#FFC2E2',
  'morning snack': '#B8FF89',
  'afternoon snack': '#FFC689',
  default: '#F5F5F5',
}

export { MealTypeColor, Rating }

export type {
  Day,
  Meal,
  MealType,
  Shopping,
  ShoppingItem,
  WeeklyMeal,
  WeeklyShopping,
}
