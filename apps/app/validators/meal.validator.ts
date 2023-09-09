import { Rating } from '@/types/meal.type'
import { z } from 'zod'

// Meal Type Enum schema
const MealTypeEnum = z.union([
  z.literal('breakfast'),
  z.literal('lunch'),
  z.literal('dinner'),
  z.literal('morning snack'),
  z.literal('afternoon snack'),
])

const MealTypeInsensitive = MealTypeEnum.transform(val => val.toLowerCase())

// Rating schema
const RatingEnum = z.nativeEnum(Rating)

// Meal schema
const MealSchema = z.object({
  type: MealTypeInsensitive,
  name: z.string(),
  ingredients: z.array(z.string()),
  recipe: z.array(z.string()),
  nutrients: z.array(z.string()),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  rating: RatingEnum.optional().nullable(),
})

// Day schema
const DaySchema = z.object({
  day: z.number(),
  plan: z.array(MealSchema),
})

// WeeklyMeal schema
const WeeklyMealSchema = z.object({
  week: z.number(),
  days: z.array(DaySchema).length(7), // enforcing length to be 7
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

// Infer the types
type MealSchemaType = z.infer<typeof MealSchema>
type DaySchemaType = z.infer<typeof DaySchema>
type WeeklyMealSchemaType = z.infer<typeof WeeklyMealSchema>

export { DaySchema, MealSchema, WeeklyMealSchema }

export type { DaySchemaType, MealSchemaType, WeeklyMealSchemaType }
