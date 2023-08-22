import { Button } from 'ui/components/button'
import { useFormState } from './FormContext'

type NextAndBackVariant = 'both' | 'next-only' | 'back-only' | 'finalize'

const NextAndBack = ({
  variant = 'both',
  handleSubmit,
  backText = 'Back',
  nextText = 'Next',
  isNextDisabled = false,
}: {
  variant?: NextAndBackVariant
  handleSubmit: any
  backText?: string
  nextText?: string
  isLoading?: boolean
  isNextDisabled?: boolean
}) => {
  const { handleBack, hasReachedFinalCheck, step } = useFormState()

  switch (variant) {
    case 'next-only':
      return (
        <div className="flex items-center justify-end w-full gap-2 my-4 sm:gap-4">
          <Button
            onClick={() => handleSubmit(false)}
            type="submit"
            disabled={isNextDisabled}
            variant={'secondary'}
          >
            {nextText}
          </Button>
          {hasReachedFinalCheck && step !== 4 && (
            <Button onClick={() => handleSubmit(true)} variant={'default'}>
              Submit
            </Button>
          )}
        </div>
      )
    case 'both':
    default:
      return (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full my-4 gap-x-4">
            <Button onClick={handleBack} variant={'outline'}>
              {backText}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              type="submit"
              variant={'secondary'}
              disabled={isNextDisabled}
              className={`flex lg:hidden`}
            >
              {nextText}
            </Button>
            <div className="items-center justify-end hidden w-full gap-4 lg:flex">
              <Button
                onClick={() => handleSubmit(false)}
                type="submit"
                variant={'secondary'}
                disabled={isNextDisabled}
              >
                {nextText}
              </Button>
              {hasReachedFinalCheck && step !== 4 && (
                <Button
                  onClick={() => handleSubmit(true)}
                  variant={'default'}
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
          {hasReachedFinalCheck && step !== 4 && (
            <Button
              onClick={() => handleSubmit(true)}
              className={`flex lg:hidden`}
              variant={'default'}
              type="submit"
            >
              Submit
            </Button>
          )}
        </div>
      )
  }
}

export default NextAndBack
