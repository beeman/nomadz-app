import React, { InputHTMLAttributes } from 'react'
import { InfoCircleIcon } from '../icons/Icons'

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  labelClassName?: string
  multiline?: boolean
  rows?: number
  prefix?: string
  maxLength?: number
  showCounter?: boolean
}

const Input: React.FC<InputProps> = ({
  label = '',
  multiline = false,
  rows = 4,
  prefix,
  className = '',
  labelClassName = '',
  maxLength,
  showCounter = false,
  ...props
}) => {
  const inputClasses =
    'w-full bg-[#1B1B1B] border-[0.8px] border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/60'
  const [value, setValue] = React.useState<string>(String(props.value ?? ''))

  React.useEffect(() => {
    setValue(String(props.value ?? ''))
  }, [props.value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      setValue(e.target.value.slice(0, maxLength))
      if (props.onChange) {
        const event = { ...e, target: { ...e.target, value: e.target.value.slice(0, maxLength) } }
        props.onChange(event as any)
      }
      return
    }
    setValue(e.target.value)
    if (props.onChange) props.onChange(e)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (maxLength) {
      const paste = e.clipboardData.getData('text')
      const newValue = value + paste
      if (newValue.length > maxLength) {
        e.preventDefault()
        const allowed = maxLength - value.length
        const toPaste = paste.slice(0, allowed)
        setValue(value + toPaste)
        if (props.onChange) {
          const event = { ...e, target: { ...e.target, value: value + toPaste } }
          props.onChange(event as any)
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      setValue(e.target.value.slice(0, maxLength))
      if (props.onChange) {
        const event = { ...e, target: { ...e.target, value: e.target.value.slice(0, maxLength) } }
        props.onChange(event as any)
      }
      return
    }
    setValue(e.target.value)
    if (props.onChange) props.onChange(e)
  }

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (maxLength) {
      const paste = e.clipboardData.getData('text')
      const newValue = value + paste
      if (newValue.length > maxLength) {
        e.preventDefault()
        const allowed = maxLength - value.length
        const toPaste = paste.slice(0, allowed)
        setValue(value + toPaste)
        if (props.onChange) {
          const event = { ...e, target: { ...e.target, value: value + toPaste } }
          props.onChange(event as any)
        }
      }
    }
  }

  return (
    <View className="gap-y-2.5">
      {label && <label className={`block text-[#CDCDCD] text-sm ${labelClassName}`}>{label}</label>}

      {multiline ? (
        <View className="relative">
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            onPaste={handlePaste}
            className={`py-3 resize-none ${maxLength && value.length >= maxLength ? '!pb-5' : ''} ${inputClasses} ${className}`}
          />
          {maxLength &&
            showCounter &&
            (value.length >= maxLength ? (
              <Text className="flex absolute right-2 bottom-3 gap-1 items-center text-xs pointer-events-none select-none text-alert-red">
                <InfoCircleIcon className="w-4 h-4" />
                Max {maxLength} characters
              </Text>
            ) : (
              <Text className="absolute right-2 bottom-2 text-xs text-[#CDCDCD] select-none pointer-events-none">
                {maxLength - value.length}
              </Text>
            ))}
        </View>
      ) : (
        <View className="relative">
          {prefix && <Text className="absolute left-4 top-1/2 text-white -translate-y-1/2">{prefix}</Text>}
          <input
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            maxLength={maxLength}
            value={value}
            onChange={handleInputChange}
            onPaste={handleInputPaste}
            className={`${inputClasses} ${prefix ? 'pl-10' : ''} ${className}`}
          />
        </View>
      )}
    </View>
  )
}

export default Input
