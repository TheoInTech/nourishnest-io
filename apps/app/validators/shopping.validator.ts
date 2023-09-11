import { z } from 'zod'

// ShoppingItem schema
const ShoppingItemSchema = z.object({
  name: z.string(),
  qty: z.string(),
})

// Shopping schema
const ShoppingSchema = z.object({
  category: z.string(),
  items: z.array(ShoppingItemSchema),
})

// WeeklyShopping schema
const WeeklyShoppingSchema = z.object({
  week: z.number(),
  shopping: z.array(ShoppingSchema),
})

type ShoppingItemSchemaType = z.infer<typeof ShoppingItemSchema>
type ShoppingSchemaType = z.infer<typeof ShoppingSchema>
type WeeklyShoppingSchemaType = z.infer<typeof WeeklyShoppingSchema>

export { ShoppingItemSchema, ShoppingSchema, WeeklyShoppingSchema }

export type {
  ShoppingItemSchemaType,
  ShoppingSchemaType,
  WeeklyShoppingSchemaType,
}
