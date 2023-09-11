import { useAuth } from '@/providers/supabase-auth-provider'
import { Day, Meal, Rating, WeeklyMeal } from '@/types/meal.type'
import { ChevronRight, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Button } from 'ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'

interface IFavorite {
  week: number
  day: number
  meal: Meal
}

const SectionFavorites = () => {
  const findFavorites = (mealPlans: WeeklyMeal[]): IFavorite[] => {
    const favorites: IFavorite[] = []

    mealPlans.forEach((plan: WeeklyMeal) => {
      plan.days.forEach((day: Day) => {
        day.plan.forEach((meal: Meal) => {
          if (meal.rating === Rating.Love) {
            if (
              favorites &&
              favorites?.length > 0 &&
              favorites.find(fave => fave?.meal?.name === meal?.name)
            )
              return

            favorites.push({ week: plan.week, day: day.day, meal })
          }
        })
      })
    })

    return favorites
  }

  const { profile } = useAuth()
  const router = useRouter()
  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]
  const favorites = useMemo(() => findFavorites(mealPlans), [mealPlans])

  const handleMealCardClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    week: number,
    day: number,
    meal: Meal,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    router.push(
      `/meal?week=${week}&day=${day}&type=${meal.type}&name=${meal.name}`,
    )
  }

  return (
    <Card className="h-full max-h-[65%] overflow-hidden">
      <CardHeader className="shadow-md">
        <CardTitle className="flex items-center gap-2">
          Favorites <Heart className="w-5 h-5 fill-destructive" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start w-full h-full gap-2 p-4 overflow-auto pb-28 card-fade">
        {favorites.length > 0 ? (
          favorites.map(({ week, day, meal }: IFavorite) => (
            <Button
              key={`T${meal.type}-M${meal.name}`}
              variant="ghost"
              className="flex items-center justify-between w-full gap-2 text-left whitespace-nowrap"
              onClick={e => handleMealCardClick(e, week, day, meal)}
            >
              <span className="overflow-hidden text-base text-ellipsis whitespace-nowrap">
                {meal.name}
              </span>
              <ChevronRight className="w-4 h-4" />
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
