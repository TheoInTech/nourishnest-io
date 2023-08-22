'use client'

import { Day, Meal, WeeklyMeal } from '@/types/meal.type'
import { Badge } from 'ui/components/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'ui/components/card'
import { Separator } from 'ui/components/separator'
import { TypographyH1 } from 'ui/components/typography/h1'
import { TypographyH2 } from 'ui/components/typography/h2'
import { TypographyH4 } from 'ui/components/typography/h4'
import { TypographyList } from 'ui/components/typography/list'
import { cn } from 'ui/lib/utils'

const mealPlan = `[ { "week": 1, "days": [ { "day": 1, "plan": [ { "type": "breakfast", "name": "Rice Cereal with Banana Purée", "ingredients": [ "1 tbsp rice cereal (fortified iron is preferred for infants)", "2 tbsp water or breastmilk/formula", "1/4 ripe banana" ], "recipe": [ "Mix rice cereal with water or breastmilk/formula to get the right consistency.", "Mash the banana well and mix with the cereal." ], "nutrients": [ "iron", "potassium", "vitamin B6" ] }, { "type": "lunch", "name": "Sweet Potato Purée", "ingredients": [ "1/4 sweet potato" ], "recipe": [ "Peel and steam the sweet potato until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Avocado Purée", "ingredients": [ "1/4 avocado" ], "recipe": [ "Peel and remove the pit from the avocado.", "Mash the avocado until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "healthy fats", "vitamin K", "vitamin E" ] }, { "type": "dinner", "name": "Carrot Purée", "ingredients": [ "1 small carrot" ], "recipe": [ "Peel and steam the carrot until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "biotin", "vitamin K" ] } ] }, { "day": 2, "plan": [ { "type": "breakfast", "name": "Oatmeal with Blueberry Purée", "ingredients": [ "1 tbsp oatmeal", "1/4 cup water or breastmilk/formula", "2 tbsp blueberry purée" ], "recipe": [ "Cook oatmeal with water or breastmilk/formula according to package instructions.", "Blend or mash the blueberries until smooth. Mix with the cooked oatmeal." ], "nutrients": [ "fiber", "vitamin C", "antioxidants" ] }, { "type": "lunch", "name": "Butternut Squash Purée", "ingredients": [ "1/4 butternut squash" ], "recipe": [ "Peel and dice the butternut squash.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Pear Purée", "ingredients": [ "1 small pear" ], "recipe": [ "Peel and remove the core from the pear.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "fiber", "potassium" ] }, { "type": "dinner", "name": "Zucchini Purée", "ingredients": [ "1/4 zucchini" ], "recipe": [ "Peel and dice the zucchini.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "fiber", "vitamin K" ] } ] }, { "day": 3, "plan": [ { "type": "breakfast", "name": "Quinoa Cereal with Apple Purée", "ingredients": [ "1 tbsp quinoa cereal", "2 tbsp water or breastmilk/formula", "2 tbsp apple purée" ], "recipe": [ "Cook quinoa cereal with water or breastmilk/formula according to package instructions.", "Blend or mash the apples until smooth. Mix with the cooked quinoa cereal." ], "nutrients": [ "protein", "fiber", "vitamin C" ] }, { "type": "lunch", "name": "Green Bean Purée", "ingredients": [ "1/4 cup green beans" ], "recipe": [ "Steam the green beans until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin K", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Peach Purée", "ingredients": [ "1 small peach" ], "recipe": [ "Peel and remove the pit from the peach.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin A", "fiber" ] }, { "type": "dinner", "name": "Broccoli Purée", "ingredients": [ "1/4 cup broccoli" ], "recipe": [ "Steam the broccoli until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin K", "fiber" ] } ] }, { "day": 4, "plan": [ { "type": "breakfast", "name": "Millet Cereal with Peach Purée", "ingredients": [ "1 tbsp millet cereal", "2 tbsp water or breastmilk/formula", "2 tbsp peach purée" ], "recipe": [ "Cook millet cereal with water or breastmilk/formula according to package instructions.", "Blend or mash the peaches until smooth. Mix with the cooked millet cereal." ], "nutrients": [ "protein", "fiber", "vitamin C" ] }, { "type": "lunch", "name": "Cauliflower Purée", "ingredients": [ "1/4 cup cauliflower" ], "recipe": [ "Steam the cauliflower until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin K", "fiber" ] }, { "type": "morning snack", "name": "Plum Purée", "ingredients": [ "1 small plum" ], "recipe": [ "Peel and remove the pit from the plum.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin A", "fiber" ] }, { "type": "dinner", "name": "Spinach Purée", "ingredients": [ "1/4 cup spinach" ], "recipe": [ "Steam the spinach until wilted.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "iron", "vitamin K", "vitamin C" ] } ] }, { "day": 5, "plan": [ { "type": "breakfast", "name": "Barley Cereal with Pear Purée", "ingredients": [ "1 tbsp barley cereal", "2 tbsp water or breastmilk/formula", "2 tbsp pear purée" ], "recipe": [ "Cook barley cereal with water or breastmilk/formula according to package instructions.", "Blend or mash the pears until smooth. Mix with the cooked barley cereal." ], "nutrients": [ "fiber", "vitamin C", "potassium" ] }, { "type": "lunch", "name": "Carrot and Potato Purée", "ingredients": [ "1 small carrot", "1 small potato" ], "recipe": [ "Peel and dice the carrot and potato.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Watermelon Purée", "ingredients": [ "1/4 cup watermelon" ], "recipe": [ "Remove the seeds and rind from the watermelon.", "Blend or mash until smooth." ], "nutrients": [ "vitamin C", "vitamin A", "water" ] }, { "type": "dinner", "name": "Cucumber Purée", "ingredients": [ "1/4 cup cucumber" ], "recipe": [ "Peel and remove the seeds from the cucumber.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin K", "water" ] } ] }, { "day": 6, "plan": [ { "type": "breakfast", "name": "Rice Cereal with Peach Purée", "ingredients": [ "1 tbsp rice cereal (fortified iron is preferred for infants)", "2 tbsp water or breastmilk/formula", "2 tbsp peach purée" ], "recipe": [ "Mix rice cereal with water or breastmilk/formula to get the right consistency.", "Blend or mash the peaches until smooth. Mix with the cereal." ], "nutrients": [ "iron", "vitamin C", "fiber" ] }, { "type": "lunch", "name": "Pumpkin Purée", "ingredients": [ "1/4 cup pumpkin" ], "recipe": [ "Peel and dice the pumpkin.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Mango Purée", "ingredients": [ "1 small mango" ], "recipe": [ "Peel and remove the pit from the mango.", "Blend or mash until smooth." ], "nutrients": [ "vitamin C", "vitamin A", "fiber" ] }, { "type": "dinner", "name": "Asparagus Purée", "ingredients": [ "1/4 cup asparagus" ], "recipe": [ "Trim the woody ends of the asparagus.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin K", "vitamin C", "fiber" ] } ] }, { "day": 7, "plan": [ { "type": "breakfast", "name": "Oatmeal with Apple Purée", "ingredients": [ "1 tbsp oatmeal", "1/4 cup water or breastmilk/formula", "2 tbsp apple purée" ], "recipe": [ "Cook oatmeal with water or breastmilk/formula according to package instructions.", "Blend or mash the apples until smooth. Mix with the cooked oatmeal." ], "nutrients": [ "fiber", "vitamin C", "antioxidants" ] }, { "type": "lunch", "name": "Butternut Squash and Carrot Purée", "ingredients": [ "1/4 butternut squash", "1 small carrot" ], "recipe": [ "Peel and dice the butternut squash and carrot.", "Steam until soft and then blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "morning snack", "name": "Kiwi Purée", "ingredients": [ "1 small kiwi" ], "recipe": [ "Peel and slice the kiwi.", "Blend or mash until smooth." ], "nutrients": [ "vitamin C", "vitamin K", "fiber" ] }, { "type": "dinner", "name": "Bell Pepper Purée", "ingredients": [ "1/4 bell pepper (red, yellow, or green)" ], "recipe": [ "Roast the bell pepper until soft and the skin is charred.", "Remove the skin, seeds, and stem.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "vitamin A", "fiber" ] } ] } ] } ]`

const HomePage = () => {
  const actualMealPlan: WeeklyMeal = JSON.parse(mealPlan)[0]
  // const [actualMealPlan, setActualMealPlan] = useState<WeeklyMeal>()

  const pickBackgroundColor = () => {
    const classes = [
      'bg-primary',
      'bg-secondary',
      'bg-accent-yellow',
      'bg-accent-blue',
    ]
    const randomIndex = Math.floor(Math.random() * classes.length)
    return classes[randomIndex]
  }

  // useEffect(() => {
  //   const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '[]')
  //   setActualMealPlan(mealPlan[0])
  // }, [])

  return (
    <div className="px-16 py-4 text-center">
      <TypographyH1>Generated Meal Plans</TypographyH1>
      <TypographyH2>Week {actualMealPlan?.week}</TypographyH2>
      <div className="relative flex flex-col flex-wrap gap-8 my-8 overflow-hidden text-left">
        <div className="flex flex-wrap w-full h-full gap-4">
          {actualMealPlan?.days?.map((daily: Day) => (
            <Card
              key={`W${actualMealPlan.week}-D${daily.day}`}
              className="w-full"
            >
              <CardHeader>
                <CardTitle>Day {daily.day}</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 p-4">
                {daily?.plan?.map((meal: Meal) => {
                  const colorClass = pickBackgroundColor()
                  return (
                    <Card
                      key={`W${actualMealPlan.week}-D${daily.day}-${meal.name}`}
                      className={cn(
                        'relative w-full text-muted-foreground',
                        colorClass,
                      )}
                    >
                      <CardHeader>
                        <CardTitle>{meal.name}</CardTitle>
                        <CardDescription className="font-bold capitalize">
                          {meal.type}
                        </CardDescription>
                        <div className="flex gap-2">
                          {meal.nutrients.map((nutrient: string) => (
                            <Badge
                              key={`W${actualMealPlan.week}-D${daily.day}-${meal.name}-${nutrient}`}
                              className="text-xs text-center capitalize border bg-muted text-muted-foreground border-border"
                            >
                              {nutrient}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4 p-4">
                        <div className="flex flex-col">
                          <TypographyH4 className="font-sans">
                            Ingredients
                          </TypographyH4>
                          <Separator />
                          <TypographyList>
                            {meal.ingredients.map((ingredient: string) => (
                              <li
                                key={`W${actualMealPlan.week}-D${daily.day}-${meal.name}-${ingredient}`}
                              >
                                {ingredient}
                              </li>
                            ))}
                          </TypographyList>
                        </div>
                        <div className="flex flex-col">
                          <TypographyH4 className="font-sans">
                            Recipe
                          </TypographyH4>
                          <Separator />
                          <TypographyList>
                            {meal.recipe.map((recipe: string) => (
                              <li
                                key={`W${actualMealPlan.week}-D${daily.day}-${meal.name}-${recipe}`}
                              >
                                {recipe}
                              </li>
                            ))}
                          </TypographyList>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
