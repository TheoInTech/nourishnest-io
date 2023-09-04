import { useAuth } from '@/providers/supabase-auth-provider'
import { Day, Meal, Rating, WeeklyMeal } from '@/types/meal.type'
import { ChevronRight, Heart } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from 'ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'

const SectionFavorites = () => {
  const findFavorites = (mealPlans: WeeklyMeal[]): Meal[] => {
    const favorites: Meal[] = []

    mealPlans.forEach((plan: WeeklyMeal) => {
      plan.days.forEach((day: Day) => {
        day.plan.forEach((meal: Meal) => {
          if (meal.rating === Rating.Love) {
            favorites.push(meal)
          }
        })
      })
    })

    return favorites
  }

  const { profile } = useAuth()
  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]
  const favorites = useMemo(() => findFavorites(mealPlans), [mealPlans])

  return (
    <Card className="h-full max-h-[65%] overflow-hidden">
      <CardHeader className="shadow-md">
        <CardTitle>Favorites</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start w-full h-full gap-4 p-4 overflow-auto hide-scrollbar">
        {favorites.length > 0 ? (
          favorites.map((meal: Meal) => (
            <Button
              key={`T${meal.type}-M${meal.name}`}
              variant="ghost"
              className="grid items-center w-full grid-cols-9 text-left"
            >
              <Heart className="col-span-2 fill-destructive" />
              <span className="col-span-6 text-base">{meal.name}</span>
              <ChevronRight className="w-4 h-4 col-span-1" />
            </Button>
          ))
        ) : (
          <>Looks like you still don&apos;t have your favorite meals yet.</>
        )}
      </CardContent>
    </Card>
  )
}

export default SectionFavorites
