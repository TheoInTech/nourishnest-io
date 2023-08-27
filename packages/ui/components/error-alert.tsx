import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from 'ui/components/alert'

export const DestructiveAlert = ({ message }: { message: string }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="w-4 h-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
