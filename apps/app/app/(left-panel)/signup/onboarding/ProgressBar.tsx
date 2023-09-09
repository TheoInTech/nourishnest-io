'use strict'

import { cn } from 'ui/lib/utils'
import { useFormState } from './FormContext'

const ProgressBar = () => {
  const { step } = useFormState()

  return (
    <div className="box-border flex flex-col w-full gap-2 my-4 text-xs">
      <div className="flex w-full gap-4">
        <div
          className={cn(
            'h-3 w-full rounded-lg bg-gray-300 shrink',
            step > 0 && 'bg-accent-blue',
          )}
        ></div>
        <div
          className={cn(
            'h-3 w-full rounded-lg bg-gray-300 shrink',
            step > 1 && 'bg-accent-yellow',
          )}
        ></div>
        <div
          className={cn(
            'h-3 w-full rounded-lg bg-gray-300 shrink',
            step > 2 && 'bg-secondary',
          )}
        ></div>

        <div
          className={cn(
            'h-3 w-full rounded-lg bg-gray-300 shrink',
            step > 3 && 'bg-primary',
          )}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
