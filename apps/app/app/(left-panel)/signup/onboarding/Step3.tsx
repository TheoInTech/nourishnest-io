import { useAuth } from '@/providers/supabase-auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
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
import { Label } from 'ui/components/label'
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
  const { handleNext, formData, setFormData, setStep } = useFormState()
  const { dietaryPreferences, user } = useAuth()
  const [allergies, setAllergies] = useState<Array<string>>(
    formData?.allergies ?? [],
  )
  const [allergyInput, setAllergyInput] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      allergies: formData?.allergies ?? [],
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

    updateLocalStorage(`onboarding-${user?.id}`, {
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

  const removeAllergy = (e: any, allergy: string) => {
    e.preventDefault()
    const updatedAllergies = [...allergies].filter(a => a !== allergy)
    setAllergies(updatedAllergies)
    form.setValue('allergies', updatedAllergies)
  }

  return (
    <FormLayout title="Build your preferences">
      <Form {...form}>
        <form className="flex flex-col col-span-2 gap-8 my-4">
          {/* Dietary Preferences */}
          <FormField
            control={form.control}
            name="dietaryPreferences"
            render={() => (
              <FormItem>
                <FormLabel>
                  Do you have any meal preferences for your child?
                </FormLabel>
                {dietaryPreferences?.map(pref => (
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
          <div className="relative flex flex-col gap-4">
            <Label>Allergies (optional)</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="peanuts, shrimp, lactose intolerance, etc."
                value={allergyInput}
                onChange={handleAllergyInputChange}
              />
              <Button
                onClick={handleAddAllergy}
                variant={'tertiary'}
                className="py-6 rounded-lg"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <ul className="flex gap-2">
            {allergies.map(allergy => (
              <li key={allergy}>
                <Badge
                  variant={'outline'}
                  className="flex items-center text-lg"
                >
                  <Button
                    variant={'link'}
                    className="h-auto px-2 py-0 text-destructive"
                    onClick={e => removeAllergy(e, allergy)}
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  {allergy}
                </Badge>
                {/* Remove the allergy from the array */}
              </li>
            ))}
          </ul>
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
