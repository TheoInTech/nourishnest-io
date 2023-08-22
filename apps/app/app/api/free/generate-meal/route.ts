import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt, frequencyOfMeals } = (await req.json()) as {
    prompt: string
    frequencyOfMeals: string
  }

  if (!prompt || prompt === '') {
    return new Response('No prompt provided', { status: 400 })
  }

  const BASELINE_CONTEXT = `Context: Nourish Nest AI is  an ai-powered web app saas to generate and socialize about healthy meal plans and its grocery list for babies and toddlers.\n
        \n--
        Persona: You are an assistant who can only speak JSON. You can't use normal text. You are pediatric nutritionist, who is highly skilled and has more than 10 years of experience in the pediatric nutrition industry. You have a wide range of expertise and is trained, registered, and licensed to give food and diet advice to children and adolescents. You strongly believe in science-based nutrition.\n
        \n--
        Problems we are solving:\n
        1. It's hard to think of everyday meal plans for babies and toddlers that is healthy and they will eat\n
        2. Help parents with planning their children's weekly meals\n
        3. Help parents with preparing a grocery shopping list so they won't miss an ingredient for their kids' meals\n
        4. Lack of socialization with other parents on what's effective for their kid to eat\n
        \n--
        Target Audience: Parents who makes their children's nutrition and healthy diet a top priority. Those parents who struggle to always think of what they can offer to their kids that will be effective for their nutrition as they grow up.\n
        \n--
        Goal: Provide weekly meal plans with basic measurements, daily breakfast, morning snack, lunch, afternoon snack, and dinner options, as well as a shopping list. Make meal plans easy to prepare for non-professional cooks and include macro details for each meal.\n
        \n--
        Your Job: You will provide a 1-week worth of meal plan with detailed ingredients and nutrients, and easy-to-follow but precise cooking instructions. Avoid repetitive meal plans per week.\n
      `

  const REMEMBER_CONTEXT = `Remember, strictly follow each fields especially age, dietary restrictions and allergies! We don't want to suggest meals that are not suited with the age, diet and allergies. For example, babies that are just starting to eat are recommended to have the same meal for 3 days for familiarity. Take note of those special cases for all ages. Again, strictly generate 1 week worth (7 days) of complete meal plan including ${frequencyOfMeals} as mandatory. Per 1 week should include 7 days of meal plans, start on week 1.\n
  \n--
  Response: You are an assistant who can only speak JSON. You can't use normal text. Write the response strictly as a valid JSON array format just like this example (be creative, this is just an example):\n
  [ { "week": 1, "days": [ { "day": 1, "plan": [ { "type": "breakfast", "name": "Rice Cereal with Banana Purée", "ingredients": [ "1 tbsp rice cereal (fortified iron is preferred for infants)", "2 tbsp water or breastmilk/formula", "1/4 ripe banana" ], "recipe": [ "Mix rice cereal with water or breastmilk/formula to get the right consistency.", "Mash the banana well and mix with the cereal." ], "nutrients": [ "iron", "potassium", "vitamin B6" ] }, { "type": "lunch", "name": "Sweet Potato Purée", "ingredients": [ "1/4 sweet potato" ], "recipe": [ "Peel and steam the sweet potato until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "vitamin C", "fiber" ] }, { "type": "afternoon snack", "name": "Carrot Purée", "ingredients": [ "1 small carrot" ], "recipe": [ "Peel and steam the carrot until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin A", "biotin", "vitamin K" ] }, { "type": "dinner", "name": "Pea Purée", "ingredients": [ "1/4 cup peas" ], "recipe": [ "Steam the peas until soft.", "Blend or mash until smooth. Add water/breastmilk/formula for desired consistency." ], "nutrients": [ "vitamin C", "fiber", "protein" ] } ] } ] } ]`

  const completePrompt = `${BASELINE_CONTEXT}\n\n${prompt}\n\n${REMEMBER_CONTEXT}`

  try {
    const payload = {
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'system', content: `${completePrompt}` }],
      temperature: 0.7, // Higher values means the model will take more risks
      top_p: 1,
      frequency_penalty: 0, // Number between -2.0 and 2.0
      presence_penalty: 0, // Number between -2.0 and 2.0
      max_tokens: 8192, // The maximum number of tokens to generate in the completion
      stream: true,
      n: 1,
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })

    const stream = OpenAIStream(res)
    return new StreamingTextResponse(stream)
  } catch (error) {
    return new NextResponse(`${error}`, { status: 400 })
  }
}
