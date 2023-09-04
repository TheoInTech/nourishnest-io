import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@radix-ui/react-alert-dialog'
import { ReactNode } from 'react'
import { AlertDialogFooter, AlertDialogHeader } from './alert-dialog'

interface IConfirmModal {
  isOpen: boolean
  title?: string | ReactNode
  description?: string | ReactNode
  closeButton?: string | ReactNode
  confirmButton?: string | ReactNode
  icon?: ReactNode
  onConfirm?: any
  children?: ReactNode
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  closeButton,
  confirmButton,
  icon,
  onConfirm,
  children,
}: IConfirmModal) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon}
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          {closeButton && <AlertDialogCancel>{closeButton}</AlertDialogCancel>}
          {confirmButton && (
            <AlertDialogAction onClick={onConfirm}>
              {confirmButton}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
