import React, { ChangeEvent, DragEvent, useState } from 'react'
import { UploadCloudIcon } from '../icons/Icons'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  className?: string
  helperText?: string
  multiple?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/jpeg,image/jpg,image/png,image/heic',
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  helperText = 'JPG, JPEG, PNG less than 5MB (500x500px)',
  multiple = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!accept.includes(file.type)) {
      setError('Invalid file type')
      return false
    }

    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large (max ${Math.floor(maxSize / 1024 / 1024)} MB allowed)`)
      return false
    }

    setError('')
    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (multiple) {
        files.forEach(handleFile)
      } else {
        handleFile(files[0])
      }
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files)
      if (multiple) {
        files.forEach(handleFile)
      } else {
        handleFile(files[0])
      }
    }
  }

  return (
    <View className="flex flex-col items-center w-full">
      <View
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center
          ${isDragging ? 'border-white/60' : 'border-[#E8E8E84D]'}
          hover:border-white/60
          transition-colors
          w-full
          text-white
          bg-[#161616]
          ${className}
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          multiple={multiple}
        />
        <View className="mb-2 text-">
          <UploadCloudIcon />
        </View>
        <View className="text-center">
          <Text>drag & drop files or </Text>
          <Text className="underline">browse</Text>
        </View>
        <View className="mt-4 text-xs text-[#727272] text-center">{helperText}</View>
      </View>
      {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}
    </View>
  )
}

export default FileUpload
