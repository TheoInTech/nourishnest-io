import { WeeklyMealSchema } from 'app/validators/meal.validator'
import { WeeklyShoppingSchema } from 'app/validators/shopping.validator'
import axios from 'axios'

export const generateFromOpenAi = (
  plan: string,
  prompt: string = '',
  frequencyOfMeals: string = '',
  startOnWeek = 1,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`/api/generate-${plan}`, {
        prompt,
        frequencyOfMeals,
        startOnWeek,
      })
      const dataResponse = JSON.parse(JSON.stringify(response?.data))

      let validated
      if (plan === 'meal') {
        validated = await WeeklyMealSchema.parse(dataResponse)
      } else if (plan === 'shopping') {
        validated = await WeeklyShoppingSchema.parse(dataResponse)
      }

      resolve(validated)
    } catch (error) {
      console.error(error)
      reject(`Invalid ${plan} plan generated. Please try again.`)
    }
  })
}
