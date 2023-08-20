import { ReactNode } from 'react'
import { useFormState } from './FormContext'

const FormLayout = ({
  children,
  title,
  description,
}: {
  children: ReactNode
  title?: string | ReactNode
  description?: string | ReactNode
}) => {
  const { step } = useFormState()

  return (
    <>
      <div className="mb-4 tracking-widest text-gray-500 uppercase font-heading">
        {step < 4 ? `${step} / 3` : 'Review'}
      </div>
      {(title || description) && (
        <div className="flex flex-col justify-center w-full h-full gap-2 mb-4">
          {title && (
            <h3 className="text-3xl font-extrabold leading-10 font-heading">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-base font-medium leading-6 text-gray-500 font-body">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center w-full gap-4">{children}</div>
    </>
  )
}

export default FormLayout
