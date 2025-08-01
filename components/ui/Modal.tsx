import { FC } from 'react'
import { Modal as ReactNativeModal, View } from 'react-native'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className = '', overlayClassName = '' }: ModalProps) => {
  return (
    <ReactNativeModal visible={isOpen} transparent>
      <View
        className={`fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/50 backdrop-blur-sm ${overlayClassName}`}
        onTouchStart={onClose}
      >
        <View className={`relative ${className}`} onTouchStart={(e) => e.stopPropagation()}>
          {children}
        </View>
      </View>
    </ReactNativeModal>
  )
}

export default Modal
