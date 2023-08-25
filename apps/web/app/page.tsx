'use client'

import { useEffect } from 'react'

const HomePage = () => {
  useEffect(() => {
    window.location.href = '/waitlist'
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      Redirecting to waitlist...
    </div>
  )
}

export default HomePage
