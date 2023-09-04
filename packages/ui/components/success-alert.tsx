import { CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from 'ui/components/alert'

export const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <Alert variant="success">
      <CheckCircle className="w-4 h-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
