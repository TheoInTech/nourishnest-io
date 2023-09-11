import { WeeklyShopping } from '@/types/meal.type'
import { Expand, Minimize2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from 'ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/components/card'
import { Checkbox } from 'ui/components/checkbox'
import { cn } from 'ui/lib/utils'
import { appendEmoji } from 'ui/utils/helpers/appendEmoji'

interface ISectionGrocery {
  plan: WeeklyShopping
}

const SectionGrocery = ({ plan }: ISectionGrocery) => {
  const [isFullView, setIsFullView] = useState<boolean>(false)
  return (
    <Card
      className={cn(
        'h-[50vh] overflow-hidden relative',
        isFullView && 'h-full',
      )}
    >
      <CardHeader className="z-40 shadow-md">
        <CardTitle className="flex items-center justify-between">
          Grocery List 🛒
          <Button variant={'ghost'} onClick={() => setIsFullView(!isFullView)}>
            {isFullView ? (
              <Minimize2 className="w-5 h-5 text-muted-foreground/80" />
            ) : (
              <Expand className="w-5 h-5 text-muted-foreground/80" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid h-full grid-cols-1 gap-4 px-4 pt-4 pb-32 overflow-auto md:grid-cols-2 card-fade">
        {plan?.shopping?.map(shop => (
          <Card key={`W${plan.week}-C${shop.category}`} className="p-4">
            <CardHeader className="px-2 pt-0 pb-2 border-b border-b-gray-300">
              <CardTitle className="text-lg">
                {appendEmoji(shop.category)}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 my-4 text-sm">
              <div className="grid items-center w-full grid-cols-5">
                <div></div>
                <div className="col-span-2 font-bold">Item</div>
                <div className="col-span-2 font-bold">Qty</div>
              </div>

              {shop?.items?.map(item => (
                <div
                  key={`W${plan.week}-C${shop.category}-I${item.name}`}
                  className="grid items-center w-full grid-cols-5"
                >
                  <div>
                    <Checkbox />
                  </div>
                  <div className="col-span-2">{item.name}</div>
                  <div className="col-span-2">{item.qty}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default SectionGrocery
