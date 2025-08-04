import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { NativeSyntheticEvent, NativeTouchEvent, View } from 'react-native'
import toastNotifications from '../../utils/toastNotifications.utils'
import { HeartFilledIcon, HeartIcon } from '../icons/Icons'

interface SaveApartmentButtonProps {
  hid: number
  isAuthenticated: boolean
  events: any[]
  onToggleSave: (hid: number) => Promise<void>
  isLoading?: boolean
  className?: string
}

export default function SaveApartmentButton({
  hid,
  isAuthenticated,
  events,
  onToggleSave,
  isLoading = false,
  className = '',
}: SaveApartmentButtonProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const event = events.find((event) => event.hid === hid)
    setIsSaved(event?.isSaved || false)
  }, [events, hid])

  const handleSaveToggle = debounce(async (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsSaved(!isSaved)
      await onToggleSave(hid)
    } catch (error) {
      setIsSaved(isSaved)
      toastNotifications.error('Failed to update property')
    }
  }, 300)

  useEffect(() => {
    return () => {
      handleSaveToggle.cancel()
    }
  }, [])

  if (!isAuthenticated) return null

  return (
    <View
      onTouchStart={(event) => {
        if (!isLoading) {
          event.persist()
          handleSaveToggle(event)
        }
      }}
      className={`flex flex-row items-center justify-center transition-colors rounded-full z-10 cursor-pointer ${
        isSaved ? 'bg-white hover:bg-white/90' : 'bg-black/70 hover:bg-black/50'
      } ${className}`}
    >
      {isSaved ? (
        <HeartFilledIcon width="100%" height="100%" />
      ) : (
        <HeartIcon color="#D9D9D9" width="100%" height="100%" />
      )}
    </View>
  )
}
