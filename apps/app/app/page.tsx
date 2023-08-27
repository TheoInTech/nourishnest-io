'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
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

const HomePage = () => {
  const { profile } = useAuth()
  const mealPlans = profile?.meal_plans?.[0]?.plan as unknown as WeeklyMeal[]

  return (
    <div className="px-16 py-4 text-center">
      <TypographyH1>Generated Meal Plans</TypographyH1>
      {mealPlans?.map((mealPlan: WeeklyMeal) => (
        <div key={`W${mealPlan.week}`}>
          <TypographyH2>Week {mealPlan?.week}</TypographyH2>
          <div className="relative flex flex-col flex-wrap gap-8 my-8 overflow-hidden text-left">
            <div className="flex flex-wrap w-full h-full gap-4">
              {mealPlan?.days?.map((daily: Day) => (
                <Card
                  key={`W${mealPlan.week}-D${daily.day}`}
                  className="w-full"
                >
                  <CardHeader>
                    <CardTitle>Day {daily.day}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4 p-4">
                    {daily?.plan?.map((meal: Meal) => {
                      return (
                        <Card
                          key={`W${mealPlan.week}-D${daily.day}-M${meal.name}`}
                          className={'relative w-full max-w-[25%]'}
                          style={{
                            // color: meal.textColor,
                            backgroundColor: meal.bgColor,
                          }}
                        >
                          <CardHeader>
                            <CardTitle>{meal.name}</CardTitle>
                            <CardDescription
                              className="font-bold capitalize"
                              // style={{ color: meal.textColor }}
                            >
                              {meal.type}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2">
                              {meal.nutrients.map((nutrient: string) => (
                                <Badge
                                  key={`W${mealPlan.week}-D${daily.day}-M${meal.name}-N${nutrient}`}
                                  className="flex-shrink-0 text-xs text-center capitalize border bg-muted text-muted-foreground border-border"
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
                                    key={`W${mealPlan.week}-D${daily.day}-M${meal.name}-I${ingredient}`}
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
                                    key={`W${mealPlan.week}-D${daily.day}-M${meal.name}-R${recipe}`}
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
      ))}
    </div>
  )
}

export default HomePage
