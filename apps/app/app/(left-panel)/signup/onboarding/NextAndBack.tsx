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
  handleSubmit: (e: any) => void | Promise<void>
  backText?: string
  nextText?: string
  isLoading?: boolean
  isNextDisabled?: boolean
}) => {
  const { handleBack, hasReachedFinalCheck, setStep, step } = useFormState()

  const handleGoToReview = (e: any) => {
    e.preventDefault()

    handleSubmit(e)
    setStep(9)
  }

  switch (variant) {
    case 'next-only':
      return (
        <div className="flex items-center justify-end w-full gap-2 my-4 sm:gap-4">
          <Button
            onClick={handleSubmit}
            type="submit"
            className={`w-[8rem] flex hover:w-[8.2rem] duration-300`}
            disabled={isNextDisabled}
            variant={'default'}
          >
            {nextText}
          </Button>
          {hasReachedFinalCheck && step !== 9 && (
            <Button
              onClick={handleGoToReview}
              className={`w-full lg:w-[10rem] flex duration-300`}
              variant={'secondary'}
            >
              Final check
            </Button>
          )}
        </div>
      )
    case 'both':
    default:
      return (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full my-4 gap-x-4">
            <Button
              onClick={handleBack}
              variant={'outline'}
              className={`flex w-full lg:w-[8rem] lg:hover:w-[8.2rem] duration-300`}
            >
              {backText}
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              variant={'default'}
              disabled={isNextDisabled}
              className={`flex lg:hidden w-full lg:w-[8rem] lg:hover:w-[8.2rem] duration-300`}
            >
              {nextText}
            </Button>
            <div className="items-center justify-end hidden w-full gap-4 lg:flex">
              <Button
                onClick={handleSubmit}
                type="submit"
                variant={'default'}
                disabled={isNextDisabled}
                className={`flex w-full lg:w-[8rem] lg:hover:w-[8.2rem] duration-300  text-xs`}
              >
                {nextText}
              </Button>
              {hasReachedFinalCheck && step !== 9 && (
                <Button
                  onClick={handleGoToReview}
                  className={`w-[8rem] hover:w-[8.2rem] duration-300`}
                  variant={'secondary'}
                  type="submit"
                >
                  Final check
                </Button>
              )}
            </div>
          </div>
          {hasReachedFinalCheck && step !== 9 && (
            <Button
              onClick={handleGoToReview}
              className={`w-full flex lg:hidden duration-300`}
              variant={'secondary'}
              type="submit"
            >
              Final check
            </Button>
          )}
        </div>
      )
  }
}

export default NextAndBack
