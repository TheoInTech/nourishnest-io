import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { prompt } = (await req.json()) as {
    prompt: string
  }

  if (!prompt || prompt === '') {
    return new Response('No prompt provided', { status: 400 })
  }

  const BASELINE_CONTEXT = `
    You will receive a JSON detailing a weekly meal plan. Your role is to generate a clear, categorized shopping list tailored for a 7-day meal plan across one week.

    Follow these steps:

    Multiple Weeks: If the nutrition plan spans more than one week, create a separate shopping list for each week, matching the week numbers provided.

    Units of Measurement: 

    Exclude "cups", "tbsp", or "tsp" from the shopping list. They are not standard supermarket measurements.
    Use practical units: "pieces", "g", "kg", "mL", "L", and "bottles".

    Ingredient Conversion: 

    Change non-standard units to supermarket measurements. For instance, convert liquid ingredients listed in cups to either mL or bottles.

    Complete List: Ensure every ingredient from the nutrition plan is on the shopping list. If the meal is repeated, adjust the quantities so they're enough for the whole week.

    Avoid Repetition: Each ingredient should appear only once on the shopping list.

    Format Guidelines:
    - the grocery list should be in JSON format.
    - the output must be in a clean JSON array structure. No additional text should be included.
    - recipes should not be in numbered list.
    - for background colors, use calm and pastel colors in hex format that aligns with the color of the category.
    - for text colors, use #333740 (black) or white #F5F5F5 (white) depending on the background color. For example, if the background color is #E7B878, the text color should be #333740 (black).
    
    Actual Response:
    Remember, make sure every single ingredient in the meal plan is included and is sufficient for 7-days of the same meal. Start on week 1. Also make sure that you follow the week number on the meal plan provided and that all ingredients are unique. Last reminder, Strictly, do not use "cups", "tbsp" or "tsp" measurements. Instead, you can use "pieces", "grams", "kilograms", "milliliter", "liter", "bottle" for measurements. Write the response strictly straight as a valid JSON array format without explanation text, just like this example:
    { "week": <week_number>, "shopping": [ { "category": "<category>", "bgColor": "<background color>", "textColor": "<textColor>", "items": [ { "name": "<item name>", "qty": "<quantity> <unit>" } ] }, { "category": "<category>", "bgColor": "<background color>", "textColor": "<textColor>", "items": [ { "name": "<item name>", "qty": "<quantity> <unit>" } ] } ] }
    `

  const completePrompt = `${BASELINE_CONTEXT}\n\n${prompt}`

  try {
    const payload = {
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'system', content: `${completePrompt}` }],
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
