'use client'

import { IMicronutrients } from '@/types/collections.type'
import { createClient } from '@/utils/supabase-browser'
import { useEffect, useState } from 'react'
import { Badge } from 'ui/components/badge'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import { Skeleton } from 'ui/components/skeleton'
import { TypographyP } from 'ui/components/typography/p'
import { cn } from 'ui/lib/utils'

const SectionMicronutrients = ({ data }: { data: string[] }) => {
  const [micronutrients, setMicronutrients] = useState<IMicronutrients[]>([])
  const [activeMicro, setActiveMicro] = useState<IMicronutrients | null>(
    micronutrients[0],
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const supabase = createClient()

  const searchMicronutrients = async (micros: string[]) => {
    try {
      const { data, error } = await supabase.rpc('search_micronutrients', {
        micros: micros as string[],
      })

      if (error) {
        console.error('Error: ', error)
        return null
      }

      return data as IMicronutrients[]
    } catch (error) {
      console.error('Unexpected error: ', error)
      return null
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      const result = await searchMicronutrients(data)
      setMicronutrients(result ?? [])
      setActiveMicro(result?.[0] || null)
      setIsLoading(false)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  if (isLoading) {
    return <Skeleton />
  }

  return (
    <Card className="gap-4">
      <CardHeader className="z-40 rounded-lg shadow-md ">
        <CardTitle className="flex items-center text-lg">
          Micronutrients 💊
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex flex-wrap gap-4">
          {micronutrients && micronutrients?.length > 0 ? (
            micronutrients?.map((nutrient: IMicronutrients) => (
              <Badge
                key={`N${nutrient.id}`}
                className={cn(
                  'flex-shrink-0 text-base text-center capitalize border shadow-sm cursor-pointer bg-muted text-muted-foreground border-border hover:bg-gray-200',
                  activeMicro?.id === nutrient.id &&
                    'bg-accent-yellow text-accent-yellow-foreground hover:bg-accent-yellow',
                )}
                onClick={() => setActiveMicro(nutrient)}
              >
                {nutrient.long_name}
              </Badge>
            ))
          ) : (
            <>No micronutrients found.</>
          )}
        </div>
        <TypographyP className="text-lg">
          {micronutrients && micronutrients?.length > 0 && activeMicro
            ? activeMicro.description
            : 'No information about this yet. Please let us know if you encounter this.'}
        </TypographyP>
      </CardContent>
    </Card>
  )
}

export default SectionMicronutrients
