'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/components/button'
import { DestructiveAlert } from 'ui/components/error-alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from 'ui/components/form'
import { Input } from 'ui/components/input'
import { SuccessAlert } from 'ui/components/success-alert'
import wait from 'ui/utils/helpers/wait'
import * as z from 'zod'

const formSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(70, 'Password can only have 70 characters'),
    confirmPassword: z.string(),
  })
  .refine(
    data => {
      return data.password === data.confirmPassword
    },
    { message: 'Passwords do not match', path: ['confirmPassword'] },
  )

const SignupPage = () => {
  const router = useRouter()
  const { signInWithPassword } = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const { email, password } = values
    try {
      // Start sign up process
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST_URL}/auth/signup`,
        {
          email,
          password,
        },
      )

      if (response.status !== 200) {
        throw new Error("You weren't signed up. Please try again.")
      }

      // Sign in
      const { error } = await signInWithPassword(email, password)

      if (error) {
        console.error('error:', error?.message || error)
        throw new Error(`${error?.message || error}. Please try again.`)
      }

      setSuccessMessage('Successfully signed up.')
      await wait(1000)
      router.push('/signup/onboarding')
    } catch (error: any) {
      setErrorMessage(error?.message || error || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/login')
  }

  const handleForgotPasswordClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault()
    router.push('/forgot-password')
  }

  return (
    <>
      <Form {...form}>
        {successMessage && <SuccessAlert message={successMessage} />}
        {errorMessage && <DestructiveAlert message={errorMessage} />}
        <form
          className="flex flex-col col-span-2 gap-4 my-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Confirm password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 mt-4">
            <Button type="submit" variant={'secondary'} isLoading={isLoading}>
              Sign up
            </Button>
            <div className="flex items-center gap-2 text-sm">
              Already have an account?
              <Button
                type="button"
                onClick={handleLoginClick}
                variant="link"
                className="self-start w-auto h-auto p-0 text-sm"
              >
                Login here.
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              Forgot your password?
              <Button
                type="button"
                onClick={handleForgotPasswordClick}
                variant="link"
                className="self-start w-auto h-auto p-0 text-sm"
              >
                Reset here.
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}

export default SignupPage
