'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from 'ui/components/button'
import { cn } from 'ui/lib/utils'

const BackToDashboard = ({ className }: { className?: string }) => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.push('/')}
      variant={'ghost'}
      className={cn(
        'self-start w-auto p-0 mt-4 text-sm text-muted-foreground hover:bg-transparent hover:text-muted-foreground/70',
        className,
      )}
    >
      <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
    </Button>
  )
}

export default BackToDashboard
