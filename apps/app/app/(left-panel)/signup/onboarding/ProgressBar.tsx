'use strict'

import { useEffect, useState } from 'react'
import { useFormState } from './FormContext'

const ProgressBar = () => {
  const { step } = useFormState()

  const [width, setWidth] = useState(0)

  useEffect(() => {
    const progress = Math.ceil((100 / 3) * step)
    const result = Math.max(10, Math.floor(progress / 10) * 10)
    const finalResult = result >= 100 ? 100 : result
    setWidth(finalResult)
  }, [step])

  return (
    <div
      className="absolute top-0 left-0 h-2 bg-nn-blue z-[999]"
      style={{ width: `${width}%` }}
    ></div>
  )
}

export default ProgressBar
