import React from 'react'
import { View } from 'react-native'

interface DropdownProps {
  isOpen: boolean
  className?: string
  onClose: () => void
  children: React.ReactNode
  zIndex?: number | undefined | null
}

const Dropdown: React.FC<DropdownProps> = ({ isOpen, className, onClose, children, zIndex = 50 }) => {
  if (!isOpen) return null

  return (
    <>
      <View
        className="absolute w-[5000px] h-[5000px] -translate-x-1/2 -translate-y-1/2 left-0 top-0 right-0 bottom-0 bg-transparent"
        onTouchStart={onClose}
      />
      <View className="fixed inset-0" style={{ zIndex: zIndex || 0 - 10 }} onTouchStart={onClose} />
      <View className={`absolute ${className}`} style={{ zIndex: zIndex || 0 }}>
        {children}
      </View>
    </>
  )
}

export default Dropdown
