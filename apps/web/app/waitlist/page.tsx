'use client'

import { createClient } from '@/utils/supabase-browser'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, InfoIcon, Loader2 } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/components/button'
import { Calendar } from 'ui/components/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from 'ui/components/form'
import { Input } from 'ui/components/input'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/components/popover'
import { TypographyH3 } from 'ui/components/typography/h3'
import { TypographyH4 } from 'ui/components/typography/h4'
import { TypographyP } from 'ui/components/typography/p'
import { cn } from 'ui/lib/utils'
import is5MonthsTo3YearsOld from 'ui/utils/helpers/is5MonthsTo3YearsOld'
import * as z from 'zod'
import DestructiveAlert from './DestructiveAlert'
import Loading from './loading'

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nickname must contain at least 1 character')
      .max(100, 'Nickname can only have 100 characters'),
    email: z.string().email('Email must be a valid email'),
    childsBirthday: z
      .string()
      .datetime('Birthday should be a date')
      .refine(val => !is5MonthsTo3YearsOld(val), {
        message: 'Birthday must be at 5 months to 3 years old',
      }),
  })
  .required()

const WaitlistPage = () => {
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isPageReady, setIsPageReady] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    '',
  )
  const [hasAlreadySubmitted, setHasAlreadySubmitted] = useState(false)
  const supabase = createClient()

  // Form Hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      childsBirthday: '',
    },
  })

  // Methods
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const { name, email, childsBirthday } = values

      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            name,
            email,
            child_birthday: childsBirthday,
          },
        ])
        .select()

      if (error) {
        if (error?.message?.includes('duplicate key')) {
          throw new Error(
            'You have already submitted your email address. Please check your inbox for updates.',
          )
        }

        throw new Error(`Failed to save to database: ${error?.message}`)
      }

      localStorage.setItem('waitlisted', String(true))
      setHasAlreadySubmitted(true)
    } catch (error: any) {
      setErrorMessage(error?.message || error || 'Something went wrong.')
      console.error(error?.message || error)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checked = localStorage.getItem('waitlisted')
      setHasAlreadySubmitted(checked === 'true')
      setIsPageReady(true)
    }
  }, [])

  if (!isPageReady) {
    return <Loading />
  }

  return (
    <>
      {hasAlreadySubmitted ? (
        <div className="flex flex-col gap-4 my-8 text-xl">
          <TypographyH3>
            Thank you for joining our Nourish Nest waitlist!
          </TypographyH3>
          <TypographyP>
            It&apos;s a privilege to be part of your journey in giving your
            child the best start with wholesome nutrition.
          </TypographyP>
          <TypographyP>
            We&apos;re preparing something special for you, so please watch your
            inbox for updates.
          </TypographyP>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <TypographyH3 className="font-sans text-">
              Ready to simplify meal planning for your little one?
            </TypographyH3>
            <TypographyH4 className="font-sans text-sm font-normal">
              Join our waitlist and be the first to experience a new way to
              easily plan nutritious meals for your child.
            </TypographyH4>
            {errorMessage && <DestructiveAlert message={errorMessage} />}

            <Suspense fallback={<Loading />}>
              <div className="flex flex-col w-full gap-4">
                <Form {...form}>
                  <form className="flex flex-col col-span-2 gap-6 my-4">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              autoFocus
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email" required {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Birthday */}
                    <FormField
                      control={form.control}
                      name="childsBirthday"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal hover:bg-accent-yellow dark:hover:text-accent-yellow-foreground',
                                    !field.value && 'text-muted-foreground/60',
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={new Date(field.value)}
                                onSelect={value =>
                                  field.onChange(value?.toISOString())
                                }
                                disabled={date => date > new Date()}
                                fromYear={new Date().getFullYear() - 3}
                                toYear={new Date(
                                  new Date().setMonth(
                                    new Date().getMonth() - 5,
                                  ),
                                ).getFullYear()}
                                toMonth={
                                  new Date(
                                    new Date().setMonth(
                                      new Date().getMonth() - 5,
                                    ),
                                  )
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="flex items-center gap-2">
                            <InfoIcon className="w-3 h-3" /> Your child&apos;s
                            birthday is used to calculate the age. We only
                            accept 5 months to 3 years old.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      type="submit"
                      disabled={
                        !form.getValues('name') ||
                        !form.getValues('email') ||
                        isLoading
                      }
                      variant={'secondary'}
                      className="flex items-center self-end gap-2"
                    >
                      {isLoading && (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      )}
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </Suspense>
          </div>
        </>
      )}
    </>
  )
}

export default WaitlistPage
