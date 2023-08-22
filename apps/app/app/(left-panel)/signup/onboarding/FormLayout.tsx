import { AlertCircle } from 'lucide-react'
import { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from 'ui/components/alert'
import { PageLoading } from 'ui/components/page-loading'
import { TypographyH1 } from 'ui/components/typography/h1'
import { TypographyH2 } from 'ui/components/typography/h2'
import { TypographyH3 } from 'ui/components/typography/h3'
import { useFormState } from './FormContext'
import ProgressBar from './ProgressBar'

export function DestructiveAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

const FormLayout = ({
  children,
  title,
}: {
  children: ReactNode
  title?: string | ReactNode
}) => {
  const { errorMessage, pageLoadingMessage } = useFormState()
  return (
    <div className="relative flex flex-col gap-y-4">
      {pageLoadingMessage && <PageLoading text={pageLoadingMessage} />}
      <div className="flex flex-col gap-y-2">
        <TypographyH1>Nourish Nest</TypographyH1>
        <TypographyH2 className="font-sans text-sm font-normal">
          Your trusted companion in nourishing and nurturing your child.
        </TypographyH2>
      </div>

      <div className="flex flex-col">
        {errorMessage && <DestructiveAlert message={errorMessage} />}
        <ProgressBar />
        {title && <TypographyH3 className="font-sans">{title}</TypographyH3>}
        <div className="flex flex-col w-full gap-4">{children}</div>
      </div>
    </div>
  )
}

export default FormLayout
