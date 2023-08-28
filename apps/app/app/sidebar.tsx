'use client'

import { useAuth } from '@/providers/supabase-auth-provider'
import IconCheck from '@/public/assets/icons/check-black.svg'
import IconLock from '@/public/assets/icons/lock.svg'
import IconLogout from '@/public/assets/icons/logout.svg'
import IconUnlock from '@/public/assets/icons/unlock.svg'
import { IMealPlans } from '@/types/collections.type'
import { SubscriptionStatus } from '@/types/subscriptions.type'
import { createClient } from '@/utils/supabase-browser'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import CaretRightIcon from 'public/assets/icons/caret-right.svg'
import ConfirmGenerateIcon from 'public/assets/icons/confirm-generate.svg'
import HamburgerIcon from 'public/assets/icons/hamburger.svg'
import LogoFitSenpai from 'public/logo-fit-senpai.svg'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'ui/components/button'
import { DestructiveAlert } from 'ui/components/error-alert'
import { PageLoading } from 'ui/components/page-loading'
import { SuccessAlert } from 'ui/components/success-alert'
import birthdayToAge from 'ui/utils/helpers/birthdayToAge'
import getGeneratedWeeks from 'ui/utils/helpers/getGeneratedWeeks'
import getInitials from 'ui/utils/helpers/getInitials'
import isTodayBeforeEndsAt from 'ui/utils/helpers/isTodayBeforeEndsAt'
import isValidJSON from 'ui/utils/helpers/isValidJSON'

const Sidebar = ({
  weekNumbers,
  handleSelectedWeek,
  selectedWeek,
  unlockableWeeks,
}: {
  weekNumbers: Array<number>
  handleSelectedWeek: (week: number) => void
  selectedWeek: number
  unlockableWeeks: Array<{ start: number; end: number }> | []
}) => {
  const router = useRouter()
  const {
    signOut,
    profile,
    setPageLoadingMessage,
    mutateProfile,
    dietaryPreferences: dietaryPreferencesRefs,
    regions: regionsRefs,
    frequencyOfMeals: frequencyOfMealsRefs,
  } = useAuth()
  const supabase = createClient()
  const {
    subscriptions,
    meal_plans: mealPlan,
    shopping_plans: shoppingPlan,
  } = profile
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const [checkedWeeks, setCheckedWeeks] = useState<Array<number>>([])
  const [startWeekToGenerate, setStartWeekToGenerate] = useState<number>(1)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const subscription =
    subscriptions &&
    subscriptions?.length > 0 &&
    subscriptions?.reduce((latest, current) => {
      return new Date(latest.created_at ?? '') >
        new Date(current.created_at ?? '')
        ? latest
        : current
    })

  const handleLogOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
    } catch (error) {
      console.error('error', error)
    }
  }

  const handleGenerateWeeksClick = (start: number) => {
    setStartWeekToGenerate(start)
    setIsGenerateModalOpen(true)
  }

  const handleWeekClick = (week: number) => {
    handleSelectedWeek(week)
    toggleSidebar()
  }

  const weekListRef = useRef(null) as any

  useEffect(() => {
    if (selectedWeek && weekListRef.current) {
      const selectedWeekElement = weekListRef.current.querySelector(
        `[data-week="${selectedWeek}"]`,
      )
      if (selectedWeekElement) {
        weekListRef.current.scrollTop =
          selectedWeekElement.offsetTop - weekListRef.current.offsetTop
      }
    }
  }, [selectedWeek])

  async function generateFromOpenAi(
    plan: string,
    prompt: string = '',
    startWeek: number = 1,
    numberToGenerate: number,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const promiseList = []
        for (let index = 0; index < numberToGenerate; index++) {
          const res = axios.post(
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/paid/generate-${plan}`,
            {
              prompt,
              startOnWeek: startWeek + index,
            },
          )
          promiseList.push(res)
        }
        const responses: any[] = await Promise.all(promiseList)

        let finalResponse = []
        let seenWeeks = new Set()
        for (const res of responses) {
          const stringify = JSON.stringify(res?.data)
          if (!isValidJSON(stringify)) reject('Invalid plan generated.')

          const parsedResponse = JSON.parse(stringify)
          if (plan === 'workout' && parsedResponse?.days.length < 7) {
            reject('Generated workout is less than expected.')
          }

          const week = parsedResponse?.week
          if (!seenWeeks.has(week)) {
            seenWeeks.add(week)
            finalResponse.push(parsedResponse)
          }
        }

        resolve(finalResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  async function generateShoppingFromOpenAi(
    meals: IMealPlans[],
    startWeek: number = 1,
  ) {
    return new Promise(async (resolve, reject) => {
      let promiseList = []
      let mealsCopy = [...meals]
      try {
        for (const meal of mealsCopy) {
          const res = axios.post(
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/paid/generate-shopping`,
            {
              prompt: JSON.stringify(meal),
              startOnWeek: startWeek,
            },
          )
          startWeek++
          promiseList.push(res)
        }
        const response: any = await Promise.all(promiseList)

        let finalResponse = []
        let seenWeeks = new Set()
        for (const res of response) {
          const stringify = JSON.stringify(res)
          if (!isValidJSON(stringify)) reject('Invalid plan generated.')

          const parsedResponse = JSON.parse(stringify)

          const week = parsedResponse?.data?.week
          if (!seenWeeks.has(week)) {
            seenWeeks.add(week)
            finalResponse.push(parsedResponse?.data)
          }
        }

        const weekWorth = profile?.generated_weeks === 1 ? 3 : 4
        if (finalResponse.length !== weekWorth) {
          reject('Generated an unexpected number of plans')
        }

        resolve(finalResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleClickUnlock = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_URL ?? '/billing')
  }

  const handleGeneratePlans = async (e: any) => {
    e.preventDefault()

    try {
      const dietaryPreferences = profile?.dietary_preferences?.map(
        pref => dietaryPreferencesRefs?.find(ref => ref.id === pref.id)?.name,
      )

      const frequencyOfMeals = profile?.frequency_of_meals?.map(
        meal => frequencyOfMealsRefs?.find(ref => ref.id === meal.id)?.name,
      )

      const region = regionsRefs?.find(
        ref => ref.id === profile?.region_id,
      )?.name
      const age = birthdayToAge(new Date(profile?.birthday ?? ''))

      // 1. Build the prompt
      const prompt = `
          Child details:
          1. Age of child - ${age}
          2. Dietary Preferences - ${dietaryPreferences?.join(', ')}
          3. Child's Weight - ${profile?.weight} ${profile?.weight_type}
          4. Allergies - ${profile?.allergies.join(', ')}
          5. Region / Location - ${region}
          6. Frequency of Meals - ${frequencyOfMeals?.join(', ')}
          7. With teeth? - ${profile?.with_teeth ? 'Yes' : 'None'}`

      setPageLoadingMessage('Generating your meal plan...')
      const numberToGenerate = startWeekToGenerate === 2 ? 3 : 4
      const mealPromise = generateFromOpenAi(
        'meal',
        prompt,
        startWeekToGenerate,
        numberToGenerate,
      )

      const [mealResponse]: any = await Promise.all([mealPromise])

      if (mealResponse.length !== numberToGenerate) {
        console.error('meal response:', mealResponse)
        throw new Error('Generated an unexpected number of meal plans')
      }

      setPageLoadingMessage('Generating your shopping list...')
      const shoppingPromise = generateShoppingFromOpenAi(
        mealResponse,
        startWeekToGenerate,
      )
      const [shoppingResponse]: any = await Promise.all([shoppingPromise])

      if (shoppingResponse.length !== numberToGenerate) {
        console.error('shopping response:', shoppingResponse)
        throw new Error('Generated an unexpected number of shopping list')
      }

      setPageLoadingMessage('Finalizing your profile...')
      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from('profile')
        .update({
          generated_weeks: getGeneratedWeeks(profile?.generated_weeks),
        })
        .match({ id: profile?.id })

      if (supabaseError) {
        console.error('error:', supabaseError)
        throw new Error('There was a problem updating your profile')
      }

      const { error: mealError } = await supabase
        .from('meal_plans')
        .update({
          plan:
            mealPlan &&
            Array.isArray(mealPlan?.plan) &&
            Array.isArray(mealResponse)
              ? [...mealPlan.plan, ...mealResponse]
              : Array.isArray(mealResponse)
              ? [...mealResponse]
              : [],
          updated_at: new Date().toLocaleDateString(),
        })
        .match({ id: mealPlan?.id })

      const { error: shoppingError } = await supabase
        .from('shopping_plan')
        .update({
          plan:
            shoppingPlan &&
            Array.isArray(shoppingPlan?.plan) &&
            Array.isArray(shoppingResponse)
              ? [...shoppingPlan.plan, ...shoppingResponse]
              : Array.isArray(shoppingResponse)
              ? [...shoppingResponse]
              : [],
          updated_at: new Date().toLocaleDateString(),
        })
        .match({ id: shoppingPlan?.id })

      if (mealError || shoppingError) {
        console.error('mealError:', mealError?.message)
        console.error('shoppingError:', shoppingError?.message)
        throw new Error('There was a problem saving your plans')
      }

      await mutateProfile()
      await setIsGenerateModalOpen(false)
      await setSuccessMessage('Successfully generated your plans!')
    } catch (error) {
      console.error(error)
      setErrorMessage(`${error}. Please try again.`)
    } finally {
      setPageLoadingMessage('')
    }
  }

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible(!isSidebarVisible)
  }, [isSidebarVisible])

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!sidebarRef.current?.contains(event.target as Node)) {
        if (!isSidebarVisible) return
        toggleSidebar()
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isSidebarVisible, toggleSidebar])

  useEffect(() => {
    const filtered = weekNumbers.filter((week: number) => {
      return localStorage.getItem(`week-${week}`) === 'true'
    })
    setCheckedWeeks(filtered)
  }, [weekNumbers])

  return (
    <>
      <DestructiveAlert message={errorMessage} />
      <SuccessAlert message={successMessage} />
      {isGenerateModalOpen && (
        <Modal>
          <div className="flex flex-col gap-8 p-4 items-center justify-center max-w-[400px]">
            <ConfirmGenerateIcon className="w-32 h-32" />
            <span className="text-2xl font-bold text-center font-heading">
              Confirm Generate Plans
            </span>
            <p className="text-sm font-medium text-center text-gray-500">
              Please check your{' '}
              <Link
                href="/profile"
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-gray-700 underline"
              >
                Profile
              </Link>{' '}
              to make sure that your information is correct and updated.
            </p>
            <div className="flex items-center justify-center w-full gap-4 my-4">
              <Button
                onClick={() => setIsGenerateModalOpen(false)}
                variant="outline"
                className="w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleGeneratePlans} type="submit">
                Yes, generate
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {isUnlockModalOpen && (
        <Modal>
          <div className="flex flex-col gap-8 p-4 items-center justify-center max-w-[400px]">
            <ConfirmGenerateIcon className="w-32 h-32" />
            <span className="text-2xl font-bold text-center font-heading">
              Unlock Additional Weeks
            </span>
            <p className="text-sm font-medium text-center text-gray-500">
              Subscribe to our Pro Plan to get the full fitness plan&apos;s
              additional weeks.
            </p>
            <div className="flex items-center justify-center w-full gap-4 my-4">
              <Button
                onClick={() => setIsUnlockModalOpen(false)}
                variant="outline"
                className="w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleClickUnlock}>Yes, unlock</Button>
            </div>
          </div>
        </Modal>
      )}
      {isLoggingOut && <PageLoading />}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        className="absolute top-0 right-0 z-20 w-auto p-4 lg:hidden"
      >
        <HamburgerIcon className="w-12 h-12" />
      </Button>
      {isSidebarVisible && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 opacity-50 bg-dim lg:hidden"
        />
      )}
      <aside
        id="main-sidebar"
        className={`fixed top-0 h-screen left-0 z-40 w-[80%] md:w-80 transition-transform duration-200 ease-in-out
        ${
          isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="grid h-screen grid-rows-6 p-8 bg-white shadow-xl text-dim">
          <div className="row-span-5 mb-20 overflow-y-hidden lg:mb-4">
            <LogoFitSenpai className="my-2" />
            <div className="relative flex flex-col items-center gap-2 my-8">
              <div className="absolute top-0 right-0 px-2 py-1 text-xs font-extrabold uppercase border-2 rounded-full border-dim font-heading">
                {subscription &&
                (subscription?.status === SubscriptionStatus.ACTIVE ||
                  (subscription?.status === SubscriptionStatus.CANCELLED &&
                    isTodayBeforeEndsAt(subscription?.ends_at)))
                  ? 'Pro'
                  : 'Free'}
              </div>
              <div className="relative w-[100px] h-[100px] duration-300 bg-neon-green bg-opacity-20 flex justify-center items-center rounded-[100%]">
                {profile?.avatar_url ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_IMAGE_URL}${profile.avatar_url}`}
                    alt="Avatar"
                    width={1000}
                    height={1000}
                    className="rounded-[100%] object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-5xl font-bold uppercase text-neon-green font-body">
                    {getInitials(profile?.nickname)}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-center">
                <LinkButton
                  href="/profile"
                  className="font-body flex items-center font-bold text-[18px] !p-0 !m-0"
                >
                  {profile?.first_name ?? ''} {profile?.last_name ?? ''}{' '}
                  <CaretRightIcon className="w-4 h-4 ml-1" />
                </LinkButton>
                <span className="text-[14px] font-medium text-gray-500">
                  {profile?.email ?? ''}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 h-full max-h-[55%] lg:max-h-[50%]">
              <ul
                className="h-full space-y-2 overflow-y-auto font-medium"
                ref={weekListRef}
              >
                {weekNumbers.map((week: number, i: number) => (
                  <li key={`week-${i}`} data-week={week}>
                    <Button
                      className={`flex flex-row justify-between !px-2 items-center hover:bg-gray-100 disabled:hover:bg-gray-200  ${
                        pathname === '/' && selectedWeek === week
                          ? 'bg-gray-200 text-dim'
                          : 'text-gray-600 bg-white'
                      }`}
                      onClick={() => handleWeekClick(week)}
                      variant="transparent"
                    >
                      <span>{`Week ${week}`}</span>
                      {checkedWeeks.includes(week) && (
                        <IconCheck className="w-5 h-5" />
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
              {unlockableWeeks.length > 0 && (
                <>
                  <hr />
                  <ul className="h-full space-y-2 overflow-y-auto font-medium">
                    {unlockableWeeks.map(
                      (week: { start: number; end: number }, i: number) => (
                        <li key={`week-${i}`}>
                          <Button
                            className={`flex flex-row justify-between !px-2 items-center hover:bg-gray-100`}
                            onClick={() =>
                              handleGenerateWeeksClick(week?.start)
                            }
                            variant="transparent"
                            disabled={i > 0}
                          >
                            <span>
                              Week {week?.start}-{week?.end}
                            </span>
                            {i > 0 ? (
                              <IconLock className="w-5 h-5 opacity-50" />
                            ) : (
                              <IconUnlock className="w-5 h-5" />
                            )}
                          </Button>
                        </li>
                      ),
                    )}
                  </ul>
                </>
              )}
              {weekNumbers.length === 1 && unlockableWeeks.length === 0 && (
                <>
                  <hr />
                  <ul className="h-full space-y-2 overflow-y-auto font-medium">
                    {[2, 3, 4].map((week, i) => (
                      <li key={week}>
                        <Button
                          className={`flex flex-row justify-between !px-2 items-center hover:bg-gray-100`}
                          onClick={() => setIsUnlockModalOpen(true)}
                          variant="transparent"
                          disabled={i > 0}
                        >
                          <span>Week {week}</span>
                          <IconLock className="w-5 h-5 opacity-50" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full flex flex-col justify-end px-6 py-4 row-span-1 mb-16 lg:mb-0 shadow-[0px_-5px_10px_0px] shadow-gray-100">
          <LinkButton
            href={'/billing'}
            variant="transparent"
            className={`text-gray-500 !m-0 !p-4 w-full font-semibold flex justify-between ${
              pathname?.includes('billing') && 'bg-gray-200 text-dim'
            }`}
          >
            Billing
            <CaretRightIcon className="w-5 h-5" />
          </LinkButton>
          <Button
            onClick={handleLogOut}
            variant="transparent"
            className=" text-[#AD6969] !m-0 !p-4 font-semibold flex justify-between"
          >
            Log Out
            <IconLogout className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
