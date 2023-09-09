import Reaction from '@/components/Reaction'
import { Meal, MealTypeColor, WeeklyMeal } from '@/types/meal.type'
import { ArrowUpRight, Expand, Minimize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from 'ui/components/badge'
import { Button } from 'ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import { TypographyP } from 'ui/components/typography/p'
import { cn } from 'ui/lib/utils'

interface ISectionMeal {
  plan: WeeklyMeal
}

const SectionMeal = ({ plan }: ISectionMeal) => {
  const [isFullView, setIsFullView] = useState<boolean>(false)
  const router = useRouter()

  const handleMealCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
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
    <Card
      className={cn(
        'h-[50vh] overflow-hidden relative',
        isFullView && 'h-full',
      )}
    >
      <CardHeader className="z-40 shadow-md">
        <CardTitle className="flex items-center justify-between">
          Meal 🍽️
          <Button variant={'ghost'} onClick={() => setIsFullView(!isFullView)}>
            {isFullView ? (
              <Minimize2 className="w-5 h-5 text-muted-foreground/80" />
            ) : (
              <Expand className="w-5 h-5 text-muted-foreground/80" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid h-full grid-cols-1 gap-4 px-4 pt-4 pb-32 overflow-auto hide-scrollbar md:grid-cols-2 card-fade">
        {plan?.days?.map(weekDay => (
          <Card key={`W${plan.week}-D${weekDay.day}`} className="p-4">
            <CardHeader className="px-2 pt-0">
              <CardTitle className="text-lg">Day {weekDay.day}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {weekDay?.plan?.map(meal => (
                <div
                  key={`W${plan.week}-D${weekDay.day}-M${meal.name}`}
                  className="flex flex-col"
                >
                  <div
                    className={`uppercase text-[8px] font-bold px-3 py-1 bg-primary-foreground/10 rounded-t-lg w-fit`}
                    style={{
                      background:
                        MealTypeColor[meal.type] || MealTypeColor.default,
                    }}
                  >
                    {meal.type}
                  </div>
                  <Card
                    className="relative z-10 border border-gray-300 rounded-tl-none shadow-none cursor-pointer hover:bg-accent-yellow/20"
                    onClick={e =>
                      handleMealCardClick(e, plan.week, weekDay.day, meal)
                    }
                  >
                    <ArrowUpRight className="absolute top-0 right-0 w-4 h-4 m-2 text-muted-foreground/60" />
                    <CardHeader className="p-4">
                      <TypographyP className="font-bold">
                        {meal.name}
                      </TypographyP>
                      <div className="flex flex-wrap gap-2">
                        {meal.nutrients.map((nutrient: string) => (
                          <Badge
                            key={`W${plan.week}-D${weekDay.day}-M${meal.name}-N${nutrient}`}
                            className="flex-shrink-0 text-[10px] text-center capitalize border shadow-sm hover:bg-muted bg-muted text-muted-foreground border-border"
                          >
                            {nutrient}
                          </Badge>
                        ))}
                      </div>

                      <Reaction
                        week={plan.week}
                        day={weekDay.day}
                        name={meal.name}
                        rating={meal.rating}
                      />
                    </CardHeader>
                    <div
                      className="absolute top-0 left-0 w-1 h-full rounded-bl-lg"
                      style={{
                        backgroundColor: meal.bgColor,
                      }}
                    ></div>
                  </Card>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default SectionMeal
