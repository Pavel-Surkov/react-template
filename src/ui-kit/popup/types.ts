import { HTMLAttributes, PropsWithChildren } from 'react'

export interface PopupProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  onClose: () => void
  opened: boolean
  mounted?: boolean
}
