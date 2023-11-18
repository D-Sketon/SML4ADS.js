export interface BaseModalProps {
  isModalOpen: boolean
  handleOk?: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void
}