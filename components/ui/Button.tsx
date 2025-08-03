import { FC, ReactNode } from 'react'
import { Text, View } from 'react-native'

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  prefixIcon?: ReactNode
  className?: string
  disabled?: boolean
}

const Button: FC<ButtonProps> = ({
  size = 'md',
  children,
  onClick,
  type = 'button',
  prefixIcon,
  className = '',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'h-8', // 32px
    md: 'h-10', // 40px
    lg: 'h-[45px]', // 45px
  }

  return (
    <View
      onTouchEnd={() => {
        if (!disabled) {
          onClick?.()
        }
      }}
      className={`${sizeClasses[size]} relative ${className}`}
    >
      {prefixIcon && <View className="absolute -translate-y-1/2 left-3 top-1/2">{prefixIcon}</View>}
      <Text className="w-full text-center">{children}</Text>
    </View>
  )
}

export default Button
