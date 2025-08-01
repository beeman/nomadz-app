import { FC } from 'react'
import { EnvelopeIcon, KeyIcon, UserIcon } from '../icons/Icons'

type InputType = 'text' | 'email' | 'password'

interface InputProps {
  type: InputType
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  disabled?: boolean
}

const Input: FC<InputProps> = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
}) => {
  const getIcon = () => {
    const iconClass = 'w-5 h-5 text-white group-focus-within:text-primary'

    switch (type) {
      case 'email':
        return <EnvelopeIcon className={iconClass} />
      case 'password':
        return <KeyIcon className={iconClass} />
      default:
        return <UserIcon className={iconClass} />
    }
  }

  return (
    <View className="flex flex-col gap-1.5">
      <label className="text-sm text-white">{label}</label>
      <View className="relative group">
        <View className="absolute inset-y-0 left-0 flex items-center pl-3">{getIcon()}</View>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2 rounded-full 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    placeholder:text-[#C6C6C6] bg-[#181818] text-white
                    disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </View>
      {error && <Text className="text-sm text-red-500">{error}</Text>}
    </View>
  )
}

export default Input
