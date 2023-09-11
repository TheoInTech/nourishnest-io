import Reaction from '@/components/Reaction'
import { Day, Meal, MealTypeColor, WeeklyMeal } from '@/types/meal.type'
import { ArrowUpRight, Expand, Minimize2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Badge } from 'ui/components/badge'
import { Button } from 'ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui/components/select'
import { TypographyH4 } from 'ui/components/typography/h4'
import { TypographyP } from 'ui/components/typography/p'
import { cn } from 'ui/lib/utils'

interface ISectionMeal {
  plan: WeeklyMeal
  day: string
}

const SectionMeal = ({ plan, day = '1' }: ISectionMeal) => {
  const [isFullView, setIsFullView] = useState<boolean>(false)
  const [selectedDay, setSelectedDay] = useState<string>(day)
  const [weekDayPlan, setWeekDayPlan] = useState<Meal[]>()
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

  useEffect(() => {
    const weekDay = plan?.days?.find(
      d => d.day === Number(selectedDay),
    ) as unknown as Day
    setWeekDayPlan(weekDay?.plan as Meal[])
  }, [plan?.days, selectedDay])

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
      <CardContent className="flex flex-col h-full gap-4 px-4 pt-4 pb-32 overflow-auto card-fade">
        <div className="flex items-center justify-between gap-4 px-2">
          <TypographyH4>Day {selectedDay}</TypographyH4>
          <Select
            onValueChange={value => setSelectedDay(value)}
            defaultValue={selectedDay}
          >
            <SelectTrigger className="w-[8rem] bg-muted font-sans flex justify-center self-end gap-4">
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {plan?.days.map(d => (
                <SelectItem
                  key={d.day}
                  value={String(d.day)}
                  className="flex justify-center"
                >
                  Day {d.day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {weekDayPlan && weekDayPlan.length > 0 ? (
            weekDayPlan?.map(meal => (
              <div
                key={`W${plan.week}-D${selectedDay}-M${meal.name}`}
                className="flex flex-col"
              >
                <div
                  className={`uppercase text-[8px] dark:text-muted font-bold px-3 py-1 bg-primary-foreground/10 rounded-t-lg w-fit`}
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
                    handleMealCardClick(e, plan.week, Number(selectedDay), meal)
                  }
                >
                  <ArrowUpRight className="absolute top-0 right-0 w-4 h-4 m-2 text-muted-foreground/60" />
                  <CardHeader className="p-4">
                    <TypographyP className="font-bold">{meal.name}</TypographyP>
                    <div className="flex flex-wrap gap-2">
                      {meal.nutrients.map((nutrient: string) => (
                        <Badge
                          key={`W${plan.week}-D${selectedDay}-M${meal.name}-N${nutrient}`}
                          className="flex-shrink-0 text-[10px] text-center capitalize border shadow-sm hover:bg-muted bg-muted text-muted-foreground border-border"
                        >
                          {nutrient}
                        </Badge>
                      ))}
                    </div>

                    <Reaction
                      week={plan.week}
                      day={Number(selectedDay)}
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
            ))
          ) : (
            <></>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default SectionMeal
