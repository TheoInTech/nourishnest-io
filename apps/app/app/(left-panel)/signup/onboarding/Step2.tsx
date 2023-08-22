import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/components/button'
import { Checkbox } from 'ui/components/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'ui/components/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui/components/form'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/popover'
import { cn } from 'ui/lib/utils'
import updateLocalStorage from 'ui/utils/helpers/updateLocalStorage'
import * as z from 'zod'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const formSchema = z
  .object({
    region: z.number().min(1, 'Choose a region'),
    frequencyOfMeals: z.number().array().nonempty('Choose at least 1 meal'),
  })
  .required()

const Step1 = () => {
  const {
    handleNext,
    formData,
    setFormData,
    frequencyOfMealsRefs,
    regionsRefs,
    setStep,
  } = useFormState()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: formData?.region ?? '',
      frequencyOfMeals: formData?.frequencyOfMeals ?? [],
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

    updateLocalStorage('onboarding', {
      ...values,
      step: 3,
    })

    if (!shouldGoToReview) handleNext()
    else setStep(4)
  }

  return (
    <FormLayout title="Build your preferences">
      <Form {...form}>
        <form className="flex flex-col col-span-2 gap-6 my-4">
          {/* Regions */}
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="relative flex flex-col">
                <FormLabel>Region</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? regionsRefs.find(
                              region => region.id === field.value,
                            )?.name
                          : 'Select region'}
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-56">
                    <Command>
                      <CommandInput placeholder="Search region..." />
                      <CommandEmpty>No region found.</CommandEmpty>
                      <CommandGroup>
                        {regionsRefs.map(region => (
                          <CommandItem
                            value={String(region.id)}
                            key={region.id}
                            onSelect={() => {
                              form.setValue('region', region.id)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-5 w-5',
                                region.id === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {region.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Frequency of Meals */}
          <FormField
            control={form.control}
            name="frequencyOfMeals"
            render={() => (
              <FormItem>
                <FormLabel>Which meals should we help you with?</FormLabel>
                {frequencyOfMealsRefs.map(meal => (
                  <FormField
                    key={meal.id}
                    control={form.control}
                    name="frequencyOfMeals"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={meal.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(meal.id)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...field.value, meal.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== meal.id,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-lg capitalize cursor-pointer">
                            {meal.name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
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
        variant="both"
      />
    </FormLayout>
  )
}

export default Step1
