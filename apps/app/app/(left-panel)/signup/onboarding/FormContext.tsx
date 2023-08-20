import React, { createContext, useContext, useState } from 'react'
import {
  IFormContext,
  IChildren,
  IFormData,
  WeightUnit,
} from '@/types/form.type'
import { IDietaryPreferences, IRegions } from '@/types/collections.type'

export const formDataDefaults: IFormData = {
  userId: '',
  nickName: '',
  birthday: '',
  weight: 0,
  weightType: WeightUnit.KG,
  allergies: [],
  dietaryPreference: [],
  frequencyOfMeals: [],
  withTeeth: false,
  region: '',
}

const FormContext = createContext<IFormContext>({
  handleNext: () => {},
  handleBack: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  hasReachedFinalCheck: false,
  setHasReachedFinalCheck: () => {},
  step: 1,
  setStep: () => {},
  formData: formDataDefaults,
  setFormData: () => {},
  regions: [],
  setRegions: () => {},
  dietaryPreferences: [],
  setDietaryPreferences: () => {},
})

export const FormProvider = ({ children }: IChildren) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [hasReachedFinalCheck, setHasReachedFinalCheck] =
    useState<boolean>(false)
  const [step, setStep] = useState(1)

  const [dietaryPreferences, setDietaryPreferences] = useState<
    Array<IDietaryPreferences>
  >([])
  const [regions, setRegions] = useState<Array<IRegions>>([])
  const [formData, setFormData] = useState<IFormData>({ ...formDataDefaults })

  const handleNext = () => {
    setStep((prevValue: number) => prevValue + 1)
  }

  const handleBack = () => {
    setStep((prevValue: number) => prevValue - 1)
  }

  return (
    <FormContext.Provider
      value={{
        handleNext,
        handleBack,
        hasReachedFinalCheck,
        setHasReachedFinalCheck,
        errorMessage,
        setErrorMessage,
        step,
        setStep,
        formData,
        setFormData,
        regions,
        setRegions,
        dietaryPreferences,
        setDietaryPreferences,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const useFormState = () => {
  return useContext(FormContext)
}
