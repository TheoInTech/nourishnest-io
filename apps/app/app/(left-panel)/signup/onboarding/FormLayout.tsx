'use client'

import { ReactNode } from 'react'

import { DestructiveAlert } from 'ui/components/error-alert'
import { PageLoading } from 'ui/components/page-loading'
import { TypographyH3 } from 'ui/components/typography/h3'
import { useFormState } from './FormContext'
import ProgressBar from './ProgressBar'

const FormLayout = ({
  children,
  title,
}: {
  children: ReactNode
  title?: string | ReactNode
}) => {
  const { errorMessage, pageLoadingMessage } = useFormState()
  return (
    <div className="relative flex flex-col">
      {pageLoadingMessage && <PageLoading text={pageLoadingMessage} />}
      {errorMessage && <DestructiveAlert message={errorMessage} />}
      <ProgressBar />
      {title && <TypographyH3 className="font-sans">{title}</TypographyH3>}
      <div className="flex flex-col w-full gap-4">{children}</div>
    </div>
  )
}

export default FormLayout
