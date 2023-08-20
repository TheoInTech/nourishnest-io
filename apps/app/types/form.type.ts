import { Dispatch, ReactNode, SetStateAction } from 'react'
import { IDietaryPreferences, IRegions } from '@/types/collections.type'

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
  dietaryPreference: Array<string>
  frequencyOfMeals: Array<string>
  withTeeth: boolean
  region: string
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
  regions: Array<IRegions>
  setRegions: Dispatch<SetStateAction<Array<IRegions>>>
  dietaryPreferences: Array<IDietaryPreferences>
  setDietaryPreferences: Dispatch<SetStateAction<Array<IDietaryPreferences>>>
}

interface IChildren {
  children: ReactNode
}

export type { IChildren, IFormContext, IFormData }
export { WeightUnit }
