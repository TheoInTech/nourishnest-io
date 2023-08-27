import { useAuth } from '@/providers/supabase-auth-provider'
import { WeightUnit } from '@/types/form.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, InfoIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/components/button'
import { Calendar } from 'ui/components/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui/components/form'
import { Input } from 'ui/components/input'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/popover'
import { RadioGroup, RadioGroupItem } from 'ui/components/radio-group'
import { cn } from 'ui/lib/utils'
import is5MonthsTo3YearsOld from 'ui/utils/helpers/is5MonthsTo3YearsOld'
import updateLocalStorage from 'ui/utils/helpers/updateLocalStorage'
import * as z from 'zod'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const formSchema = z
  .object({
    nickName: z
      .string()
      .min(1, 'Nickname must contain at least 1 character')
      .max(50, 'Nickname can only have 50 characters'),
    birthday: z
      .string()
      .datetime('Birthday should be a date')
      .refine(val => !is5MonthsTo3YearsOld(val), {
        message: 'Birthday must be at 5 months to 3 years old',
      }),
    withTeeth: z.boolean(),
    weight: z.coerce
      .number()
      .min(1, 'Weight must be at least 1')
      .max(1000, 'Weight can not exceed 1,000'),
    weightType: z.enum([WeightUnit.KG, WeightUnit.LBS]),
  })
  .required()

const Step1 = () => {
  const { handleNext, formData, setFormData, setStep } = useFormState()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: formData?.nickName ?? '',
      birthday: formData?.birthday ?? '',
      withTeeth: formData?.withTeeth ?? false,
      weight: formData?.weight ?? 0,
      weightType: formData?.weightType ?? WeightUnit.KG,
    },
  })

  const onSubmit = (
    values: z.infer<typeof formSchema>,
    shouldGoToReview: boolean,
  ) => {
    setFormData({
      ...formData,
      ...values,
    })

    updateLocalStorage(`onboarding-${user?.id}`, {
      ...values,
      step: 4,
    })

    if (!shouldGoToReview) handleNext()
    else setStep(4)
  }

  return (
    <FormLayout title="Create your child's profile">
      <Form {...form}>
        <form className="flex flex-col col-span-2 gap-8 my-4">
          <div className="flex gap-4">
            {/* Nickname */}
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nickname" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthday */}
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left py-6 font-normal hover:bg-accent-yellow dark:hover:text-accent-yellow-foreground',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Child&apos;s birthday</span>
                          )}
                          <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={value => field.onChange(value?.toISOString())}
                        disabled={date => date > new Date()}
                        fromYear={new Date().getFullYear() - 3}
                        toYear={new Date(
                          new Date().setMonth(new Date().getMonth() - 5),
                        ).getFullYear()}
                        toMonth={
                          new Date(
                            new Date().setMonth(new Date().getMonth() - 5),
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="flex items-center gap-2 text-[10px]">
                    <InfoIcon className="w-3 h-3" /> Your child&apos;s birthday
                    is used to calculate the age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            {/* Weight */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Weight ({form.getValues('weightType') ?? WeightUnit.KG})
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Weight" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight Type */}
            <FormField
              control={form.control}
              name="weightType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={WeightUnit.KG} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {WeightUnit.KG}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={WeightUnit.LBS} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {WeightUnit.LBS}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* With Teeth? */}
          <FormField
            control={form.control}
            name="withTeeth"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Does your child have teeth yet?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={value =>
                      form.setValue(
                        'withTeeth',
                        value === 'true' ? true : false,
                      )
                    }
                    defaultValue={String(field.value ?? false)}
                    className="flex gap-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={String(false)} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        None
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={String(true)} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Yes
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <NextAndBack
        handleSubmit={(shouldGoToReview: boolean) =>
          form.handleSubmit(e => onSubmit(e, shouldGoToReview))()
        }
        variant="next-only"
      />
    </FormLayout>
  )
}

export default Step1
