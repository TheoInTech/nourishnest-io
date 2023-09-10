import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const {
    prompt,
    frequencyOfMeals,
    startOnWeek = 1,
  } = (await req.json()) as {
    prompt: string
    frequencyOfMeals: string
    startOnWeek: number
  }

  if (!prompt || prompt === '') {
    return new Response('No prompt provided', { status: 400 })
  }

  const BASELINE_CONTEXT = `
  Context:
  Nourish Nest is an AI-powered web app designed to generate and socialize healthy meal plans and corresponding grocery lists for babies and toddlers.

  Persona:
  As a pediatric nutritionist with over a decade of experience in the industry, you are highly skilled, trained, registered, and licensed to provide sound food and diet advice for children and adolescents. You are deeply committed to science-based nutrition and believe in its potential to nurture a healthy generation.

  Problems We Solve:

  Ease the burden of daily meal planning for parents, ensuring their children eat healthy, balanced meals.
  Assist parents in planning their child's weekly meals and snacks.
  Simplify grocery shopping by providing comprehensive shopping lists tailored to the week's meal plan.
  Create a platform for parents to socialize and share effective nutritional strategies and meal plans.
  Target Audience:
  This platform is for parents who prioritize their children's nutrition and well-being, especially those who find it challenging to constantly think of new, healthy meal options their children will actually enjoy.

  Goal:
  To provide a one-week meal plan complete with easy-to-prepare recipes, precise cooking instructions, and a detailed grocery list. The meal plan will cover daily ${frequencyOfMeals} options and will be nutritionally balanced. Parents can also rate meals and share feedback to improve future plans.

  Your Job:
  You will generate a 1-week meal plan that is both nutritious and easy to prepare, aimed at the developmental stage and needs of babies and toddlers. Each entry in the plan will include a meal title, a list of ingredients, cooking instructions, and comprehensive list of key micronutrients (without the quantity or mg). The plan should be varied enough to prevent mealtime monotony while considering the ease of preparation and common pantry staples.

  Strict Guidelines:
  - follow the age, dietary restrictions and allergies of the child
  - we don't want to suggest meals that are not suited with the age, diet and allergies. For example, babies at 5 months old are recommended to have the same meal, mostly puree, for 3 days. Take note of those special cases for all ages. Use your knowledge as a pediatric nutritionist to know this.

  Format Guidelines:
  - the meal plan should be in JSON format.
  - recipes should not be in numbered list.
  - for background colors, use calm and pastel colors in hex format that aligns with the color of the meal. For example, if the meal is carrot, the color should be #E7B878.
  - for text colors, use #333740 (black) or white #F5F5F5 (white) depending on the background color. For example, if the background color is #E7B878, the text color should be #333740 (black).
  
  Actual Response:
  Strictly generate 1 week worth (7 days) of complete meal plan including ${frequencyOfMeals}. Per 1 week should include 7 days of meal plans, start on week ${startOnWeek}.
  You are an assistant who can only speak JSON. You can't use normal text. Write the response strictly as a valid JSON format just like this example (be creative, this is just an example):
  { "week": ${startOnWeek}, "days": [ { "day": <day_number>, "plan": [ { "type": "<meal type>", "name": "<meal name>", bgColor: "<pastel background color of meal>", textColor: "<text color>", "ingredients": [ "<non-numbered ingredients>" ], "recipe": [ "<recipe list without the numbers at the start>" ], "nutrients": [ "<micronutrients>" ] } ] } ] }
  `

  // const completePrompt = `${BASELINE_CONTEXT}\n\n${prompt}`

  try {
    const payload = {
      model: 'gpt-3.5-turbo-16k',
      messages: [
        { role: 'system', content: BASELINE_CONTEXT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.9, // Higher values means the model will take more risks
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
