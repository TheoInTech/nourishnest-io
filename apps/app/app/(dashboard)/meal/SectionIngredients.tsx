'use client'

import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import { TypographyList } from 'ui/components/typography/list'

const SectionIngredients = ({ data }: { data: string[] }) => {
  return (
    <Card className="gap-4">
      <CardHeader className="z-40 rounded-lg shadow-md ">
        <CardTitle className="flex items-center text-lg">
          Ingredients 🍴
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <TypographyList className="gap-4">
          {data && data.length > 0 ? (
            data?.map((ingredient: string) => (
              <li key={ingredient}>{ingredient}</li>
            ))
          ) : (
            <>No ingredients found.</>
          )}
        </TypographyList>
      </CardContent>
    </Card>
  )
}

export default SectionIngredients
