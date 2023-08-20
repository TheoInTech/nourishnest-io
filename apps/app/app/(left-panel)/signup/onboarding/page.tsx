'use client'

// import { useAuth } from '@/providers/supabase-auth-provider'
import { FormProvider } from './FormContext'
import FormStep from './FormStep'
import ProgressBar from './ProgressBar'

export default function Signup() {
  // const { signOut, pageLoadingMessage, user, setPageLoadingMessage } = useAuth()

  // const handleLogOut = async () => {
  //   try {
  //     await signOut()
  //   } catch (error) {
  //     console.error('error', error)
  //   }
  // }

  return (
    <FormProvider>
      <main className="relative flex items-start justify-center w-full h-screen overflow-auto">
        <ProgressBar />
        <div className="flex w-full min-h-screen overflow-auto md:w-[70%] p-8 flex-col gap-4 md:px-2 md:py-8">
          {/* <Button
            onClick={handleLogOut}
            variant={'link'}
            className=" text-[#AD6969] font-semibold flex items-center justify-end !px-0"
          >
            Log Out
            <IconLogout className="w-5 h-5 ml-4" />
          </Button> */}
          <FormStep />
        </div>
      </main>
    </FormProvider>
  )
}
