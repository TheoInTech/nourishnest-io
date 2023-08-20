import { WeightUnit } from '@/types/form.type'
import { createClient } from '@/utils/supabase-browser'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
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
import { Tabs, TabsList, TabsTrigger } from 'ui/components/tabs'
import { cn } from 'ui/lib/utils'
import is5MonthsTo3YearsOld from 'ui/utils/helpers/is5MonthsTo3YearsOld'
import * as z from 'zod'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const formSchema = z
  .object({
    nickName: z.string().min(1).max(50),
    // I need to use is5MonthsTo3YearsOld on the birthday field
    birthday: z
      .string()
      .datetime()
      .refine(val => !is5MonthsTo3YearsOld(val), {
        message: 'Birthday must be at 5 months to 3 years old',
      }),
    weight: z.number().min(1).max(1000),
    weightType: z.enum([WeightUnit.KG, WeightUnit.LBS]),
  })
  .required()

const Step1 = () => {
  const { handleNext, formData, setFormData, setErrorMessage } = useFormState()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickName: formData?.nickName ?? '',
      birthday: formData?.birthday ?? '',
      weight: formData?.weight ?? 0,
      weightType: formData?.weightType ?? WeightUnit.KG,
    },
  })

  // Utils
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('values', values)
    // setIsLoading(true)

    // setFormData({
    //   ...formData,
    //   ...values,
    // })

    // updateLocalStorage('onboarding', {
    //   ...values,
    //   step: 2,
    // })

    // setIsLoading(false)
    // handleNext()
  }

  return (
    <FormLayout
      title="Your user profile"
      description="This information will be used to create your personalized workout and meal plans."
    >
      <Form {...form}>
        <form className="flex flex-col col-span-2 gap-4">
          <FormField
            control={form.control}
            name="nickName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input placeholder="Nickname" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                          'w-[240px] pl-3 text-left font-normal',
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
                      onSelect={field.onChange}
                      disabled={date =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your child&apos;s birthday is used to calculate the age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight Type</FormLabel>
                <FormControl>
                  <Tabs defaultValue={WeightUnit.KG} className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value={WeightUnit.KG}>
                        {WeightUnit.KG}
                      </TabsTrigger>
                      <TabsTrigger value={WeightUnit.LBS}>
                        {WeightUnit.LBS}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight ({form.getValues('weightType')})</FormLabel>
                <FormControl>
                  <Input placeholder="Weight" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <NextAndBack
        handleSubmit={form.handleSubmit(onSubmit)}
        variant="next-only"
        isLoading={isLoading}
      />
    </FormLayout>
  )
}

export default Step1
