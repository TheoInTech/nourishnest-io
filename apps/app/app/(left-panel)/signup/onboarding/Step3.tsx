import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Badge } from 'ui/components/badge'
import { Button } from 'ui/components/button'
import { Checkbox } from 'ui/components/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'ui/components/form'
import { Input } from 'ui/components/input'
import updateLocalStorage from 'ui/utils/helpers/updateLocalStorage'
import * as z from 'zod'
import { useFormState } from './FormContext'
import FormLayout from './FormLayout'
import NextAndBack from './NextAndBack'

const formSchema = z
  .object({
    allergies: z.string().array().optional(),
    dietaryPreferences: z
      .number()
      .array()
      .nonempty('Choose 1 diet preference or none'),
  })
  .required()

const Step3 = () => {
  const { handleNext, formData, setFormData, dietaryPreferencesRefs, setStep } =
    useFormState()
  const [allergies, setAllergies] = useState<Array<string>>(
    formData?.allergies ?? [],
  )
  const [allergyInput, setAllergyInput] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allergies: formData?.allergies ?? '',
      dietaryPreferences: formData?.dietaryPreferences ?? [],
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
      step: 4,
    })

    if (!shouldGoToReview) handleNext()
    else setStep(4)
  }

  const handleAllergyInputChange = (e: any) => {
    e.preventDefault()
    setAllergyInput(e.target.value)
  }

  const handleAddAllergy = (e: any) => {
    e.preventDefault()
    if (allergyInput) {
      // check if input is not empty
      const updatedAllergies = [...allergies, allergyInput]
      setAllergies(updatedAllergies)
      form.setValue('allergies', updatedAllergies) // update form value
      setAllergyInput('') // clear the input
    }
  }

  return (
    <FormLayout title="Build your preferences">
      <Form {...form}>
        <form className="flex flex-col col-span-2 gap-6 my-4">
          {/* Dietary Preferences */}
          <FormField
            control={form.control}
            name="dietaryPreferences"
            render={() => (
              <FormItem>
                <FormLabel>
                  Do you have any meal preferences for your child?
                </FormLabel>
                {dietaryPreferencesRefs.map(pref => (
                  <FormField
                    key={pref.id}
                    control={form.control}
                    name="dietaryPreferences"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={pref.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(pref.id)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...field.value, pref.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== pref.id,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-lg capitalize cursor-pointer">
                            {pref.name}
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

          {/* Allergies */}
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem className="relative flex flex-col">
                <FormLabel>Allergies (optional)</FormLabel>
                <FormControl>
                  <div className="flex space-x-2" {...field}>
                    <Input
                      placeholder="peanuts, shrimp, lactose intolerance, etc."
                      value={allergyInput}
                      onChange={handleAllergyInputChange}
                    />
                    <Button onClick={handleAddAllergy} variant={'tertiary'}>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                <ul className="flex gap-2">
                  {allergies.map(allergy => (
                    <li key={allergy}>
                      <Badge variant={'outline'}>{allergy}</Badge>
                    </li>
                  ))}
                </ul>
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

export default Step3
