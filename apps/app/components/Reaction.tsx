import { useAuth } from '@/providers/supabase-auth-provider'
import { Rating, WeeklyMeal } from '@/types/meal.type'
import { Json } from '@/types/supabase.type'
import { createClient } from '@/utils/supabase-browser'
import { Heart, ThumbsDown, ThumbsUp } from 'lucide-react'
import React from 'react'
import { Button } from 'ui/components/button'
import { useToast } from 'ui/components/use-toast'
import { cn } from 'ui/lib/utils'
import { deepCopy } from 'ui/utils/helpers/deepCopy'

interface IReaction {
  week: number
  day: number
  name: string
  rating: Rating | null
}

const Reaction = ({ week, day, name, rating }: IReaction) => {
  const { profile, mutateProfile } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()
  const mealPlans = profile?.meal_plans?.plan as unknown as WeeklyMeal[]

  const handleRateSelect = async (
    e: React.MouseEvent<HTMLButtonElement>,
    targetWeek: number,
    targetDay: number,
    targetMealName: string,
    rating: Rating,
    shouldRemove: boolean,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const mealPlansCopy = deepCopy(mealPlans) as WeeklyMeal[]
      const targetPlan = mealPlansCopy.find(plan => plan.week === targetWeek)

      if (targetPlan) {
        const targetDayPlan = targetPlan.days.find(day => day.day === targetDay)

        if (targetDayPlan) {
          const targetMeal = targetDayPlan.plan.find(
            meal => meal.name === targetMealName,
          )

          if (targetMeal) {
            targetMeal.rating = !shouldRemove ? rating : null
          }
        }
      }

      const { error } = await supabase
        .from('meal_plans')
        .update({
          plan: mealPlansCopy as unknown as Json[],
        })
        .match({ profile_id: profile?.id })

      if (error) throw new Error(error?.message)

      await mutateProfile()

      if (!shouldRemove) {
        if (rating === Rating.Love) {
          toast({
            variant: 'success',
            title: "Oh you love it! I've added it to your favorites.",
          })
        } else {
          toast({
            variant: 'info',
            title:
              "Thanks for the feedback! We'll use it to improve our next meal plans.",
          })
        }
      }
    } catch (error: any) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || error || 'Something went wrong.',
      })
    }
  }
  return (
    <div className="flex self-end gap-4">
      <Button
        className="z-50 p-0 hover:bg-inherit"
        variant={'ghost'}
        onClick={event =>
          handleRateSelect(
            event,
            week,
            day,
            name,
            Rating.Bad,
            rating === Rating.Bad,
          )
        }
      >
        <ThumbsDown
          className={cn(
            'w-4 h-4 hover:fill-accent-yellow',
            rating === Rating.Bad && 'fill-accent-yellow',
          )}
        />
      </Button>
      <Button
        className="z-50 p-0 hover:bg-inherit"
        variant={'ghost'}
        onClick={event =>
          handleRateSelect(
            event,
            week,
            day,
            name,
            Rating.Good,
            rating === Rating.Good,
          )
        }
      >
        <ThumbsUp
          className={cn(
            'w-4 h-4 hover:fill-primary',
            rating === Rating.Good && 'fill-primary',
          )}
        />
      </Button>
      <Button
        className="z-50 p-0 hover:bg-inherit"
        variant={'ghost'}
        onClick={event =>
          handleRateSelect(
            event,
            week,
            day,
            name,
            Rating.Love,
            rating === Rating.Love,
          )
        }
      >
        <Heart
          className={cn(
            'w-4 h-4 hover:fill-destructive',
            rating === Rating.Love && 'fill-destructive',
          )}
        />
      </Button>
    </div>
  )
}

export default Reaction
