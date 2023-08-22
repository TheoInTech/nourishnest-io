import {
  IDietaryPreferences,
  IFrequencyOfMeals,
  IRegions,
} from '@/types/collections.type'
import {
  IChildren,
  IFormContext,
  IFormData,
  WeightUnit,
} from '@/types/form.type'
import { createContext, useContext, useState } from 'react'

export const formDataDefaults: IFormData = {
  userId: '',
  nickName: '',
  birthday: '',
  weight: 0,
  weightType: WeightUnit.KG,
  allergies: [],
  dietaryPreferences: [],
  frequencyOfMeals: [],
  withTeeth: false,
  region: 0,
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
  regionsRefs: [],
  setRegionsRefs: () => {},
  dietaryPreferencesRefs: [],
  setDietaryPreferencesRefs: () => {},
  frequencyOfMealsRefs: [],
  setFrequencyOfMealsRefs: () => {},
  pageLoadingMessage: '',
  setPageLoadingMessage: () => {},
})

export const FormProvider = ({ children }: IChildren) => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [hasReachedFinalCheck, setHasReachedFinalCheck] =
    useState<boolean>(false)
  const [step, setStep] = useState(1)

  const [dietaryPreferencesRefs, setDietaryPreferencesRefs] = useState<
    Array<IDietaryPreferences>
  >([])
  const [regionsRefs, setRegionsRefs] = useState<Array<IRegions>>([])
  const [frequencyOfMealsRefs, setFrequencyOfMealsRefs] = useState<
    Array<IFrequencyOfMeals>
  >([])
  const [formData, setFormData] = useState<IFormData>({ ...formDataDefaults })
  const [pageLoadingMessage, setPageLoadingMessage] = useState<string>('')

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
        regionsRefs,
        setRegionsRefs,
        frequencyOfMealsRefs,
        setFrequencyOfMealsRefs,
        dietaryPreferencesRefs,
        setDietaryPreferencesRefs,
        pageLoadingMessage,
        setPageLoadingMessage,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export const useFormState = () => {
  return useContext(FormContext)
}
