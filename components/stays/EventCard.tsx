import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { Event } from '../../types/event.types'
import { getStorageUrl } from '../../utils/app.utils'

interface EventCardProps {
  event: Event
  className?: string
}

const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex space-x-3 p-1 bg-black rounded-2xl ${className}`}
    >
      <Image src={getStorageUrl(event.banner)} alt={event.name} className="object-cover size-20 rounded-xl" />
      <View className="flex flex-col justify-between w-full pb-1 pr-1 overflow-hidden">
        <Text className="my-2 font-semibold text-white truncate">{event.name}</Text>
        <View className="flex flex-col">
          <Text className="text-xs text-[#ACACAC] lowercase truncate">{event.eventType?.name}</Text>
          <ArrowUpRightIcon className="size-[14px] text-[#BFBFBF] self-end" />
        </View>
      </View>
    </a>
  )
}

export default EventCard
