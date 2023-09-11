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

export interface IConfirmModal {
  isOpen: boolean
  title?: string | ReactNode
  description?: string | ReactNode
  closeButton?: string | ReactNode
  confirmButton?: string | ReactNode
  icon?: ReactNode
  onCancel?: any
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
  onCancel,
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
          {closeButton && (
            <AlertDialogCancel onClick={onCancel}>
              {closeButton}
            </AlertDialogCancel>
          )}
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
