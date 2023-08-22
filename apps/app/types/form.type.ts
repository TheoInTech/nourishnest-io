import {
  IDietaryPreferences,
  IFrequencyOfMeals,
  IRegions,
} from '@/types/collections.type'
import { Dispatch, ReactNode, SetStateAction } from 'react'

enum WeightUnit {
  KG = 'kg',
  LBS = 'lbs',
}

interface IFormData {
  userId: string
  nickName: string
  birthday: string
  weight: number
  weightType: WeightUnit
  allergies: Array<string>
  dietaryPreferences: Array<number>
  frequencyOfMeals: Array<number>
  withTeeth: boolean
  region: number
}

interface IFormContext {
  handleNext: () => void
  handleBack: () => void
  hasReachedFinalCheck: boolean
  setHasReachedFinalCheck: Dispatch<SetStateAction<boolean>>
  errorMessage: string
  setErrorMessage: Dispatch<SetStateAction<string>>
  step: number
  setStep: Dispatch<SetStateAction<number>>
  formData: IFormData
  setFormData: Dispatch<SetStateAction<IFormData>>
  regionsRefs: Array<IRegions>
  setRegionsRefs: Dispatch<SetStateAction<Array<IRegions>>>
  dietaryPreferencesRefs: Array<IDietaryPreferences>
  setDietaryPreferencesRefs: Dispatch<
    SetStateAction<Array<IDietaryPreferences>>
  >
  frequencyOfMealsRefs: Array<IFrequencyOfMeals>
  setFrequencyOfMealsRefs: Dispatch<SetStateAction<Array<IFrequencyOfMeals>>>
  pageLoadingMessage: string
  setPageLoadingMessage: Dispatch<SetStateAction<string>>
}

interface IChildren {
  children: ReactNode
}

export { WeightUnit }
export type { IChildren, IFormContext, IFormData }
