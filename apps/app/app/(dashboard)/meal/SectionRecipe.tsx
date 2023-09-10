'use client'

import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import { TypographyList } from 'ui/components/typography/list'

const SectionRecipe = ({ data }: { data: string[] }) => {
  return (
    <Card className="gap-4">
      <CardHeader className="z-40 rounded-lg shadow-md ">
        <CardTitle className="flex items-center text-lg">Recipe 👨🏻‍🍳</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <TypographyList className="gap-4">
          {data && data.length > 0 ? (
            data?.map((recipe: string) => (
              <li key={recipe} className="text-base">
                {recipe}
              </li>
            ))
          ) : (
            <>No recipes found.</>
          )}
        </TypographyList>
      </CardContent>
    </Card>
  )
}

export default SectionRecipe
